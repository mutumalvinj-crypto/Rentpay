"use client";

import { useMemo, useState } from "react";
import {
  Activity, ArrowDownLeft, ArrowUpRight, Building2, CheckCircle2,
  ChevronDown, CircleHelp, Clock3, Download, FileText, Home, LayoutDashboard,
  Menu, Plus, Search, Settings2, ShieldCheck, Users, Wallet, X
} from "lucide-react";

const nav = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Properties & units", icon: Building2 },
  { label: "Tenants", icon: Users },
  { label: "Rent ledger", icon: FileText },
  { label: "Reconciliation", icon: Activity },
  { label: "Reports", icon: ArrowUpRight }
];

const initialRows = [
  { id: "PR-1048", tenant: "Grace Wanjiku", unit: "Kilimani · A-04", period: "Oct 2026", amount: 28000, status: "Confirmed", date: "Today, 09:42" },
  { id: "PR-1047", tenant: "Brian Otieno", unit: "South B · B-12", period: "Oct 2026", amount: 18500, status: "Needs review", date: "Today, 08:17" },
  { id: "PR-1046", tenant: "Mary Njeri", unit: "Kilimani · A-11", period: "Oct 2026", amount: 32000, status: "Pending", date: "Yesterday" },
  { id: "PR-1045", tenant: "Peter Mwangi", unit: "Ngara · C-02", period: "Oct 2026", amount: 15000, status: "Confirmed", date: "Yesterday" }
];

const money = (value) => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(value);

function Badge({ children }) {
  const kind = children === "Confirmed" ? "good" : children === "Pending" ? "pending" : children === "Needs review" ? "review" : "neutral";
  return <span className={`badge ${kind}`}><span className="badge-dot" />{children}</span>;
}

