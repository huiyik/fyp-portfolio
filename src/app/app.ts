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

interface SignatureWork {
  title: string;
  format: string;
  summary: string;
  role: string;
  skills: string[];
  outcome: string;
  reflection: string;
  pdf: string;
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
    { id: 'projects', label: 'Projects' },
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

  signatureWorks: SignatureWork[] = [
    {
      title: 'Simulated Annealing: Java Implementation for a 100-Agent Assignment Problem',
      format: 'Java console application and technical report (PDF) with convergence graph and results tables',
      summary:
        'A metaheuristic optimisation project solving the classic Linear Assignment Problem: matching 100 agents to 100 tasks one to one to minimise total cost, out of a search space of 100 factorial permutations that makes brute-force search impossible. Implemented Simulated Annealing in Java from scratch, including a random initial solution, a swap-based neighbourhood operator, and the Metropolis acceptance criterion that lets the algorithm accept worse moves early on to escape local optima. Tuned the cooling schedule, inner-loop iteration count, and stopping condition, then compared three configurations to show how the parameters trade off runtime against solution quality.',
      role: 'Group project (team of 3). Contributed to the algorithm design, Java implementation, and results analysis.',
      skills: ['Java', 'Simulated Annealing', 'Metaheuristic Optimisation', 'Algorithm Design', 'Performance Tuning'],
      outcome:
        'Reduced the assignment cost from a random baseline of 4,828 to 360, a 92.5% improvement, in around 13 seconds across roughly 36 million iterations. Comparing three parameter configurations showed that a slower cooling rate and more inner iterations meaningfully improved solution quality at the cost of runtime.',
      reflection:
        'This project was my first hands-on encounter with metaheuristics: instead of guaranteeing the optimal answer like an exact algorithm would, Simulated Annealing trades a small, measurable gap from optimal for the ability to solve problems too large to brute-force. The most interesting challenge was tuning the cooling schedule, since too fast and the algorithm gets stuck in a local optimum early, too slow and it barely gets anywhere before time runs out. Comparing our three configurations side by side made that trade-off concrete rather than theoretical, a mindset I still use in my data work today: an approximate, well-justified answer delivered on time often beats a perfect one that never ships.',
      pdf: 'assets/Simulated%20Annealing%20-%20100%20Agent%20Assignment%20Problem.pdf',
    },
    {
      title: 'Predicting Electricity Consumption Through Analysis of Usage Patterns',
      format: 'Research report (PDF) using Orange Data Mining software, with model comparison tables',
      summary:
        'A data mining project comparing three techniques, Multiple Linear Regression, Neural Networks, and Random Forest, to predict monthly household electricity usage from eight household and lifestyle attributes such as household size, air-conditioner ownership, and average daily usage hours. Built the full KDD-style pipeline in Orange: data selection, missing-value imputation, three data-partition ratios, and three cross-validation fold counts, then compared every model across Mean Squared Error, Mean Absolute Error, Mean Absolute Percentage Error, and R-squared. Also tested how many top-ranked features each model needed to perform best, to see whether more input variables always helped.',
      role: 'Group project (team of 4). Contributed to the methodology design, running the Orange experiments across data partitions and cross-validation settings, and the results write-up.',
      skills: ['Orange Data Mining', 'Random Forest', 'Neural Networks', 'Linear Regression', 'Cross-Validation', 'Model Evaluation Metrics'],
      outcome:
        'Linear Regression came out as the most reliable model, narrowly ahead of a tuned Neural Network, while Random Forest needed more trees than there was time to test to close the gap. The top 5 ranked features gave the most balanced results: fewer features under-informed the models, and all 7 introduced noise that hurt generalisation.',
      reflection:
        'The counter-intuitive result was that the simplest model, Linear Regression, beat both Neural Networks and Random Forest on this dataset once we controlled properly for cross-validation and feature count. It was a direct lesson that model complexity should match the data, not the other way around: a small, structured dataset does not automatically need a deep model to fit well. Systematically walking every model through the same partition and fold combinations, rather than picking the first result that looked good, is a discipline I carried straight into my later data engineering work, where I still default to comparing configurations side by side instead of trusting a single run.',
      pdf: 'assets/Predicting%20Electicity%20Consumption.pdf',
    },
    {
      title: 'Computer Shop Management System',
      format: 'Java desktop application (Swing GUI and console interface), with a technical report (PDF), UML diagram, and source code',
      summary:
        'An object-oriented inventory, sales, and membership management system built in Java for a hypothetical computer retail shop, developed with both a console interface and a Swing-based GUI. The system covers full product management (add, update, delete, view), a multi-item shopping cart with tiered discounts and a membership discount, sales history, and a profit summary report, all backed by file-based data persistence so nothing is lost between sessions. Designed around an abstract Product base class extended by a concrete Computer class, with separate manager classes handling inventory, sales, and membership logic, and a UML class diagram documenting the structure before implementation began.',
      role: 'Group project (team of 3). Contributed to the object-oriented design, core business logic (product and sales management), and the accompanying documentation.',
      skills: ['Java', 'Object-Oriented Programming', 'Java Swing (GUI)', 'File I/O', 'UML Design', 'Software Documentation'],
      outcome:
        'Delivered a fully working dual-interface application (console and GUI) with tiered and membership-based discount logic, real-time stock validation during checkout, and an automatically generated profit summary, all backed by persistent file storage that survives a restart.',
      reflection:
        'This was my first project applying full object-oriented design end to end, from an abstract base class down to a working GUI. The trickiest part was the checkout flow: getting quantity validation, tiered discounts, and membership discounts to apply correctly and in the right order, without letting a cart item silently oversell stock that another item in the same cart had already reserved. Debugging that taught me to trace a transaction through every state it can be in, not just the happy path, the same instinct I now use auditing data pipelines: check what happens at the edges, not just when everything goes right.',
      pdf: 'assets/Computer%20Shop%20Management.pdf',
    },
    {
      title: 'Car Price Prediction System',
      format: 'Python web scraper, machine learning model, and interactive Streamlit dashboard, with a full report (PDF)',
      summary:
        'An end-to-end machine learning system that scrapes live used-car listings from an online marketplace, cleans the data, trains a price-prediction model, and serves it through an interactive web dashboard. Built a Selenium scraper that handles dynamic page loading and scrolls through paginated results to collect car title, price, mileage, year, and location, gathering 3,480+ listings across 88 pages. Cleaned the scraped data (stripping currency symbols, averaging mileage ranges, imputing missing years with the median) and trained a Random Forest Regressor with one-hot encoded location as a feature. Deployed the trained model behind a Streamlit dashboard where a user enters a car’s year, mileage, and location and receives an instant estimated market price.',
      role: 'Group project (team of 4). Contributed to the Selenium web scraper and the Streamlit dashboard deployment.',
      skills: ['Python', 'Selenium', 'Web Scraping', 'Pandas', 'Random Forest Regressor', 'Streamlit', 'Data Cleaning'],
      outcome:
        'Delivered a working end-to-end pipeline, from live scraping through to a deployed, user-facing prediction tool, that returns a real-time price estimate from just three inputs (year, mileage, location).',
      reflection:
        'The scraping stage taught me that real websites fight back: pages load dynamically, listings paginate, and automation gets detected and blocked if the scraper looks too much like a bot. Getting the Selenium script to wait for elements properly and scroll like a real user, rather than just hoping the page had loaded, was the difference between a script that worked once and one that worked reliably across 88 pages. Turning the trained model into something a non-technical user could actually use, just three inputs and an instant answer, reinforced why I care about deployment as much as model accuracy: a model nobody can use is not actually a solution. This project directly shaped the direction of my FYP, which does the same thing (train a model, then deploy it as a dashboard) for a different problem.',
      pdf: 'assets/Car%20Price%20Prediction%20System.pdf',
    },
  ];

