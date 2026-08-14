import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="state-container" style={{ marginTop: "4rem" }}>
      <h1 style={{ fontSize: "5rem", color: "#6366f1", marginBottom: "1rem" }}>404</h1>
      <h3>Page Not Found</h3>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Link to="/dashboard" className="btn btn-primary">
        Back to Dashboard
      </Link>
    </div>
  );
}
