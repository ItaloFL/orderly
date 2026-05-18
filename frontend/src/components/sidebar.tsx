import { Link, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  LayoutDashboard,
  LogOut,
  ShoppingCart,
} from "lucide-react";
import logo from "../../assets/logo.svg";
import { useCart } from "@/contexts/cart-content";

export function Sidebar() {
  const { pathname } = useLocation();
  const { items } = useCart();

  // total de unidades no carrinho
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const menuItems = [
    { icon: LayoutDashboard, label: "Início", path: "/dashboard" },
    { icon: ShoppingBag, label: "Produtos", path: "/products" },
    { icon: ShoppingCart, label: "Meu Carrinho", path: "/cart" },
    { icon: Package, label: "Meus Pedidos", path: "/orders" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/[0.06] bg-[#0d130f]/80 backdrop-blur-xl z-50 hidden md:flex flex-col p-6">
      <div className="mb-10 px-2">
        <img src={logo} alt="Orderly" className="h-8 w-auto" />
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const isCart = item.path === "/cart";

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-emerald-500 text-[#090d0b]"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="relative">
                <item.icon
                  size={20}
                  className={
                    isActive ? "" : "text-white/20 group-hover:text-emerald-500"
                  }
                />

                {isCart && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-emerald-500 text-[#090d0b] text-[10px] font-bold flex items-center justify-center leading-none">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>
              {item.label}

              {isCart && cartCount > 0 && !isActive && (
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  {cartCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
      >
        <LogOut size={20} />
        Sair da conta
      </button>
    </aside>
  );
}