export default function HomePage() {
  const [active, setActive] = useState("Overview");
  const [rows, setRows] = useState(initialRows);
  const [query, setQuery] = useState("");
  const [showPay, setShowPay] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [notice, setNotice] = useState("Demo workspace · Sample records only");
  const [amount, setAmount] = useState("28000");
  const [tenant, setTenant] = useState("Grace Wanjiku");

  const filtered = useMemo(() => rows.filter((r) =>
    [r.id, r.tenant, r.unit, r.period, r.status].join(" ").toLowerCase().includes(query.toLowerCase())
  ), [rows, query]);

  function createDemoPayment(event) {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 1) {
      setNotice("Enter a valid amount. No payment was initiated.");
      return;
    }
    setRows((current) => [{
      id: `DEMO-${Date.now().toString().slice(-6)}`,
      tenant,
      unit: "Demo unit · not allocated",
      period: "Oct 2026",
      amount: value,
      status: "Pending",
      date: "Just now · demo only"
    }, ...current]);
    setShowPay(false);
    setActive("Rent ledger");
    setNotice("Demo record created only. No money moved and no payment was confirmed.");
  }

  function exportCsv() {
    const header = ["Reference", "Tenant", "Unit", "Period", "Amount KES", "Status", "Date"];
    const body = rows.map((r) => [r.id, r.tenant, r.unit, r.period, r.amount, r.status, r.date]);
    const csv = [header, ...body].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "payrent-demo-ledger.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand"><div className="brand-mark"><Home size={19} strokeWidth={2.6} /></div><div><strong>PayRent</strong><small>RENT, RECONCILED</small></div><button className="icon-button close-nav" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18}/></button></div>
        <div className="workspace-label">WORKSPACE</div>
        <button className="workspace"><span className="workspace-avatar">M</span><span><b>Mak Properties</b><small>Owner workspace</small></span><ChevronDown size={15}/></button>
        <nav className="nav-list" aria-label="Main navigation">
          {nav.map(({ label, icon: Icon }) => <button key={label} onClick={() => { setActive(label); setMobileNav(false); }} className={`nav-item ${active === label ? "active" : ""}`}><Icon size={18}/><span>{label}</span>{label === "Reconciliation" && <span className="nav-count">2</span>}</button>)}
        </nav>
        <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><b>Need a hand?</b><p>Learn how PayRent keeps every rent record traceable.</p><button onClick={() => setNotice("Help centre is not connected in this prototype.")}>Visit help centre <ArrowUpRight size={13}/></button></div><button className="nav-item settings" onClick={() => setNotice("Workspace settings are planned; no settings have been changed.")}><Settings2 size={18}/>Settings</button><div className="profile"><div className="profile-avatar">AM</div><div><b>Alvin Mutuma</b><small>Workspace owner</small></div><ChevronDown size={15}/></div></div>
      </aside>

      {mobileNav && <button className="scrim" aria-label="Close menu" onClick={() => setMobileNav(false)} />}
      <section className="main-area">
        <header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={21}/></button><div className="breadcrumb">Workspace <span>/</span> <b>{active}</b></div><div className="top-actions"><span className="live-indicator"><span/> Demo mode</span><button className="icon-button" aria-label="Help" onClick={() => setNotice("This is a demo workspace. Live payment processing is disabled.")}><CircleHelp size={19}/></button><div className="top-avatar">AM</div></div></header>
        <div className="content">
          <div className="notice"><ShieldCheck size={16}/><span>{notice}</span><button onClick={() => setNotice("Demo workspace · Sample records only")} aria-label="Dismiss notice"><X size={14}/></button></div>
          <div className="page-heading"><div><div className="eyebrow">THURSDAY, 29 OCTOBER 2026</div><h1>{active === "Overview" ? "Good morning, Alvin" : active}</h1><p>{active === "Overview" ? "Here’s what’s happening across your rental portfolio." : "A unified view of rent obligations, records and outcomes."}</p></div><div className="heading-actions"><button className="button button-secondary" onClick={exportCsv}><Download size={16}/> Export ledger</button><button className="button button-primary" onClick={() => setShowPay(true)}><Plus size={17}/> PayRent</button></div></div>

          <div className="period-row"><div className="period-pill"><span className="period-dot"/> October 2026 <ChevronDown size={14}/></div><span className="muted-text">Last updated just now · Sample data</span></div>

          {active === "Overview" && <>
            <div className="metric-grid">
              <Metric icon={Wallet} label="Rent expected" value={money(1245000)} note="Across 42 active units" trend="Current month" />
              <Metric icon={CheckCircle2} label="Reconciled" value={money(968500)} note="77.8% of expected rent" trend="Verified records" />
              <Metric icon={Clock3} label="Outstanding" value={money(276500)} note="11 obligations to follow up" trend="Needs attention" />
              <Metric icon={Activity} label="Exceptions" value="2" note="Require human review" trend="No auto-guessing" />
            </div>
            <div className="insight-grid">
              <section className="panel collection-panel"><div className="panel-heading"><div><h2>Collection overview</h2><p>Rent progress for October</p></div><span className="tiny-tag">DEMO</span></div><div className="collection-total"><strong>{money(968500)}</strong><span>of {money(1245000)} expected</span></div><div className="progress-track"><div className="progress-fill" style={{width:"77.8%"}}/></div><div className="progress-legend"><span><i className="legend-paid"/> Reconciled <b>77.8%</b></span><span><i className="legend-open"/> Remaining <b>22.2%</b></span></div><div className="collection-footer"><div><small>Compared with September</small><b className="positive"><ArrowUpRight size={14}/> 6.4%</b></div><div><small>Active units</small><b>42 <span className="muted-inline">/ 48 total</span></b></div></div></section>
              <section className="panel attention-panel"><div className="panel-heading"><div><h2>Needs your attention</h2><p>Items that should not be auto-resolved</p></div><span className="attention-count">2</span></div><div className="attention-item"><div className="attention-symbol amber"><Clock3 size={17}/></div><div><b>Unmatched payment record</b><p>South B · B-12 · {money(18500)}</p><small>Reference PR-1047 · Review allocation</small></div><button className="arrow-button" onClick={() => setActive("Reconciliation")} aria-label="Review unmatched record"><ArrowUpRight size={17}/></button></div><div className="attention-item"><div className="attention-symbol red"><Activity size={17}/></div><div><b>Amount mismatch</b><p>Kilimani · A-11 · {money(32000)}</p><small>Provider confirmation required</small></div><button className="arrow-button" onClick={() => setActive("Reconciliation")} aria-label="Review amount mismatch"><ArrowUpRight size={17}/></button></div><button className="text-link" onClick={() => setActive("Reconciliation")}>Open reconciliation queue <ArrowUpRight size={14}/></button></section>
            </div>
          </>}

          <section className="panel ledger-panel"><div className="panel-heading ledger-heading"><div><h2>{active === "Overview" ? "Recent rent activity" : active === "Reconciliation" ? "Reconciliation queue" : active === "Properties & units" ? "Properties and units" : active === "Tenants" ? "Tenant records" : active === "Reports" ? "Reportable ledger activity" : "Rent ledger"}</h2><p>{active === "Reconciliation" ? "Unmatched or pending records require a verified source before resolution." : "Records below are sample data for this prototype."}</p></div><div className="table-actions"><label className="search-box"><Search size={15}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search records" /></label><button className="button button-secondary compact" onClick={exportCsv}><Download size={15}/> CSV</button></div></div>
            <div className="table-wrap"><table><thead><tr><th>REFERENCE</th><th>TENANT / UNIT</th><th>PERIOD</th><th>AMOUNT</th><th>STATUS</th><th>DATE</th><th/></tr></thead><tbody>{filtered.map((r) => <tr key={r.id}><td><span className="reference">{r.id}</span></td><td><div className="tenant-cell"><div className="tenant-initial">{r.tenant.split(" ").map((s) => s[0]).join("").slice(0,2)}</div><div><b>{r.tenant}</b><small>{r.unit}</small></div></div></td><td>{r.period}</td><td className="amount-cell">{money(r.amount)}</td><td><Badge>{r.status}</Badge></td><td className="date-cell">{r.date}</td><td><button className="arrow-button" aria-label={`View ${r.id}`} onClick={() => setNotice(`${r.id}: sample record. Live evidence and tenant authorization are not connected.`)}><ArrowUpRight size={16}/></button></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-state">No records match “{query}”.</div>}</div>
            <div className="table-footer"><span>Showing {filtered.length} of {rows.length} sample records</span><button className="text-link" onClick={() => setActive("Rent ledger")}>View full ledger <ArrowUpRight size={14}/></button></div>
          </section>

          <footer className="footer-note"><ShieldCheck size={15}/><span>Payment initiation is disabled. Demo records are not proof of payment, settlement or tenant balances.</span><span className="footer-version">PayRent · V1 workspace</span></footer>
        </div>
      </section>

      {showPay && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowPay(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="pay-title"><div className="modal-header"><div><div className="eyebrow">DEMO WORKFLOW</div><h2 id="pay-title">Create a PayRent record</h2></div><button className="icon-button" onClick={() => setShowPay(false)} aria-label="Close"><X size={18}/></button></div><div className="modal-callout"><ShieldCheck size={18}/><span>This creates a sample ledger record only. It will not request money or mark a payment confirmed.</span></div><form onSubmit={createDemoPayment}><label>Tenant name<input value={tenant} onChange={(e) => setTenant(e.target.value)} required maxLength={100}/></label><label>Amount (KES)<input type="number" min="1" max="100000000" step="1" value={amount} onChange={(e) => setAmount(e.target.value)} required/></label><label>Rent period<select defaultValue="Oct 2026"><option>Oct 2026</option><option>Nov 2026</option><option>Dec 2026</option></select></label><div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setShowPay(false)}>Cancel</button><button type="submit" className="button button-primary">Create demo record</button></div></form></section></div>}
    </main>
  );
}

function Metric({ icon: Icon, label, value, note, trend }) {
  return <section className="metric-card"><div className="metric-top"><span className="metric-icon"><Icon size={18}/></span><span className="metric-trend">{trend}</span></div><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-note">{note}</div></section>;
}
