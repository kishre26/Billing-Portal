import { Role } from "./rbac";

// --- Subscription Plans ---
export type Plan = {
  id: string;
  name: string;
  price: number;
  seats: number;
  features: string[];
  current?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    seats: 5,
    features: ["5 team seats", "Basic reporting", "Email support"],
  },
  {
    id: "growth",
    name: "Growth",
    price: 99,
    seats: 25,
    features: ["25 team seats", "Advanced reporting", "Priority support", "SSO"],
    current: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: 299,
    seats: 100,
    features: ["100 team seats", "Custom reporting", "Dedicated support", "SSO + SCIM", "Audit log"],
  },
];

// --- Invoices ---
export type Invoice = {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  description: string;
};

export const INVOICES: Invoice[] = [
  { id: "INV-1042", date: "2026-06-01", amount: 99, status: "paid", description: "Growth plan — June 2026" },
  { id: "INV-1031", date: "2026-05-01", amount: 99, status: "paid", description: "Growth plan — May 2026" },
  { id: "INV-1020", date: "2026-04-01", amount: 99, status: "paid", description: "Growth plan — April 2026" },
  { id: "INV-1009", date: "2026-03-01", amount: 29, status: "paid", description: "Starter plan — March 2026" },
  { id: "INV-0998", date: "2026-02-01", amount: 29, status: "overdue", description: "Starter plan — February 2026" },
];

// --- Payment Methods ---
export type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "pm_1", brand: "Visa", last4: "4242", expiry: "08/28", isDefault: true },
  { id: "pm_2", brand: "Mastercard", last4: "4444", expiry: "11/27", isDefault: false },
];

// --- Team Members ---
export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export const TEAM: TeamMember[] = [
  { id: "u_1", name: "Priya Raman", email: "priya@company.io", role: "admin" },
  { id: "u_2", name: "Jordan Lee", email: "jordan@company.io", role: "billing_manager" },
  { id: "u_3", name: "Sam Okafor", email: "sam@company.io", role: "viewer" },
  { id: "u_4", name: "Devon Marsh", email: "devon@company.io", role: "viewer" },
];