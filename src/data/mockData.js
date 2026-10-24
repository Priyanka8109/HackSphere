// Static dataset for Hackathons
export const hackathonsData = [
  {
    id: 'ai-innovation-2026',
    title: 'AI Innovation Challenge 2026',
    tagline: 'Build next-generation autonomous AI agents and multimodal tools.',
    description: 'A 48-hour global sprint challenging developers to create intelligent, autonomous agents and LLM-powered applications that solve real-world problems.',
    dates: 'Oct 24 - Oct 26, 2026',
    duration: '48 Hours',
    participants: 1420,
    status: 'Live',
    tags: ['Generative AI', 'LLMs', 'Computer Vision', 'PyTorch'],
    prize: '$25,000',
    mode: 'Online',
  },
  {
    id: 'web3-future-hack',
    title: 'Web3 & Decentralized Future Hack',
    tagline: 'Architect scalable dApps and zero-knowledge privacy systems.',
    description: 'Collaborate with smart contract developers worldwide to build scalable DeFi primitives, DAO governance tools, and privacy-preserving dApps.',
    dates: 'Nov 05 - Nov 07, 2026',
    duration: '36 Hours',
    participants: 980,
    status: 'Upcoming',
    tags: ['Solidity', 'Zero-Knowledge', 'DeFi', 'Rust'],
    prize: '$15,000',
    mode: 'Hybrid',
  },
  {
    id: 'cloud-native-sprint',
    title: 'Cloud Native & DevOps Sprint',
    tagline: 'Modernize infrastructure with Kubernetes, microservices & edge computing.',
    description: 'Demonstrate resilient distributed systems, GitOps pipelines, and serverless architectures in this intensive 24-hour engineering challenge.',
    dates: 'Nov 18 - Nov 20, 2026',
    duration: '24 Hours',
    participants: 750,
    status: 'Upcoming',
    tags: ['Kubernetes', 'Docker', 'Microservices', 'Go'],
    prize: '$10,000',
    mode: 'Online',
  }
];

export const howItWorksSteps = [
  {
    step: '01',
    title: 'Join a Hackathon',
    description: 'Browse available hackathons, check rulebooks, and register instantly with one click.',
    iconName: 'Trophy'
  },
  {
    step: '02',
    title: 'Build Your Team',
    description: 'Form squads with fellow developers, match skills, or join existing teams seamlessly.',
    iconName: 'Users'
  },
  {
    step: '03',
    title: 'Build & Submit',
    description: 'Code your project, link your GitHub repository, upload demo links, and submit before deadline.',
    iconName: 'Code'
  },
  {
    step: '04',
    title: 'Get Judged & Compete',
    description: 'Showcase your demo to industry judges, earn feedback, and compete on the leaderboard.',
    iconName: 'Award'
  }
];

export const platformFeatures = [
  {
    title: 'Team Collaboration',
    description: 'Built-in squad workspace, task boards, and member role management.',
    iconName: 'Users',
    badge: 'Collaboration'
  },
  {
    title: 'Real-Time Communication',
    description: 'Live updates, broadcast announcements, and channel discussions.',
    iconName: 'Radio',
    badge: 'Communication'
  },
  {
    title: 'Project Submission',
    description: 'Integrated GitHub repository linking, demo video embeds, and submission tracking.',
    iconName: 'FileCode2',
    badge: 'Submission'
  },
  {
    title: 'Mentor Support',
    description: 'Dedicated 1-on-1 mentor guidance tickets and office hours support.',
    iconName: 'Sparkles',
    badge: 'Mentorship'
  },
  {
    title: 'Smart Judging',
    description: 'Multi-criteria scoring rubrics on Innovation, Code Quality, Impact, and UI/UX.',
    iconName: 'CheckCircle2',
    badge: 'Judging'
  },
  {
    title: 'Live Leaderboard',
    description: 'Dynamic rank calculation and real-time team progress updates.',
    iconName: 'BarChart3',
    badge: 'Leaderboard'
  }
];

export const initialDashboardData = {
  currentHackathon: {
    title: 'AI Innovation Challenge 2026',
    status: 'In Progress',
    deadline: 'Oct 26, 2026 • 11:59 PM',
    progressPercentage: 75,
  },
  team: {
    name: 'Team Alpha',
    track: 'AI & Automation',
    progress: 75,
    members: [
      { id: 1, name: 'Priyanka', role: 'Team Lead / Full Stack', avatar: 'P', color: 'bg-blue-600', status: 'Online' },
      { id: 2, name: 'Rahul', role: 'Backend & ML Engineer', avatar: 'R', color: 'bg-indigo-600', status: 'Active' },
      { id: 3, name: 'Aisha', role: 'Frontend & UI Designer', avatar: 'A', color: 'bg-emerald-600', status: 'Active' },
      { id: 4, name: 'Rohan', role: 'DevOps & Testing', avatar: 'R', color: 'bg-amber-600', status: 'Online' },
    ]
  },
  stats: [
    {
      id: 'stat-team',
      title: 'Team Members',
      value: '4 / 4',
      subtitle: 'Squad Full (Team Alpha)',
      icon: 'Users',
      color: 'blue',
      percent: 100
    },
    {
      id: 'stat-tasks',
      title: 'Tasks Completed',
      value: '3 / 4',
      subtitle: '75% tasks finished',
      icon: 'CheckSquare',
      color: 'emerald',
      percent: 75
    },
    {
      id: 'stat-sub',
      title: 'Submission Progress',
      value: '75%',
      subtitle: 'Draft saved (GitHub linked)',
      icon: 'UploadCloud',
      color: 'indigo',
      percent: 75
    },
    {
      id: 'stat-time',
      title: 'Days Remaining',
      value: '2 Days',
      subtitle: 'Submission deadline soon',
      icon: 'Clock',
      color: 'amber',
      percent: 40
    }
  ],
  tasks: [
    { id: 1, title: 'Complete UI Design', category: 'Frontend', status: 'Completed', assignee: 'Aisha' },
    { id: 2, title: 'Develop Backend API', category: 'Backend', status: 'Completed', assignee: 'Rahul' },
    { id: 3, title: 'Integrate Database', category: 'Database', status: 'Completed', assignee: 'Priyanka' },
    { id: 4, title: 'Prepare Presentation', category: 'Pitch / Demo', status: 'In Progress', assignee: 'Rohan' },
  ],
  announcements: [
    {
      id: 1,
      title: 'Submission deadline extended to 11:59 PM.',
      type: 'Urgent',
      time: '15 mins ago',
      author: 'Hackathon Admin'
    },
    {
      id: 2,
      title: 'Mentor session starts at 5 PM.',
      type: 'Event',
      time: '1 hour ago',
      author: 'Mentor Team'
    },
    {
      id: 3,
      title: 'API sandbox and reference links updated in dashboard.',
      type: 'Update',
      time: '3 hours ago',
      author: 'Technical Team'
    }
  ]
};

// ==========================================
// Async Data Fetching Simulators (Experiment 2)
// ==========================================

export const fetchHackathonsAsync = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(hackathonsData);
    }, 450); // simulated network latency
  });
};

export const fetchDashboardDataAsync = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialDashboardData);
    }, 500); // simulated network latency
  });
};

export const fetchAnnouncementsAsync = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initialDashboardData.announcements);
    }, 400);
  });
};
