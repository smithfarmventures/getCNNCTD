-- ============================================================
-- CNNCTD Seed Data
-- All users have password: Password123!
-- bcrypt hash: $2b$10$YnPgvRMHBbdMFNq7u6u/XeQjMoGf5t5pT0NQUxOv0K3r8sHV2HJVG
-- ============================================================

-- ============================================================
-- INVESTOR USERS
-- ============================================================
INSERT INTO users (id, email, password_hash, role) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'sarah.chen@apexventures.com',    '$2b$10$YnPgvRMHBbdMFNq7u6u/XeQjMoGf5t5pT0NQUxOv0K3r8sHV2HJVG', 'investor'),
  ('a1000000-0000-0000-0000-000000000002', 'marcus.riley@northstarcapital.vc', '$2b$10$YnPgvRMHBbdMFNq7u6u/XeQjMoGf5t5pT0NQUxOv0K3r8sHV2HJVG', 'investor'),
  ('a1000000-0000-0000-0000-000000000003', 'priya.nair@redwoodgrowth.com',    '$2b$10$YnPgvRMHBbdMFNq7u6u/XeQjMoGf5t5pT0NQUxOv0K3r8sHV2HJVG', 'investor'),
  ('a1000000-0000-0000-0000-000000000004', 'james.okafor@titanfund.io',       '$2b$10$YnPgvRMHBbdMFNq7u6u/XeQjMoGf5t5pT0NQUxOv0K3r8sHV2HJVG', 'investor'),
  ('a1000000-0000-0000-0000-000000000005', 'elena.vasquez@harborpeak.vc',     '$2b$10$YnPgvRMHBbdMFNq7u6u/XeQjMoGf5t5pT0NQUxOv0K3r8sHV2HJVG', 'investor');

-- ============================================================
-- INVESTOR PROFILES
-- ============================================================
INSERT INTO investor_profiles (
  id, user_id, firm_name, year_founded, hq_location,
  fund_size, check_size_min, check_size_max,
  stage_focus, industry_focus, investment_pros, thesis, photo_url
) VALUES
(
  'b1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'Apex Ventures',
  2015,
  'San Francisco, CA',
  '$400M',
  500000,
  5000000,
  ARRAY['Seed', 'Series A'],
  ARRAY['B2B SaaS', 'AI/ML', 'Developer Tools'],
  47,
  'We back technical founders solving enterprise workflow problems with defensible data moats. We''re hands-on partners who''ve built and sold companies ourselves — our value-add starts on day one.',
  'https://cdn.cnnctd.app/investors/apex_ventures.jpg'
),
(
  'b1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000002',
  'NorthStar Capital',
  2011,
  'New York, NY',
  '$1.2B',
  2000000,
  20000000,
  ARRAY['Series A', 'Series B'],
  ARRAY['Fintech', 'Insurtech', 'Regtech'],
  112,
  'Financial infrastructure is being rebuilt from scratch. We partner with founders who understand regulatory nuance and have the patience to win in highly structured markets.',
  'https://cdn.cnnctd.app/investors/northstar_capital.jpg'
),
(
  'b1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000003',
  'Redwood Growth Partners',
  2018,
  'Austin, TX',
  '$250M',
  250000,
  3000000,
  ARRAY['Pre-Seed', 'Seed'],
  ARRAY['Climate Tech', 'AgriTech', 'Supply Chain'],
  34,
  'The climate transition creates the largest economic opportunity of the next 30 years. We invest in the unglamorous infrastructure — logistics, agriculture, and industrial software — that will actually move the needle.',
  'https://cdn.cnnctd.app/investors/redwood_growth.jpg'
),
(
  'b1000000-0000-0000-0000-000000000004',
  'a1000000-0000-0000-0000-000000000004',
  'Titan Fund',
  2020,
  'Miami, FL',
  '$175M',
  1000000,
  8000000,
  ARRAY['Seed', 'Series A'],
  ARRAY['Consumer', 'Marketplace', 'Creator Economy'],
  28,
  'Consumer behavior shifts create brief but massive windows. We look for products with genuine word-of-mouth loops and founders who are obsessed with retention, not just growth.',
  'https://cdn.cnnctd.app/investors/titan_fund.jpg'
),
(
  'b1000000-0000-0000-0000-000000000005',
  'a1000000-0000-0000-0000-000000000005',
  'Harbor Peak Ventures',
  2013,
  'Boston, MA',
  '$600M',
  3000000,
  15000000,
  ARRAY['Series A', 'Series B', 'Series C'],
  ARRAY['HealthTech', 'Digital Health', 'Biotech'],
  89,
  'Healthcare is a $4T market still running on fax machines. We invest in companies that reduce friction for providers and patients alike — especially those with a path to value-based care contracts.',
  'https://cdn.cnnctd.app/investors/harbor_peak.jpg'
);

