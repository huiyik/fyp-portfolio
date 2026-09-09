import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';

interface NavLink {
  id: string;
  label: string;
}

interface SkillCategory {
  title: string;
  bg: string;
  skills: string[];
}

interface ModelResult {
  name: string;
  accuracy: string;
  precision: string;
  recall: string;
  f1: string;
  rank: string;
  winner?: boolean;
}

interface SimpleCard {
  title: string;
  text: string;
}

interface ProblemCard extends SimpleCard {
  number: string;
}

interface KddStep {
  number: string;
  name: string;
  description: string;
}

interface TimelineItem {
  date: string;
  text: string;
}

interface Photo {
  src: string;
  alt: string;
  caption: string;
}

interface WeeklyReport {
  week: string;
  dates: string;
  focus: string;
  tasks: string[];
  skills: string[];
  challenges: string[];
  learning: string;
  next: string;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  loading = signal(true);
  scrollProgress = signal(0);
  showBackToTop = signal(false);
  activeSection = signal('home');
  typedText = signal('');
  formStatus = signal<'idle' | 'submitting' | 'success' | 'error'>('idle');

  readonly formspreeEndpoint = 'https://formspree.io/f/mkolawky';

  lightboxPhoto = signal<Photo | null>(null);
  zoomScale = signal(1);
  panX = signal(0);
  panY = signal(0);
  isPanning = signal(false);

  readonly dashboardUrl = 'https://telco-churn-prediction-mly57bjbcpgnh48swfsz9a.streamlit.app/';

  navLinks: NavLink[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'career', label: 'Résumé' },
    { id: 'fyp', label: 'FYP' },
    { id: 'internship', label: 'Internship' },
    { id: 'activities', label: 'Activities' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ];

  fypStats = [
    { value: '80%', label: 'Model Accuracy' },
    { value: '7,043', label: 'Records Analysed' },
    { value: '8', label: 'Key Predictors Selected' },
    { value: '6', label: 'Models Compared' },
    { value: '1', label: 'Live Dashboard Deployed' },
  ];

  profilePhoto: Photo = {
    src: 'assets/profile-new.jpeg',
    alt: 'Tang Hui Yi',
    caption: 'Tang Hui Yi | Decision Mathematics & Data Analytics Student',
  };

  posterPhoto: Photo = {
    src: 'assets/fyp-poster.jpg',
    alt: 'FYP Poster',
    caption: 'Final Year Project Research Poster',
  };

  attendancePhoto: Photo = {
    src: 'assets/attendance-form.png',
    alt: 'Signed Attendance and Supervision Monitoring Form',
    caption: 'Signed Attendance and Supervision Monitoring Form (SQQZK4993)',
  };

  skillCategories: SkillCategory[] = [
    {
      title: 'Programming',
      bg: 'assets/bg-programming.jpg',
      skills: ['Python', 'Java', 'SQL', 'DAX'],
    },
    {
      title: 'Data Processing',
      bg: 'assets/bg-data-processing.jpeg',
      skills: ['Pandas', 'NumPy', 'Polars', 'Scikit-learn', 'Web Scraping'],
    },
    {
      title: 'Data Engineering',
      bg: 'assets/bg-deployment.jpg',
      skills: [
        'Microsoft Fabric',
        'Delta Lake / OneLake',
        'Medallion Architecture',
        'Pipeline Orchestration',
      ],
    },
    {
      title: 'Visualisation & BI',
      bg: 'assets/bg-visualisation.jpeg',
      skills: ['Power BI', 'Tableau', 'Semantic Models', 'Row-Level Security', 'Matplotlib'],
    },
    {
      title: 'Methodology',
      bg: 'assets/bg-methodology.jpg',
      skills: [
        'KDD Process',
        'Machine Learning',
        'Data Mining',
        'Kimball / Star Schema',
        'Classification',
      ],
    },
    {
      title: 'Tools & Workflow',
      bg: 'assets/bg-other.jpg',
      skills: ['Streamlit', 'Git & GitHub', 'Azure DevOps', 'Microsoft Office', 'Google Workspace'],
    },
  ];

  problemCards: ProblemCard[] = [
    {
      number: '01',
      title: 'High Churn Rates',
      text: 'Customers on month-to-month contracts can leave anytime with no penalty.',
    },
    {
      number: '02',
      title: 'Black Box Issue',
      text: 'Companies have data but cannot tell who is about to leave or why.',
    },
    {
      number: '03',
      title: 'Methodological Gap',
      text: 'No agreement on which model works best for telecom churn data.',
    },
  ];

