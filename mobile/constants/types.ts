export type UserRole = 'founder' | 'investor';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export type FundingStage =
  | 'pre-seed'
  | 'seed'
  | 'series-a'
  | 'series-b'
  | 'growth';

export type Industry =
  | 'fintech'
  | 'saas'
  | 'deeptech'
  | 'consumer'
  | 'health'
  | 'climate'
  | 'web3'
  | 'other';

export type EmployeeRange = '1-10' | '11-50' | '51-200' | '201+';

export interface InvestorProfile {
  id: string;
  user_id: string;
  firm_name: string;
  year_founded: number | null;
  hq_location: string;
  fund_size: number | null;
  check_size_min: number | null;
  check_size_max: number | null;
  stage_focus: FundingStage[];
  industry_focus: Industry[];
  investment_thesis: string;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface FounderProfile {
  id: string;
  user_id: string;
  company_name: string;
  year_founded: number | null;
  ceo_name: string;
  hq_location: string;
  industry: Industry | null;
  stage: FundingStage | null;
  employee_count: EmployeeRange | null;
  one_liner: string;
  round_target: number | null;
  capital_raised: number | null;
  revenue_ltm: number | null;
  growth_yoy: number | null;
  gross_margin: number | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export type MatchStatus =
  | 'new'
  | 'in_conversation'
  | 'meeting_scheduled'
  | 'passed';

export interface Match {
  id: string;
  investor_id: string;
  founder_id: string;
  status: MatchStatus;
  created_at: string;
  counterparty_name: string;
  counterparty_role: UserRole;
  counterparty_profile: Partial<InvestorProfile> | Partial<FounderProfile>;
  last_message?: string;
  last_message_at?: string;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface InvestorSwipeCard {
  type: 'investor';
  user_id: string;
  profile: InvestorProfile;
}

export interface FounderSwipeCard {
  type: 'founder';
  user_id: string;
  profile: FounderProfile;
}

export type SwipeCard = InvestorSwipeCard | FounderSwipeCard;

export interface SwipeResult {
  matched: boolean;
  match_id?: string;
  match_name?: string;
}

// Enriched card shape used by the new SwipeCard / CompanyDetailScreen UI
export interface AnnualRevenuePoint {
  year: string;
  label: string;
  value: number;
}

export interface Company {
  user_id: string;          // maps to SwipeCard.user_id for swipe actions
  name: string;
  initials: string;
  logo: string | null;
  tagline: string;
  stage: string;
  matchScore: number;
  matchReason: string;
  tags: string[];
  arr: string;
  yoyGrowth: string;
  raiseTarget: string;
  churn: string;
  grossMargin: string;
  burnMultiple: string;
  tam: string;
  founded: string;
  ceo: string;
  hq: string;
  teamSize: string;
  capitalRaised: string;
  annualRevenue: AnnualRevenuePoint[];
}

export interface AuthResponse {
  user: User;
  token: string;
  has_profile: boolean;
}
