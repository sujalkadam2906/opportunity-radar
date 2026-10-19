import React, { useState, useEffect } from 'react';
import { UserPreferences, WorkMode, ExperienceLevel } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { DEMO_PREFERENCES } from '../../data/demoJobs';
import { X, Plus, RotateCcw } from 'lucide-react';
import styles from './PreferencesModal.module.css';

export interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (prefs: UserPreferences) => void;
  isSaving: boolean;
}

const COMMON_LOCATIONS = [
  'Bengaluru',
  'Remote',
  'Pune',
  'Hyderabad',
  'Gurugram',
  'Mumbai',
  'Chennai',
];

export function PreferencesModal({
  isOpen,
  onClose,
  preferences,
  onSave,
  isSaving,
}: PreferencesModalProps) {
  const [formState, setFormState] = useState<UserPreferences>(preferences);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    setFormState(preferences);
  }, [preferences, isOpen]);

  const toggleWorkMode = (mode: WorkMode) => {
    setFormState((prev) => {
      const current = prev.preferredWorkModes || [];
      const updated = current.includes(mode)
        ? current.filter((m) => m !== mode)
        : [...current, mode];
      return { ...prev, preferredWorkModes: updated.length ? updated : [mode] };
    });
  };

  const toggleLocation = (loc: string) => {
    setFormState((prev) => {
      const current = prev.preferredLocations || [];
      const updated = current.includes(loc)
        ? current.filter((l) => l !== loc)
        : [...current, loc];
      return { ...prev, preferredLocations: updated.length ? updated : [loc] };
    });
  };

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (!formState.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setFormState((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    }
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    setFormState((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleResetDefaults = () => {
    setFormState(DEMO_PREFERENCES);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
    onClose();
  };

  const experienceOptions = [
    { value: 'internship', label: 'Internship' },
    { value: 'entry', label: 'Entry-Level (0–1 yrs)' },
    { value: 'junior', label: 'Junior (1–2 yrs)' },
    { value: 'mid', label: 'Mid-Level (2+ yrs)' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Candidate Career Preferences"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={handleResetDefaults}>
            <RotateCcw size={14} aria-hidden="true" />
            <span>Reset Demo Defaults</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Apply & Recalculate'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Target Role Title"
          value={formState.targetRole}
          onChange={(e) =>
            setFormState((prev) => ({ ...prev, targetRole: e.target.value }))
          }
          placeholder="e.g. Frontend Engineer, React Developer"
          required
        />

        <Select
          label="Target Seniority / Experience Level"
          value={formState.targetExperience}
          options={experienceOptions}
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              targetExperience: e.target.value as ExperienceLevel,
            }))
          }
        />

        <div className={styles.section}>
          <label className={styles.sectionTitle}>Preferred Work Modes</label>
          <div className={styles.pillGroup}>
            {(['remote', 'hybrid', 'onsite'] as WorkMode[]).map((mode) => {
              const active = formState.preferredWorkModes?.includes(mode);
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => toggleWorkMode(mode)}
                  className={`${styles.togglePill} ${active ? styles.togglePillActive : ''}`}
                  aria-pressed={active}
                >
                  {mode === 'remote'
                    ? 'Remote'
                    : mode === 'hybrid'
                      ? 'Hybrid'
                      : 'On-site'}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.sectionTitle}>Preferred Locations (India)</label>
          <div className={styles.pillGroup}>
            {COMMON_LOCATIONS.map((loc) => {
              const active = formState.preferredLocations?.includes(loc);
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => toggleLocation(loc)}
                  className={`${styles.togglePill} ${active ? styles.togglePillActive : ''}`}
                  aria-pressed={active}
                >
                  {loc}
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.sectionTitle}>
            Your Core Skills (Used in Match Heuristic)
          </label>
          <div className={styles.skillInputRow}>
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill (e.g. Next.js, Redux, Docker)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <Button variant="secondary" size="md" onClick={addSkill}>
              <Plus size={16} aria-hidden="true" />
              <span>Add</span>
            </Button>
          </div>
          <div className={styles.skillChips}>
            {formState.skills.map((skill) => (
              <span key={skill} className={styles.skillChip}>
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className={styles.removeSkillBtn}
                  aria-label={`Remove skill ${skill}`}
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <label className={styles.sectionTitle}>
            Minimum Desired Annual Compensation (INR)
          </label>
          <span className={styles.salaryDisplay}>
            ₹{(formState.minSalaryInr / 100000).toFixed(1)} LPA (₹
            {formState.minSalaryInr.toLocaleString('en-IN')})
          </span>
          <input
            type="range"
            min="300000"
            max="2000000"
            step="50000"
            value={formState.minSalaryInr}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                minSalaryInr: Number(e.target.value),
              }))
            }
            aria-label="Minimum desired annual CTC in INR"
          />
        </div>
      </form>
    </Modal>
  );
}
