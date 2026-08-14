import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/FormInput";

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Show / Hide password
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        }

        if (!form.password) {
            newErrors.password = "Password is required";
        } else if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError("");
        setSuccessMessage("");

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            await register(form.name, form.email, form.password);

            setSuccessMessage(
                "Account created! Redirecting to login..."
            );

            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            const message =
                err.response?.data?.message ||
                (typeof err.response?.data === "string"
                    ? err.response.data
                    : null) ||
                "Registration failed. Please try again.";

            setServerError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Create Account</h1>

                {serverError && (
                    <div className="alert alert-error">
                        {serverError}
                    </div>
                )}

                {successMessage && (
                    <div className="alert alert-success">
                        {successMessage}
                    </div>
                )}

                <FormInput
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name}
                />

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
                    {loading ? "Creating account..." : "Register"}
                </button>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <Link to="/login">Log In</Link>
                </p>
            </form>
        </div>
    );
}