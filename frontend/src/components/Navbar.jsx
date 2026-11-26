import { Link } from "react-router-dom";
import { LogIn, LogOut, ShoppingBag } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const NOMBRE_ROL = { admin: "Administrador", editor: "Editor" };

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <header className="navbar bg-base-100 shadow-sm px-4">
      <Link to="/" className="flex flex-1 items-center gap-2 text-xl font-bold">
        <ShoppingBag className="size-6 text-primary" />
        Catálogo de productos
      </Link>
      {/* INV01 · sesión actual */}
      {user ? (
        <div className="flex items-center gap-2">
          <span className="hidden text-sm sm:inline">{user.email}</span>
          <span className="badge badge-primary">{NOMBRE_ROL[user.role] ?? user.role}</span>
          <button className="btn btn-ghost btn-sm" onClick={logout}>
            <LogOut className="size-4" />
            Salir
          </button>
        </div>
      ) : (
        <Link to="/login" className="btn btn-ghost btn-sm">
          <LogIn className="size-4" />
          Iniciar sesión
        </Link>
      )}
    </header>
  );
}
