import { useState } from "react";
import { stages, today, safeUrl } from "../lib/applications";
export default function ApplicationForm({ application, onSave, onCancel }) {
  const [form, setForm] = useState({
    company: application.company || "",
    role: application.role || "",
    stage: application.stage || "Saved",
    date: application.date || today(),
    followUp: application.followUp || "",
    url: application.url || "",
    notes: application.notes || "",
  });
  const [error, setError] = useState("");
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  function submit(e) {
    e.preventDefault();
    const url = safeUrl(form.url);
    if (!form.company.trim() || !form.role.trim()) {
      setError("Enter a company and role.");
      return;
    }
    if (url === null) {
      setError("Use a complete http or https job link.");
      return;
    }
    onSave({
      ...form,
      company: form.company.trim(),
      role: form.role.trim(),
      notes: form.notes.trim(),
      url,
    });
  }
  return (
    <form className="form" onSubmit={submit}>
      <div className="form-row">
        <label>
          Company
          <input
            autoFocus
            name="company"
            required
            maxLength={90}
            value={form.company}
            onChange={update}
            placeholder="e.g. Demo Studio"
          />
        </label>
        <label>
          Role
          <input
            name="role"
            required
            maxLength={120}
            value={form.role}
            onChange={update}
            placeholder="e.g. Frontend Intern"
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          Stage
          <select name="stage" value={form.stage} onChange={update}>
            {stages.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </select>
        </label>
        <label>
          Date added
          <input
            name="date"
            type="date"
            required
            value={form.date}
            onChange={update}
          />
        </label>
      </div>
      <label>
        Follow-up date (optional)
        <input
          name="followUp"
          type="date"
          value={form.followUp}
          onChange={update}
        />
      </label>
      <label>
        Job link (optional)
        <input
          type="url"
          name="url"
          maxLength={500}
          value={form.url}
          onChange={update}
          placeholder="https://example.com/careers"
        />
      </label>
      <label>
        Notes
        <textarea
          name="notes"
          rows={3}
          maxLength={2000}
          value={form.notes}
          onChange={update}
          placeholder="What interests you? What is your next step?"
        />
      </label>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <div className="form-actions">
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="primary">Save application</button>
      </div>
    </form>
  );
}
