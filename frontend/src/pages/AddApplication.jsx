import { useNavigate } from "react-router-dom";
import ApplicationForm from "../components/ApplicationForm";
import { api } from "../services/api";

export default function AddApplication() {
  const navigate = useNavigate();
  async function createApplication(data) { await api.createApplication(data); navigate("/applications"); }
  return <section><div className="page-heading"><div><h1>Add Application</h1><p>Record a company and role you have applied for.</p></div></div><div className="panel form-panel"><ApplicationForm onSubmit={createApplication} submitLabel="Save Application" /></div></section>;
}
