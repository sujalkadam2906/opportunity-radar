import { JobListing, UserPreferences, FitScoreBreakdown, ExperienceLevel } from '../../../types';

/**
 * Normalizes skill strings for case-insensitive matching
 */
export function normalizeSkill(skill: string): string {
  return skill
    .toLowerCase()
    .trim()
    .replace(/\.js$/, '')
    .replace(/\s+/g, '');
}

/**
 * Checks experience level compatibility.
 * Returns 25 for exact match, 15 for adjacent levels, 5 otherwise.
 */
function calculateExperienceScore(
  userExp: ExperienceLevel,
  jobExp: ExperienceLevel
): { score: number; match: boolean } {
  if (userExp === jobExp) {
    return { score: 25, match: true };
  }

  // Adjacent hierarchy: internship <-> entry <-> junior <-> mid
  const levels: ExperienceLevel[] = ['internship', 'entry', 'junior', 'mid'];
  const userIdx = levels.indexOf(userExp);
  const jobIdx = levels.indexOf(jobExp);

  if (userIdx !== -1 && jobIdx !== -1 && Math.abs(userIdx - jobIdx) === 1) {
    return { score: 15, match: true };
  }

  return { score: 5, match: false };
}

/**
 * Deterministic, explainable job-match heuristic calculator.
 *
 * Scoring model (Total: 100 points):
 * 1. Required Skills (up to 30 pts) + Preferred Skills (up to 10 pts) = 40 pts max
 * 2. Seniority / Experience Compatibility = 25 pts max
 * 3. Work Arrangement Compatibility = 20 pts max
 * 4. Location Compatibility = 15 pts max
 */
export function calculateFitScore(
  job: JobListing,
  preferences: UserPreferences
): FitScoreBreakdown {
  if (!preferences) {
    return {
      score: 50,
      matchedSkills: [],
      missingSkills: job.requiredSkills,
      workModeMatch: false,
      locationMatch: false,
      experienceMatch: false,
      summary: 'Default baseline score (no preferences configured)',
    };
  }

  const normalizedUserSkills = new Set(
    (preferences.skills || []).map(normalizeSkill)
  );

  // 1. Skill Overlap Calculation
  const matchedRequired: string[] = [];
  const missingRequired: string[] = [];

  job.requiredSkills.forEach((skill) => {
    if (normalizedUserSkills.has(normalizeSkill(skill))) {
      matchedRequired.push(skill);
    } else {
      missingRequired.push(skill);
    }
  });

  const reqRatio =
    job.requiredSkills.length > 0
      ? matchedRequired.length / job.requiredSkills.length
      : 1;
  const requiredSkillPoints = Math.round(reqRatio * 30);

  // Preferred skills bonus (2 pts each, max 10 pts)
  let preferredSkillPoints = 0;
  job.preferredSkills.forEach((skill) => {
    if (normalizedUserSkills.has(normalizeSkill(skill))) {
      preferredSkillPoints += 2;
    }
  });
  preferredSkillPoints = Math.min(preferredSkillPoints, 10);

  const totalSkillScore = requiredSkillPoints + preferredSkillPoints;

  // 2. Experience Level Compatibility (Max 25 pts)
  const expResult = calculateExperienceScore(
    preferences.targetExperience,
    job.experienceLevel
  );

  // 3. Work Arrangement Compatibility (Max 20 pts)
  let workModeScore = 0;
  let workModeMatch = false;
  const preferredModes = preferences.preferredWorkModes || [];

  if (preferredModes.includes(job.workMode)) {
    workModeScore = 20;
    workModeMatch = true;
  } else if (
    preferredModes.includes('hybrid') &&
    job.workMode === 'remote'
  ) {
    // Candidates open to hybrid are almost universally pleased with remote
    workModeScore = 18;
    workModeMatch = true;
  }

  // 4. Location Compatibility (Max 15 pts)
  let locationScore = 0;
  let locationMatch = false;

  if (job.workMode === 'remote') {
    locationScore = 15;
    locationMatch = true;
  } else {
    const jobLocNormalized = job.location.toLowerCase();
    const matchesUserLoc = (preferences.preferredLocations || []).some(
      (loc) => jobLocNormalized.includes(loc.toLowerCase().trim())
    );
    if (matchesUserLoc) {
      locationScore = 15;
      locationMatch = true;
    }
  }

  const finalScore = Math.min(
    100,
    Math.max(
      0,
      totalSkillScore + expResult.score + workModeScore + locationScore
    )
  );

  // Compose human-readable rationale
  const reasons: string[] = [];
  if (matchedRequired.length > 0) {
    reasons.push(
      `${matchedRequired.length}/${job.requiredSkills.length} required skills matched`
    );
  }
  if (expResult.match) {
    reasons.push('Experience level aligned');
  }
  if (workModeMatch) {
    reasons.push(`${job.workMode} mode aligns with your preference`);
  }
  if (locationMatch && job.workMode !== 'remote') {
    reasons.push('Location matched');
  }

  const summary =
    reasons.length > 0
      ? reasons.join(' • ')
      : 'Lower overlap with current preferences';

  return {
    score: finalScore,
    matchedSkills: matchedRequired,
    missingSkills: missingRequired,
    workModeMatch,
    locationMatch,
    experienceMatch: expResult.match,
    summary,
  };
}
