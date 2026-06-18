import { useState } from "react";

const genNo = () => "RCP-" + Date.now().toString().slice(-8);

const THEMES = {
  light: {
    id: "light", label: "Light", icon: "○",
    bg: "#F4F6F9", panel: "#FFFFFF", border: "#E2E8F0",
    text: "#0F172A", muted: "#64748B", accent: "#2563EB",
    accentFg: "#FFFFFF", input: "#F8FAFC", inputBorder: "#CBD5E1",
    divider: "#F1F5F9", receiptBg: "#FFFFFF",
    shadow: "0 1px 4px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)",
    totalBg: "#EFF6FF", sectionLabel: "#2563EB",
  },
  dark: {
    id: "dark", label: "Dark", icon: "●",
    bg: "#09090D", panel: "#111118", border: "#1E1E2E",
    text: "#E2E8F0", muted: "#4A5568", accent: "#818CF8",
    accentFg: "#FFFFFF", input: "#0D0D15", inputBorder: "#252535",
    divider: "#161622", receiptBg: "#111118",
    shadow: "0 2px 8px rgba(0,0,0,0.6), 0 12px 40px rgba(0,0,0,0.4)",
    totalBg: "#1A1A30", sectionLabel: "#818CF8",
  },
  ethereal: {
    id: "ethereal", label: "✦ Ethereal", icon: "✦",
    bg: "transparent", panel: "rgba(255,255,255,0.07)", border: "rgba(255,255,255,0.12)",
    text: "#F8FAFF", muted: "rgba(255,255,255,0.5)", accent: "#C4B5FD",
    accentFg: "#1A0A3C", input: "rgba(255,255,255,0.05)", inputBorder: "rgba(255,255,255,0.14)",
    divider: "rgba(255,255,255,0.06)", receiptBg: "rgba(255,255,255,0.04)",
    shadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)",
    totalBg: "rgba(196,181,253,0.14)", sectionLabel: "#C4B5FD",
  },
};