-- ============================================================
-- FOUNDER USERS
-- ============================================================
INSERT INTO users (id, email, password_hash, role) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'alex.morgan@vaultlayer.io',       '$2b$10$YnPgvRMHBbdMFNq7u6u/XeQjMoGf5t5pT0NQUxOv0K3r8sHV2HJVG', 'founder'),
  ('c1000000-0000-0000-0000-000000000002', 'dana.kim@flowcastai.com',         '$2b$10$YnPgvRMHBbdMFNq7u6u/XeQjMoGf5t5pT0NQUxOv0K3r8sHV2HJVG', 'founder'),
  ('c1000000-0000-0000-0000-000000000003', 'omar.hassan@carbonledger.co',     '$2b$10$YnPgvRMHBbdMFNq7u6u/XeQjMoGf5t5pT0NQUxOv0K3r8sHV2HJVG', 'founder'),
  ('c1000000-0000-0000-0000-000000000004', 'tara.singh@loopmarket.com',       '$2b$10$YnPgvRMHBbdMFNq7u6u/XeQjMoGf5t5pT0NQUxOv0K3r8sHV2HJVG', 'founder'),
  ('c1000000-0000-0000-0000-000000000005', 'ben.lautner@medsynchealth.com',   '$2b$10$YnPgvRMHBbdMFNq7u6u/XeQjMoGf5t5pT0NQUxOv0K3r8sHV2HJVG', 'founder');

