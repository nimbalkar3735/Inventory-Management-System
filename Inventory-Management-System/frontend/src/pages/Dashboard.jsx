import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStockCount: 0,
    totalValue: 0,
  });
  const [lowStockList, setLowStockList] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [productsRes, categoriesRes, lowStockRes] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
        api.get("/products/low-stock"),
      ]);

      const products = productsRes.data || [];
      const categories = categoriesRes.data || [];
      const lowStock = lowStockRes.data || [];

      const totalVal = products.reduce(
        (sum, p) => sum + (Number(p.price) || 0) * (Number(p.quantity) || 0),
        0
      );

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        lowStockCount: lowStock.length,
        totalValue: totalVal,
      });

      setLowStockList(lowStock);
      setRecentProducts(products.slice(-5).reverse());
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="state-container">
        <h3>Loading Dashboard...</h3>
        <p>Fetching inventory summary and real-time metrics.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-container">
        <h3 style={{ color: "#dc2626" }}>Connection Error</h3>
        <p>{error}</p>
        <button onClick={loadDashboardData} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Inventory Dashboard</h1>
          <p>Real-time overview of products, stock levels, and inventory value.</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/products/new" className="btn btn-primary">
            + Add Product
          </Link>
          <Link to="/categories" className="btn btn-secondary">
            Manage Categories
          </Link>
        </div>
      </div>

      <div className="grid-stats">
        <div className="stat-card">
          <div className="stat-icon indigo">📦</div>
          <div className="stat-info">
            <h3>Total Products</h3>
            <div className="stat-value">{stats.totalProducts}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon emerald">🏷️</div>
          <div className="stat-info">
            <h3>Categories</h3>
            <div className="stat-value">{stats.totalCategories}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">⚠️</div>
          <div className="stat-info">
            <h3>Low Stock Alert</h3>
            <div className="stat-value" style={{ color: stats.lowStockCount > 0 ? "#b45309" : undefined }}>
              {stats.lowStockCount}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">💰</div>
          <div className="stat-info">
            <h3>Total Value</h3>
            <div className="stat-value">${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      {/* Low Stock Warning Banner */}
      {stats.lowStockCount > 0 && (
        <div className="alert alert-error dashboard-alert">
          <div>
            <strong>Attention:</strong> You have {stats.lowStockCount} item(s) running low on stock!
          </div>
          <Link to="/low-stock" className="btn btn-sm btn-danger">
            View Low Stock Items
          </Link>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Recent Products Card */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 style={{ fontSize: "1.1rem" }}>Recently Added Products</h3>
            <Link to="/products" style={{ color: "#4f46e5", fontSize: "0.85rem", textDecoration: "none", fontWeight: "600" }}>
              View All →
            </Link>
          </div>
          {recentProducts.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>No products added yet.</p>
          ) : (
            <div className="dashboard-table-scroll">
              <table className="table">
                <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td><code style={{ fontSize: "0.8rem", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>{p.sku}</code></td>
                    <td>${Number(p.price).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${p.quantity === 0 ? "badge-out" : p.quantity < 5 ? "badge-low" : "badge-normal"}`}>
                        {p.quantity}
                      </span>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Items Card */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 style={{ fontSize: "1.1rem" }}>Low Stock Watchlist</h3>
            <Link to="/low-stock" style={{ color: "#4f46e5", fontSize: "0.85rem", textDecoration: "none", fontWeight: "600" }}>
              Manage Stock →
            </Link>
          </div>
          {lowStockList.length === 0 ? (
            <p style={{ color: "#166534", fontSize: "0.9rem", background: "#dcfce7", padding: "0.75rem", borderRadius: "6px" }}>
              ✅ All products are well-stocked above threshold.
            </p>
          ) : (
            <div className="dashboard-table-scroll">
              <table className="table">
                <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Remaining</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lowStockList.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.categoryName || p.category?.name || "Uncategorized"}</td>
                    <td>
                      <span className="badge badge-low">{p.quantity} left</span>
                    </td>
                    <td>
                      <Link to={`/products/edit/${p.id}`} className="btn btn-sm btn-update">
                        Update
                      </Link>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}