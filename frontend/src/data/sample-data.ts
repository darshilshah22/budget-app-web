import {
  LucideIcon,
  Wallet,
  TrendingUp,
  CreditCard,
  PiggyBank,
  AlertCircle,
  DollarSign,
  Globe,
  Moon,
  Bell,
  Mail,
  Smartphone,
  Shield,
  Key,
  User,
  Lock,
  CreditCard as CardIcon,
} from "lucide-react";
// Interfaces
export interface MonthlyData {
  name: string;
  income: number;
  expenses: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface SummaryCard {
  title: string;
  value: string;
  change: {
    value: number;
    direction: "up" | "down";
  };
  icon: LucideIcon;
  color: "blue" | "green" | "red" | "purple" | "yellow";
}

export interface Budget {
  id: string;
  category: string;
  spent: number;
  total: number;
  trend: number;
  trendDirection: "up" | "down";
  color: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: "warning" | "success" | "info";
  icon: LucideIcon;
}

export interface Category {
  id: number;
  name: string;
  type: "expense" | "income";
  color: string;
  transactions: number;
  total: number;
  trend: string;
  trendDirection: "up" | "down";
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  amount: number;
  category: string;
  type: "income" | "expense";
}

// Sample Data
export const monthlyData: MonthlyData[] = [
  { name: "Jan", income: 5000, expenses: 3500 },
  { name: "Feb", income: 5500, expenses: 3800 },
  { name: "Mar", income: 4800, expenses: 3200 },
  { name: "Apr", income: 6000, expenses: 4000 },
  { name: "May", income: 5200, expenses: 3600 },
  { name: "Jun", income: 5800, expenses: 3900 },
];

export const categoryData: CategoryData[] = [
  { name: "Food", value: 35 },
  { name: "Transport", value: 25 },
  { name: "Entertainment", value: 20 },
  { name: "Shopping", value: 15 },
  { name: "Others", value: 5 },
];

export const COLORS = ["#4ade80", "#f87171", "#fbbf24", "#60a5fa", "#a78bfa"];

export const summaryCards: SummaryCard[] = [
  {
    title: "Total Balance",
    value: "₹24,500",
    change: { value: 12.5, direction: "up" },
    icon: Wallet,
    color: "blue",
  },
  {
    title: "Income",
    value: "₹8,200",
    change: { value: 8.2, direction: "up" },
    icon: TrendingUp,
    color: "green",
  },
  {
    title: "Expenses",
    value: "₹3,800",
    change: { value: 5.7, direction: "down" },
    icon: CreditCard,
    color: "red",
  },
  {
    title: "Savings",
    value: "₹4,400",
    change: { value: 15.3, direction: "up" },
    icon: PiggyBank,
    color: "purple",
  },
];

export const budgets: Budget[] = [
  {
    id: "1",
    category: "Food & Dining",
    spent: 450,
    total: 600,
    trend: 12.5,
    trendDirection: "up",
    color: "blue",
  },
  {
    id: "2",
    category: "Transportation",
    spent: 280,
    total: 400,
    trend: 8.2,
    trendDirection: "down",
    color: "green",
  },
  {
    id: "3",
    category: "Entertainment",
    spent: 150,
    total: 200,
    trend: 5.7,
    trendDirection: "up",
    color: "purple",
  },
  {
    id: "4",
    category: "Shopping",
    spent: 320,
    total: 500,
    trend: 15.3,
    trendDirection: "up",
    color: "red",
  },
  {
    id: "5",
    category: "Utilities",
    spent: 180,
    total: 250,
    trend: 3.1,
    trendDirection: "down",
    color: "yellow",
  },
];

export const insights: Insight[] = [
  {
    id: "1",
    title: "High Spending Alert",
    description: "Your Food & Dining spending is 75% of the budget.",
    type: "warning",
    icon: AlertCircle,
  },
  {
    id: "2",
    title: "Savings Opportunity",
    description: "You could save ₹120 by reducing Entertainment expenses.",
    type: "success",
    icon: TrendingUp,
  },
  {
    id: "3",
    title: "Budget Optimization",
    description: "Consider reallocating unused Transportation budget.",
    type: "info",
    icon: DollarSign,
  },
];

export const categories: Category[] = [
  {
    id: 1,
    name: "Food & Dining",
    type: "expense",
    color: "blue",
    transactions: 45,
    total: 1200.5,
    trend: "+8%",
    trendDirection: "up",
  },
  {
    id: 2,
    name: "Transportation",
    type: "expense",
    color: "green",
    transactions: 32,
    total: 450.75,
    trend: "-3%",
    trendDirection: "down",
  },
  {
    id: 3,
    name: "Entertainment",
    type: "expense",
    color: "purple",
    transactions: 28,
    total: 350.25,
    trend: "+12%",
    trendDirection: "up",
  },
  {
    id: 4,
    name: "Shopping",
    type: "expense",
    color: "orange",
    transactions: 56,
    total: 850.0,
    trend: "+5%",
    trendDirection: "up",
  },
  {
    id: 5,
    name: "Utilities",
    type: "expense",
    color: "red",
    transactions: 12,
    total: 250.5,
    trend: "-2%",
    trendDirection: "down",
  },
  {
    id: 6,
    name: "Salary",
    type: "income",
    color: "green",
    transactions: 4,
    total: 5000.0,
    trend: "+5%",
    trendDirection: "up",
  },
  {
    id: 7,
    name: "Freelance",
    type: "income",
    color: "blue",
    transactions: 8,
    total: 1200.0,
    trend: "+15%",
    trendDirection: "up",
  },
  {
    id: 8,
    name: "Investments",
    type: "income",
    color: "purple",
    transactions: 3,
    total: 750.0,
    trend: "+8%",
    trendDirection: "up",
  },
];

export const events: Event[] = [
  {
    id: "1",
    title: "Grocery Shopping",
    date: "2025-03-15",
    time: "10:00 AM",
    amount: 150.5,
    category: "Food",
    type: "expense",
  },
  {
    id: "2",
    title: "Salary Deposit",
    date: "2025-03-14",
    time: "9:00 AM",
    amount: 5000.0,
    category: "Income",
    type: "income",
  },
  {
    id: "3",
    title: "Netflix Subscription",
    date: "2025-03-13",
    time: "12:00 AM",
    amount: 15.99,
    category: "Entertainment",
    type: "expense",
  },
  {
    id: "4",
    title: "Amazon Purchase",
    date: "2025-03-15",
    time: "11:00 AM",
    amount: 120.0,
    category: "Shopping",
    type: "expense",
  },
];

export interface SettingItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action?: () => void;
}

export interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  items: SettingItem[];
}

export const settings: SettingSection[] = [
  {
    id: "profile",
    title: "Profile Settings",
    description: "Manage your personal information and preferences",
    icon: User,
    items: [
      {
        id: "personal-info",
        title: "Personal Information",
        description: "Update your name, email, and profile picture",
        icon: User,
      },
      {
        id: "notifications",
        title: "Notification Preferences",
        description: "Configure how you receive notifications",
        icon: Bell,
      },
      {
        id: "security",
        title: "Security Settings",
        description: "Manage your password and security options",
        icon: Lock,
      },
    ],
  },
  {
    id: "preferences",
    title: "App Preferences",
    description: "Customize your app experience",
    icon: Globe,
    items: [
      {
        id: "theme",
        title: "Theme Settings",
        description: "Choose between light and dark mode",
        icon: Moon,
      },
      {
        id: "language",
        title: "Language",
        description: "Select your preferred language",
        icon: Globe,
      },
      {
        id: "currency",
        title: "Currency",
        description: "Set your default currency",
        icon: CreditCard,
      },
    ],
  },
  {
    id: "notifications",
    title: "Notification Settings",
    description: "Manage your notification preferences",
    icon: Bell,
    items: [
      {
        id: "email-notifications",
        title: "Email Notifications",
        description: "Configure email notification settings",
        icon: Mail,
      },
      {
        id: "push-notifications",
        title: "Push Notifications",
        description: "Manage push notification preferences",
        icon: Smartphone,
      },
      {
        id: "billing-notifications",
        title: "Billing Notifications",
        description: "Set up billing and payment notifications",
        icon: CardIcon,
      },
    ],
  },
  {
    id: "security",
    title: "Security Settings",
    description: "Manage your account security",
    icon: Shield,
    items: [
      {
        id: "password",
        title: "Password",
        description: "Change your account password",
        icon: Key,
      },
      {
        id: "two-factor",
        title: "Two-Factor Authentication",
        description: "Enable or disable 2FA",
        icon: Shield,
      },
      {
        id: "sessions",
        title: "Active Sessions",
        description: "View and manage active sessions",
        icon: Smartphone,
      },
    ],
  },
  {
    id: "billing",
    title: "Billing & Subscription",
    description: "Manage your subscription and billing",
    icon: CreditCard,
    items: [
      {
        id: "subscription",
        title: "Subscription Plan",
        description: "View and manage your subscription",
        icon: CardIcon,
      },
      {
        id: "payment-methods",
        title: "Payment Methods",
        description: "Manage your payment methods",
        icon: CreditCard,
      },
      {
        id: "billing-history",
        title: "Billing History",
        description: "View your billing history",
        icon: CreditCard,
      },
    ],
  },
];