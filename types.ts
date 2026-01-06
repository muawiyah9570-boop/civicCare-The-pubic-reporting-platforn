
export enum UserRole {
  CITIZEN = 'citizen',
  ADMIN = 'admin',
  AUTHORITY = 'authority'
}

export enum ReportStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  REJECTED = 'Rejected'
}

export enum ReportCategory {
  ROAD = 'Road Damage',
  GARBAGE = 'Garbage/Sanitation',
  WATER = 'Water Leakage',
  ELECTRICITY = 'Electricity Issue',
  STREETLIGHT = 'Streetlight Fault',
  OTHER = 'Other'
}

export enum PriorityLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: ReportCategory;
  password?: string;
}

export interface Report {
  id: string;
  userId: string;
  userName: string;
  category: ReportCategory;
  description: string;
  location: string;
  imageUrl?: string;
  status: ReportStatus;
  priority: PriorityLevel;
  createdAt: number;
  updatedAt: number;
  notes?: string;
  assignedTo?: string;
}

export interface GovScheme {
  title: string;
  description: string;
  benefits: string;
  eligibility: string;
  link?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