  internshipResponsibilities: string[] = [
    'Design and build an automated monthly data pipeline that identifies potential B2B customers from public industry directories.',
    'Model the collected data for reporting using a medallion (bronze, silver, gold) architecture and a Kimball star schema.',
    'Build and maintain Power BI dashboards for the business and sales teams.',
    'Apply data-quality checks, change tracking, and row-level security across the model.',
    'Move the work from sandbox development into the standard dev, test, and prod deployment lifecycle.',
    'Build a credit-risk scoring model for the Credit Control team from historical invoice and payment data.',
  ];

  internshipContributions: string[] = [
    'Delivered an end-to-end pipeline (ingest, clean, model, dashboard) that runs unattended on a monthly schedule.',
    'Cut the reporting data model from ~13 tables to 5 through better grain and dimensional design.',
    'Built a multi-page Power BI report with row-level security separating two business units.',
    'Found and fixed dozens of real data-quality and logic bugs through systematic raw-data audits.',
    'Rebuilt a second, independent pipeline project from scratch to reinforce the same architecture.',
    'Built a customer credit-risk score, validated it against known outcomes, and stress-tested it with an out-of-time test that surfaced a meaningful gap in the original model’s assumptions.',
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
    'Structured model-review & findings documentation',
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
      focus: 'Starting a second internship project: credit-risk analytics for the Credit Control team',
      tasks: [
        'Sat in on a credit-review discussion with the Credit Control team and my mentor to understand how credit decisions are made today, then drafted a project brief covering the objective and candidate risk factors.',
        'Researched general drivers of B2B payment default, including payment behaviour, company profile, and credit-bureau data, and evaluated whether public trade or customs datasets could help measure customer concentration risk. Concluded that source was not reliable enough for this purpose and did not pursue it.',
        'Read into how broader market conditions can affect a customer’s ability to pay on time, as background for the risk factors under consideration.',
        'Worked with invoice data in Microsoft Fabric and reworked an early customer risk-grouping approach after mentor feedback, moving from a single forced category per customer to independent risk flags.',
        'Found and corrected a data-joining error in my own earlier work, where an identifier that was not unique across the full dataset had been treated as if it were. Fixing it materially changed an early summary figure.',
        'Explored a product-level dataset for the first time, built a clean categorisation from free text, and ran a first hypothesis test on whether product type relates to default risk. The result was negative, so the feature was dropped.',
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
        'I initially assumed one pattern in the data was linked to seasonal timing. Checking it directly showed the effect was minor and better explained by internal processing behaviour.',
        'A query returning more rows than expected was the clue that led me to the join error. Without that check, an incorrect figure would have gone into the analysis unnoticed.',
        'Tried to identify a specific payment-failure type in the data. No reliable signal existed for it, so I recorded it as a dead end rather than forcing a weak feature.',
      ],
      learning:
        'Always check that the numbers reconcile, especially when a result looks reasonable at first glance, and treat an identifier as unique only within the scope it was actually designed for. A negative result is still a useful one: it stops a feature that looks sensible on paper from being built on nothing.',
      next: 'Get the early findings reviewed with my mentor, then begin requesting the additional data needed for further testing.',
    },
    {
      week: 'Week 7',
      dates: '14 to 18 September 2026',
      focus: 'A reproducible data snapshot, a first risk score, and migrating an earlier project out of its sandbox',
      tasks: [
        'Built a frozen, read-only snapshot of the relevant data using a read-only cross-workspace link rather than a duplicate copy, so the analysis would give reproducible results instead of shifting every time the source data changed.',
        'Cleaned residual records from a past system migration out of the dataset, then classified records by how overdue they were.',
        'Designed and validated a first customer risk score from payment history, checking it against known outcomes to confirm it concentrated risk sensibly rather than spreading it evenly.',
        'Tested and rejected a hypothesis about why risk increased sharply past a certain point in the aging data. The pattern held regardless of payment terms, suggesting a process-driven cause rather than a billing-cycle artefact.',
        'Migrated an earlier internship project out of its temporary workspace into the permanent one ahead of a trial period ending, moving all its tables and notebooks and confirming that internal reference IDs stayed stable across the move.',
        'Found and fixed a permissions issue where report viewers, but not I, hit an access error, traced to a connection setting that routed permission checks incorrectly.',
      ],
      skills: [
        'Data snapshotting & reproducibility',
        'Cross-workspace data access',
        'Risk scoring & validation',
        'Semantic model migration',
        'Power BI permissions troubleshooting',
        'Deployment auditing',
      ],
      challenges: [
        'The outcome being predicted had to be kept separate from the score’s own inputs, otherwise the score would describe what had already happened rather than warn about what might happen next.',
        'A working data refresh did not guarantee a working report for everyone. The permissions issue only appeared when someone outside my own account opened the page, which is why a full access audit was worth running.',
      ],
      learning:
        'A data snapshot exists for reproducibility, not convenience, since a live source can change daily and the same query can return different answers on different days unless something is frozen. Repointing an existing model to a new location, rather than rebuilding it, keeps its existing security configuration intact.',
      next: 'Finish the risk-scoring build on the new snapshot and begin proper report pages for it.',
    },
    {
      week: 'Week 8',
      dates: '21 to 25 September 2026',
      focus: 'Applying a recognised risk methodology and stress-testing the results',
      tasks: [
        'Reworked the credit-risk report pages: fixed a chart that was misrepresenting scale, cleaned up labelling, and corrected a figure that was being read from the wrong source.',
        'Researched a recognised accounting methodology for this kind of risk scoring, a provision-matrix approach for expected credit losses, rather than continuing with judgement-based weights, and re-derived the model’s rates from historical settled records.',
        'Rebuilt the risk model on the new methodology, aligning the categories with the historical bands and confirming a known risk threshold held up under a second, independent check.',
        'Added customer tenure and an activity status (active, quiet, or lapsed) to the model, computed carefully so long-standing customers were not undercounted.',
        'Found and fixed a ranking bug introduced by the new tenure field, caused by a formula only partially clearing its filter context.',
        'Verified the rebuilt model against a full set of checks before treating it as final, and wrote a standalone methodology note using illustrative figures only.',
      ],
      skills: [
        'Expected-credit-loss / provision-matrix methodology',
        'DAX filter-context debugging',
        'Financial risk data modelling',
        'Technical writing',
        'Rigorous validation practice',
      ],
      challenges: [
        'Hit a type-mismatch error combining a fixed-point value with a floating-point rate. Resolved it by converting within the calculation rather than changing how the underlying data was stored.',
        'The thresholds used to define an inactive customer were conventional rather than data-derived, so I flagged this openly as a limitation rather than presenting it as settled.',
      ],
      learning:
        'A validation rule set in advance, like a minimum sample size before trusting a result, only means something if it is still followed on the day a result looks especially convincing. The most defensible answer is rarely the most striking-looking one.',
      next: 'Validate the methodology note’s references, properly test the activity thresholds against real behaviour, and take the data-quality issues found so far back to the Credit Control team.',
    },
    {
      week: 'Week 9',
      dates: '28 September 2026 (in progress)',
      focus: 'Responding to mentor feedback and re-testing the model’s own assumptions',
      tasks: [
        'Reviewed my mentor’s critique of the risk methodology in detail rather than assuming either side was right, and confirmed the underlying statistics were sound, but that my write-up explained them poorly enough to cause the misunderstanding. Rewrote the unclear section and accepted the parts of the feedback that were genuinely valid.',
        'Traced a data-provenance question back to its root cause using version history rather than assumption, and confirmed no changes had been made to a data source outside the project’s own scope. Added a safeguard against this happening by accident in future.',
        'Added a missing reference field to the report using a small lookup table rather than reworking the whole snapshot, keeping every previously validated figure reproducible.',
        'Ran an out-of-time validation, training the model on an earlier period and testing it on a later one, as requested after the previous review.',
        'Found that risk rates estimated from more recent data differed meaningfully from those estimated using the full historical window, and, after ruling out a couple of alternative explanations, concluded the model’s original time window mixed two different periods of the business that should be treated separately.',
        'Quantified how much this correction changed the model’s overall risk estimate, while confirming the relative ranking of customers stayed largely the same, so the change improves how defensible the model is rather than which accounts it flags.',
        'Surfaced two general data-quality gaps for the Credit Control team to review, relating to how completely certain account records were populated.',
      ],
      skills: [
        'Out-of-time statistical validation',
        'Root-cause analysis under critique',
        'Data version-history auditing',
        'Financial control gap analysis',
        'Stakeholder communication',
      ],
      challenges: [
        'My mentor’s critique turned out to be based on a misreading of my own write-up, a useful reminder that a statistically sound result can still fail to communicate clearly.',
        'A result that initially looked like good news deserved more scrutiny, not less. It took ruling out a couple of alternative explanations before I could trust what it actually meant.',
      ],
      learning:
        'The most valuable outcome this week did not come from building something new. It came from taking a piece of critical feedback seriously enough to re-verify the work from scratch, which is what surfaced a genuine gap in the model’s original assumptions.',
      next: 'Re-derive the model’s rates on the corrected time window, update the methodology write-up accordingly, and raise the data-quality gaps directly with the Credit Control team.',
    },
    {
      week: 'Week 10',
      dates: '29 September to 5 October 2026 (in progress)',
      focus: 'A structured model review, and a corrected out-of-time test to answer it',
      tasks: [
        'Took part in a structured review of the risk model with stakeholders, separating what was confirmed as sound, the overall ranking approach, the general expected-credit-loss framework, the rate calculation logic, and the exclusion of one unrepresentative historical period, from what still needed evidence.',
        'Wrote up every open issue from the review as a ranked list of findings by severity, covering how the model was being evaluated, how its historical window behaved over time, how closely its output duplicated an existing report, and how clearly it was presented to a non-technical audience.',
        'Built a proper out-of-time test: trained the rates on one block of historical records and evaluated them only on a later, non-overlapping block, directly answering the review’s most serious finding that the existing accuracy figure had been measured on data the model had already learned from.',
        'Found and fixed a bug in my own test query: a filter meant to exclude records too recent to have a known outcome yet had been dropped during an earlier rewrite, which was quietly making recent periods look better than they actually were.',
        'Studied a worked walkthrough of the expected-credit-loss framework and confirmed the model’s structure (exposure, probability of default, and loss severity) matched the standard approach, while finding that the loss-severity assumption had effectively been fixed at total loss without that ever being a deliberate decision.',
        'Discussed the findings with my mentor. The exposure and loss-severity assumptions were accepted as reasonable, leaving the probability-of-default estimate as the main open question.',
        'Started building a roll-rate style query that reconstructs, month by month, how accounts move between aging stages, as an alternative way of estimating that same probability.',
      ],
      skills: [
        'Out-of-time test design',
        'Root-cause debugging of a data pipeline',
        'Expected-credit-loss (IFRS 9 / MFRS 9) framework application',
        'Structured findings documentation',
        'Critical evaluation of a model’s own assumptions',
      ],
      challenges: [
        'The first corrected test run still overstated how wrong the model was, because the same filtering bug I had fixed once before had crept back in during a rewrite, a reminder that a fix needs a regression check, not just a one-time correction.',
        'The clean, non-overlapping test sample was still fairly small, so the result says something is off in direction but is not yet large enough on its own to settle the exact scale of the problem.',
      ],
      learning:
        'The review’s biggest lesson was that a single aggregate accuracy figure can hide almost everything that matters. The same model can look strong overall while failing badly in its most recent, most relevant periods. Measuring something the right way, with no overlap between what it learned from and what it is judged on, matters more than the number that measurement produces.',
      next: 'Re-run the corrected out-of-time test to confirm the result holds, finish the roll-rate query and compare it against the current method, and follow up on a data-definition question with the team that owns the underlying records before finalising the probability-of-default estimate.',
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
