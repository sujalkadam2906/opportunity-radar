import { WebSocketServer, WebSocket } from 'ws';
import { JobListing, WebSocketStreamEvent } from '../src/types';

const PORT = 4001;
const wss = new WebSocketServer({ port: PORT });

console.log(`[StreamServer] Opportunity Radar Demo WebSocket Server running on ws://localhost:${PORT}`);

const LIVE_STREAM_SAMPLES: Partial<JobListing>[] = [
  {
    title: 'Frontend Engineer (React & WebGL)',
    company: {
      id: 'comp-stream-01',
      name: 'PixiGraph India',
      location: 'Bengaluru, Karnataka',
      tagline: 'Interactive 3D geometry engine for web browsers',
      size: '11-50',
      industry: 'Graphics & Web3D',
    },
    location: 'Bengaluru, Karnataka',
    workMode: 'hybrid',
    experienceLevel: 'entry',
    category: 'frontend',
    salary: {
      min: 800000,
      max: 1200000,
      currency: 'INR',
      period: 'yearly',
      display: '₹8.0 – 12.0 LPA',
    },
    requiredSkills: ['React', 'TypeScript', 'WebGL', 'Three.js'],
    preferredSkills: ['GLSL', 'Canvas', 'Performance Tuning'],
    description:
      'Brand new opening! PixiGraph is hiring an entry-level frontend developer passionate about 3D browser graphics and WebGL shaders.',
    responsibilities: [
      'Build React wrappers for WebGL shaders and 3D scenes.',
      'Optimize frame rates to maintain consistent 60 FPS on mobile devices.',
      'Collaborate with 3D designers on asset pipelines.',
    ],
    qualifications: [
      'Strong grasp of JavaScript math (vectors, matrices) and React.',
      'Portfolio demonstrating 3D or creative coding projects.',
    ],
    benefits: ['Competitive salary', 'Flexible hybrid policy', 'Learning budget'],
    demoNotice: 'Demonstration stream event — simulated live vacancy.',
  },
  {
    title: 'Junior Frontend Performance Engineer',
    company: {
      id: 'comp-stream-02',
      name: 'KwikCheckout',
      location: 'Gurugram, Haryana',
      tagline: 'Sub-second mobile checkout SDK for Indian e-commerce',
      size: '51-200',
      industry: 'FinTech',
    },
    location: 'Gurugram, Haryana',
    workMode: 'remote',
    experienceLevel: 'entry',
    category: 'frontend',
    salary: {
      min: 950000,
      max: 1350000,
      currency: 'INR',
      period: 'yearly',
      display: '₹9.5 – 13.5 LPA',
    },
    requiredSkills: ['React', 'TypeScript', 'Web Vitals', 'JavaScript'],
    preferredSkills: ['Service Workers', 'Bundle Analysis', 'Lighthouse CI'],
    description:
      'Just posted! Join KwikCheckout to shave milliseconds off checkout flows across India’s top shopping portals.',
    responsibilities: [
      'Analyze browser network waterfalls and optimize bundle payloads.',
      'Instrument Real User Monitoring (RUM) metrics for Core Web Vitals.',
      'Refactor components for instant Interaction to Next Paint (INP).',
    ],
    qualifications: [
      'Passion for web performance metrics and browser internals.',
      'Experience with React profiling and modern bundling.',
    ],
    benefits: ['100% Remote', 'Equity options', 'MacBook Pro provided'],
    demoNotice: 'Demonstration stream event — simulated live vacancy.',
  },
  {
    title: 'UI Developer - Accessibility Specialist',
    company: {
      id: 'comp-stream-03',
      name: 'Samavesh Tech',
      location: 'Pune, Maharashtra',
      tagline: 'Accessible assistive technology interfaces',
      size: '11-50',
      industry: 'Accessibility Tech',
    },
    location: 'Pune, Maharashtra',
    workMode: 'remote',
    experienceLevel: 'entry',
    category: 'frontend',
    salary: {
      min: 700000,
      max: 1050000,
      currency: 'INR',
      period: 'yearly',
      display: '₹7.0 – 10.5 LPA',
    },
    requiredSkills: ['React', 'HTML', 'CSS', 'WCAG', 'Screen Readers'],
    preferredSkills: ['ARIA APG', 'Automated A11y Testing', 'TypeScript'],
    description:
      'Samavesh is committed to building digital tools accessible to all persons with disabilities in India. We need a frontend engineer with a deep passion for accessibility standards.',
    responsibilities: [
      'Conduct accessibility audits across web applications.',
      'Build keyboard-navigable and screen-reader compliant components.',
      'Author a11y testing scripts using axe-core and Vitest.',
    ],
    qualifications: [
      'Familiarity with WCAG 2.2 guidelines and assistive tools (NVDA, VoiceOver).',
      'Solid semantic HTML and React skills.',
    ],
    benefits: ['Inclusive workplace', 'Remote work', 'Comprehensive health coverage'],
    demoNotice: 'Demonstration stream event — simulated live vacancy.',
  },
];