const fmt = (n) =>
  "₦" + parseFloat(n || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function ReceiptGenerator() {
  const [themeId, setThemeId] = useState("light");
  const T = THEMES[themeId];
  const isEthereal = themeId === "ethereal";
  const blur = isEthereal ? "blur(20px)" : "none";

  const [biz, setBiz] = useState({
    name: "Your Business Name",
    address: "123 Lagos Island, Lagos",
    phone: "+234 800 000 0000",
    email: "hello@yourbusiness.com",
  });

  const [customer, setCustomer] = useState({ name: "", email: "", phone: "", address: "" });
  const [meta, setMeta] = useState({ number: genNo(), date: new Date().toISOString().split("T")[0], notes: "Thank you for your business!" });
  const [items, setItems] = useState([{ id: 1, desc: "Service / Product", qty: 1, rate: "" }]);
  const [tax, setTax] = useState("7.5");

  const addItem = () => setItems(p => [...p, { id: Date.now(), desc: "", qty: 1, rate: "" }]);
  const removeItem = (id) => setItems(p => p.filter(i => i.id !== id));
  const updateItem = (id, k, v) => setItems(p => p.map(i => i.id === id ? { ...i, [k]: v } : i));

  const subtotal = items.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.rate) || 0), 0);
  const taxAmt = subtotal * (parseFloat(tax) || 0) / 100;
  const total = subtotal + taxAmt;

  const inp = (extra = {}) => ({
    background: T.input, border: `1px solid ${T.inputBorder}`, color: T.text,
    borderRadius: 8, padding: "8px 11px", fontSize: 13, width: "100%",
    outline: "none", fontFamily: "inherit", backdropFilter: blur,
    transition: "border-color 0.15s, box-shadow 0.15s", boxSizing: "border-box",
    ...extra,
  });

  const card = (extra = {}) => ({
    background: T.panel, border: `1px solid ${T.border}`, borderRadius: 14,
    padding: 18, marginBottom: 12, backdropFilter: blur, boxShadow: T.shadow,
    ...extra,
  });

  const lbl = { fontSize: 10.5, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5, display: "block" };
  const secTitle = { fontSize: 11, fontWeight: 800, color: T.sectionLabel, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", position: "relative", overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        input:focus, textarea:focus, select:focus { outline: none !important; border-color: ${T.accent} !important; box-shadow: 0 0 0 3px ${T.accent}28 !important; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.4; }
        input::placeholder, textarea::placeholder { color: ${T.muted}; opacity: 0.6; }
        textarea { resize: vertical; }
        button { font-family: inherit; }
        @keyframes a1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(4%,6%) scale(1.06)} }
        @keyframes a2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-5%,-4%) scale(1.09)} }
        @keyframes a3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(3%,-5%) scale(0.94)} }
        @media print {
          .no-print { display: none !important; }
          #receipt { box-shadow: none !important; border: none !important; padding: 0 !important; }
          body { background: white !important; }
        }
      `}</style>

      {/* Ethereal BG */}
      {isEthereal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 0, background: "linear-gradient(135deg,#0F0524 0%,#0A1030 40%,#12082A 100%)", pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-15%", left: "-5%", width: "55%", height: "55%", background: "radial-gradient(ellipse,rgba(124,58,237,0.45) 0%,transparent 65%)", filter: "blur(50px)", animation: "a1 9s ease-in-out infinite" }} />
          <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "50%", height: "50%", background: "radial-gradient(ellipse,rgba(20,184,166,0.35) 0%,transparent 65%)", filter: "blur(50px)", animation: "a2 11s ease-in-out infinite" }} />
          <div style={{ position: "absolute", top: "45%", left: "45%", width: "40%", height: "40%", background: "radial-gradient(ellipse,rgba(236,72,153,0.25) 0%,transparent 65%)", filter: "blur(60px)", animation: "a3 13s ease-in-out infinite" }} />
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1300, margin: "0 auto", padding: "20px 16px 40px" }}>

        {/* Header */}
        <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: T.text, letterSpacing: "-0.04em", lineHeight: 1 }}>Receipt Generator</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>Professional receipts for your Nigerian business</div>
          </div>
          <div style={{ display: "flex", gap: 4, background: T.panel, border: `1px solid ${T.border}`, borderRadius: 12, padding: 4, backdropFilter: blur }}>
            {Object.values(THEMES).map(th => (
              <button key={th.id} onClick={() => setThemeId(th.id)} style={{
                padding: "7px 16px", borderRadius: 9, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 700, letterSpacing: "-0.01em",
                background: themeId === th.id ? T.accent : "transparent",
                color: themeId === th.id ? T.accentFg : T.muted,
                transition: "all 0.18s",
              }}>{th.label}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>

          {/* ── LEFT FORM ── */}
          <div className="no-print">

            {/* Business */}
            <div style={card()}>
              <div style={secTitle}>Your Business</div>
              <div style={{ display: "grid", gap: 10 }}>
                {[["Business Name","name"],["Address","address"],["Phone","phone"],["Email","email"]].map(([l,k]) => (
                  <div key={k}>
                    <label style={lbl}>{l}</label>
                    <input style={inp()} value={biz[k]} onChange={e => setBiz(p => ({...p,[k]:e.target.value}))} placeholder={l} />
                  </div>
                ))}
              </div>
            </div>

            {/* Customer */}
            <div style={card()}>
              <div style={secTitle}>Bill To (Customer)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[["Name","name"],["Email","email"],["Phone","phone"],["Address","address"]].map(([l,k]) => (
                  <div key={k} style={{ gridColumn: k === "address" ? "1/-1" : "auto" }}>
                    <label style={lbl}>{l}</label>
                    <input style={inp()} value={customer[k]} onChange={e => setCustomer(p=>({...p,[k]:e.target.value}))} placeholder={l} />
                  </div>
                ))}
              </div>
            </div>

            {/* Receipt details */}
            <div style={card()}>
              <div style={secTitle}>Receipt Details</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={lbl}>Receipt No.</label>
                  <input style={inp()} value={meta.number} onChange={e => setMeta(p=>({...p,number:e.target.value}))} />
                </div>
                <div>
                  <label style={lbl}>Date</label>
                  <input style={inp({ colorScheme: themeId !== "light" ? "dark" : "light" })} type="date" value={meta.date} onChange={e => setMeta(p=>({...p,date:e.target.value}))} />
                </div>
              </div>
            </div>

            {/* Line items */}
            <div style={card()}>
              <div style={secTitle}>Line Items</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 52px 88px 78px 24px", gap: 6, marginBottom: 8 }}>
                {["Description","Qty","Rate (₦)","Amount",""].map((h,i) => (
                  <div key={i} style={lbl}>{h}</div>
                ))}
              </div>
              {items.map(item => {
                const amt = (parseFloat(item.qty)||0)*(parseFloat(item.rate)||0);
                return (
                  <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr 52px 88px 78px 24px", gap: 6, marginBottom: 6 }}>
                    <input style={inp()} value={item.desc} onChange={e => updateItem(item.id,"desc",e.target.value)} placeholder="Description" />
                    <input style={inp({textAlign:"center"})} type="number" min="0" value={item.qty} onChange={e => updateItem(item.id,"qty",e.target.value)} />
                    <input style={inp({textAlign:"right"})} type="number" min="0" step="0.01" value={item.rate} onChange={e => updateItem(item.id,"rate",e.target.value)} placeholder="0" />
                    <div style={{ background: T.divider, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 10px", fontSize: 12, color: T.muted, textAlign: "right", display:"flex",alignItems:"center",justifyContent:"flex-end" }}>
                      {fmt(amt)}
                    </div>
                    <button onClick={() => removeItem(item.id)} style={{ background:"none",border:"none",color:"#EF4444",cursor:"pointer",fontSize:18,lineHeight:1,padding:0,display:"flex",alignItems:"center",justifyContent:"center" }}>×</button>
                  </div>
                );
              })}
              <button onClick={addItem} style={{ marginTop: 8, width:"100%", background:"transparent", border:`1.5px dashed ${T.accent}`, color:T.accent, borderRadius:9, padding:"9px 0", cursor:"pointer", fontSize:13, fontWeight:700 }}>
                + Add Item
              </button>
            </div>

            {/* Tax & Notes */}
            <div style={card()}>
              <div style={secTitle}>Tax & Notes</div>
              <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12, alignItems: "start" }}>
                <div>
                  <label style={lbl}>Tax Rate (%)</label>
                  <input style={inp()} type="number" min="0" max="100" step="0.5" value={tax} onChange={e=>setTax(e.target.value)} placeholder="0" />
                </div>
                <div>
                  <label style={lbl}>Notes / Terms</label>
                  <textarea style={inp({minHeight:72,lineHeight:1.5})} value={meta.notes} onChange={e=>setMeta(p=>({...p,notes:e.target.value}))} placeholder="Payment terms, thank you note..." />
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT PREVIEW ── */}
          <div>
            <div className="no-print" style={{ display:"flex", gap:8, marginBottom:12 }}>
              <button onClick={() => window.print()} style={{
                flex:1, background:T.accent, color:T.accentFg, border:"none", borderRadius:11,
                padding:"13px 0", fontSize:14, fontWeight:800, cursor:"pointer", letterSpacing:"-0.02em",
              }}>⬇ Download / Print PDF</button>
              <button onClick={() => setMeta(p=>({...p,number:genNo()}))} title="Generate new receipt number" style={{
                background:T.panel, border:`1px solid ${T.border}`, color:T.muted, borderRadius:11,
                padding:"13px 16px", fontSize:12, cursor:"pointer", backdropFilter:blur, fontWeight:700,
              }}>↻ New #</button>
            </div>

            {/* Receipt */}
            <div id="receipt" style={{
              background: T.receiptBg, border:`1px solid ${T.border}`, borderRadius:16,
              padding:32, boxShadow:T.shadow, backdropFilter:blur, color:T.text,
            }}>
              {/* Top */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:26 }}>
                <div>
                  <div style={{ fontSize:22, fontWeight:900, color:T.text, letterSpacing:"-0.04em", lineHeight:1.1 }}>{biz.name||"Business Name"}</div>
                  <div style={{ fontSize:12, color:T.muted, marginTop:6, lineHeight:1.7 }}>
                    {biz.address && <div>{biz.address}</div>}
                    {biz.phone && <div>{biz.phone}</div>}
                    {biz.email && <div>{biz.email}</div>}
                  </div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:26, fontWeight:900, color:T.accent, letterSpacing:"-0.04em" }}>RECEIPT</div>
                  <div style={{ fontSize:12, color:T.muted, marginTop:5, lineHeight:1.7 }}>
                    <div style={{ fontWeight:600 }}># {meta.number}</div>
                    <div>{meta.date}</div>
                  </div>
                </div>
              </div>

              <div style={{ height:1, background:T.border, marginBottom:20 }} />

              {/* Bill To */}
              {(customer.name||customer.email||customer.phone||customer.address) && (
                <div style={{ marginBottom:22 }}>
                  <div style={{ fontSize:10, fontWeight:800, color:T.accent, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Bill To</div>
                  {customer.name && <div style={{ fontSize:14, fontWeight:700, color:T.text }}>{customer.name}</div>}
                  <div style={{ fontSize:12, color:T.muted, lineHeight:1.7, marginTop:2 }}>
                    {customer.email && <div>{customer.email}</div>}
                    {customer.phone && <div>{customer.phone}</div>}
                    {customer.address && <div>{customer.address}</div>}
                  </div>
                </div>
              )}

              {/* Items */}
              <div style={{ marginBottom:20 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 44px 88px 88px", gap:8, paddingBottom:10, borderBottom:`1px solid ${T.border}` }}>
                  {["Description","Qty","Rate","Amount"].map((h,i) => (
                    <div key={h} style={{ fontSize:10, fontWeight:800, color:T.muted, textTransform:"uppercase", letterSpacing:"0.08em", textAlign:i>0?"right":"left" }}>{h}</div>
                  ))}
                </div>
                {items.map(item => {
                  const amt=(parseFloat(item.qty)||0)*(parseFloat(item.rate)||0);
                  return (
                    <div key={item.id} style={{ display:"grid", gridTemplateColumns:"1fr 44px 88px 88px", gap:8, padding:"10px 0", borderBottom:`1px solid ${T.divider}` }}>
                      <div style={{ fontSize:13, color:T.text }}>{item.desc||"—"}</div>
                      <div style={{ fontSize:13, color:T.muted, textAlign:"right" }}>{item.qty}</div>
                      <div style={{ fontSize:13, color:T.muted, textAlign:"right" }}>{fmt(item.rate)}</div>
                      <div style={{ fontSize:13, color:T.text, fontWeight:700, textAlign:"right" }}>{fmt(amt)}</div>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div style={{ display:"flex", justifyContent:"flex-end" }}>
                <div style={{ width:220 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", fontSize:13 }}>
                    <span style={{ color:T.muted }}>Subtotal</span>
                    <span style={{ color:T.text }}>{fmt(subtotal)}</span>
                  </div>
                  {parseFloat(tax) > 0 && (
                    <div style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", fontSize:13 }}>
                      <span style={{ color:T.muted }}>Tax ({tax}%)</span>
                      <span style={{ color:T.text }}>{fmt(taxAmt)}</span>
                    </div>
                  )}
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 16px", background:T.totalBg, borderRadius:10, marginTop:8 }}>
                    <span style={{ fontWeight:900, fontSize:16, color:T.text }}>Total</span>
                    <span style={{ fontWeight:900, fontSize:16, color:T.accent }}>{fmt(total)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {meta.notes && (
                <div style={{ marginTop:22, padding:"12px 14px", background:T.divider, borderRadius:9, borderLeft:`3px solid ${T.accent}` }}>
                  <div style={{ fontSize:10, fontWeight:800, color:T.accent, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>Notes</div>
                  <div style={{ fontSize:12, color:T.muted, lineHeight:1.65 }}>{meta.notes}</div>
                </div>
              )}

              {/* Footer */}
              <div style={{ marginTop:22, textAlign:"center", fontSize:11, color:T.muted, borderTop:`1px solid ${T.border}`, paddingTop:14 }}>
                {biz.name} · {biz.phone} · {biz.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