-- ============================================================
-- FOUNDER PROFILES
-- ============================================================
INSERT INTO founder_profiles (
  id, user_id, company_name, year_founded, ceo_name, hq_location,
  industry, stage, employee_count, capital_raised_to_date, round_target,
  one_liner, overview,
  revenue_ltm, revenue_growth_yoy, gross_margin, gross_churn, burn_multiple,
  maus, logo_url
) VALUES
(
  'd1000000-0000-0000-0000-000000000001',
  'c1000000-0000-0000-0000-000000000001',
  'VaultLayer',
  2022,
  'Alex Morgan',
  'San Francisco, CA',
  'B2B SaaS',
  'Seed',
  '11-25',
  3200000,
  8000000,
  'The compliance automation platform that turns SOC 2 from a 6-month nightmare into a 3-week checklist.',
  'VaultLayer automates evidence collection, policy management, and auditor workflows for security compliance frameworks including SOC 2, ISO 27001, and HIPAA. Unlike legacy GRC tools built for compliance officers, VaultLayer is developer-first: it integrates with your existing stack (AWS, GitHub, Jira) and continuously monitors controls in real time. We''ve signed 38 enterprise customers in 14 months, with zero churn and an NPS of 71.',
  1800000,
  2.4,
  0.78,
  0.00,
  1.8,
  NULL,
  'https://cdn.cnnctd.app/founders/vaultlayer.png'
),
(
  'd1000000-0000-0000-0000-000000000002',
  'c1000000-0000-0000-0000-000000000002',
  'FlowCast AI',
  2021,
  'Dana Kim',
  'New York, NY',
  'AI/ML',
  'Series A',
  '26-50',
  9500000,
  18000000,
  'AI-powered demand forecasting for mid-market CPG brands that reduces inventory waste by 30%.',
  'FlowCast AI replaces Excel-based forecasting for consumer goods companies with $10M–$500M in revenue. Our ML models ingest POS data, weather, social signals, and supply chain events to produce SKU-level forecasts 8 weeks out. Customers see an average 28% reduction in stockouts and 32% reduction in overstock within 90 days. We currently serve 61 brands and are expanding into Europe in Q3.',
  4200000,
  1.8,
  0.71,
  0.03,
  1.4,
  NULL,
  'https://cdn.cnnctd.app/founders/flowcast_ai.png'
),
(
  'd1000000-0000-0000-0000-000000000003',
  'c1000000-0000-0000-0000-000000000003',
  'CarbonLedger',
  2022,
  'Omar Hassan',
  'Austin, TX',
  'Climate Tech',
  'Seed',
  '6-10',
  1800000,
  5000000,
  'Automated Scope 1, 2, and 3 carbon accounting for manufacturers who need to meet SEC disclosure requirements.',
  'CarbonLedger connects to ERP systems (SAP, NetSuite, Oracle) and utility APIs to automatically calculate and report greenhouse gas emissions. With the SEC''s new climate disclosure rules taking effect for large accelerated filers in 2026, thousands of supply chain vendors face mandatory reporting for the first time. CarbonLedger turns a 6-month consulting engagement into a 2-week onboarding. We have 12 paying customers and a pipeline of 80+ from inbound alone.',
  420000,
  NULL,
  0.82,
  0.00,
  3.2,
  NULL,
  'https://cdn.cnnctd.app/founders/carbonledger.png'
),
(
  'd1000000-0000-0000-0000-000000000004',
  'c1000000-0000-0000-0000-000000000004',
  'LoopMarket',
  2021,
  'Tara Singh',
  'Los Angeles, CA',
  'Marketplace',
  'Series A',
  '26-50',
  7100000,
  15000000,
  'The recommerce marketplace where fashion brands sell authenticated pre-owned inventory directly to consumers.',
  'LoopMarket operates a white-label recommerce channel for fashion brands (think: brand.loopmarket.com), letting them reclaim the resale market from StockX and ThredUp. Brands upload end-of-season and customer-return inventory; LoopMarket handles authentication, photography, fulfillment, and customer service. Brands earn 60% of sale price with zero ops overhead. GMV grew from $800K to $5.2M in 12 months, with 14 brand partners including two publicly traded retailers.',
  3100000,
  5.5,
  0.42,
  0.07,
  2.1,
  89000,
  'https://cdn.cnnctd.app/founders/loopmarket.png'
),
(
  'd1000000-0000-0000-0000-000000000005',
  'c1000000-0000-0000-0000-000000000005',
  'MedSync Health',
  2020,
  'Ben Lautner',
  'Boston, MA',
  'HealthTech',
  'Series B',
  '51-100',
  22000000,
  30000000,
  'Automated prior authorization for specialty medications — cutting approval time from 14 days to under 4 hours.',
  'Prior authorization delays kill patient outcomes and burn 40% of specialty pharmacy staff time. MedSync integrates directly with payer portals and EHR systems to auto-submit PA requests, predict approval probability, and escalate edge cases to clinical staff. We process over 85,000 PA requests per month across 210 specialty pharmacy locations. Our win rate against manual processes in head-to-head pilots is 100%. We are pursuing a Series B to accelerate payer API partnerships and expand into DME and infusion.',
  8900000,
  1.3,
  0.68,
  0.02,
  1.1,
  NULL,
  'https://cdn.cnnctd.app/founders/medsync.png'
);
