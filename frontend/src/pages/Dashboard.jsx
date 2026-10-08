import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { api } from "../services/api";

const cards = [
  ["Total Applications", "total_applications"], ["Online Assessments", "total_online_assessments"],
  ["Interviews", "total_interviews"], ["Offers", "total_offers"], ["Rejections", "total_rejections"],
];

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getAnalytics().then(setAnalytics).catch((requestError) => setError(requestError.message));
  }, []);

  if (error) return <p className="error-message">Could not load dashboard: {error}</p>;
  if (!analytics) return <p className="loading">Loading dashboard...</p>;

  const chartData = Object.entries(analytics.applications_by_status).map(([name, value]) => ({ name, value }));
  return <section>
    <div className="page-heading"><div><h1>Dashboard</h1><p>See a quick overview of your placement journey.</p></div></div>
    <div className="stat-grid">
      {cards.map(([label, key]) => <article className="stat-card" key={key}><p>{label}</p><strong>{analytics[key]}</strong></article>)}
    </div>
    <section className="panel chart-panel">
      <div className="panel-heading"><div><h2>Applications by Status</h2><p>Interview rate: {analytics.interview_rate}% · Offer rate: {analytics.offer_rate}%</p></div></div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={310}>
          <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#2563eb" radius={[5, 5, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  </section>;
}
