import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/FormInput";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [accountNotFound, setAccountNotFound] = useState(false);
    const [loading, setLoading] = useState(false);

    // Show / Hide password state
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");
        setAccountNotFound(false);

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            await login(form.email, form.password);
            navigate("/dashboard");
        } catch (err) {
            const status = err.response?.status;

            const message =
                err.response?.data?.message || "Invalid email or password";

            setServerError(message);
            setAccountNotFound(status === 404);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">

                {/* InventoryHub Branding */}
                <div className="auth-brand">
                    <div className="auth-brand-logo">
                        <svg
                            width="34"
                            height="34"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M3 7L12 12L21 7"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 12V22"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            />
                        </svg>

                        <span className="brand-inventory">
                        Inventory
                    </span>
                        <span className="brand-hub">
                        Hub
                    </span>
                    </div>

                    <p className="auth-welcome">
                        Welcome to InventoryHub
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                <h1 style={{ color: "white" }}>Log In</h1>

                {serverError && (
                    <div className="alert alert-error">
                        {serverError}

                        {accountNotFound && (
                            <>
                                {" "}
                                Please{" "}
                                <Link to="/register">register first</Link>.
                            </>
                        )}
                    </div>
                )}

                <FormInput
                    label="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                />

                {/* Password field with Show / Hide button */}
                <div className="password-field">
                    <FormInput
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        error={errors.password}
                    />

                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                            setShowPassword((prev) => !prev)
                        }
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                        title={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {showPassword ? "🙈" : "👁"}
                    </button>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Log In"}
                </button>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <Link to="/register">Register</Link>
                </p>
                </form>
            </div>
        </div>
    );}