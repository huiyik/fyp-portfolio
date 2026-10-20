import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
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
  bg?: string;
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

interface SkillInfo {
  name: string;
  definition: string;
  link: string;
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
  bg: string;
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

  selectedWeek = signal('Week 1');

  selectWeek(week: string): void {
    this.selectedWeek.set(week);
  }

  /** Position of the shown week in weeklyReports, or -1 if it is not found. */
  weekIndex = computed(() =>
    this.weeklyReports.findIndex((report) => report.week === this.selectedWeek()),
  );

  /** Move the week selection by delta, clamped to the ends of the list. */
  stepWeek(delta: number): void {
    const next = this.weekIndex() + delta;
    const report = this.weeklyReports[next];
    if (report) {
      this.selectedWeek.set(report.week);
    }
  }

  selectedWork = signal('');

  selectWork(title: string): void {
    this.selectedWork.set(title);
  }

  hoveredSkill = signal<SkillInfo | null>(null);
  skillTooltipPos = signal({ left: '0px', top: '0px' });

  showSkillTooltip(skill: SkillInfo, event: MouseEvent | FocusEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.skillTooltipPos.set({
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.top}px`,
    });
    this.hoveredSkill.set(skill);
  }

  hideSkillTooltip(): void {
    this.hoveredSkill.set(null);
  }

  /** Looks up a skill tag's definition and reference link by its exact
   *  display text. Returns null for tags with no entry, so the template
   *  can fall back to a plain, non-interactive tag. */
  getSkillInfo(name: string): SkillInfo | null {
    const entry = this.skillLibrary[name];
    return entry ? { name, ...entry } : null;
  }

  /** Position of the shown project in signatureWorks, or -1 if it is not found. */
  workIndex = computed(() =>
    this.signatureWorks.findIndex((work) => work.title === this.selectedWork()),
  );

  /** Move the project selection by delta, clamped to the ends of the list. */
  stepWork(delta: number): void {
    const next = this.workIndex() + delta;
    const work = this.signatureWorks[next];
    if (work) {
      this.selectedWork.set(work.title);
    }
  }

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

  internshipGalleryPhotos: Photo[] = [
    {
      src: 'assets/onboarding.jpg',
      alt: 'Onboarding session at the start of the internship',
      caption: 'Onboarding session at the start of the internship, covering the organisation\'s culture framework.',
    },
    {
      src: 'assets/group%20photo%20with%20the%20team.jpg',
      alt: 'Group photo with the team',
      caption: 'With the team during the internship.',
    },
    {
      src: 'assets/project%20dashboard.png',
      alt: 'Internship project dashboard',
      caption: 'One page from the potential-customer leads dashboard built during the internship, not the whole project. Sensitive info are redacted here.',
    },
    {
      src: 'assets/working.jpg',
      alt: 'Working at my desk during the internship',
      caption: 'At my desk during the internship, building a sandbox project with free, scrapable weather data from a public API. I used an AI coding agent in VS Code to automate the workflow between VS Code and Microsoft Fabric.',
    },
    {
      src: 'assets/site-visit.jpg',
      alt: 'Site visit during the internship',
      caption: 'Dr Sahubar Ali (centre), my industrial training site visit supervisor, visiting me on site during the internship, with my company supervisor and mentor, Mr. Koay Wei Sheng (left).',
    },
  ];

  activityCards: SimpleCard[] = [
    { title: 'Leadership', text: 'Event coordination, team management, administrative oversight', bg: 'assets/leadership%20pic.jpg' },
    { title: 'Project Management', text: 'Logistics planning, contingency preparation, cross-department coordination', bg: 'assets/project%20management%20pic.jpg' },
    { title: 'Communication', text: 'Trilingual in English, Malay, and Chinese. Stakeholder reporting and documentation.', bg: 'assets/communication%20pic.jpg' },
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
        'This project solves the classic Linear Assignment Problem using a metaheuristic optimisation method. The task is to match 100 agents to 100 tasks, one to one, so the total cost is as low as possible. There are 100 factorial possible ways to do this, so a brute-force search is not possible. I built Simulated Annealing in Java from scratch. This included a random starting solution, a swap-based neighbourhood operator, and the Metropolis acceptance rule. This rule lets the algorithm accept a worse move early on, so it can escape local optima. I tuned the cooling schedule, the inner-loop iteration count, and the stopping condition. Then I compared three configurations to show how these settings trade off runtime against solution quality.',
      role: 'Group project (team of 3). Contributed to the algorithm design, Java implementation, and results analysis.',
      skills: ['Java', 'Simulated Annealing', 'Metaheuristic Optimisation', 'Algorithm Design', 'Performance Tuning'],
      outcome:
        'The assignment cost dropped from a random baseline of 4,828 to 360. This is a 92.5% improvement, done in about 13 seconds across roughly 36 million iterations. I compared three parameter configurations. A slower cooling rate and more inner iterations gave better solution quality, but took more runtime.',
      reflection:
        'This project was my first hands-on experience with metaheuristics. An exact algorithm always finds the optimal answer, but Simulated Annealing trades a small, measurable gap from optimal for the ability to solve problems too large to brute-force. The most interesting challenge was tuning the cooling schedule. If it is too fast, the algorithm gets stuck in a local optimum early. If it is too slow, it barely improves before time runs out. Comparing our three configurations side by side made this trade-off clear and real, not just a theory.',
      pdf: 'assets/Simulated%20Annealing%20-%20100%20Agent%20Assignment%20Problem.pdf',
      bg: 'assets/simulated%20annealing%20pic.jpg',
    },
    {
      title: 'Predicting Electricity Consumption Through Analysis of Usage Patterns',
      format: 'Research report (PDF) using Orange Data Mining software, with model comparison tables',
      summary:
        'This data mining project compares three techniques: Multiple Linear Regression, Neural Networks, and Random Forest. The goal is to predict monthly household electricity usage from eight household and lifestyle attributes, such as household size, air-conditioner ownership, and average daily usage hours. I built a full KDD-style pipeline in Orange. This covered data selection, missing-value imputation, three data-partition ratios, and three cross-validation fold counts. Then I compared every model using Mean Squared Error, Mean Absolute Error, Mean Absolute Percentage Error, and R-squared. I also tested how many top-ranked features each model needed to perform best, to check whether more input variables always helped.',
      role: 'Group project (team of 4). Contributed to the methodology design, running the Orange experiments across data partitions and cross-validation settings, and the results write-up.',
      skills: ['Orange Data Mining', 'Random Forest', 'Neural Networks', 'Linear Regression', 'Cross-Validation', 'Model Evaluation Metrics'],
      outcome:
        'Linear Regression was the most reliable model, just ahead of a tuned Neural Network. Random Forest needed more trees than we had time to test, so it could not close the gap. The top 5 ranked features gave the most balanced results. Fewer features did not give the models enough information, and all 7 features added noise that hurt generalisation.',
      reflection:
        'The surprising result was that the simplest model, Linear Regression, beat both Neural Networks and Random Forest on this dataset, once we controlled properly for cross-validation and feature count. This taught me that model complexity should match the data. A small, structured dataset does not need a deep model to fit well. We tested every model on the same partition and fold combinations, instead of just picking the first result that looked good.',
      pdf: 'assets/Predicting%20Electicity%20Consumption.pdf',
      bg: 'assets/predicting%20electricity%20consumption%20pic.jpg',
    },
    {
      title: 'Computer Shop Management System',
      format: 'Java desktop application (Swing GUI and console interface), with a technical report (PDF), UML diagram, and source code',
      summary:
        'This is an object-oriented inventory, sales, and membership management system. I built it in Java for a hypothetical computer retail shop, with both a console interface and a Swing-based GUI. The system covers full product management (add, update, delete, view), a multi-item shopping cart with tiered discounts and a membership discount, sales history, and a profit summary report. File-based data storage backs all of this, so nothing is lost between sessions. I designed it around an abstract Product base class, extended by a concrete Computer class. Separate manager classes handle inventory, sales, and membership logic. We also made a UML class diagram to document the structure before we started building.',
      role: 'Group project (team of 3). Contributed to the object-oriented design, core business logic (product and sales management), and the accompanying documentation.',
      skills: ['Java', 'Object-Oriented Programming', 'Java Swing (GUI)', 'File I/O', 'UML Design', 'Software Documentation'],
      outcome:
        'We delivered a fully working dual-interface application (console and GUI). It has tiered and membership-based discount logic, real-time stock checks during checkout, and an automatic profit summary. Persistent file storage backs all of this, so the data survives a restart.',
      reflection:
        'This was my first project using full object-oriented design from start to finish, from an abstract base class down to a working GUI. The trickiest part was the checkout flow. I had to get quantity checks, tiered discounts, and membership discounts to apply correctly and in the right order. I also had to stop one cart item from quietly overselling stock that another item in the same cart had already reserved. Debugging this taught me to trace a transaction through every state it can be in, not just the normal path.',
      pdf: 'assets/Computer%20Shop%20Management.pdf',
      bg: 'assets/computer%20shop%20mangement%20pic.jpg',
    },
    {
      title: 'Car Price Prediction System',
      format: 'Python web scraper, machine learning model, and interactive Streamlit dashboard, with a full report (PDF)',
      summary:
        'This is an end-to-end machine learning system. It scrapes live used-car listings from an online marketplace, cleans the data, trains a price-prediction model, and serves it through an interactive web dashboard. I built a Selenium scraper that handles dynamic page loading and scrolls through paginated results. It collects car title, price, mileage, year, and location, and gathered 3,480+ listings across 88 pages. I cleaned the scraped data by stripping currency symbols, averaging mileage ranges, and filling missing years with the median. Then I trained a Random Forest Regressor, using one-hot encoded location as a feature. I deployed the trained model behind a Streamlit dashboard. A user enters a car’s year, mileage, and location, and gets an instant estimated market price.',
      role: 'Group project (team of 4). Contributed to the Selenium web scraper and the Streamlit dashboard deployment.',
      skills: ['Python', 'Selenium', 'Web Scraping', 'Pandas', 'Random Forest Regressor', 'Streamlit', 'Data Cleaning'],
      outcome:
        'We delivered a working end-to-end pipeline, from live scraping to a deployed, user-facing prediction tool. It returns a real-time price estimate from just three inputs: year, mileage, and location.',
      reflection:
        'The scraping stage taught me that real websites fight back. Pages load dynamically, listings paginate, and automation gets detected and blocked if the scraper looks too much like a bot. I had to get the Selenium script to wait for elements properly and scroll like a real user, instead of just hoping the page had loaded. This was the difference between a script that worked once and one that worked reliably across 88 pages. Turning the trained model into something a non-technical user could use, with just three inputs and an instant answer, showed me why I care about deployment as much as model accuracy. A model nobody can use is not really a solution.',
      pdf: 'assets/Car%20Price%20Prediction%20System.pdf',
      bg: 'assets/Car%20price%20prediction%20system%20pic.jpg',
    },
    {
      title: 'Discrete Event Simulation: Expanded Retail Store Operations Model',
      format: 'Arena simulation model and technical report (PDF), with flowcharts and a performance comparison table',
      summary:
        'This project expands a Discrete Event Simulation (DES) model of a retail store, covering the fresh produce, butchery, and payment counter sections. I built it in Arena simulation software. The expanded model adds multiple customer types, scheduled arrivals for peak and off-peak hours, staff scheduling across sections, cycle time tracking, and full entity transfer animations. I used the model to run a what-if analysis. This compared a fixed staffing level of two workers against the store’s existing flexible staffing schedule, to see which approach served customers better.',
      role: 'Group project (team of 3). Contributed to building the expanded simulation model and running the what-if analysis comparing staffing scenarios.',
      skills: ['Discrete Event Simulation', 'Arena Simulation Software', 'Queueing & Resource Scheduling', 'What-If / Sensitivity Analysis', 'Model Verification & Validation', 'Business Process Modelling'],
      outcome:
        'The what-if model, with a steady two-person staff, served more customers than the basic model (373.8 against 364 on average) and cut both the average total time in the system and the average waiting time. Maximum waiting time also dropped, and staff utilisation rose moderately across all three sections. The only trade-off was a small rise in lost customers during peak periods.',
      reflection:
        'This was my first time using Discrete Event Simulation to test a real operational decision instead of just building a model. The most useful part was the verification and validation step: checking that the schedule module repeated correctly over the full three-day run, then comparing the expanded model against the earlier, simpler one to confirm it still behaved as expected before trusting any of its results. The what-if analysis also showed a genuine trade-off rather than a clean win. Fixed staffing improved average waiting times, but the maximum waiting time was still high enough that our own recommendation was to reject it in favour of a variable schedule. A model does not have to recommend the most impressive-looking change to be useful.',
      pdf: 'assets/DES%20project.pdf',
      bg: 'assets/DES%20pic.jpg',
    },
  ];

  internshipResponsibilities: string[] = [
    'Design and build an automated monthly data pipeline for a business reporting use case, using data gathered from public sources.',
    'Model the collected data for reporting using a medallion (bronze, silver, gold) architecture and a Kimball star schema.',
    'Build and maintain Power BI dashboards for internal business stakeholders.',
    'Apply data-quality checks, change tracking, and row-level security across the model.',
    'Move the work from sandbox development into the standard dev, test, and prod deployment lifecycle.',
    'Build a statistical risk-scoring model for a separate analytics project, using historical transactional data.',
  ];

  internshipContributions: string[] = [
    'Delivered an end-to-end pipeline (ingest, clean, model, dashboard) that runs unattended on a monthly schedule.',
    'Cut the reporting data model from about 13 tables to 5 through better grain and dimensional design.',
    'Built a multi-page Power BI report with row-level security separating two business units.',
    'Found and fixed many real data-quality and logic bugs through systematic raw-data audits.',
    'Rebuilt a second, independent pipeline project from scratch to reinforce the same architecture.',
    'Built and validated a statistical risk-scoring model, then stress-tested it with an out-of-time validation method. This found an assumption in the original design that needed correcting.',
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
    'Sensitivity analysis',
    'Cohort-based measurement design',
    'Platform governance (service accounts, licensing)',
  ];

  /** Definitions and reference links for every skill tag across the site.
   *  Looked up by exact tag text; a tag with no entry here renders as a
   *  plain, non-interactive tag instead of a link. */
  private readonly skillLibrary: Record<string, { definition: string; link: string }> = {
    Python: {
      definition: 'A general-purpose programming language widely used for data analysis, scripting, and automation.',
      link: 'https://www.python.org/doc/essays/blurb/',
    },
    SQL: {
      definition: 'A query language for reading and changing data stored in relational databases.',
      link: 'https://en.wikipedia.org/wiki/SQL',
    },
    Pandas: {
      definition: 'A Python library for working with tabular data, such as filtering, grouping, and reshaping tables.',
      link: 'https://pandas.pydata.org/docs/getting_started/overview.html',
    },
    'Data cleaning & EDA': {
      definition: 'Fixing or removing incorrect data (cleaning), then visually exploring a dataset to understand its patterns before modelling (exploratory data analysis).',
      link: 'https://en.wikipedia.org/wiki/Exploratory_data_analysis',
    },
    'Dimensional modelling basics': {
      definition: 'A data modelling technique that organises data into fact tables (measurements) and dimension tables (context), commonly used for reporting.',
      link: 'https://en.wikipedia.org/wiki/Dimensional_modeling',
    },
    'Power BI & Tableau fundamentals': {
      definition: 'Core skills in two leading business intelligence tools, used to build interactive dashboards and reports from data.',
      link: 'https://learn.microsoft.com/power-bi/fundamentals/power-bi-overview',
    },
    'Technical report writing': {
      definition: 'Writing a clear, structured document that explains a technical process, method, or result to a specific audience.',
      link: 'https://en.wikipedia.org/wiki/Technical_report',
    },
    'Stakeholder communication': {
      definition: 'Clearly sharing project progress, findings, or decisions with the people who have an interest in the outcome.',
      link: 'https://en.wikipedia.org/wiki/Stakeholder_management',
    },
    'Microsoft Fabric (Lakehouse, OneLake, Data Pipelines)': {
      definition: 'Microsoft\'s unified data platform, combining data storage (OneLake), a lake-based table format (Lakehouse), and pipeline orchestration in one service.',
      link: 'https://learn.microsoft.com/fabric/fundamentals/microsoft-fabric-overview',
    },
    Polars: {
      definition: 'A fast, memory-efficient DataFrame library for Python, used as an alternative to pandas for larger datasets.',
      link: 'https://docs.pola.rs/',
    },
    'Delta Lake': {
      definition: 'An open table format that adds reliability features, such as transactions and version history, on top of data stored in a data lake.',
      link: 'https://delta.io/',
    },
    'Medallion architecture': {
      definition: 'A data design pattern that organises a pipeline into bronze (raw), silver (cleaned), and gold (business-ready) layers.',
      link: 'https://learn.microsoft.com/azure/databricks/lakehouse/medallion',
    },
    'SCD Type 2': {
      definition: 'A Slowly Changing Dimension technique that keeps a full history of changes to a record by adding new rows instead of overwriting old ones.',
      link: 'https://en.wikipedia.org/wiki/Slowly_changing_dimension',
    },
    'Semantic models & Direct Lake': {
      definition: 'A semantic model defines how tables relate and calculate in Power BI. Direct Lake lets Power BI read Fabric lakehouse data directly, without importing a copy.',
      link: 'https://learn.microsoft.com/fabric/fundamentals/direct-lake-overview',
    },
    'Advanced DAX': {
      definition: 'Data Analysis Expressions, the formula language used in Power BI to build calculated measures and columns, used here beyond basic aggregation.',
      link: 'https://learn.microsoft.com/dax/dax-overview',
    },
    'Row-Level Security': {
      definition: 'A Power BI feature that restricts which rows of data a user can see in a report, based on their identity or role.',
      link: 'https://learn.microsoft.com/power-bi/enterprise/service-admin-rls',
    },
    'Pipeline orchestration & idempotency': {
      definition: 'Orchestration coordinates the order and scheduling of data processing steps. Idempotency means a pipeline can be re-run safely without producing duplicate or incorrect results.',
      link: 'https://en.wikipedia.org/wiki/Idempotence',
    },
    'Production-safety practices': {
      definition: 'Engineering habits, such as validation checks and safe failure handling, that protect a live system from being broken by a bad run or bad data.',
      link: 'https://learn.microsoft.com/azure/well-architected/reliability/principles',
    },
    'Git & Azure DevOps': {
      definition: 'Git is a version control system for tracking code changes. Azure DevOps is Microsoft\'s platform for hosting repositories, pipelines, and project boards built on top of it.',
      link: 'https://learn.microsoft.com/devops/what-is-azure-devops',
    },
    'Dev / Test / Prod ALM': {
      definition: 'Application Lifecycle Management: promoting work through separate development, testing, and production environments before it goes live.',
      link: 'https://learn.microsoft.com/fabric/cicd/deployment-pipelines/understand-the-deployment-process',
    },
    'Credit risk / provision-matrix modelling': {
      definition: 'Estimating how likely a customer is not to pay, often using a provision matrix that applies a loss rate based on how overdue an invoice is.',
      link: 'https://en.wikipedia.org/wiki/Credit_risk',
    },
    'Out-of-time statistical validation': {
      definition: 'Testing a model on data from a later time period than it was trained on, to check it still works on data it has never seen.',
      link: 'https://en.wikipedia.org/wiki/Cross-validation_(statistics)',
    },
    'DAX filter-context debugging': {
      definition: 'Diagnosing why a DAX measure returns the wrong number by tracing exactly which filters are active when it is evaluated.',
      link: 'https://learn.microsoft.com/dax/context-and-filters-dax',
    },
    'Structured model-review & findings documentation': {
      definition: 'Running a formal review of a model\'s assumptions and methodology, and writing up every issue found as a ranked, documented finding.',
      link: 'https://en.wikipedia.org/wiki/Model_risk_management',
    },
    'Sensitivity analysis': {
      definition: 'Testing how much a model\'s final result changes when one input or parameter is varied, to see which inputs matter most.',
      link: 'https://en.wikipedia.org/wiki/Sensitivity_analysis',
    },
    'Cohort-based measurement design': {
      definition: 'Measuring an outcome by following a fixed group (a cohort) from a defined starting point, instead of taking a snapshot at one point in time.',
      link: 'https://en.wikipedia.org/wiki/Cohort_study',
    },
    'Platform governance (service accounts, licensing)': {
      definition: 'Managing how a platform is administered safely at scale, including non-human service accounts and the licensing rules that control who can view or edit content.',
      link: 'https://learn.microsoft.com/power-bi/enterprise/service-admin-administering-power-bi-in-your-organization',
    },
    Java: {
      definition: 'A general-purpose, object-oriented programming language widely used for desktop, web, and enterprise applications.',
      link: 'https://en.wikipedia.org/wiki/Java_(programming_language)',
    },
    DAX: {
      definition: 'Data Analysis Expressions, the formula language used in Power BI to build calculated measures and columns.',
      link: 'https://learn.microsoft.com/dax/dax-overview',
    },
    NumPy: {
      definition: 'A core Python library for fast numerical computing, built around a multi-dimensional array type.',
      link: 'https://numpy.org/doc/stable/user/whatisnumpy.html',
    },
    'Scikit-learn': {
      definition: 'A Python library providing ready-to-use implementations of common machine learning algorithms.',
      link: 'https://scikit-learn.org/stable/getting_started.html',
    },
    'Web Scraping': {
      definition: 'Automatically extracting data from web pages, usually by fetching and parsing their HTML.',
      link: 'https://en.wikipedia.org/wiki/Web_scraping',
    },
    'Web scraping': {
      definition: 'Automatically extracting data from web pages, usually by fetching and parsing their HTML.',
      link: 'https://en.wikipedia.org/wiki/Web_scraping',
    },
    'Microsoft Fabric': {
      definition: 'Microsoft\'s unified data platform, combining data storage, pipelines, and analytics tools in one service.',
      link: 'https://learn.microsoft.com/fabric/fundamentals/microsoft-fabric-overview',
    },
    'Microsoft Fabric (Lakehouse, OneLake)': {
      definition: 'Microsoft\'s unified data platform, combining data storage (OneLake) with a lake-based table format (Lakehouse).',
      link: 'https://learn.microsoft.com/fabric/fundamentals/microsoft-fabric-overview',
    },
    'Delta Lake / OneLake': {
      definition: 'Delta Lake is an open table format for reliable data storage. OneLake is Microsoft Fabric\'s built-in, tenant-wide version of that storage layer.',
      link: 'https://learn.microsoft.com/fabric/onelake/onelake-overview',
    },
    'Medallion Architecture': {
      definition: 'A data design pattern that organises a pipeline into bronze (raw), silver (cleaned), and gold (business-ready) layers.',
      link: 'https://learn.microsoft.com/azure/databricks/lakehouse/medallion',
    },
    'Pipeline Orchestration': {
      definition: 'Coordinating the order, timing, and dependencies of the steps in a data pipeline.',
      link: 'https://en.wikipedia.org/wiki/Orchestration_(computing)',
    },
    'Pipeline orchestration': {
      definition: 'Coordinating the order, timing, and dependencies of the steps in a data pipeline.',
      link: 'https://en.wikipedia.org/wiki/Orchestration_(computing)',
    },
    'Power BI': {
      definition: 'A Microsoft tool for connecting to data and building interactive reports and dashboards.',
      link: 'https://learn.microsoft.com/power-bi/fundamentals/power-bi-overview',
    },
    Tableau: {
      definition: 'A widely used business intelligence tool for building interactive data visualisations and dashboards.',
      link: 'https://en.wikipedia.org/wiki/Tableau_Software',
    },
    'Semantic Models': {
      definition: 'The layer in Power BI that defines how tables relate to each other and how measures are calculated, sitting between raw data and a report.',
      link: 'https://learn.microsoft.com/power-bi/fundamentals/power-bi-overview',
    },
    Matplotlib: {
      definition: 'A Python library for creating static charts and plots, such as line graphs and bar charts.',
      link: 'https://matplotlib.org/stable/users/explain/quick_start.html',
    },
    'KDD Process': {
      definition: 'Knowledge Discovery in Databases: a structured sequence of steps (selection, preprocessing, transformation, data mining, evaluation) for finding patterns in data.',
      link: 'https://en.wikipedia.org/wiki/Data_mining',
    },
    'Machine Learning': {
      definition: 'Building models that learn patterns from data, rather than being explicitly programmed with rules.',
      link: 'https://en.wikipedia.org/wiki/Machine_learning',
    },
    'Data Mining': {
      definition: 'Finding patterns and relationships in large datasets using statistical and computational methods.',
      link: 'https://en.wikipedia.org/wiki/Data_mining',
    },
    'Kimball / Star Schema': {
      definition: 'The Kimball method models reporting data as a star schema: a central fact table surrounded by descriptive dimension tables.',
      link: 'https://en.wikipedia.org/wiki/Star_schema',
    },
    Classification: {
      definition: 'A machine learning task that assigns each record to one of a fixed set of categories.',
      link: 'https://en.wikipedia.org/wiki/Statistical_classification',
    },
    Streamlit: {
      definition: 'A Python framework for turning a data script into a shareable interactive web app with minimal code.',
      link: 'https://docs.streamlit.io/get-started',
    },
    'Git & GitHub': {
      definition: 'Git is a version control system for tracking code changes. GitHub is a hosting platform for Git repositories.',
      link: 'https://docs.github.com/get-started/using-git/about-git',
    },
    'Azure DevOps': {
      definition: 'Microsoft\'s platform for hosting code repositories, pipelines, and project boards.',
      link: 'https://learn.microsoft.com/devops/what-is-azure-devops',
    },
    'Microsoft Office': {
      definition: 'Microsoft\'s suite of productivity applications, including Word, Excel, and PowerPoint.',
      link: 'https://en.wikipedia.org/wiki/Microsoft_Office',
    },
    'Google Workspace': {
      definition: 'Google\'s suite of cloud productivity and collaboration tools, including Docs, Sheets, and Drive.',
      link: 'https://en.wikipedia.org/wiki/Google_Workspace',
    },
    'Simulated Annealing': {
      definition: 'A metaheuristic optimisation method that searches for a good solution by occasionally accepting worse moves, to avoid getting stuck in a local optimum.',
      link: 'https://en.wikipedia.org/wiki/Simulated_annealing',
    },
    'Metaheuristic Optimisation': {
      definition: 'A family of general-purpose strategies for finding a good, though not guaranteed optimal, solution to a problem too large to search exhaustively.',
      link: 'https://en.wikipedia.org/wiki/Metaheuristic',
    },
    'Algorithm Design': {
      definition: 'Planning the step-by-step logic a program follows to solve a problem, before writing the code itself.',
      link: 'https://en.wikipedia.org/wiki/Algorithm',
    },
    'Performance Tuning': {
      definition: 'Adjusting a system\'s parameters or code to improve its speed or resource use.',
      link: 'https://en.wikipedia.org/wiki/Performance_tuning',
    },
    'Orange Data Mining': {
      definition: 'An open-source, visual data mining and machine learning tool that builds analysis workflows from drag-and-drop components.',
      link: 'https://orangedatamining.com/',
    },
    'Random Forest': {
      definition: 'A machine learning method that combines many decision trees and averages their predictions for a more accurate result.',
      link: 'https://en.wikipedia.org/wiki/Random_forest',
    },
    'Neural Networks': {
      definition: 'A machine learning model loosely inspired by the brain, made of connected layers of nodes that learn to approximate a function from data.',
      link: 'https://en.wikipedia.org/wiki/Neural_network_(machine_learning)',
    },
    'Linear Regression': {
      definition: 'A statistical method that models the relationship between inputs and an output as a straight line.',
      link: 'https://en.wikipedia.org/wiki/Linear_regression',
    },
    'Cross-Validation': {
      definition: 'A technique for testing a model by repeatedly training it on part of the data and testing it on the rest, for a more reliable estimate of its accuracy.',
      link: 'https://en.wikipedia.org/wiki/Cross-validation_(statistics)',
    },
    'Model Evaluation Metrics': {
      definition: 'Numerical measures, such as error rate or R-squared, used to judge how well a model\'s predictions match reality.',
      link: 'https://en.wikipedia.org/wiki/Precision_and_recall',
    },
    'Object-Oriented Programming': {
      definition: 'A programming style that organises code into objects, each bundling its own data and behaviour.',
      link: 'https://en.wikipedia.org/wiki/Object-oriented_programming',
    },
    'Java Swing (GUI)': {
      definition: 'A Java toolkit for building desktop graphical user interfaces, such as windows, buttons, and forms.',
      link: 'https://en.wikipedia.org/wiki/Swing_(Java)',
    },
    'File I/O': {
      definition: 'Reading data from and writing data to files on disk, so a program\'s data survives after it closes.',
      link: 'https://en.wikipedia.org/wiki/Input/output',
    },
    'UML Design': {
      definition: 'Unified Modeling Language: a standard set of diagrams for planning the structure of a software system before building it.',
      link: 'https://en.wikipedia.org/wiki/Unified_Modeling_Language',
    },
    'Software Documentation': {
      definition: 'Written material that explains how a piece of software is structured, built, or used.',
      link: 'https://en.wikipedia.org/wiki/Software_documentation',
    },
    Selenium: {
      definition: 'A tool for automating web browsers, commonly used for web scraping and automated testing.',
      link: 'https://www.selenium.dev/documentation/',
    },
    'Random Forest Regressor': {
      definition: 'A Random Forest model adapted to predict a continuous number, such as a price, rather than a category.',
      link: 'https://en.wikipedia.org/wiki/Random_forest',
    },
    'Data Cleaning': {
      definition: 'Fixing or removing incorrect, incomplete, or inconsistent data before it is analysed.',
      link: 'https://en.wikipedia.org/wiki/Data_cleansing',
    },
    'Discrete Event Simulation': {
      definition: 'A modelling technique that simulates a system as a sequence of distinct events over time, such as arrivals and service completions.',
      link: 'https://en.wikipedia.org/wiki/Discrete-event_simulation',
    },
    'Arena Simulation Software': {
      definition: 'A discrete event simulation tool used to build and run models of business processes, such as a store or a factory line.',
      link: 'https://en.wikipedia.org/wiki/Arena_(software)',
    },
    'Queueing & Resource Scheduling': {
      definition: 'Modelling how entities wait in line for a limited resource, and how that resource is allocated over time.',
      link: 'https://en.wikipedia.org/wiki/Queueing_theory',
    },
    'What-If / Sensitivity Analysis': {
      definition: 'Testing how a result changes when one assumption or input is changed, to compare different scenarios.',
      link: 'https://en.wikipedia.org/wiki/Sensitivity_analysis',
    },
    'Model Verification & Validation': {
      definition: 'Verification checks that a model was built correctly. Validation checks that it accurately represents the real system it models.',
      link: 'https://en.wikipedia.org/wiki/Verification_and_validation_of_computer_simulation_models',
    },
    'Business Process Modelling': {
      definition: 'Mapping out the steps, decisions, and flow of a real business process, usually to analyse or improve it.',
      link: 'https://en.wikipedia.org/wiki/Business_process_modeling',
    },
    'Star schema basics': {
      definition: 'A beginner-level grasp of the star schema: a central fact table surrounded by descriptive dimension tables.',
      link: 'https://en.wikipedia.org/wiki/Star_schema',
    },
    'Kimball dimensional modelling': {
      definition: 'A data modelling approach, created by Ralph Kimball, that structures reporting data around fact and dimension tables.',
      link: 'https://en.wikipedia.org/wiki/Dimensional_modeling',
    },
    'Grain and bridge tables': {
      definition: 'Grain is the level of detail one row in a fact table represents. A bridge table resolves a many-to-many relationship between a fact and a dimension.',
      link: 'https://en.wikipedia.org/wiki/Dimensional_modeling',
    },
    'Advanced DAX (DISTINCTCOUNT, CALCULATE)': {
      definition: 'Using more advanced DAX functions, such as DISTINCTCOUNT and CALCULATE, to change the filter context a measure is evaluated in.',
      link: 'https://learn.microsoft.com/dax/dax-overview',
    },
    'Power BI cross-filter direction': {
      definition: 'A setting on a relationship between two Power BI tables that controls whether filtering flows one way or both ways.',
      link: 'https://learn.microsoft.com/power-bi/fundamentals/power-bi-overview',
    },
    'Idempotency and defensive coding': {
      definition: 'Writing code so repeating an operation produces the same safe result (idempotency), and so it anticipates and handles unexpected input (defensive coding).',
      link: 'https://en.wikipedia.org/wiki/Idempotence',
    },
    'Hashing for change detection': {
      definition: 'Computing a short fingerprint (hash) of a record so a new version can be compared against the old one to detect whether anything changed.',
      link: 'https://en.wikipedia.org/wiki/Hash_function',
    },
    'Name and fuzzy matching': {
      definition: 'Matching records that refer to the same real-world thing even when their text does not match exactly, such as small spelling differences.',
      link: 'https://en.wikipedia.org/wiki/Record_linkage',
    },
    'String normalisation': {
      definition: 'Converting text into a single consistent format, such as fixing case or spacing, so comparisons and matches are reliable.',
      link: 'https://en.wikipedia.org/wiki/Text_normalization',
    },
    Regex: {
      definition: 'Regular expressions: a pattern language for finding, matching, or validating pieces of text.',
      link: 'https://en.wikipedia.org/wiki/Regular_expression',
    },
    'Systematic data-quality auditing': {
      definition: 'Methodically checking a dataset against defined rules or expectations, instead of spot-checking individual records.',
      link: 'https://en.wikipedia.org/wiki/Data_quality',
    },
    'Pipeline scheduling and dependencies': {
      definition: 'Defining when a pipeline runs and which steps must finish before others can start.',
      link: 'https://en.wikipedia.org/wiki/Job_scheduler',
    },
    'Environment isolation and security boundaries': {
      definition: 'Keeping separate environments, such as a sandbox and production, from being able to affect each other.',
      link: 'https://en.wikipedia.org/wiki/Sandbox_(computer_security)',
    },
    'Semantic-model best practices': {
      definition: 'Established conventions for structuring a Power BI semantic model so it performs well and stays easy to maintain.',
      link: 'https://learn.microsoft.com/power-bi/fundamentals/power-bi-overview',
    },
    'Power BI report authoring (PBIP)': {
      definition: 'Building a Power BI report using the Power BI Project (PBIP) file format, which stores the report as readable source files instead of one binary file.',
      link: 'https://learn.microsoft.com/power-bi/developer/projects/projects-overview',
    },
    'Theming, map visuals, drill-through': {
      definition: 'Styling a report consistently (theming), showing data on a map (map visuals), and letting a user click through from a summary to its detail (drill-through).',
      link: 'https://learn.microsoft.com/power-bi/fundamentals/power-bi-overview',
    },
    'Time-series anomaly logic': {
      definition: 'Rules or models that flag a data point as unusual compared to the normal pattern of a series over time.',
      link: 'https://en.wikipedia.org/wiki/Anomaly_detection',
    },
    'ALM and deployment pipelines': {
      definition: 'Application Lifecycle Management: promoting work through separate development, testing, and production environments before it goes live.',
      link: 'https://learn.microsoft.com/fabric/cicd/deployment-pipelines/understand-the-deployment-process',
    },
    'Cross-workspace model deployment': {
      definition: 'Deploying a semantic model so it is used from a different workspace than the one it was built in.',
      link: 'https://learn.microsoft.com/fabric/cicd/deployment-pipelines/understand-the-deployment-process',
    },
    'RLS across environments': {
      definition: 'Keeping row-level security rules consistent and correctly configured as a model moves between dev, test, and prod.',
      link: 'https://learn.microsoft.com/power-bi/enterprise/service-admin-rls',
    },
    'Dev, Test, and Prod discipline': {
      definition: 'Consistently promoting work through separate development, testing, and production environments before it goes live.',
      link: 'https://learn.microsoft.com/fabric/cicd/deployment-pipelines/understand-the-deployment-process',
    },
    Documentation: {
      definition: 'Written material that records how something works, so it can be understood and maintained by someone else later.',
      link: 'https://en.wikipedia.org/wiki/Documentation',
    },
    'Credit risk analytics': {
      definition: 'Using data and statistics to estimate how likely a customer or counterparty is to fail to repay what they owe.',
      link: 'https://en.wikipedia.org/wiki/Credit_risk',
    },
    'Hypothesis testing': {
      definition: 'A statistical method for checking whether a pattern seen in data is likely to be real, or could reasonably be due to chance.',
      link: 'https://en.wikipedia.org/wiki/Statistical_hypothesis_test',
    },
    'SQL joins & key design': {
      definition: 'Combining rows from multiple tables using SQL joins, and designing the key fields that make those joins accurate.',
      link: 'https://en.wikipedia.org/wiki/Join_(SQL)',
    },
    'Microsoft Fabric notebooks': {
      definition: 'Code notebooks inside Microsoft Fabric, used to explore, clean, and process data with Python or Spark.',
      link: 'https://learn.microsoft.com/fabric/fundamentals/microsoft-fabric-overview',
    },
    'Data-quality auditing': {
      definition: 'Methodically checking a dataset against defined rules or expectations, instead of spot-checking individual records.',
      link: 'https://en.wikipedia.org/wiki/Data_quality',
    },
    'Literature review': {
      definition: 'Systematically reading and summarising existing research or documented practice on a topic before starting new work.',
      link: 'https://en.wikipedia.org/wiki/Literature_review',
    },
    'Data snapshotting & reproducibility': {
      definition: 'Freezing a copy of data at a point in time, so an analysis gives the same result every time it is re-run.',
      link: 'https://en.wikipedia.org/wiki/Reproducibility',
    },
    'Cross-workspace data access': {
      definition: 'Reading data that lives in a different workspace than the one the current item is in.',
      link: 'https://learn.microsoft.com/fabric/fundamentals/microsoft-fabric-overview',
    },
    'Risk scoring & validation': {
      definition: 'Building a score that ranks risk, then checking that score against real, known outcomes to confirm it works.',
      link: 'https://en.wikipedia.org/wiki/Credit_risk',
    },
    'Semantic model migration': {
      definition: 'Moving a semantic model to a new workspace or environment while keeping its structure and connections intact.',
      link: 'https://learn.microsoft.com/fabric/cicd/deployment-pipelines/understand-the-deployment-process',
    },
    'Power BI permissions troubleshooting': {
      definition: 'Diagnosing why a specific user can or cannot see a Power BI report or its data as expected.',
      link: 'https://learn.microsoft.com/power-bi/enterprise/service-admin-rls',
    },
    'Deployment auditing': {
      definition: 'Checking what was actually changed or moved during a deployment, rather than assuming it went as planned.',
      link: 'https://learn.microsoft.com/fabric/cicd/deployment-pipelines/understand-the-deployment-process',
    },
    'Expected-credit-loss / provision-matrix methodology': {
      definition: 'Estimating how likely a customer is not to pay, often using a provision matrix that applies a loss rate based on how overdue an invoice is.',
      link: 'https://en.wikipedia.org/wiki/Credit_risk',
    },
    'Financial risk data modelling': {
      definition: 'Structuring financial and transactional data so it supports risk calculations and reporting.',
      link: 'https://en.wikipedia.org/wiki/Credit_risk',
    },
    'Technical writing': {
      definition: 'Writing clear, structured documents that explain a technical process, method, or result to a specific audience.',
      link: 'https://en.wikipedia.org/wiki/Technical_writing',
    },
    'Rigorous validation practice': {
      definition: 'Consistently checking a result against independent evidence before treating it as final.',
      link: 'https://en.wikipedia.org/wiki/Verification_and_validation',
    },
    'Root-cause analysis under critique': {
      definition: 'Tracing a problem back to its true underlying cause, done while responding to someone else\'s challenge or feedback.',
      link: 'https://en.wikipedia.org/wiki/Root_cause_analysis',
    },
    'Data version-history auditing': {
      definition: 'Checking a data source\'s change history to confirm what was and was not modified, and when.',
      link: 'https://en.wikipedia.org/wiki/Data_lineage',
    },
    'Financial control gap analysis': {
      definition: 'Comparing current financial data controls against what should be in place, to find and document the gaps.',
      link: 'https://en.wikipedia.org/wiki/Internal_control',
    },
    'Out-of-time test design': {
      definition: 'Designing an evaluation that trains a model on one time period and tests it only on a later, non-overlapping period.',
      link: 'https://en.wikipedia.org/wiki/Cross-validation_(statistics)',
    },
    'Root-cause debugging of a data pipeline': {
      definition: 'Tracing a pipeline bug back to its true source, rather than only fixing the symptom.',
      link: 'https://en.wikipedia.org/wiki/Root_cause_analysis',
    },
    'Expected-credit-loss (IFRS 9 / MFRS 9) framework application': {
      definition: 'Applying the IFRS 9 / MFRS 9 accounting standard\'s expected credit loss framework to estimate loan or receivables losses.',
      link: 'https://en.wikipedia.org/wiki/IFRS_9',
    },
    'Structured findings documentation': {
      definition: 'Writing up every issue found during a review as a ranked, clearly documented finding, instead of an informal list.',
      link: 'https://en.wikipedia.org/wiki/Model_risk_management',
    },
    'Critical evaluation of a model’s own assumptions': {
      definition: 'Actively questioning whether a model\'s starting assumptions still hold, instead of taking them for granted.',
      link: 'https://en.wikipedia.org/wiki/Model_risk_management',
    },
    'Data pipeline staleness-bug root-causing': {
      definition: 'Tracing a bug where data silently stops updating back to its true source in the pipeline, instead of just patching the symptom.',
      link: 'https://en.wikipedia.org/wiki/Root_cause_analysis',
    },
    'Roll-rate methodology': {
      definition: 'A technique that estimates loss by measuring, in steps, the probability an account moves from one aging stage to the next, then chaining those steps together.',
      link: 'https://en.wikipedia.org/wiki/Credit_risk',
    },
    'Reproducible evaluation design': {
      definition: 'Designing a test so that running it again, by anyone, produces the same result.',
      link: 'https://en.wikipedia.org/wiki/Reproducibility',
    },
    'Self-verification of technical methodology': {
      definition: 'Checking your own understanding of a method against the actual data and logic, instead of assuming it is correct.',
      link: 'https://en.wikipedia.org/wiki/Verification_and_validation',
    },
    'Technical documentation': {
      definition: 'Written material that explains how a technical process or system works, so it can be understood and maintained by someone else.',
      link: 'https://en.wikipedia.org/wiki/Technical_writing',
    },
    'Root-cause analysis': {
      definition: 'Tracing a problem back to its true underlying cause, rather than only fixing the symptom.',
      link: 'https://en.wikipedia.org/wiki/Root_cause_analysis',
    },
  };

  weeklyReports: WeeklyReport[] = [
    {
      week: 'Week 1',
      dates: '3 to 7 August 2026',
      focus: 'Onboarding and a first working pipeline',
      tasks: [
        "Learned the organisation's history, structure, policies, and culture framework, and clarified the project brief with my mentor.",
        'Built the first version of a web scraper. It collects a list of entries, scrapes individual profile pages, then filters and scores the results.',
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
        'A script can look like it is working, but still quietly corrupt data. So checking the actual output, not just whether it ran, is the only reliable test. Saving raw data first and filtering later keeps that data reusable for other work.',
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
        'Added production-safety guards. These included a row-count check before overwriting good data, bounded retries on network calls, idempotent writes, and an orchestrator notebook to run the pipeline end to end.',
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
        'Completed a Slowly Changing Dimension (Type 2) design, so historical changes are kept instead of overwritten.',
        "Built a two-stage matching process to separate new records from the existing dataset.",
        'Configured Row-Level Security so each business unit sees only its own data, while still sharing new records, plus a manager role with full access.',
        'Ran a full data-quality audit across about 800 records. I standardised inconsistent wording in several fields and fixed real logic bugs (a year-stripping rule that damaged valid codes, a case-sensitivity bug, and greedy patterns causing data loss).',
        'Evaluated other public data sources as extra options and documented why most were not usable (anti-bot protection, paywalls, thin data, wrong record type).',
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
        'Logic that is correct on paper can still give wrong results because of a data-format quirk (empty string versus null) or a platform quirk. So checking against a real example beats trusting that it "should" work. A filter is only as good as its keyword list.',
      next: 'Finalise the monthly schedule and connect Git version control.',
    },
    {
      week: 'Week 4',
      dates: '24 to 28 August 2026',
      focus: 'Automation, an agent-assisted workflow, and a second pipeline',
      tasks: [
        'Set the pipeline to run automatically on a monthly schedule with no manual trigger.',
        'Explored an agent-driven workflow from the code editor to the cloud in an isolated sandbox, keeping production and any internal data strictly out of scope.',
        'Rebuilt the sandbox from scratch as a separate practice project. It is a self-updating daily weather monitor for several cities, built from a free public API.',
        'Applied every lesson from the main project to it. This included a clean star schema with business-friendly names, correct data types, a scheduled orchestration pipeline, and a themed multi-page Power BI report with a map, drill-through, and anomaly indicators.',
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
        'Moved both semantic models and reports into official team Dev and Test workspaces, using a purpose-built deployment function. This kept the data in its original location, with no duplicate storage.',
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
      focus: 'Starting a second internship project: statistical risk analytics for a business dataset',
      tasks: [
        'Sat in on a review discussion with a business team and my mentor, to understand how credit decisions are made today. Then I drafted a project brief covering the objective and candidate risk factors.',
        'Researched general drivers of business payment default, including payment behaviour, company profile, and credit-bureau data. I also checked whether public trade datasets could help measure customer concentration risk, but found that source was not reliable enough, so I did not pursue it.',
        'Read about how broader market conditions can affect a customer’s ability to pay on time. This gave background for the risk factors under consideration.',
        'Worked with transactional data in Microsoft Fabric. After mentor feedback, I reworked an early risk-grouping approach, moving from a single forced category per record to independent risk flags.',
        'Found and corrected a data-joining error in my own earlier work, where an identifier that was not unique across the full dataset had been treated as if it were. Fixing it changed an early summary figure.',
        'Explored a new dataset for the first time. I built a clean categorisation from free text, then ran a first hypothesis test on whether this attribute relates to default risk. The result was negative, so I dropped the feature.',
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
        'I first assumed one pattern in the data was linked to seasonal timing. Checking it directly showed the effect was small and was better explained by internal processing behaviour.',
        'A query returning more rows than expected was the clue that led me to the join error. Without that check, a wrong figure would have gone into the analysis unnoticed.',
        'Tried to identify a specific pattern in the data. No reliable signal existed for it, so I recorded it as a dead end instead of forcing a weak feature.',
      ],
      learning:
        'Always check that the numbers reconcile, especially when a result looks reasonable at first glance. Also treat an identifier as unique only within the scope it was actually designed for. A negative result is still a useful one, because it stops a feature that looks sensible on paper from being built on nothing.',
      next: 'Get the early findings reviewed with my mentor, then begin requesting the extra data needed for further testing.',
    },
    {
      week: 'Week 7',
      dates: '14 to 18 September 2026',
      focus: 'A reproducible data snapshot, a first risk score, and migrating an earlier project out of its sandbox',
      tasks: [
        'Built a frozen, read-only snapshot of the relevant data using a cross-workspace link instead of a duplicate copy. This way, the analysis gives reproducible results instead of shifting every time the source data changed.',
        'Cleaned residual records from a past system migration out of the dataset, then classified records by how overdue they were.',
        'Designed and validated a first risk score from payment history. I checked it against known outcomes to confirm it concentrated risk sensibly instead of spreading it evenly.',
        'Tested and rejected a hypothesis about why risk increased sharply past a certain point in the data. The pattern held regardless of payment terms, which pointed to a process-driven cause instead of a billing-cycle artefact.',
        'Migrated an earlier internship project out of its temporary workspace into the permanent one, ahead of a trial period ending. I moved all its tables and notebooks and confirmed that internal reference IDs stayed stable across the move.',
        'Found and fixed a permissions issue where report viewers, but not I, hit an access error. I traced it to a connection setting that routed permission checks incorrectly.',
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
        'The outcome being predicted had to be kept separate from the score’s own inputs. Otherwise, the score would describe what had already happened instead of warning about what might happen next.',
        'A working data refresh did not guarantee a working report for everyone. The permissions issue only appeared when someone outside my own account opened the page, which is why a full access audit was worth running.',
      ],
      learning:
        'A data snapshot exists for reproducibility, not convenience. A live source can change daily, so the same query can return different answers on different days unless something is frozen. Repointing an existing model to a new location, instead of rebuilding it, keeps its existing security setup intact.',
      next: 'Finish the risk-scoring build on the new snapshot and begin proper report pages for it.',
    },
    {
      week: 'Week 8',
      dates: '21 to 25 September 2026',
      focus: 'Applying a recognised risk methodology and stress-testing the results',
      tasks: [
        'Reworked the risk report pages. I fixed a chart that was misrepresenting scale, cleaned up labelling, and corrected a figure that was being read from the wrong source.',
        'Researched a recognised accounting methodology for this kind of risk scoring, a provision-matrix approach for expected credit losses, instead of continuing with judgement-based weights. I then re-derived the model’s rates from historical settled records.',
        'Rebuilt the risk model on the new methodology. I aligned the categories with the historical bands and confirmed a known risk threshold held up under a second, independent check.',
        'Added customer tenure and an activity status (active, quiet, or lapsed) to the model. I computed this carefully so long-standing customers were not undercounted.',
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
        'Hit a type-mismatch error combining a fixed-point value with a floating-point rate. I resolved it by converting within the calculation instead of changing how the underlying data was stored.',
        'The thresholds used to define an inactive customer were conventional, not data-derived, so I openly flagged this as a limitation instead of presenting it as settled.',
      ],
      learning:
        'A validation rule set in advance, like a minimum sample size before trusting a result, only means something if it is still followed on the day a result looks especially convincing. The most defensible answer is rarely the most striking-looking one.',
      next: 'Validate the methodology note’s references, test the activity thresholds against real behaviour, and share the data-quality issues found so far with the business team.',
    },
    {
      week: 'Week 9',
      dates: '28 September 2026',
      focus: 'Responding to mentor feedback and re-testing the model’s own assumptions',
      tasks: [
        'Reviewed my mentor’s critique of the risk methodology in detail, instead of assuming either side was right. I confirmed the underlying statistics were sound, but my write-up had explained them poorly enough to cause the misunderstanding. I rewrote the unclear section and accepted the parts of the feedback that were genuinely valid.',
        'Traced a data question back to its root cause using version history instead of assumption, and confirmed no changes had been made to a data source outside the project’s own scope. I then added a safeguard against this happening by accident in future.',
        'Added a missing reference field to the report using a small lookup table, instead of reworking the whole snapshot. This kept every previously validated figure reproducible.',
        'Ran an out-of-time validation, training the model on an earlier period and testing it on a later one, as requested after the previous review.',
        'Found that risk rates estimated from more recent data differed meaningfully from those estimated using the full historical window. After ruling out a couple of other explanations, I concluded the model’s original time window mixed two different periods of the business that should be treated separately.',
        'Measured how much this correction changed the model’s overall risk estimate. The relative ranking of customers stayed largely the same, so the change improves how defensible the model is, not which accounts it flags.',
        'Surfaced two general data-quality gaps for the business team to review, about how completely certain account records were populated.',
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
        'A result that initially looked like good news deserved more scrutiny, not less. It took ruling out a couple of other explanations before I could trust what it actually meant.',
      ],
      learning:
        'The most valuable outcome this week did not come from building something new. It came from taking a piece of critical feedback seriously enough to re-check the work from scratch, which is what surfaced a genuine gap in the model’s original assumptions.',
      next: 'Re-derive the model’s rates on the corrected time window, update the methodology write-up, and raise the data-quality gaps directly with the business team.',
    },
    {
      week: 'Week 10',
      dates: '29 September to 5 October 2026',
      focus: 'A structured model review, a corrected out-of-time test, and a closer look at the governing standard',
      tasks: [
        'Took part in a structured review of the risk model with stakeholders. We separated what was confirmed as sound, the overall ranking approach, the general expected-credit-loss framework, the rate calculation logic, and the exclusion of one unrepresentative historical period, from what still needed evidence.',
        'Wrote up every open issue from the review as a ranked list of findings by severity. This covered how the model was being evaluated, how its historical window behaved over time, how closely its output duplicated an existing report, and how clearly it was presented to a non-technical audience.',
        'Built a proper out-of-time test. I trained the rates on one block of historical records and evaluated them only on a later, non-overlapping block. This directly answered the review’s most serious finding, that the existing accuracy figure had been measured on data the model had already learned from.',
        'Found and fixed a bug in my own test query. A filter meant to exclude records too recent to have a known outcome had been dropped during an earlier rewrite, which was quietly making recent periods look better than they actually were.',
        'Studied a worked walkthrough of the expected-credit-loss framework and confirmed the model’s structure (exposure, probability of default, and loss severity) matched the standard approach. I also found that the loss-severity assumption had effectively been fixed at total loss, without that ever being a deliberate decision.',
        'Went deeper into the governing accounting standard itself and found several genuine differences between the current method and the standard: how a loss is actually defined, the absence of any forward-looking adjustment for current conditions, grouping accounts only by how overdue they are instead of by shared risk characteristics, and the assumption that a loss is always total once an account is flagged.',
        'Discussed the findings with my mentor. The exposure and loss-severity assumptions were accepted as reasonable, so the probability-of-default estimate is now the main open question.',
        'Started building a roll-rate style query that reconstructs, month by month, how accounts move between aging stages. This is an alternative way of estimating that same probability.',
      ],
      skills: [
        'Out-of-time test design',
        'Root-cause debugging of a data pipeline',
        'Expected-credit-loss (IFRS 9 / MFRS 9) framework application',
        'Structured findings documentation',
        'Critical evaluation of a model’s own assumptions',
      ],
      challenges: [
        'The first corrected test run still overstated how wrong the model was, because the same filtering bug I had fixed once before had crept back in during a rewrite. This was a reminder that a fix needs a regression check, not just a one-time correction.',
        'A cleaned, machine-generated summary of a long review meeting read convincingly on its own, but checking it line by line against the raw recording showed it contained a worked example and a line of reasoning that were never actually said. I discarded the summary and rebuilt the record from the raw recording instead.',
      ],
      learning:
        'Verifying a summary against its original source is not optional. A plausible-sounding summary can contain material that was never there, and acting on it would mean responding to a problem nobody actually raised.',
      next: 'Audit the first pipeline project for similar blind spots, properly separate the roll-rate measurement from the final loss-rate figure, and design a fixed, repeatable rule for splitting data into training and testing periods.',
    },
    {
      week: 'Week 11',
      dates: '6 to 9 October 2026',
      focus: 'Auditing the first pipeline project and rebuilding the evaluation around a fixed rule',
      tasks: [
        'Returned to audit the first internship pipeline project, reviewing its two core transformation steps in detail. Confirmed how each layer writes its data: the raw layer appends one batch per run, the cleaned layer rebuilds its full change history in memory before writing so nothing is lost, and the reporting layer is fully rebuilt every run.',
        'Found a bug where a record removed from the source would still be carried forward indefinitely in the cleaned layer, so a count that should be able to fall could only stay the same or grow. Traced it to the query only keeping the latest run of each record and discarding the history that would let a fix be dated properly.',
        'Found that the underlying collection step has no retry logic and no check on how many records succeeded, which was the original reason the carry-forward behaviour was added. Fixing the retry first would make it safe to introduce a proper expiry rule.',
        'Looked into automating report deployment with a service account, and found a real platform limitation: ownership of an existing item cannot be transferred to a service account directly, only assigned at creation. Planned a workaround and confirmed the orchestration step only needed a single piece re-created this way, since it calls the other steps directly rather than through a separate scheduler.',
        'Confirmed a licensing limitation: below a certain capacity tier, every user needs an individual licence to view or edit reports, regardless of the service account’s access. Built and ran a small test write to confirm a safe, fail-if-exists write pattern, then built and scheduled a test pipeline. Its first run reported success in five seconds with no steps actually executed, a false pass rather than a real result.',
        'Worked the roll-rate method through end to end: measure each step between aging stages separately, then multiply the chain to estimate the probability of loss from each stage. Found that all five current rates rest on the same small set of past failures, so they are really one measurement split five ways rather than five independent ones.',
        'Ran a sensitivity check and found the influence was inverted from the evidence. The final step in the chain has the most influence on the end result but rests on the fewest observations, while the earliest steps rest on far more data but barely move the final number. Defined an escalation rule for the rates going forward: an isolated off reading is treated as noise, a short run in the same direction gets a closer look, and a sustained run either widens the measurement window or, if it traces to one customer, flags that customer instead of the rate.',
        'Replaced the training and testing split with a fixed, pre-stated rule instead of one chosen after seeing where the figures looked weakest, to avoid the split itself becoming a source of bias. Wrote the new test as a single repeatable query so the result can be regenerated rather than quoted from memory.',
      ],
      skills: [
        'Data pipeline staleness-bug root-causing',
        'Platform governance (service accounts, licensing)',
        'Roll-rate methodology',
        'Sensitivity analysis',
        'Reproducible evaluation design',
      ],
      challenges: [
        'The scheduled test pipeline has not actually passed yet. The run that reported success executed nothing, which only came to light because the run time was suspiciously short.',
        'Still waiting on confirmation from the team that owns the underlying records about whether a particular status field means a payment was received or the amount was written off. The final loss-rate figure depends directly on the answer.',
      ],
      learning:
        'A failed test on its own gives no instruction. Breaking the error down into its separate causes, rather than reporting one combined number, is what turns a failure into a decision about what to change next.',
      next: 'Reconcile the roll-rate measurement against the chained final figure on a single, non-forecast period, to check the two methods agree before relying on either for future periods.',
    },
    {
      week: 'Week 12',
      dates: '12 to 18 October 2026 (in progress)',
      focus: 'Self-checking the method from memory and separating how two account groups must be measured',
      tasks: [
        'Wrote out my own understanding of the roll-rate method from memory, without checking any reference, then compared it against the actual data and logic. Four points were wrong, and are worth recording as the easiest parts of the method to get wrong.',
        'Corrected the first error: a record does not belong to one aging stage, it belongs to a stage on a specific date. The same record contributes many rows over its life as time passes, which is also where most of the measurement volume comes from.',
        'Corrected the second error: I had described comparing a predicted figure against an actual outcome without stating that the final figure can take months to resolve, while a single step in the chain resolves in about a month. The two checks run on completely different timelines.',
        'Corrected the third error: I had treated multiplying the steps together as a given, when it actually depends on each step being independent of the one before it, which does not automatically hold for slow-paying accounts. This is why it now sits behind a test rather than being assumed.',
        'Corrected the fourth error: I had left out the largest, not-yet-overdue group of accounts entirely, because it cannot use the same monthly measurement as the others. Its width varies by customer, so a month of waiting does not move every account the same distance.',
        'Worked out exactly why that group, and one other wider aging band, fail the monthly measurement: a month of waiting has to move a record exactly one stage for the monthly method to be valid, and it does not for either of these two groups. Measuring them correctly, as a cohort tracked from entry rather than as a monthly snapshot, gives a meaningfully different rate than the shortcut does.',
        'Identified that this same cohort-style measurement is needed in several places, not just those two groups: the same two aging bands, a fallback direct measurement if the chaining approach fails its own test, and every evaluation of the final combined figure, which is a cohort measurement by definition.',
      ],
      skills: [
        'Self-verification of technical methodology',
        'Cohort-based measurement design',
        'Technical documentation',
        'Root-cause analysis',
      ],
      challenges: [
        'All four errors were in the same place: what exactly is being measured and on what timeline. That suggests the unit of measurement is the part most worth stating explicitly in any write-up of the method, not the formula itself.',
        'The two account groups that fail the monthly shortcut are not a small edge case. One of them holds most of the money that has not yet gone overdue at all, so measuring it incorrectly would misstate the figure that matters most.',
      ],
      learning:
        'Writing a method out from memory and checking it against the data found errors that simply reading the method back would not have. Recording where a well-understood method is still easy to misstate is as useful as recording the method itself.',
      next: 'Apply the correct cohort-based measurement to the two account groups that need it, and re-run the full evaluation with the corrected logic in place.',
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
    this.selectedWork.set(this.signatureWorks[0]?.title ?? '');

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
          // Reveal once on the way down, then stop watching. Scrolling back
          // up never hides it again.
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

    document
      .querySelectorAll('.reveal, .card-slide')
      .forEach((el) => this.revealObserver?.observe(el));
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