  kddSteps: KddStep[] = [
    { number: '01', name: 'Data Selection', description: 'Loaded Telco dataset, reduced 21 to 8 variables.' },
    { number: '02', name: 'Preprocessing', description: 'Fixed blanks, dropped CustomerID, encoded target.' },
    { number: '03', name: 'Transformation', description: '<strong>One-hot encoding</strong>, expanded to 14 columns.' },
    { number: '04', name: 'Data Splitting', description: '<strong>70%</strong> train, <strong>30%</strong> test, random_state=42.' },
    { number: '05', name: 'Data Mining', description: 'Trained 6 classification models.' },
    { number: '06', name: 'Evaluation', description: 'Compared <strong>Accuracy</strong>, <strong>Precision</strong>, <strong>Recall</strong>, <strong>F1-Score</strong>.' },
    { number: '07', name: 'Deployment', description: 'Saved best model, deployed on Streamlit.' },
  ];

  modelResults: ModelResult[] = [
    { name: '<strong>Decision Tree</strong> (Default)', accuracy: '0.72', precision: '0.49', recall: '0.48', f1: '0.49', rank: '6th' },
    { name: '<strong>Decision Tree</strong> (Max Depth 3)', accuracy: '0.78', precision: '0.70', recall: '0.34', f1: '0.46', rank: '4th' },
    { name: '<strong>Decision Tree</strong> (Max Depth 5)', accuracy: '0.79', precision: '0.62', recall: '0.61', f1: '0.62', rank: '2nd' },
    { name: '<strong>Decision Tree</strong> (Entropy)', accuracy: '0.73', precision: '0.51', recall: '0.48', f1: '0.50', rank: '5th' },
    { name: '<strong>Random Forest</strong>', accuracy: '0.78', precision: '0.62', recall: '0.47', f1: '0.53', rank: '3rd' },
    { name: '<strong>Logistic Regression</strong>', accuracy: '0.80', precision: '0.67', recall: '0.53', f1: '0.59', rank: '1st', winner: true },
  ];

  findingCards: SimpleCard[] = [
    { title: '80% Accuracy', text: '<strong>Logistic Regression</strong> performed best among all six models.' },
    { title: 'Top 3 Predictors', text: '<strong>Contract Type</strong>, <strong>Tenure</strong>, and <strong>Monthly Charges</strong>.' },
    { title: 'Live Dashboard', text: 'Deployed for non-technical business analysts.' },
  ];

  dashboardShots: Photo[] = [
    {
      src: 'assets/dashboard-high.jpg',
      alt: 'Dashboard screenshot: High Risk Prediction',
      caption: 'Dashboard Output: High Risk Customer Prediction',
    },
    {
      src: 'assets/dashboard-low.jpg',
      alt: 'Dashboard screenshot: Low Risk Prediction',
      caption: 'Dashboard Output: Low Risk Customer Prediction',
    },
    {
      src: 'assets/dashboard-moderate.jpg',
      alt: 'Dashboard screenshot: Moderate Risk Prediction',
      caption: 'Dashboard Output: Moderate Risk Customer Prediction',
    },
  ];

  galleryPhotos: Photo[] = [
    {
      src: 'assets/supervisor.jpeg',
      alt: 'With Supervisor Dr. Izwan',
      caption: 'With my Supervisor, Associate Professor Ts. Dr. Izwan Nizal Bin Mohd Shaharanee',
    },
    {
      src: 'assets/evaluator.jpeg',
      alt: 'Presenting to Evaluator',
      caption: 'Presenting to Evaluator at Decision Science Research Symposium 2026',
    },
    {
      src: 'assets/symposium.jpeg',
      alt: 'Decision Science Research Symposium 2026',
      caption: 'Decision Science Research Symposium 2026, School of Quantitative Sciences, UUM',
    },
    {
      src: 'assets/silver-award.jpeg',
      alt: 'Silver Award, Decision Support System Category',
      caption:
        'Silver Award for the Decision Support System Category at the Decision Science Research Symposium 2026 (Poster Presentation)',
    },
  ];

