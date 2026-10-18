import { JobListing } from '../types';
import { DEMO_JOBS } from '../data/demoJobs';

// In-memory job repository that can receive live items via WebSocket stream
let currentJobListings: JobListing[] = [...DEMO_JOBS];

export const jobService = {
  /**
   * Fetches all job listings asynchronously with simulated network latency
   * and AbortSignal support.
   */
  async getJobs(signal?: AbortSignal): Promise<JobListing[]> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        resolve([...currentJobListings]);
      }, 150);

      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('Job fetch aborted', 'AbortError'));
        });
      }
    });
  },

  /**
   * Fetches a single job listing by ID
   */
  async getJobById(id: string, signal?: AbortSignal): Promise<JobListing | null> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const found = currentJobListings.find((j) => j.id === id) || null;
        resolve(found);
      }, 100);

      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new DOMException('Job lookup aborted', 'AbortError'));
        });
      }
    });
  },

  /**
   * Injects a newly received job from the WebSocket stream into the client pool
   */
  injectLiveJob(newJob: JobListing): void {
    const exists = currentJobListings.some((j) => j.id === newJob.id);
    if (!exists) {
      currentJobListings = [newJob, ...currentJobListings];
    }
  },

  /**
   * Resets job pool to initial seed state
   */
  resetToSeed(): void {
    currentJobListings = [...DEMO_JOBS];
  },
};
