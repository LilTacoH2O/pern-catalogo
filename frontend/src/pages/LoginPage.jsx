import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

// INV01 · Inicio de sesión para administrar el catálogo
export default function LoginPage() {
  const { user, login } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setError("");
    const result = await login(form.email, form.password);
    setSending(false);
    if (result.ok) navigate("/");
    else setError(result.message);
  };

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <div className="card bg-base-100 shadow-md">
        <form className="card-body gap-4" onSubmit={handleSubmit}>
          <h1 className="card-title text-2xl">Iniciar sesión</h1>
          <p className="text-base-content/70">
            Solo el personal autorizado puede agregar, editar o eliminar productos.
          </p>
          {error && <div role="alert" className="alert alert-error">{error}</div>}
          <label className="form-control">
            <span className="label-text mb-1">Correo</span>
            <input className="input input-bordered w-full" type="email" name="email" autoComplete="username"
              value={form.email} onChange={handleChange} required />
          </label>
          <label className="form-control">
            <span className="label-text mb-1">Contraseña</span>
            <input className="input input-bordered w-full" type="password" name="password" autoComplete="current-password"
              value={form.password} onChange={handleChange} required />
          </label>
          <button className="btn btn-primary" type="submit" disabled={sending}>
            {sending ? <span className="loading loading-spinner" /> : <LogIn className="size-5" />}
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
