import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { JOB_TYPES, STATUSES } from "../components/ApplicationForm";
import { api } from "../services/api";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({ company: "", status: "", job_type: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function loadApplications(activeFilters = filters) {
    setLoading(true);
    api.getApplications(activeFilters).then(setApplications).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false));
  }
  useEffect(() => { loadApplications(); }, []);
  function updateFilter(event) { setFilters({ ...filters, [event.target.name]: event.target.value }); }
  function handleFilter(event) { event.preventDefault(); loadApplications(); }
  async function handleDelete(id) {
    if (!window.confirm("Delete this application?")) return;
    try { await api.deleteApplication(id); loadApplications(); } catch (requestError) { setError(requestError.message); }
  }
  const displayDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString() : "—";

  return <section>
    <div className="page-heading"><div><h1>Applications</h1><p>Search, filter, and manage your job applications.</p></div><Link className="primary-button" to="/applications/new">Add Application</Link></div>
    <form className="filters panel" onSubmit={handleFilter}>
      <input name="company" value={filters.company} onChange={updateFilter} placeholder="Search company" />
      <select name="status" value={filters.status} onChange={updateFilter}><option value="">All statuses</option>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select>
      <select name="job_type" value={filters.job_type} onChange={updateFilter}><option value="">All job types</option>{JOB_TYPES.map((item) => <option key={item}>{item}</option>)}</select>
      <button className="secondary-button">Apply Filters</button>
    </form>
    {error && <p className="error-message">{error}</p>}
    <div className="table-panel panel">
      {loading ? <p className="loading">Loading applications...</p> : <table><thead><tr><th>Company</th><th>Role</th><th>Job Type</th><th>Status</th><th>Application Date</th><th>Interview Date</th><th>Package</th><th>Actions</th></tr></thead>
        <tbody>{applications.length === 0 ? <tr><td colSpan="8" className="empty-state">No applications found.</td></tr> : applications.map((application) => <tr key={application.id}><td><strong>{application.company_name}</strong></td><td>{application.role}</td><td>{application.job_type}</td><td><span className="status-badge">{application.application_status}</span></td><td>{displayDate(application.application_date)}</td><td>{displayDate(application.interview_date)}</td><td>{application.package_lpa ? `${application.package_lpa} LPA` : "—"}</td><td className="action-cell"><Link to={`/applications/${application.id}/edit`}>Edit</Link><button onClick={() => handleDelete(application.id)}>Delete</button></td></tr>)}</tbody></table>}
    </div>
  </section>;
}
