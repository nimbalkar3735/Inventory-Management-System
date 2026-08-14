import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function LowStock() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Restock modal state
  const [editingProduct, setEditingProduct] = useState(null);
  const [restockQty, setRestockQty] = useState(10);

  const fetchLowStock = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/products/low-stock");
      setLowStockProducts(res.data || []);
    } catch (err) {
      console.error("Error loading low stock products:", err);
      setError(err.response?.data?.message || "Failed to fetch low stock products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
  }, []);

  const handleOpenRestock = (product) => {
    setEditingProduct(product);
    setRestockQty(Math.max(product.quantity + 10, 10));
  };

  const handleSaveRestock = async () => {
    if (!editingProduct) return;
    try {
      await api.patch(`/products/${editingProduct.id}/quantity`, {
        quantity: Number(restockQty),
      });
      setSuccessMessage(`Stock updated for ${editingProduct.name}.`);
      setEditingProduct(null);
      fetchLowStock();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update stock.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Low Stock Alerts</h1>
          <p>Products requiring immediate stock replenishment (Threshold: &lt; 5 units).</p>
        </div>
        <Link to="/products" className="btn btn-secondary">
          View All Products
        </Link>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="state-container">
          <h3>Checking Stock Levels...</h3>
        </div>
      ) : lowStockProducts.length === 0 ? (
        <div className="state-container" style={{ borderColor: "#86efac", background: "#f0fdf4" }}>
          <h3 style={{ color: "#166534" }}>✅ Healthy Inventory</h3>
          <p style={{ color: "#15803d" }}>
            No low-stock products found. All items currently have 5 or more units in stock.
          </p>
          <Link to="/products" className="btn btn-primary">
            Manage Products
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Current Qty</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Restock</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((p) => {
                const isOut = p.quantity === 0;
                return (
                  <tr key={p.id}>
                    <td>
                      <strong>{p.name}</strong>
                    </td>
                    <td>
                      <code style={{ fontSize: "0.8rem", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                        {p.sku}
                      </code>
                    </td>
                    <td>{p.categoryName || p.category?.name || "Uncategorized"}</td>
                    <td>${Number(p.price).toFixed(2)}</td>
                    <td>
                      <strong style={{ color: isOut ? "#dc2626" : "#b45309" }}>{p.quantity}</strong>
                    </td>
                    <td>
                      <span className={`badge ${isOut ? "badge-out" : "badge-low"}`}>
                        {isOut ? "Out of Stock" : "Low Stock"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => handleOpenRestock(p)}
                        className="btn btn-sm btn-primary"
                      >
                        + Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Restock Modal */}
      {editingProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Replenish Product Stock</h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="modal-close"
              >
                ✕
              </button>
            </div>
            <p style={{ marginBottom: "1rem", color: "#64748b" }}>
              Updating quantity for <strong>{editingProduct.name}</strong> (SKU: {editingProduct.sku})
            </p>
            <div className="form-group">
              <label>Set Total Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setEditingProduct(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveRestock}>
                Save Quantity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
