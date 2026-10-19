import { openDB, DBSchema, IDBPDatabase } from 'idb';
import {
  JobListing,
  SavedJobRecord,
  JobApplicationRecord,
  UserPreferences,
} from '../../types';
import { DEMO_PREFERENCES } from '../../data/demoJobs';

const DB_NAME = 'OpportunityRadarDB';
const DB_VERSION = 1;

interface OpportunityRadarDBSchema extends DBSchema {
  saved_jobs: {
    key: string;
    value: SavedJobRecord;
    indexes: { by_savedAt: string };
  };
  applications: {
    key: string;
    value: JobApplicationRecord;
    indexes: { by_status: string; by_updatedAt: string };
  };
  user_preferences: {
    key: string;
    value: UserPreferences;
  };
}

// In-Memory & LocalStorage Fallback Cache
class MemoryFallbackStorage {
  private savedJobs = new Map<string, SavedJobRecord>();
  private applications = new Map<string, JobApplicationRecord>();
  private preferences: UserPreferences | null = null;

  constructor() {
    this.hydrateFromLocalStorage();
  }

  private hydrateFromLocalStorage() {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      const sj = localStorage.getItem('op_fallback_saved_jobs');
      if (sj) {
        const parsed = JSON.parse(sj) as SavedJobRecord[];
        parsed.forEach((item) => this.savedJobs.set(item.jobId, item));
      }
      const apps = localStorage.getItem('op_fallback_applications');
      if (apps) {
        const parsed = JSON.parse(apps) as JobApplicationRecord[];
        parsed.forEach((item) => this.applications.set(item.id, item));
      }
      const prefs = localStorage.getItem('op_fallback_preferences');
      if (prefs) {
        this.preferences = JSON.parse(prefs) as UserPreferences;
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }

  private persist() {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(
        'op_fallback_saved_jobs',
        JSON.stringify(Array.from(this.savedJobs.values()))
      );
      localStorage.setItem(
        'op_fallback_applications',
        JSON.stringify(Array.from(this.applications.values()))
      );
      if (this.preferences) {
        localStorage.setItem('op_fallback_preferences', JSON.stringify(this.preferences));
      }
    } catch {
      // Ignore quota exceeded
    }
  }

  getSavedJobs(): SavedJobRecord[] {
    return Array.from(this.savedJobs.values()).sort(
      (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
    );
  }

  saveJob(job: JobListing): void {
    this.savedJobs.set(job.id, {
      jobId: job.id,
      savedAt: new Date().toISOString(),
      jobSnapshot: job,
    });
    this.persist();
  }

  unsaveJob(jobId: string): void {
    this.savedJobs.delete(jobId);
    this.persist();
  }

  isJobSaved(jobId: string): boolean {
    return this.savedJobs.has(jobId);
  }

  getApplications(): JobApplicationRecord[] {
    return Array.from(this.applications.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  saveApplication(app: JobApplicationRecord): void {
    this.applications.set(app.id, app);
    this.persist();
  }

  deleteApplication(id: string): void {
    this.applications.delete(id);
    this.persist();
  }

  getUserPreferences(): UserPreferences {
    return this.preferences || DEMO_PREFERENCES;
  }

  saveUserPreferences(prefs: UserPreferences): void {
    this.preferences = prefs;
    this.persist();
  }
}

const memoryFallback = new MemoryFallbackStorage();
let dbPromise: Promise<IDBPDatabase<OpportunityRadarDBSchema>> | null = null;
let idbAvailable = true;

async function getDB(): Promise<IDBPDatabase<OpportunityRadarDBSchema>> {
  if (!idbAvailable) {
    throw new Error('IndexedDB not supported or disabled');
  }

  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    idbAvailable = false;
    throw new Error('IndexedDB not available');
  }

  if (!dbPromise) {
    dbPromise = openDB<OpportunityRadarDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Store: saved_jobs
        if (!db.objectStoreNames.contains('saved_jobs')) {
          const savedStore = db.createObjectStore('saved_jobs', {
            keyPath: 'jobId',
          });
          savedStore.createIndex('by_savedAt', 'savedAt');
        }

        // Store: applications
        if (!db.objectStoreNames.contains('applications')) {
          const appStore = db.createObjectStore('applications', {
            keyPath: 'id',
          });
          appStore.createIndex('by_status', 'status');
          appStore.createIndex('by_updatedAt', 'updatedAt');
        }

        // Store: user_preferences
        if (!db.objectStoreNames.contains('user_preferences')) {
          db.createObjectStore('user_preferences');
        }
      },
    }).catch((err) => {
      console.warn('Failed to initialize IndexedDB, falling back to memory/local:', err);
      idbAvailable = false;
      throw err;
    });
  }

  return dbPromise;
}

export const storage = {
  async getSavedJobs(): Promise<SavedJobRecord[]> {
    try {
      const db = await getDB();
      const records = await db.getAllFromIndex('saved_jobs', 'by_savedAt');
      return records.reverse(); // Newest first
    } catch {
      return memoryFallback.getSavedJobs();
    }
  },

  async saveJob(job: JobListing): Promise<void> {
    const record: SavedJobRecord = {
      jobId: job.id,
      savedAt: new Date().toISOString(),
      jobSnapshot: job,
    };
    try {
      const db = await getDB();
      await db.put('saved_jobs', record);
    } catch {
      memoryFallback.saveJob(job);
    }
  },

  async unsaveJob(jobId: string): Promise<void> {
    try {
      const db = await getDB();
      await db.delete('saved_jobs', jobId);
    } catch {
      memoryFallback.unsaveJob(jobId);
    }
  },

  async isJobSaved(jobId: string): Promise<boolean> {
    try {
      const db = await getDB();
      const rec = await db.get('saved_jobs', jobId);
      return !!rec;
    } catch {
      return memoryFallback.isJobSaved(jobId);
    }
  },

  async getApplications(): Promise<JobApplicationRecord[]> {
    try {
      const db = await getDB();
      const records = await db.getAllFromIndex('applications', 'by_updatedAt');
      return records.reverse();
    } catch {
      return memoryFallback.getApplications();
    }
  },

  async saveApplication(app: JobApplicationRecord): Promise<void> {
    try {
      const db = await getDB();
      await db.put('applications', app);
    } catch {
      memoryFallback.saveApplication(app);
    }
  },

  async deleteApplication(id: string): Promise<void> {
    try {
      const db = await getDB();
      await db.delete('applications', id);
    } catch {
      memoryFallback.deleteApplication(id);
    }
  },

  async getUserPreferences(): Promise<UserPreferences> {
    try {
      const db = await getDB();
      const prefs = await db.get('user_preferences', 'current_preferences');
      return prefs || DEMO_PREFERENCES;
    } catch {
      return memoryFallback.getUserPreferences();
    }
  },

  async saveUserPreferences(prefs: UserPreferences): Promise<void> {
    try {
      const db = await getDB();
      await db.put('user_preferences', prefs, 'current_preferences');
    } catch {
      memoryFallback.saveUserPreferences(prefs);
    }
  },
};
