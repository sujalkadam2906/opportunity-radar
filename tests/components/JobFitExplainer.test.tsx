import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JobFitExplainer } from '../../src/features/jobs/components/JobFitExplainer';
import { FitScoreBreakdown } from '../../src/types';

describe('JobFitExplainer Component', () => {
  const sampleFit: FitScoreBreakdown = {
    score: 85,
    matchedSkills: ['React', 'TypeScript', 'CSS'],
    missingSkills: ['Next.js'],
    workModeMatch: true,
    locationMatch: true,
    experienceMatch: true,
    summary: 'Strong match with 3/4 skills matched • Experience level aligned',
  };

  it('renders fit score and summary explanation', () => {
    render(<JobFitExplainer fit={sampleFit} />);

    expect(screen.getByText('85 / 100')).toBeInTheDocument();
    expect(screen.getByText(sampleFit.summary)).toBeInTheDocument();
  });

  it('renders overlapping matched skills and missing prerequisite skills', () => {
    render(<JobFitExplainer fit={sampleFit} />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('CSS')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });

  it('indicates preference alignment factors', () => {
    render(<JobFitExplainer fit={sampleFit} />);

    expect(screen.getByText('Work mode aligns with your target')).toBeInTheDocument();
    expect(screen.getByText('Seniority band compatible')).toBeInTheDocument();
    expect(
      screen.getByText('Location / Remote eligibility satisfied')
    ).toBeInTheDocument();
  });
});