let streamIndex = 0;

function broadcast(event: WebSocketStreamEvent) {
  const data = JSON.stringify(event);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

wss.on('connection', (ws) => {
  console.log(`[StreamServer] Client connected. Total active clients: ${wss.clients.size}`);

  const welcomeEvent: WebSocketStreamEvent = {
    type: 'CONNECTED',
    payload: {
      clientCount: wss.clients.size,
      timestamp: new Date().toISOString(),
    },
  };
  ws.send(JSON.stringify(welcomeEvent));

  ws.on('close', () => {
    console.log(`[StreamServer] Client disconnected. Active clients: ${wss.clients.size}`);
  });

  ws.on('error', (err) => {
    console.error('[StreamServer] Socket error:', err.message);
  });
});

// Periodic Demonstration Broadcast (Every 25 seconds)
const broadcastInterval = setInterval(() => {
  if (wss.clients.size === 0) return;

  const sample = LIVE_STREAM_SAMPLES[streamIndex % LIVE_STREAM_SAMPLES.length];
  if (!sample) return;
  streamIndex++;

  const newJob: JobListing = {
    id: `opp-stream-${Date.now().toString(36)}`,
    title: sample.title || 'Frontend Developer',
    company: sample.company || {
      id: 'comp-stream',
      name: 'Stream Demo Corp',
      location: 'Bengaluru, Karnataka',
      tagline: 'Demonstration stream company',
      size: '11-50',
      industry: 'Technology',
    },
    location: sample.location || 'Bengaluru, Karnataka',
    workMode: sample.workMode || 'remote',
    experienceLevel: sample.experienceLevel || 'entry',
    category: sample.category || 'frontend',
    salary: sample.salary || {
      min: 800000,
      max: 1200000,
      currency: 'INR',
      period: 'yearly',
      display: '₹8.0 – 12.0 LPA',
    },
    requiredSkills: sample.requiredSkills || ['React', 'JavaScript'],
    preferredSkills: sample.preferredSkills || ['TypeScript'],
    description: sample.description || 'Demonstration live stream posting.',
    responsibilities: sample.responsibilities || ['Develop modern frontend features.'],
    qualifications: sample.qualifications || ['Relevant experience or projects.'],
    benefits: sample.benefits || ['Great team culture'],
    postedAt: new Date().toISOString(),
    isFresh: true,
    isFeatured: true,
    demoNotice: 'Demonstration listing generated via live stream server.',
  };

  console.log(`[StreamServer] Broadcasting newly emitted opportunity: "${newJob.title}" at ${newJob.company.name}`);

  broadcast({
    type: 'NEW_JOB_OPPORTUNITY',
    payload: newJob,
  });
}, 25000);

// Heartbeat interval (every 30 seconds)
const heartbeatInterval = setInterval(() => {
  broadcast({
    type: 'HEARTBEAT',
    payload: { timestamp: new Date().toISOString() },
  });
}, 30000);

process.on('SIGINT', () => {
  console.log('\n[StreamServer] Shutting down WebSocket server...');
  clearInterval(broadcastInterval);
  clearInterval(heartbeatInterval);
  wss.close(() => {
    console.log('[StreamServer] Closed successfully.');
    process.exit(0);
  });
});