  activityCards: SimpleCard[] = [
    { title: 'Leadership', text: 'Event coordination, team management, administrative oversight' },
    { title: 'Project Management', text: 'Logistics planning, contingency preparation, cross-department coordination' },
    { title: 'Communication', text: 'Trilingual in English, Malay, and Chinese. Stakeholder reporting and documentation.' },
  ];

  contactLinks: { icon: string; label: string; href: string }[] = [
    { icon: 'assets/icon-email.png', label: 'hytang0806@gmail.com', href: '' },
    { icon: 'assets/icon-phone.png', label: '+60 11-2319 1627', href: '' },
    { icon: 'assets/icon-github.png', label: 'github.com/huiyik', href: 'https://github.com/huiyik' },
    {
      icon: 'assets/icon-linkedin.png',
      label: 'linkedin.com/in/tang-hui-yi-b9b9b91b3',
      href: 'https://www.linkedin.com/in/tang-hui-yi-b9b9b91b3/',
    },
    {
      icon: 'assets/icon-instagram.png',
      label: 'instagram.com/huiy1k_',
      href: 'https://www.instagram.com/huiy1k_/',
    },
  ];

  timeline: TimelineItem[] = [
    { date: 'April 2026', text: 'Project development begins. Dashboard structure planned with supervisor.' },
    { date: 'April to May 2026', text: 'Data preprocessing completed. Six models trained and evaluated.' },
    { date: 'May to June 2026', text: 'Streamlit dashboard built and deployed on Streamlit Community Cloud.' },
    { date: 'June 2026', text: 'Final report written and revised based on supervisor feedback.' },
    { date: 'June 29, 2026', text: 'Poster presented at Decision Science Research Symposium 2026 at UUM.' },
    { date: 'July 2026', text: 'Final report and e-portfolio submitted.' },
  ];

  internshipResponsibilities: string[] = [
    'Design and build an automated monthly data pipeline that identifies potential B2B customers from public industry directories.',
    'Model the collected data for reporting using a medallion (bronze, silver, gold) architecture and a Kimball star schema.',
    'Build and maintain Power BI dashboards for the business and sales teams.',
    'Apply data-quality checks, change tracking, and row-level security across the model.',
    'Move the work from sandbox development into the standard dev, test, and prod deployment lifecycle.',
  ];

  internshipContributions: string[] = [
    'Delivered an end-to-end pipeline (ingest, clean, model, dashboard) that runs unattended on a monthly schedule.',
    'Cut the reporting data model from ~13 tables to 5 through better grain and dimensional design.',
    'Built a multi-page Power BI report with row-level security separating two business units.',
    'Found and fixed dozens of real data-quality and logic bugs through systematic raw-data audits.',
    'Rebuilt a second, independent pipeline project from scratch to reinforce the same architecture.',
  ];

  skillsApplied: string[] = [
    'Python',
    'SQL',
    'Pandas',
    'Data cleaning & EDA',
    'Dimensional modelling basics',
    'Power BI & Tableau fundamentals',
    'Technical report writing',
    'Stakeholder communication',
  ];

  skillsGained: string[] = [
    'Microsoft Fabric (Lakehouse, OneLake, Data Pipelines)',
    'Polars',
    'Delta Lake',
    'Medallion architecture',
    'SCD Type 2',
    'Semantic models & Direct Lake',
    'Advanced DAX',
    'Row-Level Security',
    'Pipeline orchestration & idempotency',
    'Production-safety practices',
    'Git & Azure DevOps',
    'Dev / Test / Prod ALM',
  ];

