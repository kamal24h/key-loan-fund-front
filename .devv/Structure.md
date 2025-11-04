# This file is only for editing file nodes, do not break the structure
## Project Description
Fund Manager Pro is a professional private fund management platform designed for fund managers, GPs, and investment professionals. Track portfolio performance, manage investor relations, monitor investments, and generate comprehensive reports with institutional-grade tools.

## Key Features
- Email OTP authentication system
- Real-time dashboard with key metrics (AUM, IRR, MOIC)
- Portfolio management and tracking
- Investment monitoring and performance analytics
- Investor relationship management
- Transaction tracking and reporting

## Data Storage
Tables:
- fund_portfolios (f33m6xybmt4w) - Fund portfolio data and performance metrics
- investments (f33m6xybmzgg) - Portfolio company investment tracking
- investors (f33m6xy95340) - Investor profiles and commitments
- transactions (f33m6xygmlts) - Financial transaction history
- loans (f33mzfsmxrlt) - Fund member loans with terms and status
- loan_installments (f33mzfsmxrls) - Individual loan installment records for repayment tracking

## Devv SDK Integration
Built-in: Auth (email OTP), Table (database operations)
External: None

## Special Requirements
Professional financial platform design with focus on data density, precision, and trust

/src
├── assets/          # Static resources directory
│
├── components/      # Components directory
│   ├── ui/         # Pre-installed shadcn/ui components
│   ├── AppLayout.tsx # Main application layout with sidebar navigation
│   └── ProtectedRoute.tsx # Route guard component for authentication
│
├── hooks/          # Custom Hooks directory
│   ├── use-mobile.ts # Mobile detection Hook
│   └── use-toast.ts  # Toast notification system Hook
│
├── lib/            # Utility library directory
│   └── utils.ts    # Utility functions, including cn function for merging Tailwind classes
│
├── pages/          # Page components directory (React Router structure)
│   ├── LoginPage.tsx # Authentication page with email OTP
│   ├── DashboardPage.tsx # Main dashboard with key metrics
│   ├── PortfoliosPage.tsx # Fund portfolio management [next: add CRUD functionality]
│   ├── InvestmentsPage.tsx # Investment tracking [next: add CRUD functionality]
│   ├── InvestorsPage.tsx # Investor management [next: add CRUD functionality]
│   ├── ReportsPage.tsx # Performance reporting [next: add report generation]
│   └── NotFoundPage.tsx # 404 error page
│
├── store/          # State management directory (Zustand)
│   └── auth-store.ts # Authentication state with persistence
│
├── App.tsx         # Root component with protected route configuration
│
├── main.tsx        # Entry file, renders root component and mounts to DOM
│
├── index.css       # Professional financial design system with navy/blue theme
│
└── tailwind.config.js  # Tailwind CSS v3 configuration file