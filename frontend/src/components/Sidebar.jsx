import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/applications", label: "Applications" },
  { to: "/applications/new", label: "Add Application" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand"><span>PT</span> PlacementTrack</div>
      <p className="sidebar-caption">Campus placement organizer</p>
      <nav>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} end={link.end} className="nav-link">
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
