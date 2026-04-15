import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { useAdmin } from "../hooks/useAdmin";
import { useAdminLogin } from "../hooks/useBackend";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAdmin();
  const { mutateAsync: adminLogin, isPending, isActorReady } = useAdminLogin();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLoggedIn) navigate({ to: "/admin/dashboard" });
  }, [isLoggedIn, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const success = await adminLogin(password);
      if (success) {
        login("admin-authenticated");
        toast.success("Welcome back, Admin!");
        navigate({ to: "/admin/dashboard" });
      } else {
        toast.error("Incorrect password. Please try again.");
      }
    } catch {
      toast.error("Login failed. Please try again.");
    }
  }

  return (
    <Layout hideFooter>
      <section className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center py-10">
        <div className="container mx-auto px-4 max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border/60 rounded-xl shadow-luxury p-8 flex flex-col gap-6"
          >
            {/* Logo + Title */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Admin Login
                </h1>
                <p className="text-sm text-muted-foreground font-body mt-1">
                  Kami Shopsy Store Management
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Phone — read-only, pre-filled */}
              <div className="grid gap-2">
                <Label htmlFor="phone" className="font-body text-sm">
                  Phone Number (Username)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value="03057393786"
                  readOnly
                  className="font-body bg-muted text-muted-foreground cursor-not-allowed"
                  data-ocid="admin-phone"
                />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password" className="font-body text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="font-body pr-10"
                    data-ocid="admin-password"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground transition-smooth"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gradient-gold-accent text-primary-foreground font-body font-semibold shadow-luxury hover:shadow-luxury-hover transition-smooth mt-2"
                disabled={isPending || !isActorReady}
                data-ocid="admin-login-submit"
              >
                {isPending
                  ? "Verifying..."
                  : !isActorReady
                    ? "Connecting..."
                    : "Login"}
              </Button>
              {!isActorReady && !isPending && (
                <p className="text-xs text-center text-muted-foreground font-body">
                  Connecting to store — please wait a moment…
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
