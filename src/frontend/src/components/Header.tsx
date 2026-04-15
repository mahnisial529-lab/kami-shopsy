import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, LogIn, Menu, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCartContext } from "../contexts/CartContext";

export function Header() {
  const { totalItems } = useCartContext();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin =
    typeof window !== "undefined" &&
    !!sessionStorage.getItem("kami-shopsy-admin");

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border/60 shadow-luxury">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo + Brand */}
        <Link
          to="/"
          className="flex items-center gap-3 min-w-0 transition-smooth hover:opacity-90"
          data-ocid="nav-logo"
        >
          <img
            src="/assets/images/kami-shopsy-logo.jpeg"
            alt="Kami Shopsy Logo"
            className="h-10 w-10 rounded-full object-cover border-2 border-primary/60 shadow-luxury flex-shrink-0"
          />
          <span className="font-display text-xl font-bold text-primary leading-none hidden sm:block tracking-wide">
            Kami Shopsy
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-6"
          data-ocid="nav-links"
        >
          <Link
            to="/"
            className="text-sm font-body text-muted-foreground hover:text-primary transition-smooth"
            activeProps={{ className: "text-primary" }}
          >
            Home
          </Link>
          <Link
            to="/category/$id"
            params={{ id: "all" }}
            search={{ q: undefined }}
            className="text-sm font-body text-muted-foreground hover:text-primary transition-smooth"
          >
            Shop
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative transition-smooth"
            onClick={() => navigate({ to: "/checkout" })}
            data-ocid="nav-cart"
            aria-label="View cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                {totalItems > 99 ? "99+" : totalItems}
              </Badge>
            )}
          </Button>

          {/* Admin */}
          {isAdmin ? (
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex gap-2 border-primary/40 text-primary hover:bg-primary/10 transition-smooth"
              onClick={() => navigate({ to: "/admin/dashboard" })}
              data-ocid="nav-admin-dashboard"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex gap-2 border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-smooth"
              onClick={() => navigate({ to: "/admin/login" })}
              data-ocid="nav-admin-login"
            >
              <LogIn className="h-4 w-4" />
              Admin
            </Button>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden transition-smooth"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            data-ocid="nav-mobile-toggle"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-card px-4 py-4 flex flex-col gap-4">
          <Link
            to="/"
            className="text-sm font-body text-muted-foreground hover:text-primary transition-smooth"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/category/$id"
            params={{ id: "all" }}
            search={{ q: undefined }}
            className="text-sm font-body text-muted-foreground hover:text-primary transition-smooth"
            onClick={() => setMobileOpen(false)}
          >
            Shop All
          </Link>
          {isAdmin ? (
            <Link
              to="/admin/dashboard"
              className="text-sm font-body text-primary"
              onClick={() => setMobileOpen(false)}
            >
              Admin Dashboard
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="text-sm font-body text-muted-foreground hover:text-primary transition-smooth"
              onClick={() => setMobileOpen(false)}
            >
              Admin Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
