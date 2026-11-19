import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export default function Navbar() {
  return (
    <header className="navbar bg-base-100 shadow-sm px-4">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold">
        <ShoppingBag className="size-6 text-primary" />
        Catálogo de productos
      </Link>
    </header>
  );
}