  weeklyReports: WeeklyReport[] = [
    {
      week: 'Week 1',
      dates: '3 to 7 August 2026',
      focus: 'Onboarding and a first working pipeline',
      tasks: [
        "Learned the organisation's history, structure, policies, and culture framework, and clarified the project brief with my mentor.",
        'Built the first version of a web scraper: collect a member list, scrape individual profile pages, then filter and score the results.',
        'Set up Python, a virtual environment, and Delta Lake on the work machine.',
        'Practised the Lakehouse workflow in Microsoft Fabric by uploading data to OneLake, loading it into Delta tables, and querying it through both the SQL endpoint and notebooks.',
        'Built a first star schema (one fact table plus dimension tables).',
      ],
      skills: [
        'Python',
        'Web scraping',
        'Polars',
        'Delta Lake',
        'Microsoft Fabric (Lakehouse, OneLake)',
        'Star schema basics',
      ],
      challenges: [
        'A CSV export kept crashing because the column headers were built from only the first record. I fixed it by defining a complete, fixed schema up front.',
        'The scraper was silently pulling the wrong text into one field on every row. I traced it to an outer wrapper element matching first, then rewrote it to read the real label and value structure directly.',
        'Spaces in the machine username broke Delta Lake. I fixed it by writing tables to a path without spaces.',
      ],
      learning:
        'A script can look like it is working while quietly corrupting data, so checking the actual output, not just whether it ran, is the only reliable test. Saving raw data first and filtering later keeps that data reusable for other work.',
      next: 'Formalise the bronze, silver, and gold layers and move the pipeline fully into Fabric.',
    },
    {
      week: 'Week 2',
      dates: '10 to 14 August 2026',
      focus: 'Medallion architecture and a production-ready pipeline',
      tasks: [
        'Restructured the whole pipeline on the medallion (bronze, silver, gold) pattern.',
        'Simplified the data model by folding redundant bridge tables into a single shared attribute bridge, cutting the star schema from about 13 tables to 5.',
        'Migrated all cleaning, filtering, and scoring logic from local scripts into Fabric notebooks.',
        'Rebuilt the semantic model relationships and DAX measures, and built a multi-page Power BI report (overview, attribute detail pages, and a pipeline-health page).',
        'Added production-safety guards: a row-count sanity check before overwriting good data, bounded retries on network calls, idempotent writes, and an orchestrator notebook to run the pipeline end to end.',
      ],
      skills: [
        'Medallion architecture',
        'Kimball dimensional modelling',
        'Grain and bridge tables',
        'Advanced DAX (DISTINCTCOUNT, CALCULATE)',
        'Power BI cross-filter direction',
        'Pipeline orchestration',
        'Idempotency and defensive coding',
      ],
      challenges: [
        'DAX measures returned inflated values once a company had multiple fact rows. I fixed it by switching aggregation from Sum to Max and using DISTINCTCOUNT.',
        'Slicers were not filtering paired tables. I traced it to a single-direction relationship, then split attribute types onto separate pages to avoid cross-filter side effects.',
        'I found that a safety guard had never actually run because an error was being silently swallowed.',
      ],
      learning:
        'Too many bridge tables usually signal a grain problem, not a modelling need. "Does it work when I watch it" is not the same as "is it safe to run unattended", and automation needs guards, retries, and loud failures.',
      next: 'Add slowly-changing history to track profile changes over time, and set up the monthly schedule.',
    },
    {
      week: 'Week 3',
      dates: '17 to 21 August 2026',
      focus: 'Change tracking, security, and data quality',
      tasks: [
        'Completed a Slowly Changing Dimension (Type 2) design so historical changes are preserved rather than overwritten.',
        "Built a two-stage matching process to separate net-new prospects from the company's existing customer records.",
        'Configured Row-Level Security so each business unit sees only its own customer data while sharing new prospects, plus a manager role with full access.',
        'Ran a full data-quality audit across about 800 records, standardising inconsistent wording in several fields and fixing real logic bugs (a year-stripping rule that damaged valid codes, a case-sensitivity bug, greedy patterns causing data loss).',
        'Evaluated other public directories as extra lead sources and documented why most were not usable (anti-bot protection, paywalls, thin data, wrong company type).',
      ],
      skills: [
        'SCD Type 2',
        'Hashing for change detection',
        'Name and fuzzy matching',
        'String normalisation',
        'Row-Level Security',
        'Regex',
        'Systematic data-quality auditing',
      ],
      challenges: [
        '"Unchanged" records kept stale derived columns after the cleaning logic changed, because the raw data had not changed. I fixed it by re-deriving on every run.',
        'RLS "Test as role" did not work under single sign-on on this connection type. I worked around it with a live viewer-account test.',
        'Inconsistent place-name spellings silently broke a filter until the output was checked directly.',
      ],
      learning:
        'Logic that is correct on paper can still produce wrong results because of a data-format quirk (empty string versus null) or a platform quirk, so verifying against a real example beats trusting that it "should" work. A filter is only as good as its keyword list.',
      next: 'Finalise the monthly schedule and connect Git version control.',
    },
    {
      week: 'Week 4',
      dates: '24 to 28 August 2026',
      focus: 'Automation, an agent-assisted workflow, and a second pipeline',
      tasks: [
        'Set the pipeline to run automatically on a monthly schedule with no manual trigger.',
        'Explored an agent-driven workflow from the code editor to the cloud in an isolated sandbox, keeping production and any internal data strictly out of scope.',
        'Rebuilt the sandbox from scratch as a separate practice project: a self-updating daily weather monitor for several cities from a free public API.',
        'Applied every lesson from the main project: a clean star schema with business-friendly names, correct data types, a scheduled orchestration pipeline, and a themed multi-page Power BI report with a map, drill-through, and anomaly indicators.',
      ],
      skills: [
        'Pipeline scheduling and dependencies',
        'Environment isolation and security boundaries',
        'Semantic-model best practices',
        'Power BI report authoring (PBIP)',
        'Theming, map visuals, drill-through',
        'Time-series anomaly logic',
      ],
      challenges: [
        'Intermittent refresh failures turned out to be a plain schema-name mismatch, not the capacity throttling I first assumed.',
        'A documented platform bug made one card visual break with multiple measures. I confirmed it through community threads, then split it into separate cards.',
        'An outbound email alert was removed after reviewing the "data leaving the tenant automatically" implication.',
      ],
      learning:
        'Rebuilding a project clean, with the right guidelines loaded from the start, is far faster than retrofitting. Always confirm the actual root cause instead of acting on the first theory, and think about where data goes, not just whether a feature works.',
      next: 'Bring both projects into a shared team workspace and the standard dev, test, and prod lifecycle.',
    },
    {
      week: 'Week 5',
      dates: '1 to 5 September 2026',
      focus: 'Deployment lifecycle and handover',
      tasks: [
        'Built a second internal search tool for the business team on a small finance dataset, with data-quality checks on record uniqueness.',
        'Moved both semantic models and reports into official team Dev and Test workspaces using a purpose-built deployment function, while keeping the data in its original location (no duplicate storage).',
        'Reviewed the standard Dev, Test, and Prod deployment pipeline with my mentor.',
        'Reconfigured Row-Level Security across environments and traced a data-visibility bug to reports still bound to the old model. I fixed it by rebinding them to the correct one.',
        'Updated the portable project-context documentation for handover.',
      ],
      skills: [
        'ALM and deployment pipelines',
        'Cross-workspace model deployment',
        'RLS across environments',
        'Dev, Test, and Prod discipline',
        'Documentation',
      ],
      challenges: [
        "A visibility reversal during audience testing meant each account saw the other unit's data. I root-caused it to cloned reports still pointing at an outdated model with an inverted rule set, then resolved it by rebinding to the corrected models.",
        'A file-permission error hit when writing through a local mount path. I fixed it by using the authenticated cloud path already used elsewhere in the pipeline.',
      ],
      learning:
        'When you copy or clone report artefacts, check what they are actually connected to, because a stale binding will silently serve wrong data. Keeping data in one place and only deploying the models around it avoids redundant storage and drift.',
      next: 'Continue promoting the work toward production and hand over with clear documentation.',
    },
  ];

