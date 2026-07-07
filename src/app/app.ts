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
    { id: 'fyp', label: 'FYP' },
    { id: 'activities', label: 'Activities' },
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
    caption: 'Signed Attendance and Supervision Monitoring Form — SQQZK4993',
  };

  skillCategories: SkillCategory[] = [
    { title: 'Programming', bg: 'assets/bg-programming.jpg', skills: ['Python', 'Java'] },
    {
      title: 'Data Processing',
      bg: 'assets/bg-data-processing.jpeg',
      skills: ['Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib'],
    },
    { title: 'Visualisation', bg: 'assets/bg-visualisation.jpeg', skills: ['Tableau', 'Power BI'] },
    { title: 'Deployment', bg: 'assets/bg-deployment.jpg', skills: ['Streamlit', 'GitHub'] },
    {
      title: 'Methodology',
      bg: 'assets/bg-methodology.jpg',
      skills: ['KDD Process', 'Machine Learning', 'Data Mining', 'Classification'],
    },
    { title: 'Other', bg: 'assets/bg-other.jpg', skills: ['Microsoft Office', 'Google Workspace'] },
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
      caption: 'Dashboard Output — High Risk Customer Prediction',
    },
    {
      src: 'assets/dashboard-low.jpg',
      alt: 'Dashboard screenshot: Low Risk Prediction',
      caption: 'Dashboard Output — Low Risk Customer Prediction',
    },
    {
      src: 'assets/dashboard-moderate.jpg',
      alt: 'Dashboard screenshot: Moderate Risk Prediction',
      caption: 'Dashboard Output — Moderate Risk Customer Prediction',
    },
  ];

  galleryPhotos: Photo[] = [
    {
      src: 'assets/supervisor.jpeg',
      alt: 'With Supervisor Dr. Izwan',
      caption: 'With Supervisor — Associate Professor Ts. Dr. Izwan Nizal Bin Mohd Shaharanee',
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
        'Silver Award — Decision Support System Category, Decision Science Research Symposium 2026 (Poster Presentation)',
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
    { date: 'April 2025', text: 'Project development begins. Dashboard structure planned with supervisor.' },
    { date: 'April – May 2025', text: 'Data preprocessing completed. Six models trained and evaluated.' },
    { date: 'May – June 2025', text: 'Streamlit dashboard built and deployed on Streamlit Community Cloud.' },
    { date: 'June 2025', text: 'Final report written and revised based on supervisor feedback.' },
    { date: 'June 29, 2025', text: 'Poster presented at Decision Science Research Symposium 2026 at UUM.' },
    { date: 'July 2025', text: 'Final report and e-portfolio submitted.' },
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

  ngOnInit(): void {
    setTimeout(() => this.loading.set(false), 1500);
    this.typeLoop();
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
    if (this.zoomScale() <= 1) {
      return;
    }
    this.isDragging = true;
    this.isPanning.set(true);
    this.dragStart = { x: event.clientX, y: event.clientY };
    this.panStart = { x: this.panX(), y: this.panY() };
  }

  onLightboxPointerMove(event: PointerEvent): void {
    if (!this.isDragging) {
      return;
    }
    this.panX.set(this.panStart.x + (event.clientX - this.dragStart.x));
    this.panY.set(this.panStart.y + (event.clientY - this.dragStart.y));
  }

  onLightboxPointerUp(): void {
    this.isDragging = false;
    this.isPanning.set(false);
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
