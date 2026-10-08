import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AddApplication from "./pages/AddApplication";
import Applications from "./pages/Applications";
import Dashboard from "./pages/Dashboard";
import EditApplication from "./pages/EditApplication";

export default function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/new" element={<AddApplication />} />
          <Route path="/applications/:id/edit" element={<EditApplication />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
