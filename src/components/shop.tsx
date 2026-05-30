/* ============================================================
   INVARIANT — demo shop renders
   ShopFrame: presentational frames for the dashboard preview.
   ShopApp: a genuinely vulnerable, pokeable store.
   ============================================================ */
"use client";

import { useState } from "react";
import type { FrameId } from "@/lib/data";

const PRICE_A = 179.99;
const PRICE_B = 19.99;
const QTY_B = 2;

const money = (n: number) =>
  (n < 0 ? "-$" : "$") + Math.abs(n).toFixed(2);

function Flag({ label }: { label: string }) {
  return (
    <div className="s-flag" style={{ inset: -5 }}>
      <span className="s-flagtag">{label}</span>
    </div>
  );
}

function ShopTop({ count = 3 }: { count?: number }) {
  return (
    <div className="s-top">
      <div className="s-logo">
        <span className="m"></span>Northwind
      </div>
      <div className="s-nav">
        <span>Shop</span>
        <span>Deals</span>
        <span>Support</span>
      </div>
      <div className="s-cartbtn">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="20" r="1.4" />
          <circle cx="18" cy="20" r="1.4" />
          <path d="M2 3h3l2.4 12.5a1.5 1.5 0 0 0 1.5 1.2h8.3a1.5 1.5 0 0 0 1.5-1.2L22 7H6" />
        </svg>
        Cart · {count}
      </div>
    </div>
  );
}

type CartBodyProps = {
  qtyA: number;
  couponPct: number;
  flag?: "qty" | "coupon" | null;
  onQty?: (v: number) => void;
  onCoupon?: () => void;
  couponCount?: number;
};

function CartBody({ qtyA, couponPct, flag, onQty, onCoupon, couponCount }: CartBodyProps) {
  const lineA = PRICE_A * qtyA;
  const lineB = PRICE_B * QTY_B;
  const sub = lineA + lineB;
  const disc = sub > 0 ? sub * couponPct : 0;
  const total = sub - disc;
  const badQty = qtyA < 1;

  return (
    <div className="s-body">
      <div className="s-h">Your cart</div>
      <div className="s-hsub">2 items · ships from Reno, NV</div>

      <div style={{ position: "relative" }}>
        {flag === "qty" && <Flag label="INV-02 · qty ≥ 1" />}
        <div className="s-line">
          <div className="s-thumb"></div>
          <div>
            <div className="s-pname">Aero75 Mechanical Keyboard</div>
            <div className="s-pmeta">Linear switches · {money(PRICE_A)}</div>
          </div>
          <div className="s-right">
            <div className={"s-stepper" + (badQty ? " bad" : "")}>
              <button onClick={() => onQty && onQty(qtyA - 1)}>–</button>
              <input
                data-testid="qty-input"
                value={qtyA}
                onChange={(e) =>
                  onQty && onQty(parseInt(e.target.value || "0", 10))
                }
                readOnly={!onQty}
              />
              <button onClick={() => onQty && onQty(qtyA + 1)}>+</button>
            </div>
            <div className={"s-linetot" + (lineA < 0 ? " neg" : "")}>{money(lineA)}</div>
          </div>
        </div>
      </div>

      <div className="s-line">
        <div className="s-thumb"></div>
        <div>
          <div className="s-pname">Braided USB-C Cable</div>
          <div className="s-pmeta">2 m · {money(PRICE_B)}</div>
        </div>
        <div className="s-right">
          <div className="s-stepper">
            <button>–</button>
            <input value={QTY_B} readOnly />
            <button>+</button>
          </div>
          <div className="s-linetot">{money(lineB)}</div>
        </div>
      </div>

      <div style={{ position: "relative" }}>
        {flag === "coupon" && <Flag label="INV-01 · once per cart" />}
        <div className="s-coupon">
          <input data-testid="coupon-input" defaultValue="SAVE20" placeholder="Coupon code" />
          <button onClick={() => onCoupon && onCoupon()}>Apply</button>
        </div>
        {couponPct > 0 && (
          <div className="s-chip" data-testid="discount">
            ✓ SAVE20 applied{couponCount && couponCount > 1 ? ` ×${couponCount}` : ""} · −
            {Math.round(couponPct * 100)}%
          </div>
        )}
      </div>

      <div className="s-sum">
        <div className="s-srow">
          <span className="l">Subtotal</span>
          <span
            className={"v" + (sub < 0 ? " neg" : "")}
            data-testid="cart-subtotal"
          >
            {money(sub)}
          </span>
        </div>
        {couponPct > 0 && (
          <div className="s-srow">
            <span className="l">Discount (SAVE20)</span>
            <span className="v disc">−{money(disc)}</span>
          </div>
        )}
        <div className="s-srow">
          <span className="l">Shipping</span>
          <span className="v">$0.00</span>
        </div>
        <div className="s-srow tot">
          <span>Total</span>
          <span className={"v" + (total < 0 ? " neg" : "")} data-testid="cart-total">
            {money(total)}
          </span>
        </div>
      </div>
      <button className="s-cta">Checkout</button>
    </div>
  );
}

