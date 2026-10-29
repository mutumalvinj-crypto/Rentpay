-- PayRent core schema v1.
-- This migration intentionally does not implement payment confirmation.
-- Review against the existing Task 28 schema before applying to any shared DB.
begin;

create extension if not exists pgcrypto;

create table if not exists public.payrent_properties (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  name text not null check (length(trim(name)) between 1 and 120),
  address text,
  currency text not null default 'KES' check (currency = 'KES'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payrent_units (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.payrent_properties(id) on delete restrict,
  unit_code text not null check (length(trim(unit_code)) between 1 and 80),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (property_id, unit_code)
);

create table if not exists public.payrent_occupancies (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.payrent_units(id) on delete restrict,
  tenant_user_id uuid references auth.users(id) on delete restrict,
  tenant_display_name text not null check (length(trim(tenant_display_name)) between 1 and 120),
  starts_on date not null,
  ends_on date,
  status text not null default 'invited' check (status in ('invited','active','ended','revoked')),
  created_at timestamptz not null default now(),
  check (ends_on is null or ends_on >= starts_on)
);

create unique index if not exists payrent_one_active_occupancy_per_unit
  on public.payrent_occupancies(unit_id)
  where status = 'active';

create table if not exists public.payrent_obligations (
  id uuid primary key default gen_random_uuid(),
  occupancy_id uuid not null references public.payrent_occupancies(id) on delete restrict,
  category text not null default 'rent' check (category in ('rent','water','electricity','service_charge','deposit','other')),
  period_start date not null,
  period_end date not null,
  due_date date not null,
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null default 'KES' check (currency = 'KES'),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  check (period_end >= period_start),
  unique (occupancy_id, category, period_start, period_end)
);

create table if not exists public.payrent_payment_intents (
  id uuid primary key default gen_random_uuid(),
  occupancy_id uuid not null references public.payrent_occupancies(id) on delete restrict,
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null default 'KES' check (currency = 'KES'),
  status text not null default 'created'
    check (status in ('created','pending','confirmed','cancelled','failed','reconciliation_required','reversed')),
  provider text not null default 'unconfigured',
  provider_reference text,
  idempotency_key text not null unique,
  request_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payrent_receipt_evidence (
  id uuid primary key default gen_random_uuid(),
  payment_intent_id uuid not null references public.payrent_payment_intents(id) on delete restrict,
  provider text not null,
  provider_receipt text not null,
  amount_minor bigint not null check (amount_minor > 0),
  currency text not null default 'KES' check (currency = 'KES'),
  authenticated_callback boolean not null default false,
  payload_sha256 text not null check (payload_sha256 ~ '^[0-9a-f]{64}$'),
  recorded_at timestamptz not null default now(),
  unique (provider, provider_receipt)
);

create table if not exists public.payrent_allocations (
  id uuid primary key default gen_random_uuid(),
  payment_intent_id uuid not null references public.payrent_payment_intents(id) on delete restrict,
  obligation_id uuid not null references public.payrent_obligations(id) on delete restrict,
  amount_minor bigint not null check (amount_minor > 0),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.payrent_audit_events (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete restrict,
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists payrent_units_property_idx on public.payrent_units(property_id);
create index if not exists payrent_occupancies_unit_status_idx on public.payrent_occupancies(unit_id, status);
create index if not exists payrent_obligations_occupancy_due_idx on public.payrent_obligations(occupancy_id, due_date);
create index if not exists payrent_intents_occupancy_status_idx on public.payrent_payment_intents(occupancy_id, status);
create index if not exists payrent_receipt_evidence_intent_idx on public.payrent_receipt_evidence(payment_intent_id);
create index if not exists payrent_allocations_obligation_idx on public.payrent_allocations(obligation_id);
create index if not exists payrent_audit_entity_idx on public.payrent_audit_events(entity_type, entity_id, created_at desc);

alter table public.payrent_properties enable row level security;
alter table public.payrent_units enable row level security;
alter table public.payrent_occupancies enable row level security;
alter table public.payrent_obligations enable row level security;
alter table public.payrent_payment_intents enable row level security;
alter table public.payrent_receipt_evidence enable row level security;
alter table public.payrent_allocations enable row level security;
alter table public.payrent_audit_events enable row level security;

-- No broad anon/authenticated grants or permissive policies are added here.
-- All access remains denied until explicit membership-aware policies and
-- reviewed server-side access paths are implemented. Never expose service role
-- credentials to a browser. Confirmation requires a separate atomic RPC that
-- validates persisted provider evidence and writes audit state in one txn.

commit;
