import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Quantity Update Modal state
  const [editingQuantityProduct, setEditingQuantityProduct] = useState(null);
  const [newQuantity, setNewQuantity] = useState(0);

  // Delete Confirmation state
  const [deletingProductId, setDeletingProductId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (searchTerm.trim()) {
        params.name = searchTerm.trim();
        params.sku = searchTerm.trim();
      }
      if (selectedCategory) {
        params.categoryId = selectedCategory;
      }

      const res = await api.get("/products", { params });
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory]);

  const handleOpenQuantityModal = (product) => {
    setEditingQuantityProduct(product);
    setNewQuantity(product.quantity);
  };

  const handleSaveQuantity = async () => {
    if (!editingQuantityProduct) return;
    try {
      await api.patch(`/products/${editingQuantityProduct.id}/quantity`, {
        quantity: Number(newQuantity),
      });
      setSuccessMessage(`Updated stock quantity for ${editingQuantityProduct.name}`);
      setEditingQuantityProduct(null);
      fetchProducts();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setSuccessMessage("Product deleted successfully.");
      setDeletingProductId(null);
      fetchProducts();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Product Inventory</h1>
          <p>Search, filter, edit, and maintain all stock items.</p>
        </div>
        <Link to="/products/new" className="btn btn-primary">
          + Add New Product
        </Link>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by Product Name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {(searchTerm || selectedCategory) && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("");
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="state-container">
          <h3>Loading Products...</h3>
        </div>
      ) : products.length === 0 ? (
        <div className="state-container">
          <h3>No Products Found</h3>
          <p>
            {searchTerm || selectedCategory
              ? "No items match your search or filter parameters."
              : "Your inventory is currently empty. Click below to add your first product."}
          </p>
          {!searchTerm && !selectedCategory && (
            <Link to="/products/new" className="btn btn-primary">
              + Add First Product
            </Link>
          )}
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Quantity Available</th>
                <th>Price per Unit</th>
                <th>Total Stock Value</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
            {products.map((p, index) => {
              const qty = Number(p.quantity) || 0;
              const unitPrice = Number(p.price) || 0;
              const totalStockValue = qty * unitPrice;

              const isOut = qty === 0;
              const isLow = qty > 0 && qty < 5;

                return (
                  <tr key={p.id}>
                    <td>#{index + 1}</td>
                    <td>
                      <strong>{p.name}</strong>
                    </td>
                    <td>
                      <code style={{ fontSize: "0.8rem", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                        {p.sku}
                      </code>
                    </td>
                    <td>{p.categoryName || p.category?.name || "Uncategorized"}</td><td>
                    <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                    >
                      <strong>{qty}</strong>

                      <button
                          onClick={() => handleOpenQuantityModal(p)}
                          className="btn-icon"
                          title="Quick update stock quantity"
                          style={{
                            padding: "1px 5px",
                            fontSize: "0.75rem",
                          }}
                      >
                        ✏️ Qty
                      </button>
                    </div>
                  </td>

                    <td>
                      ${unitPrice.toFixed(2)}
                    </td>

                    <td>
                      <strong>${totalStockValue.toFixed(2)}</strong>
                    </td>
                    <td>
                      <span className={`badge ${isOut ? "badge-out" : isLow ? "badge-low" : "badge-normal"}`}>
                        {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="action-buttons" style={{ justifyContent: "flex-end" }}>
                        <Link to={`/products/edit/${p.id}`} className="btn btn-sm btn-edit">
                          Edit
                        </Link>
                        <button
                            onClick={() => setDeletingProductId(p.id)}
                            className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Quantity Quick Patch Modal */}
      {editingQuantityProduct && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Update Stock Quantity</h2>
              <button onClick={() => setEditingQuantityProduct(null)} className="modal-close">
                ✕
              </button>
            </div>
            <p style={{ color: "#64748b", marginBottom: "1rem" }}>
              Item: <strong>{editingQuantityProduct.name}</strong> (SKU: {editingQuantityProduct.sku})
            </p>
            <div className="form-group">
              <label>New Quantity</label>
              <input
                type="number"
                min="0"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setEditingQuantityProduct(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveQuantity}>
                Save Quantity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProductId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ color: "#dc2626" }}>Confirm Deletion</h2>
              <button onClick={() => setDeletingProductId(null)} className="modal-close">
                ✕
              </button>
            </div>
            <p style={{ marginBottom: "1.5rem" }}>
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setDeletingProductId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteProduct(deletingProductId)}>
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