  private readonly phrases = [
    'Data Analytics Student',
    'Data Mining Enthusiast',
    'Python Developer',
    'Dashboard Builder',
  ];
  private phraseIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private typingTimeout?: ReturnType<typeof setTimeout>;
  private revealObserver?: IntersectionObserver;

  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private panStart = { x: 0, y: 0 };

  private activePointers = new Map<number, { x: number; y: number }>();
  private pinchStartDistance = 0;
  private pinchStartScale = 1;

  private static readonly TAPPABLE_CARD_SELECTOR = '.card, .photo-frame, .skill-card';

  ngOnInit(): void {
    setTimeout(() => this.loading.set(false), 1500);
    this.typeLoop();

    // Mobile browsers don't apply :hover on tap, so mirror the desktop
    // hover glow explicitly for touch by toggling a class on the tapped card.
    document.addEventListener(
      'touchstart',
      (event) => {
        const card = (event.target as HTMLElement)?.closest(App.TAPPABLE_CARD_SELECTOR);
        card?.classList.add('is-touched');
      },
      { passive: true },
    );
    const clearTouchedCard = (event: TouchEvent) => {
      const card = (event.target as HTMLElement)?.closest(App.TAPPABLE_CARD_SELECTOR);
      card?.classList.remove('is-touched');
    };
    document.addEventListener('touchend', clearTouchedCard, { passive: true });
    document.addEventListener('touchcancel', clearTouchedCard, { passive: true });
  }

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.revealObserver?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll('.reveal').forEach((el) => this.revealObserver?.observe(el));
  }

  ngOnDestroy(): void {
    clearTimeout(this.typingTimeout);
    this.revealObserver?.disconnect();
    document.body.style.overflow = '';
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress.set(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    this.showBackToTop.set(scrollTop > 600);
    this.updateActiveSection(scrollTop);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.lightboxPhoto()) {
      this.closeLightbox();
    }
  }

  openLightbox(photo: Photo): void {
    this.lightboxPhoto.set(photo);
    this.zoomScale.set(1);
    this.panX.set(0);
    this.panY.set(0);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxPhoto.set(null);
    document.body.style.overflow = '';
  }

  onLightboxWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.25 : 0.25;
    const next = Math.min(4, Math.max(1, this.zoomScale() + delta));
    this.zoomScale.set(next);
    if (next === 1) {
      this.panX.set(0);
      this.panY.set(0);
    }
  }

  toggleLightboxZoom(): void {
    if (this.zoomScale() > 1) {
      this.zoomScale.set(1);
      this.panX.set(0);
      this.panY.set(0);
    } else {
      this.zoomScale.set(2);
    }
  }

  onLightboxPointerDown(event: PointerEvent): void {
    this.activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (this.activePointers.size === 2) {
      this.isDragging = false;
      this.isPanning.set(false);
      this.pinchStartDistance = this.getPinchDistance();
      this.pinchStartScale = this.zoomScale();
      return;
    }

    if (this.activePointers.size === 1) {
      if (this.zoomScale() <= 1) {
        return;
      }
      this.isDragging = true;
      this.isPanning.set(true);
      this.dragStart = { x: event.clientX, y: event.clientY };
      this.panStart = { x: this.panX(), y: this.panY() };
    }
  }

  onLightboxPointerMove(event: PointerEvent): void {
    if (!this.activePointers.has(event.pointerId)) {
      return;
    }
    this.activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (this.activePointers.size === 2) {
      const distance = this.getPinchDistance();
      if (this.pinchStartDistance > 0) {
        const scale = this.pinchStartScale * (distance / this.pinchStartDistance);
        const next = Math.min(4, Math.max(1, scale));
        this.zoomScale.set(next);
        if (next === 1) {
          this.panX.set(0);
          this.panY.set(0);
        }
      }
      return;
    }

    if (!this.isDragging) {
      return;
    }
    this.panX.set(this.panStart.x + (event.clientX - this.dragStart.x));
    this.panY.set(this.panStart.y + (event.clientY - this.dragStart.y));
  }

  onLightboxPointerUp(event: PointerEvent): void {
    this.activePointers.delete(event.pointerId);

    if (this.activePointers.size < 2) {
      this.pinchStartDistance = 0;
    }

    if (this.activePointers.size === 0) {
      this.isDragging = false;
      this.isPanning.set(false);
    }
  }

  private getPinchDistance(): number {
    const points = Array.from(this.activePointers.values());
    const [a, b] = points;
    return Math.hypot(b.x - a.x, b.y - a.y);
  }

  scrollToSection(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async submitContactForm(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    this.formStatus.set('submitting');

    try {
      const response = await fetch(this.formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Formspree submission failed');
      }

      this.formStatus.set('success');
      form.reset();
    } catch {
      this.formStatus.set('error');
    } finally {
      setTimeout(() => this.formStatus.set('idle'), 5000);
    }
  }

  private updateActiveSection(scrollTop: number): void {
    const offset = scrollTop + 160;
    let current = this.navLinks[0].id;

    for (const link of this.navLinks) {
      const el = document.getElementById(link.id);
      if (el && el.offsetTop <= offset) {
        current = link.id;
      }
    }

    this.activeSection.set(current);
  }

  private typeLoop = (): void => {
    const currentPhrase = this.phrases[this.phraseIndex];
    this.charIndex += this.isDeleting ? -1 : 1;
    this.typedText.set(currentPhrase.substring(0, this.charIndex));

    let delay = this.isDeleting ? 45 : 95;

    if (!this.isDeleting && this.charIndex === currentPhrase.length) {
      delay = 1400;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      delay = 300;
    }

    this.typingTimeout = setTimeout(this.typeLoop, delay);
  };
}
