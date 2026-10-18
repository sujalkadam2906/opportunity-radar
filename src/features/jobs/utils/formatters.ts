import {
  SalaryRange,
  WorkMode,
  ExperienceLevel,
  JobCategory,
  ApplicationStatus,
} from '../../../types';

export function formatSalary(salary: SalaryRange): string {
  if (salary.display) {
    return salary.display;
  }
  if (salary.period === 'monthly') {
    return `₹${salary.min.toLocaleString('en-IN')} – ₹${salary.max.toLocaleString('en-IN')}/mo`;
  }
  const minLpa = (salary.min / 100000).toFixed(1);
  const maxLpa = (salary.max / 100000).toFixed(1);
  return `₹${minLpa} – ${maxLpa} LPA`;
}

export function formatWorkMode(mode: WorkMode | 'all'): string {
  switch (mode) {
    case 'remote':
      return 'Remote';
    case 'hybrid':
      return 'Hybrid';
    case 'onsite':
      return 'On-site';
    case 'all':
      return 'All Work Modes';
    default:
      return mode;
  }
}

export function formatExperience(level: ExperienceLevel | 'all'): string {
  switch (level) {
    case 'internship':
      return 'Internship';
    case 'entry':
      return 'Entry-Level (0–1y)';
    case 'junior':
      return 'Junior (1–2y)';
    case 'mid':
      return 'Mid-Level (2y+)';
    case 'all':
      return 'All Experience';
    default:
      return level;
  }
}

export function formatCategory(cat: JobCategory | 'all'): string {
  switch (cat) {
    case 'frontend':
      return 'Frontend';
    case 'fullstack':
      return 'Full-Stack';
    case 'backend':
      return 'Backend';
    case 'mobile':
      return 'Mobile (iOS/Android)';
    case 'devops':
      return 'DevOps & Cloud';
    case 'qa':
      return 'QA & Automation';
    case 'all':
      return 'All Domains';
    default:
      return cat;
  }
}

export function formatApplicationStatus(status: ApplicationStatus): string {
  switch (status) {
    case 'saved':
      return 'Saved';
    case 'applied':
      return 'Applied';
    case 'interview':
      return 'Interviewing';
    case 'offer':
      return 'Offer Received';
    case 'rejected':
      return 'Not Selected';
    default:
      return status;
  }
}
