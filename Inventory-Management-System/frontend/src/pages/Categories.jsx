import { useState, useEffect } from "react";
import api from "../services/api";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation state
  const [deletingId, setDeletingId] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.response?.data?.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setFormError("Category name is required.");
      return;
    }

    setFormError("");
    setSubmitting(true);

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, { name: categoryName.trim() });
        setSuccessMessage(`Updated category "${categoryName.trim()}"`);
      } else {
        await api.post("/categories", { name: categoryName.trim() });
        setSuccessMessage(`Added category "${categoryName.trim()}"`);
      }
      setIsModalOpen(false);
      fetchCategories();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error saving category:", err);
      setFormError(
        err.response?.data?.message || "Failed to save category. Duplicate name or network issue."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setSuccessMessage("Category deleted successfully.");
      setDeletingId(null);
      fetchCategories();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting category:", err);
      const msg =
        err.response?.data?.message ||
        "Cannot delete category: products are currently assigned to it.";
      alert(msg);
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Product Categories</h1>
          <p>Organize products into distinct category groups.</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary">
          + Add Category
        </button>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="state-container">
          <h3>Loading Categories...</h3>
        </div>
      ) : categories.length === 0 ? (
        <div className="state-container">
          <h3>No Categories Found</h3>
          <p>Get started by creating your first product category.</p>
          <button onClick={handleOpenAddModal} className="btn btn-primary">
            + Add First Category
          </button>
        </div>
      ) : (
        <div className="table-container" style={{ maxWidth: "800px" }}>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td>
                    <strong>{c.name}</strong>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div className="action-buttons" style={{ justifyContent: "flex-end" }}>
                      <button
                          onClick={() => handleOpenEditModal(c)}
                          className="btn btn-sm btn-edit"
                      >
                        Edit
                      </button>
                      <button
                          onClick={() => setDeletingId(c.id)}
                          className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingCategory ? "Edit Category" : "Add New Category"}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>
            {formError && <div className="alert alert-error">{formError}</div>}
            <form onSubmit={handleSaveCategory}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Electronics, Office Supplies..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ color: "#dc2626" }}>Delete Category</h2>
              <button
                onClick={() => setDeletingId(null)}
                className="modal-close"
              >
                ✕
              </button>
            </div>
            <p style={{ marginBottom: "1.5rem" }}>
              Are you sure you want to delete this category? Note: A category cannot be deleted if products are currently assigned to it.
            </p>
            <div className="form-actions">
              <button className="btn btn-secondary" onClick={() => setDeletingId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteCategory(deletingId)}>
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
