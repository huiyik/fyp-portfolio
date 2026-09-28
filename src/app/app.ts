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
    { id: 'career', label: 'Resume' },
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
      bg: 'assets/tools-picture.png',
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
    'Build a credit-risk scoring model for the finance team from historical invoice and payment data.',
  ];

  internshipContributions: string[] = [
    'Delivered an end-to-end pipeline (ingest, clean, model, dashboard) that runs unattended on a monthly schedule.',
    'Cut the reporting data model from ~13 tables to 5 through better grain and dimensional design.',
    'Built a multi-page Power BI report with row-level security separating two business units.',
    'Found and fixed dozens of real data-quality and logic bugs through systematic raw-data audits.',
    'Rebuilt a second, independent pipeline project from scratch to reinforce the same architecture.',
    'Built a customer credit-risk score, validated it against real outcomes, then stress-tested it with an out-of-time test that uncovered a lasting shift in the underlying business the original model had missed.',
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
    'Credit risk / provision-matrix modelling',
    'Out-of-time statistical validation',
    'DAX filter-context debugging',
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
    {
      week: 'Week 6',
      dates: '7 to 11 September 2026',
      focus: 'Starting a second internship project: credit-risk analytics for the finance team',
      tasks: [
        'Reviewed a credit-review meeting recording with the finance team and my mentor to understand how credit release decisions are made today, then drafted a project brief covering the business background, objective, and candidate risk factors.',
        'Researched what drives B2B payment default, including payment behaviour, company profile, and credit-bureau data, and checked whether industry trade or customs datasets could measure a customer’s dependency on a single buyer. Concluded that data source was not reliable enough for this purpose and dropped it.',
        'Mapped how a volatile 2026 petrochemical and resin market could squeeze a customer’s cash flow and, in turn, their ability to pay on time.',
        'Got hands-on with the invoice data in Microsoft Fabric. Rebuilt a customer risk-grouping approach after mentor feedback, moving from one forced category per customer to independent yes-or-no risk flags, and checked whether write-offs cluster at particular times of year.',
        'Found and fixed a serious bug in my own earlier join logic. Invoice numbers repeat across separate business units, and I had been joining on invoice number alone, silently matching unrelated invoices together. Fixing it dropped a wildly inflated write-off count down to the real, much smaller figure.',
        'Explored the invoice line-items table for the first time, built a clean grouping of raw material families from free text, and ran the project’s first hypothesis test on whether the material a customer buys relates to default risk. The result was negative, so I dropped it as a feature.',
      ],
      skills: [
        'Credit risk analytics',
        'Hypothesis testing',
        'SQL joins & key design',
        'Microsoft Fabric notebooks',
        'Data-quality auditing',
        'Literature review',
      ],
      challenges: [
        'I assumed write-offs clustered because of year-end processing timing. Checking it directly showed the pattern was mild and better explained by processing behaviour than true default timing.',
        'A query returning more rows than existed in the source table was the only reason I caught the invoice-number join bug. Otherwise a badly wrong number would have gone into the analysis unnoticed.',
        'I tried to identify bounced cheques in the data. No column marks this and genuine failures were too rare to detect reliably, so I recorded it as a dead end rather than forcing a weak signal.',
      ],
      learning:
        'Always check that the numbers add up, especially when a query looks reasonable. An identifier that is unique inside one business unit is not automatically unique across all of them. A negative result, like material type not predicting risk, is still useful: it stopped me building a feature that looked sensible but predicted nothing.',
      next: 'Get the early findings reviewed, then start requesting the real payment and credit history data needed for hands-on testing.',
    },
    {
      week: 'Week 7',
      dates: '14 to 18 September 2026',
      focus: 'A frozen data snapshot, a first risk score, and migrating the other pipeline out of its sandbox',
      tasks: [
        'Built a frozen, read-only snapshot of the invoice data using a cross-workspace shortcut rather than a copy back into production, so the risk analysis would give reproducible answers instead of shifting every time the source data changed.',
        'Cleaned out legacy system-migration residue from the data, a block of old records carried over from a prior ERP that were still flagged open but were not real outstanding debt, then classified every invoice into an aging band.',
        'Designed and validated a first customer risk score from invoice aging history, benchmarked against customers who actually defaulted. Flagging under 10% of the customer base caught roughly 40% of eventual failures.',
        'Tested and rejected my own hypothesis that a sharp jump in risk around 60 days overdue was simply customers paying one extra billing cycle late. The pattern held regardless of payment terms, so it is more likely a business process trigger at that point.',
        'Migrated an unrelated production pipeline built earlier in the internship out of its sandbox workspace into the permanent one ahead of a trial expiring. Moved every table and notebook, switched every file-path reference to a workspace-independent connection, and verified that internal ID numbers stayed stable across the move, since anything referencing an old ID would otherwise silently point at the wrong record.',
        'Found and fixed a permissions bug where report viewers, but not me, hit an access error. Traced it to a connection-type default that routed permission checks through the wrong layer, and corrected the underlying connection settings.',
      ],
      skills: [
        'Data snapshotting & reproducibility',
        'Cross-workspace data shortcuts',
        'Risk scoring & validation',
        'Semantic model migration',
        'Power BI permissions troubleshooting',
        'Deployment auditing',
      ],
      challenges: [
        'The prediction target had to be kept out of the score’s own inputs, otherwise the score would just recognise failures that had already happened instead of warning about new ones.',
        'A successful data refresh did not guarantee a working report. The permissions bug only showed up when someone outside the workspace opened the page, which is why I ran a full connection and access audit across every workspace afterward.',
      ],
      learning:
        'A snapshot is not for convenience, it is for reproducibility, since the source data changes daily and the same query can give a different answer on different days unless something is frozen. Repointing an existing model to a new location, rather than rebuilding it, preserves all its security rules, which is exactly the part you do not want to rebuild by hand and risk getting subtly wrong.',
      next: 'Finish the customer risk-scoring build on the new snapshot and begin proper report pages for it.',
    },
    {
      week: 'Week 8',
      dates: '21 to 25 September 2026',
      focus: 'Applying an accounting-standard risk methodology and stress-testing my own results',
      tasks: [
        'Reworked the credit-risk report pages. Fixed a misleading fully-stacked chart that hid the real currency scale, cleaned up labels and titles, and corrected a card that was quietly under-reporting the true overdue balance by reading from the wrong source.',
        'Researched the accounting-standard method for this kind of risk scoring, a provision matrix under the relevant financial reporting standard for expected credit losses, rather than continuing with judgement-based weights, and re-derived the model’s loss rates directly from tens of thousands of historical settled invoices.',
        'Rebuilt the risk model on the standard-based rates. Split the overdue categories to match the historical ones exactly, added a real loss-rate column, and confirmed the well-known wall in the data, where risk multiplies roughly tenfold once an invoice passes 60 days overdue, held up under a second, independent measurement.',
        'Added customer tenure and an active, quiet, or stopped activity status, computed carefully so a longstanding customer was not undercounted by only looking at data since a system migration.',
        'Found and fixed a subtle ranking bug where adding the new tenure column broke a top-customer ranking measure, because the underlying formula was only clearing part of the filter context it needed to.',
        'Verified all of the above against a full set of checks before treating any of it as final, and wrote a standalone methodology note explaining the approach with illustrative figures only.',
      ],
      skills: [
        'Expected-credit-loss / provision-matrix methodology',
        'DAX filter-context debugging',
        'Financial risk data modelling',
        'Technical writing',
        'Rigorous validation practice',
      ],
      challenges: [
        'Hit a type-mismatch error multiplying a fixed-point currency value by a floating-point rate. Fixed it by converting inside the calculation rather than changing how the currency column itself was stored.',
        'The thresholds I used to define a quiet versus a stopped customer were conventional, not something I had actually derived from the data yet. I flagged this honestly as a limitation rather than presenting it as settled.',
      ],
      learning:
        'A rule you set for yourself in advance, like a minimum sample size before trusting a result, only means something if you still follow it on the day the result looks especially good. The most defensible number is rarely the most dramatic-looking one, and it is worth the extra step to check why.',
      next: 'Validate the methodology note’s references, check the tenure and activity thresholds properly against real buying patterns, and take the open data-quality issues found so far back to the finance team.',
    },
    {
      week: 'Week 9',
      dates: '28 September 2026 (in progress)',
      focus: 'Responding to mentor feedback and finding a major flaw in my own model',
      tasks: [
        'Went back through my mentor’s critique of the risk methodology line by line rather than assuming either of us was right, and confirmed my original statistics were mathematically sound. My write-up had explained them poorly enough to cause the misreading, so I rewrote the unclear section and accepted the parts of the feedback that were genuinely valid, including the lack of a held-out test period.',
        'Traced a data-location concern back to its root cause using version history rather than guesswork, confirmed nothing had ever been written to a production data source I do not own, and added an automatic safeguard that refuses to run if it is ever pointed at the wrong location.',
        'Added a missing reference field to the credit-risk report by building a small lookup table rather than reworking the whole snapshot, keeping every previously validated figure reproducible.',
        'Ran an out-of-time validation, the test explicitly requested after the previous review, training the model’s risk rates on older data and testing them on newer data.',
        'The headline result: default rates measured on recent years came out roughly seven times lower than on older years. After ruling out two explanations, data censoring and pandemic-era disruption, I traced it to a real, lasting shift in the underlying business around 2019 that the original nine-year window had been quietly averaging over.',
        'Quantified the impact: correcting for this brought the model’s flagship risk figure down by roughly 9 percent, while leaving which customers are riskiest almost completely unchanged, so the fix improves how defensible the number is rather than the ranking itself.',
        'Surfaced two immediately actionable data-quality issues for the finance team: a set of paid-up-front invoices that should not logically be overdue at all, and a meaningful block of open invoices with no payment terms recorded, so their risk cannot be assessed.',
      ],
      skills: [
        'Out-of-time statistical validation',
        'Root-cause analysis under critique',
        'Delta Lake version-history auditing',
        'Financial control gap analysis',
        'Stakeholder communication',
      ],
      challenges: [
        'My mentor’s critique of the method turned out to be based on a misreading, but it was a misreading my own document invited. A statistically correct result can still fail to communicate.',
        'A result that looks like good news, default rates falling dramatically, deserved more suspicion rather than less. It took ruling out two other explanations before I could trust what it actually meant.',
      ],
      learning:
        'The most valuable finding this week did not come from building something new. It came from taking a piece of criticism seriously enough to re-verify my own work from scratch, which is what surfaced a genuine, previously invisible flaw in the model’s foundation.',
      next: 'Re-derive the model’s rates on the corrected, more recent time window, update the methodology write-up with the correction, and raise the two data-quality gaps directly with the finance team.',
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
      // Small threshold + bottom margin so blocks reveal reliably regardless
      // of their height (a large threshold never fires on very tall elements).
      { threshold: 0.02, rootMargin: '0px 0px -6% 0px' },
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