function HomeBody() {
  const items: [string, number][] = [
    ["Aero75 Mechanical Keyboard", PRICE_A],
    ["Braided USB-C Cable", PRICE_B],
    ["Pro Desk Mat — XL", 34.0],
    ["Aluminium Laptop Stand", 59.0],
  ];
  return (
    <div className="s-body">
      <div className="s-h">New this week</div>
      <div className="s-hsub">Desk gear, free shipping over $50</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginTop: 6,
        }}
      >
        {items.map(([n, p]) => (
          <div
            key={n}
            style={{
              background: "#fff",
              border: "1px solid var(--s-line)",
              borderRadius: 10,
              padding: 12,
            }}
          >
            <div
              className="s-thumb"
              style={{ width: "100%", height: 88, borderRadius: 8 }}
            ></div>
            <div className="s-pname" style={{ marginTop: 10 }}>
              {n}
            </div>
            <div className="s-pmeta">{money(p)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckoutBody() {
  return (
    <div className="s-body">
      <div className="s-h">Checkout</div>
      <div className="s-hsub">Step 2 of 2 · payment</div>
      <div className="s-checkout" style={{ marginTop: 8 }}>
        <div className="s-fieldrow">
          <label>Email</label>
          <div className="inp">ada@northwind.io</div>
        </div>
        <div className="s-fieldrow">
          <label>Card number</label>
          <div className="inp">4242 4242 4242 4242</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="s-fieldrow" style={{ flex: 1 }}>
            <label>Expiry</label>
            <div className="inp">04 / 28</div>
          </div>
          <div className="s-fieldrow" style={{ flex: 1 }}>
            <label>CVC</label>
            <div className="inp">•••</div>
          </div>
        </div>
        <div className="s-sum" style={{ marginTop: 4 }}>
          <div className="s-srow">
            <span className="l">Order total</span>
            <span className="v">$219.97</span>
          </div>
        </div>
        <button className="s-cta">Place order</button>
      </div>
    </div>
  );
}

function OrderBody({ flag }: { flag?: boolean }) {
  return (
    <div className="s-body">
      <div className="s-order">
        <div style={{ position: "relative", display: "inline-block" }}>
          {flag && <Flag label="INV-03 · PAID, $0 captured" />}
          <span className="s-badge warn" data-testid="order-status">
            ● PAID · $0.00 captured
          </span>
        </div>
        <div className="s-onum" data-testid="order-num">
          Order #1041
        </div>
        <div className="s-hsub" style={{ marginBottom: 0 }}>
          Confirmation sent to ada@northwind.io
        </div>
        <div
          className="s-pmeta"
          style={{ marginTop: 14, fontFamily: "var(--mono)" }}
          data-testid="amount-captured"
        >
          amount_captured = $0.00
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SAAS — Orbit subscription management frames
   ============================================================ */
function SaasFrame({ frame }: { frame: FrameId }) {
  const isViol = frame === "saas-trialReset" || frame === "saas-apiAccess" || frame === "saas-seatOverflow";

  const navItems = ["Dashboard", "Billing", "Team", "Settings"];
  const activeNav =
    frame === "saas-billing" || frame === "saas-planChange" || frame === "saas-trialReset" || frame === "saas-downgrade" || frame === "saas-apiAccess"
      ? "Billing"
      : frame === "saas-seatOverflow"
      ? "Team"
      : "Dashboard";

  return (
    <div className="saas-app" style={{ height: "100%", display: "flex", flexDirection: "column", background: "#f9fafb", color: "#111827", fontFamily: "var(--font)" }}>
      <style>{`
        .saas-top { display:flex; align-items:center; gap:10px; padding:11px 18px; border-bottom:1px solid #e5e7eb; background:#fff; }
        .saas-logo { font-weight:700; font-size:14px; letter-spacing:-0.02em; color:#6366f1; display:flex; align-items:center; gap:6px; }
        .saas-logo .sq { width:14px; height:14px; border-radius:4px; background:#6366f1; }
        .saas-nav { display:flex; gap:2px; margin-left:18px; }
        .saas-nav span { font-size:12.5px; padding:4px 10px; border-radius:6px; cursor:pointer; color:#6b7280; }
        .saas-nav span.on { background:#f3f4f6; color:#111827; font-weight:500; }
        .saas-badge { font-size:10.5px; font-weight:600; padding:2px 8px; border-radius:999px; border:1px solid; letter-spacing:.04em; }
        .saas-badge.trial { color:#7c3aed; border-color:#c4b5fd; background:#ede9fe; }
        .saas-badge.pro { color:#0284c7; border-color:#bae6fd; background:#e0f2fe; }
        .saas-badge.free { color:#6b7280; border-color:#d1d5db; background:#f9fafb; }
        .saas-badge.viol { color:#dc2626; border-color:#fca5a5; background:#fef2f2; }
        .saas-card { background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:14px 16px; margin-bottom:12px; font-size:12.5px; }
        .saas-card .label { font-size:11px; color:#6b7280; margin-bottom:6px; font-family:var(--mono); letter-spacing:.06em; text-transform:uppercase; }
        .saas-card .val { font-size:15px; font-weight:600; color:#111827; }
        .saas-card .flag { border:1.5px dashed #dc2626; border-radius:7px; position:relative; padding:10px; margin:-2px; }
        .saas-card .flagtag { position:absolute; top:-9px; left:8px; background:#dc2626; color:#fff; font-size:9.5px; font-weight:700; padding:2px 6px; border-radius:4px; font-family:var(--mono); }
        .saas-body { padding:16px 18px; flex:1; overflow:auto; }
        .saas-row { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid #f3f4f6; font-size:12.5px; }
        .saas-row .name { flex:1; color:#374151; }
        .saas-row .role { font-size:11px; color:#9ca3af; font-family:var(--mono); }
        .saas-row .status { font-size:11px; padding:2px 7px; border-radius:999px; font-family:var(--mono); }
        .saas-row .status.active { background:#dcfce7; color:#16a34a; }
        .saas-api-row { font-family:var(--mono); font-size:11.5px; padding:9px 12px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:7px; margin-bottom:8px; display:flex; align-items:center; justify-content:space-between; }
        .saas-api-row .code { color:#6b7280; }
        .saas-api-row .badge200 { font-size:11px; padding:2px 7px; border-radius:5px; font-weight:700; background:#dcfce7; color:#16a34a; }
        .saas-api-row .badge403 { font-size:11px; padding:2px 7px; border-radius:5px; font-weight:700; background:#fef2f2; color:#dc2626; }
      `}</style>

      {/* top bar */}
      <div className="saas-top">
        <div className="saas-logo"><span className="sq"></span>Orbit</div>
        <div className="saas-nav">
          {navItems.map(n => <span key={n} className={n === activeNav ? "on" : ""}>{n}</span>)}
        </div>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af" }}>ada@northwind.io</span>
      </div>

      <div className="saas-body">
        {/* Dashboard home */}
        {frame === "saas-home" && (
          <>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Dashboard</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[["MRR", "$4,280"], ["Active users", "127"], ["Trials", "14"], ["Churn rate", "2.3%"]].map(([l, v]) => (
                <div className="saas-card" key={l}><div className="label">{l}</div><div className="val">{v}</div></div>
              ))}
            </div>
          </>
        )}

        {/* Billing page */}
        {(frame === "saas-billing" || frame === "saas-downgrade") && (
          <>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Billing</div>
            <div className="saas-card">
              <div className="label">Current plan</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                <span className={"saas-badge " + (frame === "saas-downgrade" ? "free" : "trial")}>
                  {frame === "saas-downgrade" ? "FREE" : "TRIAL"}
                </span>
                <span style={{ fontSize: 13, color: "#6b7280" }}>
                  {frame === "saas-downgrade" ? "Downgraded — features locked" : "12 days remaining"}
                </span>
              </div>
            </div>
            <div className="saas-card">
              <div className="label">Change plan</div>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                {["Trial", "Pro $49", "Business $99"].map(p => (
                  <button key={p} style={{ flex: 1, padding: "6px 0", border: "1px solid #e5e7eb", borderRadius: 7, background: "#f9fafb", fontSize: 12, cursor: "pointer" }}>{p}</button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Plan change mid-trial */}
        {frame === "saas-planChange" && (
          <>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Billing</div>
            <div className="saas-card">
              <div className="label">Current plan</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                <span className="saas-badge pro">PRO</span>
                <span style={{ fontSize: 13, color: "#6b7280" }}>Plan changed mid-trial</span>
              </div>
            </div>
          </>
        )}

        {/* Trial reset (violation) */}
        {frame === "saas-trialReset" && (
          <>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Account</div>
            <div className="saas-card">
              <div className="label">Trial status</div>
              <div style={{ position: "relative", marginTop: 6 }}>
                <div className="flag">
                  <span className="flagtag">INV-01 · trial reset</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div><span style={{ color: "#6b7280", fontSize: 12 }}>trial_ends_at</span></div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "#dc2626", fontWeight: 600 }}>2026-06-12 (reset to +14d)</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#9ca3af" }}>was: 2026-05-29</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* API access on free (violation) */}
        {frame === "saas-apiAccess" && (
          <>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>API · /v1/analytics</div>
            <div className="saas-card">
              <div className="label">Request</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                GET /api/v1/analytics<br />Authorization: Bearer sk-orb-xxx
              </div>
            </div>
            <div className="saas-card" style={{ position: "relative" }}>
              <div className="flag">
                <span className="flagtag">INV-02 · free plan 200</span>
                <div className="label">Response</div>
                <div className="saas-api-row">
                  <span className="code">HTTP/1.1</span>
                  <span className="badge200">200 OK</span>
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#374151", marginTop: 8 }}>
                  {"{"}<br />
                  &nbsp;&nbsp;"mrr": 4280,<br />
                  &nbsp;&nbsp;"users": 127,<br />
                  &nbsp;&nbsp;"plan": "free" <span style={{ color: "#dc2626" }}>// ← should be 403</span><br />
                  {"}"}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Seat overflow (violation) */}
        {frame === "saas-seatOverflow" && (
          <>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Team</div>
            <div style={{ position: "relative", marginBottom: 12 }}>
              <div style={{ border: "1.5px dashed #dc2626", borderRadius: 9, padding: "8px 10px", position: "relative" }}>
                <span style={{ position: "absolute", top: -9, left: 8, background: "#dc2626", color: "#fff", fontSize: "9.5px", fontWeight: 700, padding: "2px 6px", borderRadius: 4, fontFamily: "var(--mono)" }}>INV-03 · 6/5 seats</span>
                <div style={{ fontSize: 12, color: "#dc2626", fontWeight: 600, marginBottom: 6 }}>Seat limit exceeded — 6 of 5</div>
                {["Ada L.", "Bo W.", "Cal R.", "Dee M.", "Eve S.", "Finn T. (over limit)"].map((n, i) => (
                  <div className="saas-row" key={n}>
                    <div className="name">{n}</div>
                    <span className="role">member</span>
                    <span className={"status " + (i < 5 ? "active" : "")} style={i >= 5 ? { background: "#fef2f2", color: "#dc2626" } : {}}>{i < 5 ? "active" : "active ⚠"}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   BANKING — Flux transfer frames
   ============================================================ */
function BankingFrame({ frame }: { frame: FrameId }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#f8fafc", color: "#0f172a", fontFamily: "var(--font)" }}>
      <style>{`
        .bank-top { display:flex; align-items:center; gap:10px; padding:11px 18px; border-bottom:1px solid #e2e8f0; background:#fff; }
        .bank-logo { font-weight:700; font-size:14px; letter-spacing:-0.02em; color:#0284c7; display:flex; align-items:center; gap:6px; }
        .bank-logo .sq { width:14px; height:14px; border-radius:4px; background:linear-gradient(135deg,#0284c7,#0ea5e9); }
        .bank-nav { display:flex; gap:2px; margin-left:18px; }
        .bank-nav span { font-size:12.5px; padding:4px 10px; border-radius:6px; color:#64748b; }
        .bank-nav span.on { background:#f1f5f9; color:#0f172a; font-weight:500; }
        .bank-body { padding:16px 18px; flex:1; overflow:auto; }
        .bank-card { background:#fff; border:1px solid #e2e8f0; border-radius:10px; padding:14px 16px; margin-bottom:12px; font-size:12.5px; }
        .bank-label { font-size:11px; color:#64748b; margin-bottom:4px; font-family:var(--mono); letter-spacing:.06em; text-transform:uppercase; }
        .bank-amount { font-size:22px; font-weight:700; font-family:var(--mono); }
        .bank-field { border:1px solid #e2e8f0; border-radius:7px; padding:8px 12px; font-size:13px; margin-bottom:8px; font-family:var(--mono); color:#475569; }
        .bank-flag { border:1.5px dashed #dc2626; border-radius:8px; padding:10px; position:relative; margin:-2px; }
        .bank-flagtag { position:absolute; top:-9px; left:8px; background:#dc2626; color:#fff; font-size:9.5px; font-weight:700; padding:2px 6px; border-radius:4px; font-family:var(--mono); }
        .bank-tx { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #f1f5f9; font-size:12.5px; }
        .bank-tx .ref { font-family:var(--mono); font-size:11px; color:#94a3b8; }
        .bank-tx .neg { color:#dc2626; font-family:var(--mono); font-weight:600; }
        .bank-tx .pos { color:#16a34a; font-family:var(--mono); font-weight:600; }
      `}</style>

      <div className="bank-top">
        <div className="bank-logo"><span className="sq"></span>Flux</div>
        <div className="bank-nav">
          {["Overview", "Transfer", "History", "Cards"].map(n => (
            <span key={n} className={
              (frame === "bank-home" && n === "Overview") ||
              (["bank-transfer","bank-negTransfer","bank-transfer1","bank-transfer2"].includes(frame) && n === "Transfer") ||
              (frame === "bank-overdraft" && n === "Overview")
                ? "on" : ""
            }>{n}</span>
          ))}
        </div>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#94a3b8" }}>ada@northwind.io</span>
      </div>

      <div className="bank-body">
        {/* Account overview */}
        {frame === "bank-home" && (
          <>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Account overview</div>
            <div className="bank-card">
              <div className="bank-label">Available balance</div>
              <div className="bank-amount" style={{ color: "#0f172a" }}>$1,200.00</div>
            </div>
            <div className="bank-card">
              <div className="bank-label">Recent transactions</div>
              {[["T-0039", "Amazon", "-$49.99"], ["T-0038", "Salary", "+$3,200.00"], ["T-0037", "Netflix", "-$15.99"]].map(([ref, name, amount]) => (
                <div className="bank-tx" key={ref}>
                  <div><div style={{ fontWeight: 500 }}>{name}</div><div className="ref">{ref}</div></div>
                  <span className={amount.startsWith("+") ? "pos" : "neg"}>{amount}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Transfer form */}
        {frame === "bank-transfer" && (
          <>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>New transfer</div>
            <div className="bank-card">
              <div className="bank-label">Amount</div>
              <div className="bank-field">-500</div>
              <div className="bank-label">Recipient</div>
              <div className="bank-field">acc_recipient_123</div>
              <div className="bank-label">Reference</div>
              <div className="bank-field">T-0041</div>
            </div>
          </>
        )}

        {/* Negative transfer processed (violation) */}
        {frame === "bank-negTransfer" && (
          <>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Transfer result</div>
            <div className="bank-card" style={{ position: "relative" }}>
              <div className="bank-flag">
                <span className="bank-flagtag">INV-01 · negative amount</span>
                <div className="bank-label">Status</div>
                <div style={{ color: "#dc2626", fontWeight: 600, fontSize: 13, marginBottom: 8 }}>● PROCESSED — -$500.00</div>
                <div className="bank-tx">
                  <div><div style={{ fontWeight: 500 }}>Transfer to acc_recipient_123</div><div className="ref">T-0041</div></div>
                  <span className="neg">-$500.00</span>
                </div>
                <div style={{ fontSize: 11.5, color: "#dc2626", marginTop: 8, fontFamily: "var(--mono)" }}>recipient.balance -= 500 ← wrong direction</div>
              </div>
            </div>
          </>
        )}

        {/* First transfer OK */}
        {frame === "bank-transfer1" && (
          <>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Transfer #T-0041</div>
            <div className="bank-card">
              <div className="bank-label">Status</div>
              <div style={{ color: "#16a34a", fontWeight: 600, fontSize: 13, marginBottom: 8 }}>● COMPLETED</div>
              <div className="bank-tx"><div><div style={{ fontWeight: 500 }}>Transfer</div><div className="ref">T-0041</div></div><span className="neg">-$200.00</span></div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>Balance: $1,000.00</div>
            </div>
          </>
        )}

        {/* Duplicate transfer (violation) */}
        {frame === "bank-transfer2" && (
          <>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Transfers</div>
            <div className="bank-card" style={{ position: "relative" }}>
              <div className="bank-flag">
                <span className="bank-flagtag">INV-02 · duplicate accepted</span>
                <div className="bank-label">Recent</div>
                {[["T-0042","Same ref accepted","neg","-$200.00"], ["T-0041","Original transfer","neg","-$200.00"]].map(([ref, name, cls, amount]) => (
                  <div className="bank-tx" key={ref}>
                    <div><div style={{ fontWeight: 500 }}>{name}</div><div className="ref">{ref}</div></div>
                    <span className={cls}>{amount}</span>
                  </div>
                ))}
                <div style={{ fontSize: 11.5, color: "#dc2626", marginTop: 8, fontFamily: "var(--mono)" }}>total_debited = $400 (expected $200)</div>
              </div>
            </div>
          </>
        )}

        {/* Overdraft (violation) */}
        {frame === "bank-overdraft" && (
          <>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Account overview</div>
            <div className="bank-card" style={{ position: "relative" }}>
              <div className="bank-flag">
                <span className="bank-flagtag">INV-03 · balance negative</span>
                <div className="bank-label">Available balance</div>
                <div className="bank-amount" style={{ color: "#dc2626" }}>-$4.99</div>
                <div style={{ fontSize: 11.5, color: "#dc2626", marginTop: 8, fontFamily: "var(--mono)" }}>transfer $1200 + fee $4.99 → -$4.99</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---- presentational frame dispatcher for the browser preview ---- */
export function ShopFrame({ frame }: { frame: FrameId }) {
  if (frame.startsWith("saas-")) return <SaasFrame frame={frame} />;
  if (frame.startsWith("bank-")) return <BankingFrame frame={frame} />;

  let body: React.ReactNode;
  let count = 3;
  switch (frame) {
    case "home":
      body = <HomeBody />;
      count = 0;
      break;
    case "cart":
      body = <CartBody qtyA={1} couponPct={0} />;
      break;
    case "cartQty":
      body = <CartBody qtyA={-2} couponPct={0} />;
      break;
    case "cartNeg":
      body = <CartBody qtyA={-2} couponPct={0} flag="qty" />;
      break;
    case "coupon1":
      body = <CartBody qtyA={1} couponPct={0.2} couponCount={1} />;
      break;
    case "coupon3":
      body = <CartBody qtyA={1} couponPct={0.6} couponCount={3} flag="coupon" />;
      break;
    case "checkout":
      body = <CheckoutBody />;
      break;
    case "orderPaid":
      body = <OrderBody flag={true} />;
      break;
    default:
      body = <CartBody qtyA={1} couponPct={0} />;
  }
  return (
    <div className="shop">
      <ShopTop count={count} />
      {body}
    </div>
  );
}

/* ---- a genuinely vulnerable, pokeable store for the standalone page ---- */
export function ShopApp() {
  const [qtyA, setQtyA] = useState(1);
  const [couponCount, setCouponCount] = useState(0);
  const couponPct = Math.min(couponCount * 0.2, 1);
  const badQty = qtyA < 1;
  return (
    <div
      className="shop"
      style={{
        maxWidth: 560,
        margin: "0 auto",
        borderLeft: "1px solid var(--s-line)",
        borderRight: "1px solid var(--s-line)",
      }}
    >
      <ShopTop count={3} />
      <CartBody
        qtyA={qtyA}
        couponPct={couponPct}
        couponCount={couponCount}
        flag={badQty ? "qty" : couponCount > 1 ? "coupon" : null}
        onQty={(v) => setQtyA(isNaN(v) ? 0 : v)}
        onCoupon={() => setCouponCount((c) => c + 1)}
      />
    </div>
  );
}
