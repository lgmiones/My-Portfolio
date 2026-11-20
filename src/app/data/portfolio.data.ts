/**
 * All portfolio content lives here, so updating the site means editing this
 * file only. Content follows the résumé (Nov 2026).
 */

export type ProjectCategory = 'Full Stack' | 'Landing Pages' | 'Web' | 'AI';

export interface ProjectLink {
  label: string;
  url: string;
  kind: 'live' | 'code' | 'preview';
}

export interface Project {
  slug: string;
  title: string;
  /** Short descriptor shown under the title. */
  kind: string;
  category: ProjectCategory;
  client?: string;
  summary: string;
  points: string[];
  stack: string[];
  /** Screenshot path, or omit and set `art` for an illustrated cover. */
  image?: string;
  art?: 'court';
  links: ProjectLink[];
  featured?: boolean;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  type: string;
  points: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export const PROFILE = {
  name: 'Louell Grey A. Miones',
  shortName: 'Louell Grey',
  role: 'Full Stack Developer',
  email: 'louellgreyyy@gmail.com',
  phoneDisplay: '0952 469 4469',
  phoneHref: 'tel:+639524694469',
  location: 'Cebu, Philippines',
  timeZone: 'Asia/Manila',
  resume: 'assets/Louell_Grey_Miones_Resume.pdf',
  portrait: 'assets/work/portrait.jpg',
  socials: {
    github: 'https://github.com/lgmiones',
    linkedin: 'https://www.linkedin.com/in/louell-grey-miones-037182263',
    facebook: 'https://www.facebook.com/lgmiones',
    figma: 'https://www.figma.com/files/project/328299748',
  },
  summary: [
    'Full Stack Developer with hands-on experience building web applications using ASP.NET Core, ReactJS, and MSSQL. Skilled in UI/UX design with Figma, website development with Webflow, and building high-converting landing pages and sales pages integrated with CRM checkout funnels.',
    'I build clean, maintainable, user-centered solutions guided by SOLID principles and Agile practices — and I collaborate well across cross-functional teams as a fast-adapting, resourceful professional with a strong, positive work ethic.',
  ],
};

export const SERVICES = [
  {
    title: 'Full-stack applications',
    body: 'Web apps with ASP.NET Core and React on top of MSSQL — REST APIs, auth, role-based access and clean service-repository architecture.',
    tags: ['C#', 'ASP.NET Core', 'React', 'EF Core', 'MSSQL'],
  },
  {
    title: 'Landing & sales pages',
    body: 'Conversion-focused pages with offer and pricing tiers, social proof, countdowns, lead capture and CTAs wired into CRM checkout funnels.',
    tags: ['Next.js', 'CheckoutChamp', 'Vercel', 'UTM tracking'],
  },
  {
    title: 'UI / UX design',
    body: 'Interfaces designed in Figma with a clear user journey and strong visual branding, then built responsively in code or Webflow.',
    tags: ['Figma', 'Webflow', 'Canva', 'Tailwind CSS'],
  },
];

export const SKILLS: SkillGroup[] = [
  { label: 'Frontend', items: ['React', 'Angular', 'Next.js', 'Tailwind CSS', 'TypeScript'] },
  { label: 'Backend', items: ['C#', 'ASP.NET Core', 'REST API Development'] },
  { label: 'Database', items: ['MSSQL Server Express', 'Entity Framework Core', 'Supabase (PostgreSQL)', 'Prisma'] },
  { label: 'Tools & DevOps', items: ['Visual Studio Code', 'Git', 'Docker', 'Azure DevOps'] },
  { label: 'Design & CRM', items: ['Figma', 'Webflow', 'CheckoutChamp', 'Canva', 'Vercel'] },
  {
    label: 'Landing & Sales',
    items: ['Conversion-focused layouts', 'Offer & pricing tiers', 'CTAs', 'Giveaway & lead capture', 'CRM checkout integration'],
  },
  { label: 'Practices', items: ['Agile', 'SOLID principles', 'Responsive UI', 'Cross-functional collaboration'] },
];

export const MARQUEE = [
  'React', 'Angular', 'ASP.NET Core', 'C#', 'MSSQL', 'Entity Framework Core', 'Next.js',
  'Tailwind CSS', 'Docker', 'Azure DevOps', 'Figma', 'Webflow', 'CheckoutChamp', 'Supabase',
];

export const EXPERIENCE: Experience[] = [
  {
    role: 'Junior Software Engineer & CRM Specialist',
    company: 'N-PAX',
    period: 'Aug 2025 — Present',
    type: 'Full-time',
    points: [
      'Implement ERP features and enhancements, writing clean, maintainable code and participating in peer code reviews to ensure quality and consistency.',
      'Design and develop REST API integrations and database queries to synchronize data across systems.',
      'Build scripts and internal tools that automate routine ERP tasks, reducing manual processing time.',
      'Provide CRM and customer support by investigating reported issues, reproducing defects, and coordinating hotfixes and releases to minimize downtime.',
    ],
  },
  {
    role: 'Web Designer & Landing Page Developer',
    company: 'Bolder One LLC (Bolder Adventure Park)',
    period: 'Apr 2026 — Oct 2026',
    type: 'Contract',
    points: [
      'Designed a high-converting VIP landing page and admission page in Figma with a clean user journey and strong visual branding, structured for integration with CheckoutChamp CRM.',
      'Built and deployed a sales page for the park’s “Scale or Fail” campaign, featuring the founder’s story, seven tiered reward packages ($25–$10,000), FAQs, and purchase CTAs tied to the checkout flow.',
      'Built a Family Fun Day landing page promoting a discounted family bundle, with attraction highlights, value comparison, social proof, and multiple “Buy Now” CTAs leading to date-and-time checkout.',
      'Built a birthday party giveaway landing page for a monthly $1,000 party sweepstakes, with a prize breakdown, attractions showcase, testimonials, and a quick-entry lead capture form.',
      'Built the EPICJARED influencer-partnership landing page in Next.js, pairing a creator’s Facebook post and Google reviews as social proof with two exclusive ticket tiers, a live offer countdown, FAQs, and UTM-tracked checkout CTAs.',
    ],
  },
  {
    role: 'Technical and Network Support Intern',
    company: 'ACE-1 IT Solutions, Cebu City',
    period: 'Jun 2024 — Aug 2024',
    type: 'Internship',
    points: [
      'Diagnosed and resolved hardware and network issues for clients, ensuring reliable system operations.',
      'Assisted in troubleshooting and maintaining network infrastructure to optimize performance and connectivity.',
      'Gained hands-on experience in IT support, strengthening technical problem-solving and system maintenance skills.',
    ],
  },
];

export const TRAINING = {
  title: 'Full Stack Developer Track',
  org: 'N-PAX Fresh Graduate Technical Training',
  period: 'Aug 2025 — Dec 2025',
  points: [
    'Completed an intensive, multi-phase program combining professional communication, proactive work habits, and full-stack technical foundations.',
    'Built hands-on skills in C#, ASP.NET Core, React, MSSQL, Entity Framework Core, Tailwind CSS, Git, Docker, and Azure DevOps.',
    'Culminated in a full-stack capstone project applying Agile methodology.',
  ],
};

export const EDUCATION = {
  degree: 'Bachelor of Science in Computer Engineering',
  school: 'University of Cebu — Lapu-Lapu and Mandaue',
  period: '2021 — 2025',
  thesis: 'EGGSENTIAL — AI-powered egg categorization with YOLOv8',
};

export const PROJECTS: Project[] = [
  {
    slug: 'crimescope',
    title: 'CrimeScope',
    kind: 'Lapu-Lapu crime map & analytics',
    category: 'Full Stack',
    summary:
      'An interactive crime map of all 30 Lapu-Lapu City barangays, built from official PSA/NAMRIA boundaries and 2020 census data.',
    points: [
      '3D, choropleth and heatmap views with month-by-month playback.',
      'Analytics for crime rates per 10,000 residents, a 24-hour crime clock and trend charts.',
      'Synthetic data refreshed monthly via GitHub Actions and a Vercel deploy hook.',
    ],
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'MapLibre GL', 'D3', 'Tailwind CSS'],
    image: 'assets/work/crimescope.jpg',
    links: [{ label: 'Live site', url: 'https://lapu2-crimescope.vercel.app/', kind: 'live' }],
    featured: true,
  },
  {
    slug: 'pickleball',
    title: 'Pickleball Court Booking System',
    kind: 'Online & walk-in booking platform',
    category: 'Full Stack',
    summary:
      'A reusable court-booking template that any client can rebrand from an admin Branding Settings page — no code changes needed.',
    points: [
      'Built with Next.js 14 (App Router), React, Tailwind CSS, Prisma and Supabase (PostgreSQL, Auth, Storage).',
      'Visual court map with live status, date and time-slot booking with double-booking prevention (database unique constraint plus a server-side re-check), and GCash / Bank QR payments with proof-of-payment upload and admin verification.',
      'Secure admin panel with income and statistics dashboards (Chart.js), court, schedule and booking management, and report exports to CSV, Excel and PDF.',
    ],
    stack: ['Next.js 14', 'React', 'Tailwind CSS', 'Prisma', 'Supabase', 'Chart.js'],
    art: 'court',
    links: [
      { label: 'View code', url: 'https://github.com/lgmiones/Pickleball-Online-and-Walk-in-Booking-System', kind: 'code' },
    ],
    featured: true,
  },
  {
    slug: 'epicjared',
    title: 'EPICJARED Exclusive Offer',
    kind: 'Influencer-partnership landing page',
    category: 'Landing Pages',
    client: 'Bolder Adventure Park',
    summary:
      'A Next.js landing page pairing a creator’s Facebook post and Google reviews as social proof with two exclusive ticket tiers.',
    points: [
      'Live offer countdown, FAQs and UTM-tracked checkout CTAs.',
      'Built to turn an influencer’s audience into ticket sales with a fast, focused purchase path.',
    ],
    stack: ['Next.js', 'React', 'Vercel', 'UTM tracking'],
    image: 'assets/work/bolder-epicjared.jpg',
    links: [{ label: 'Live site', url: 'https://epic-jared-landing.vercel.app/', kind: 'live' }],
    featured: true,
  },
  {
    slug: 'flipsters',
    title: 'FLIPSTERS',
    kind: 'Full-stack e-commerce web app',
    category: 'Full Stack',
    summary:
      'An e-commerce app with a React (Vite, Tailwind CSS) frontend and an ASP.NET Core Web API backend with JWT auth and role-based access control.',
    points: [
      'Service-repository architecture for clean backend logic, Entity Framework Core for data, and secure API calls with Axios.',
      'User registration, product browsing, cart management and order placement, plus an admin view for product and customer activity.',
    ],
    stack: ['React', 'Vite', 'Tailwind CSS', 'ASP.NET Core', 'EF Core', 'JWT'],
    image: 'assets/work/flipsters.jpg',
    links: [
      { label: 'Preview', url: 'https://www.canva.com/design/DAG1XVHSxz4/isgbVvsO8ahnD8Gx6BjkWQ/edit', kind: 'preview' },
      { label: 'View code', url: 'https://github.com/lgmiones/ShoeApp', kind: 'code' },
    ],
    featured: true,
  },
  {
    slug: 'family-fun-day',
    title: 'Family Fun Day',
    kind: 'Bundle offer landing page',
    category: 'Landing Pages',
    client: 'Bolder Adventure Park',
    summary:
      'A landing page promoting a discounted family bundle — four all-access passes, pizza and drinks at one flat price.',
    points: [
      'Attraction highlights, value comparison and social proof.',
      'Multiple “Buy Now” CTAs leading straight to date-and-time checkout.',
    ],
    stack: ['Landing page', 'CheckoutChamp', 'Vercel'],
    image: 'assets/work/bolder-family.jpg',
    links: [{ label: 'Live site', url: 'https://bolder-family-fun-day-landing.vercel.app/', kind: 'live' }],
    featured: true,
  },
  {
    slug: 'scale-or-fail',
    title: 'Scale or Fail',
    kind: 'Campaign sales page',
    category: 'Landing Pages',
    client: 'Bolder Adventure Park',
    summary:
      'The sales page for the park’s “Scale or Fail” campaign, built around the founder’s story.',
    points: [
      'Seven tiered reward packages from $25 to $10,000, with FAQs and purchase CTAs tied to the checkout flow.',
    ],
    stack: ['Sales page', 'Reward tiers', 'Checkout funnel'],
    image: 'assets/work/bolder-scale.jpg',
    links: [{ label: 'Live site', url: 'https://scale.bolderadventurepark.com/', kind: 'live' }],
  },
  {
    slug: 'birthday-giveaway',
    title: 'Birthday Party Giveaway',
    kind: 'Sweepstakes & lead-capture page',
    category: 'Landing Pages',
    client: 'Bolder Adventure Park',
    summary: 'A landing page for a monthly $1,000 birthday party sweepstakes.',
    points: ['Prize breakdown, attractions showcase, testimonials and a quick-entry lead capture form.'],
    stack: ['Landing page', 'Lead capture', 'Vercel'],
    image: 'assets/work/bolder-giveaway.jpg',
    links: [{ label: 'Live site', url: 'https://birthday-party-give-away-landing-pa.vercel.app/', kind: 'live' }],
  },
  {
    slug: 'bolder-vip',
    title: 'Bolder VIP & Admission',
    kind: 'VIP landing & admission pages',
    category: 'Landing Pages',
    client: 'Bolder Adventure Park',
    summary:
      'High-converting VIP landing and admission pages designed in Figma with a clean user journey and strong visual branding.',
    points: ['Structured for integration with the CheckoutChamp CRM checkout.'],
    stack: ['Figma', 'Angular', 'CheckoutChamp'],
    image: 'assets/work/bolder-park.jpg',
    links: [{ label: 'Live site', url: 'https://bolder-adventure-park.vercel.app/', kind: 'live' }],
  },
  {
    slug: 'task-app',
    title: 'Task Management App',
    kind: 'Full-stack web application',
    category: 'Full Stack',
    summary: 'A task management system built with an ASP.NET Core Web API and ReactJS, with full CRUD and authentication.',
    points: [
      'Containerized with Docker for consistent deployment across environments.',
      'Responsive UI built with Tailwind CSS.',
    ],
    stack: ['ASP.NET Core', 'React', 'Docker', 'Tailwind CSS', 'SQL Server'],
    image: 'assets/work/taskapp.jpg',
    links: [
      { label: 'Preview', url: 'https://www.canva.com/design/DAG70ISY5Ag/yd_MsR5OolqGh2Dnqa4HDQ/edit', kind: 'preview' },
      { label: 'View code', url: 'https://github.com/lgmiones/TaskApp', kind: 'code' },
    ],
  },
  {
    slug: 'fintrack',
    title: 'FinTrack',
    kind: 'Capstone — personal finance manager',
    category: 'Full Stack',
    summary: 'Helps users track income, expenses and savings goals through visual data representations.',
    points: [
      'Category-based tracking and trend monitoring with Entity Framework Core.',
      'Collaborated on backend/frontend integration, deployment and testing.',
    ],
    stack: ['React', '.NET', 'EF Core', 'MSSQL'],
    image: 'assets/work/fintrack.jpg',
    links: [
      { label: 'Preview', url: 'https://www.canva.com/design/DAG70WtTtL8/Kz-BRdeXjTPsPAuGczF90Q/edit', kind: 'preview' },
      { label: 'View code', url: 'https://github.com/NajeBabs/fintech', kind: 'code' },
    ],
  },
  {
    slug: 'pickle-party',
    title: 'Pickle & Party',
    kind: '60th birthday invitation website',
    category: 'Web',
    summary:
      'A responsive, animated invitation site with a photo hero, event details with a map link, a live countdown and an evening program timeline.',
    points: [
      'Custom Open Graph and Twitter preview images, so the invite shows a branded card when shared.',
      'Deployed on Netlify.',
    ],
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    image: 'assets/work/pickle-party.jpg',
    links: [
      { label: 'Live site', url: 'https://marissa-60th-birthday-invitation.netlify.app/', kind: 'live' },
      { label: 'View code', url: 'https://github.com/lgmiones/Marissa-birthday-invitation', kind: 'code' },
    ],
  },
  {
    slug: 'villa-prudencia',
    title: 'Villa Prudencia Beach Resort',
    kind: 'Resort landing page',
    category: 'Web',
    summary:
      'A responsive landing page showcasing resort accommodations and activities, guiding visitors from discovery to booking inquiry.',
    points: ['Intuitive layout built around the resort’s beachfront charm in Boljoon, Cebu.'],
    stack: ['Angular', 'Responsive UI'],
    image: 'assets/work/villa-prudencia.jpg',
    links: [{ label: 'Live site', url: 'https://villa-prudencia-resort.netlify.app/', kind: 'live' }],
  },
  {
    slug: 'limasawa',
    title: 'Limasawa Island Escape',
    kind: 'Travel itinerary landing page',
    category: 'Web',
    summary:
      'A travel landing page with a day-by-day itinerary planner, points-of-interest showcase, photo gallery and travel tips.',
    points: ['Clean, image-driven layout that guides visitors from destination discovery through trip planning.'],
    stack: ['HTML', 'CSS', 'JavaScript'],
    image: 'assets/work/limasawa.jpg',
    links: [{ label: 'Live site', url: 'https://limasawa-itinerary.netlify.app/', kind: 'live' }],
  },
  {
    slug: 'eggsential',
    title: 'EGGSENTIAL',
    kind: 'Thesis — AI egg categorization',
    category: 'AI',
    summary:
      'An AI-powered classification system using YOLOv8 to detect quality issues (dirt, rot, cracks) and classify eggs by size and weight.',
    points: ['Improves sorting accuracy for the poultry industry.'],
    stack: ['YOLOv8', 'FastAPI', 'TensorFlow'],
    image: 'assets/work/eggsential.jpg',
    links: [
      { label: 'Preview', url: 'https://drive.google.com/drive/folders/17o3anjPlaWUOfJ2IBateu7pajWxioPMj?usp=drive_link', kind: 'preview' },
    ],
  },
];

export const PROJECT_FILTERS: Array<'All' | ProjectCategory> = ['All', 'Full Stack', 'Landing Pages', 'Web', 'AI'];
