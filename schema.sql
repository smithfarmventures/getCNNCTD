-- Users / Auth
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('investor', 'founder')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investor Profiles
CREATE TABLE investor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  firm_name TEXT,
  year_founded INT,
  hq_location TEXT,
  fund_size TEXT,
  check_size_min INT,
  check_size_max INT,
  stage_focus TEXT[],
  industry_focus TEXT[],
  investment_pros INT,
  thesis TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Founder / Company Profiles
CREATE TABLE founder_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT,
  year_founded INT,
  ceo_name TEXT,
  hq_location TEXT,
  industry TEXT,
  stage TEXT,
  employee_count TEXT,
  capital_raised_to_date BIGINT,
  round_target BIGINT,
  one_liner TEXT,
  overview TEXT,
  revenue_ltm BIGINT,
  revenue_growth_yoy NUMERIC,
  gross_margin NUMERIC,
  gross_churn NUMERIC,
  burn_multiple NUMERIC,
  maus INT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Swipes
CREATE TABLE swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id UUID REFERENCES users(id),
  swiped_id UUID REFERENCES users(id),
  direction TEXT NOT NULL CHECK (direction IN ('like', 'pass')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(swiper_id, swiped_id)
);

-- Matches
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID REFERENCES users(id),
  founder_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'new' CHECK (status IN ('new','in_conversation','meeting_scheduled','passed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Waitlist
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT CHECK (role IN ('investor', 'founder')),
  company TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
