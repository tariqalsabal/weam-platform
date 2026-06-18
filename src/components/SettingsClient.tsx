"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Partner = { id: number; name: string; gender: string | null };
type Profile = {
  name: string;
  phoneCall: string;
  email: string | null;
  phoneWhats: string | null;
  address: string | null;
};

export default function SettingsClient({ profile, partners }: { profile: Profile; partners: Partner[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email || "",
    phoneWhats: profile.phoneWhats || "",
    address: profile.address || "",
  });
  const [savedMsg, setSavedMsg] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [newName, setNewName] = useState("");
  const [newGender, setNewGender] = useState("أنثى");
  const [addingPartner, setAddingPartner] = useState(false);

  async function saveProfile() {
    setSavingProfile(true);
    setSavedMsg("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSavedMsg("تم الحفظ ✓");
        router.refresh();
      }
    } finally {
      setSavingProfile(false);
    }
  }

  async function addPartner() {
    if (!newName.trim()) return;
    setAddingPartner(true);
    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, gender: newGender }),
      });
      if (res.ok) {
        setNewName("");
        router.refresh();
      }
    } finally {
      setAddingPartner(false);
    }
  }

  async function deletePartner(id: number) {
    const res = await fetch(`/api/partners?id=${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "تعذّر الحذف");
    }
  }

  return (
    <div className="weam-wrap">
      {/* الملف الشخصي */}
      <div className="weam-section-title">بياناتي</div>
      <div className="weam-glass mb-6 p-6">
        <div className="weam-field">
          <label className="weam-label">الاسم</label>
          <input className="weam-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="weam-field">
          <label className="weam-label">الهاتف (للدخول)</label>
          <input className="weam-input" value={profile.phoneCall} disabled dir="ltr" style={{ opacity: 0.6 }} />
        </div>
        <div className="grid gap-x-4 sm:grid-cols-2">
          <div className="weam-field">
            <label className="weam-label">واتساب</label>
            <input className="weam-input" value={form.phoneWhats} onChange={(e) => setForm({ ...form, phoneWhats: e.target.value })} dir="ltr" />
          </div>
          <div className="weam-field">
            <label className="weam-label">البريد</label>
            <input className="weam-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} dir="ltr" />
          </div>
        </div>
        <div className="weam-field">
          <label className="weam-label">العنوان</label>
          <input className="weam-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="flex items-center gap-3">
          <button className="weam-btn" onClick={saveProfile} disabled={savingProfile}>
            {savingProfile ? "جارٍ الحفظ…" : "حفظ البيانات"}
          </button>
          {savedMsg && <span style={{ color: "var(--green)" }}>{savedMsg}</span>}
        </div>
      </div>

      {/* أطراف الأسرة */}
      <div className="weam-section-title">أطراف أسرتي</div>
      <div className="weam-glass p-6">
        <div className="mb-4 flex flex-col gap-2.5">
          {partners.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--txt-mut)" }}>
              لا توجد أطراف بعد — أضِف طرفاً لتتمكن من إجراء تقييم له.
            </p>
          ) : (
            partners.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "var(--glass-2)", border: "1px solid var(--line)" }}>
                <span className="font-bold">
                  {p.name} <span style={{ color: "var(--txt-mut)" }}>· {p.gender || "—"}</span>
                </span>
                <button onClick={() => deletePartner(p.id)} className="text-sm font-bold" style={{ color: "var(--red)" }}>
                  حذف
                </button>
              </div>
            ))
          )}
        </div>

        <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_auto]">
          <div>
            <label className="weam-label">اسم الطرف</label>
            <input className="weam-input" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="زوجة 1 / ابن ..." />
          </div>
          <div>
            <label className="weam-label">النوع</label>
            <select className="weam-input" value={newGender} onChange={(e) => setNewGender(e.target.value)}>
              <option className="text-black">أنثى</option>
              <option className="text-black">ذكر</option>
            </select>
          </div>
          <button className="weam-btn success" onClick={addPartner} disabled={addingPartner} style={{ height: 48 }}>
            {addingPartner ? "…" : "إضافة"}
          </button>
        </div>
      </div>
    </div>
  );
}
