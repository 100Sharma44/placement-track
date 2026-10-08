import { useState } from "react";

export const JOB_TYPES = ["Internship", "Full-Time", "Internship + PPO"];
export const STATUSES = ["Applied", "Online Assessment", "Interview", "Offer", "Rejected"];

const emptyApplication = {
  company_name: "", role: "", job_type: "Internship", application_status: "Applied",
  application_date: new Date().toISOString().slice(0, 10), interview_date: "", location: "",
  package_lpa: "", notes: "",
};

function toFormData(application) {
  if (!application) return emptyApplication;
  return { ...application, interview_date: application.interview_date || "", location: application.location || "", package_lpa: application.package_lpa ?? "", notes: application.notes || "" };
}

export default function ApplicationForm({ initialApplication, onSubmit, submitLabel }) {
  const [formData, setFormData] = useState(() => toFormData(initialApplication));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const data = {
        ...formData,
        interview_date: formData.interview_date || null,
        location: formData.location || null,
        notes: formData.notes || null,
        package_lpa: formData.package_lpa === "" ? null : Number(formData.package_lpa),
      };
      await onSubmit(data);
    } catch (submissionError) {
      setError(submissionError.message);
      setSaving(false);
    }
  }

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}
      <div className="form-grid">
        <label>Company Name *<input name="company_name" value={formData.company_name} onChange={updateField} required /></label>
        <label>Role *<input name="role" value={formData.role} onChange={updateField} required /></label>
        <label>Job Type *<select name="job_type" value={formData.job_type} onChange={updateField}>{JOB_TYPES.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Status *<select name="application_status" value={formData.application_status} onChange={updateField}>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Application Date *<input type="date" name="application_date" value={formData.application_date} onChange={updateField} required /></label>
        <label>Interview Date<input type="date" name="interview_date" value={formData.interview_date} onChange={updateField} /></label>
        <label>Location<input name="location" value={formData.location} onChange={updateField} placeholder="e.g. Bengaluru" /></label>
        <label>Package (LPA)<input type="number" min="0" step="0.1" name="package_lpa" value={formData.package_lpa} onChange={updateField} /></label>
      </div>
      <label>Notes<textarea name="notes" value={formData.notes} onChange={updateField} rows="4" placeholder="Any useful details about this application" /></label>
      <button className="primary-button" disabled={saving}>{saving ? "Saving..." : submitLabel}</button>
    </form>
  );
}
