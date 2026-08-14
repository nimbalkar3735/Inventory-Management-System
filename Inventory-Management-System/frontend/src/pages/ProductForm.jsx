import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";
import FormInput from "../components/FormInput";

export default function ProductForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    quantity: "",
    categoryId: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error loading categories:", err);
        setServerError("Failed to load category list.");
      }
    };

    const loadProduct = async () => {
      if (!isEditMode) return;
      try {
        const res = await api.get(`/products/${id}`);
        const p = res.data;
        setForm({
          name: p.name || "",
          sku: p.sku || "",
          price: p.price ?? "",
          quantity: p.quantity ?? "",
          categoryId: p.categoryId || p.category?.id || "",
        });
      } catch (err) {
        console.error("Error loading product:", err);
        setServerError(err.response?.data?.message || "Product not found.");
      } finally {
        setFetching(false);
      }
    };

    loadCategories();
    loadProduct();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const totalStockValue =
      Number(form.price || 0) * Number(form.quantity || 0);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.sku.trim()) newErrors.sku = "SKU is required";
    if (form.price === "" || isNaN(form.price) || Number(form.price) < 0) {
      newErrors.price = "Valid price (≥ 0) is required";
    }
    if (form.quantity === "" || isNaN(form.quantity) || Number(form.quantity) < 0) {
      newErrors.quantity = "Valid quantity (≥ 0) is required";
    }
    if (!form.categoryId) newErrors.categoryId = "Category selection is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
      categoryId: parseInt(form.categoryId, 10),
    };

    try {
      if (isEditMode) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post("/products", payload);
      }
      navigate("/products");
    } catch (err) {
      console.error("Error saving product:", err);
      setServerError(
        err.response?.data?.message || "Failed to save product. Check duplicate SKU or network connection."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="state-container">
        <h3>Loading Product Details...</h3>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>{isEditMode ? "Edit Product" : "Add New Product"}</h1>
          <p>{isEditMode ? `Update details for Product #${id}` : "Create a new inventory item with stock quantity."}</p>
        </div>
        <Link to="/products" className="btn btn-secondary">
          ← Back to Products
        </Link>
      </div>

      <div className="card-form" style={{ margin: "0 auto" }}>
        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Product Name"
            name="name"
            placeholder="e.g. Wireless Mouse"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
          />

          <FormInput
            label="SKU (Stock Keeping Unit)"
            name="sku"
            placeholder="e.g. WM-1001"
            value={form.sku}
            onChange={handleChange}
            error={errors.sku}
          />

          <div className="form-group">
            <label>Category</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className={errors.categoryId ? "input-error" : ""}
            >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <span className="field-error">{errors.categoryId}</span>}
          </div>

          <div className="form-row">
            <FormInput
                label="Price per Unit ($)"
                type="number"
                step="0.01"
                min="0"
                name="price"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                error={errors.price}
            />

            <FormInput
                label="Initial Quantity"
                type="number"
                min="0"
                name="quantity"
                placeholder="0"
                value={form.quantity}
                onChange={handleChange}
                error={errors.quantity}
            />
          </div>

          <div className="stock-value-preview">
            <div>
              <span>Total Stock Value</span>
              <small>Price per unit × quantity</small>
            </div>

            <strong>${totalStockValue.toFixed(2)}</strong>
          </div>

          <div className="form-actions">
            <Link to="/products" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (isEditMode ? "Saving..." : "Creating...") : isEditMode ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
