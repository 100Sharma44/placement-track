import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApplicationForm from "../components/ApplicationForm";
import { api } from "../services/api";

export default function EditApplication() {
  const { id } = useParams(); const navigate = useNavigate(); const [application, setApplication] = useState(null); const [error, setError] = useState("");
  useEffect(() => { api.getApplication(id).then(setApplication).catch((requestError) => setError(requestError.message)); }, [id]);
  async function saveApplication(data) { await api.updateApplication(id, data); navigate("/applications"); }
  if (error) return <p className="error-message">Could not load application: {error}</p>;
  if (!application) return <p className="loading">Loading application...</p>;
  return <section><div className="page-heading"><div><h1>Edit Application</h1><p>Update the details or application status.</p></div></div><div className="panel form-panel"><ApplicationForm initialApplication={application} onSubmit={saveApplication} submitLabel="Update Application" /></div></section>;
}
