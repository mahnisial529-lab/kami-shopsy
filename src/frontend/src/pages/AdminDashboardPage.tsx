import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@caffeineai/core-infrastructure";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Eye,
  EyeOff,
  KeyRound,
  LayoutGrid,
  LogOut,
  Megaphone,
  Package,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import { Layout } from "../components/Layout";
import { useAdmin } from "../hooks/useAdmin";
import {
  useAdminLogin,
  useAllOrders,
  useAllProducts,
  useCategories,
  useGetAnnouncement,
  useSetAnnouncement,
  useToggleAnnouncement,
} from "../hooks/useBackend";

const ADMIN_LINKS = [
  {
    to: "/admin/categories",
    label: "Categories",
    icon: LayoutGrid,
    desc: "Add, edit, delete product categories",
  },
  {
    to: "/admin/products",
    label: "Products",
    icon: Package,
    desc: "Manage product listings and prices",
  },
  {
    to: "/admin/orders",
    label: "Orders",
    icon: ShoppingCart,
    desc: "View and manage customer orders",
  },
] as const;

type ChangePasswordStep = "idle" | "verify" | "newpass";

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAdmin();
  const { data: categories, isLoading: catLoading } = useCategories();
  const { data: products, isLoading: prodLoading } = useAllProducts();
  const { data: orders, isLoading: ordLoading } = useAllOrders();
  const { mutateAsync: adminLogin } = useAdminLogin();
  const { actor } = useActor(createActor);

  // Announcement
  const { data: announcement, isLoading: annLoading } = useGetAnnouncement();
  const { mutateAsync: setAnnouncement, isPending: savingAnn } =
    useSetAnnouncement();
  const { mutateAsync: toggleAnnouncement, isPending: togglingAnn } =
    useToggleAnnouncement();
  const [annMessage, setAnnMessage] = useState("");
  const [annActive, setAnnActive] = useState(false);
  const annInitialized = useRef(false);

  // Populate announcement form once data arrives
  useEffect(() => {
    if (!annInitialized.current && announcement !== undefined) {
      annInitialized.current = true;
      setAnnMessage(announcement?.message ?? "");
      setAnnActive(announcement?.isActive ?? false);
    }
  }, [announcement]);

  // Password change state
  const [pwStep, setPwStep] = useState<ChangePasswordStep>("idle");
  const [currentPassword, setCurrentPassword] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const codeRef = useRef<string>("");

  useEffect(() => {
    if (!isLoggedIn) navigate({ to: "/admin/login" });
  }, [isLoggedIn, navigate]);

  function handleLogout() {
    logout();
    navigate({ to: "/" });
  }

  // ── Announcement handlers ────────────────────────────────────────────────

  async function handleSaveAnnouncement() {
    if (!annMessage.trim()) {
      toast.error("Announcement message cannot be empty");
      return;
    }
    try {
      await setAnnouncement({
        message: annMessage.trim(),
        isActive: annActive,
      });
      toast.success("Announcement saved successfully!");
    } catch {
      toast.error("Failed to save announcement. Please try again.");
    }
  }

  async function handleToggleAnnouncement(checked: boolean) {
    setAnnActive(checked);
    try {
      await toggleAnnouncement(checked);
      toast.success(
        checked
          ? "Announcement is now active!"
          : "Announcement has been deactivated!",
      );
    } catch {
      // Revert on failure
      setAnnActive(!checked);
      toast.error("Failed to update. Please try again.");
    }
  }

  // ── Password change handlers ─────────────────────────────────────────────

  function openChangePassword() {
    setCurrentPassword("");
    setEnteredCode("");
    setNewPassword("");
    setConfirmPassword("");
    codeRef.current = "";
    setSentCode("");
    setPwStep("verify");
  }

  async function handleSendCode() {
    if (!currentPassword.trim()) {
      toast.error("Please enter your current password first");
      return;
    }
    setChangingPw(true);
    try {
      const valid = await adminLogin(currentPassword);
      if (!valid) {
        toast.error("Current password is incorrect");
        setChangingPw(false);
        return;
      }
      const code = generateCode();
      codeRef.current = code;
      setSentCode(code);
      toast.success(`Verification code generated: ${code}`, {
        duration: 30000,
        description: "This code is valid for 30 seconds. Please note it down.",
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setChangingPw(false);
    }
  }

  function handleVerifyCode() {
    if (enteredCode !== codeRef.current) {
      toast.error("Incorrect code. Please try again.");
      return;
    }
    setPwStep("newpass");
    setEnteredCode("");
    toast.success("Code verified successfully!");
  }

  async function handleChangePassword() {
    if (!newPassword.trim() || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!actor) {
      toast.error("System is not ready. Please wait.");
      return;
    }
    setChangingPw(true);
    try {
      const success = await actor.setAdminPassword(
        currentPassword,
        newPassword,
      );
      if (success) {
        toast.success("Password changed successfully!");
        setPwStep("idle");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        codeRef.current = "";
      } else {
        toast.error("Failed to change password. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setChangingPw(false);
    }
  }

  const stats = [
    {
      label: "Categories",
      value: categories?.length ?? 0,
      icon: LayoutGrid,
      loading: catLoading,
    },
    {
      label: "Products",
      value: products?.length ?? 0,
      icon: Package,
      loading: prodLoading,
    },
    {
      label: "Orders",
      value: orders?.length ?? 0,
      icon: ShoppingCart,
      loading: ordLoading,
    },
    {
      label: "Revenue",
      value: `PKR ${Number(orders?.reduce((s, o) => s + o.totalAmount, BigInt(0)) ?? BigInt(0)).toLocaleString()}`,
      icon: TrendingUp,
      loading: ordLoading,
    },
  ];

  return (
    <Layout>
      {/* Admin header */}
      <div className="bg-card border-b border-border/60">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground font-body mt-0.5">
              Kami Shopsy Store Management
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-smooth font-body"
              onClick={openChangePassword}
              data-ocid="admin-change-password-btn"
            >
              <KeyRound className="h-4 w-4" />
              Change Password
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border text-muted-foreground hover:border-destructive/40 hover:text-destructive transition-smooth font-body"
              onClick={handleLogout}
              data-ocid="admin-logout"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <section className="bg-background py-10">
        <div className="container mx-auto px-4 flex flex-col gap-10">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border/60 rounded-lg p-5 shadow-luxury flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-body uppercase tracking-wide">
                    {stat.label}
                  </span>
                  <stat.icon className="h-4 w-4 text-primary opacity-60" />
                </div>
                {stat.loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <p className="font-display text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Announcement Management */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-card border border-border/60 rounded-lg p-6 shadow-luxury"
            data-ocid="announcement-section"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-amber-100 border border-amber-200 rounded-lg p-2">
                <Megaphone className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">
                  Announcement Banner
                </h2>
                <p className="text-xs text-muted-foreground font-body">
                  Display a special offer or message on the homepage
                </p>
              </div>
            </div>

            {annLoading ? (
              <div className="flex flex-col gap-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-8 w-32" />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Message textarea */}
                <div className="grid gap-2">
                  <Label
                    htmlFor="ann-message"
                    className="font-body text-sm font-semibold"
                  >
                    Announcement Message
                  </Label>
                  <Textarea
                    id="ann-message"
                    value={annMessage}
                    onChange={(e) => setAnnMessage(e.target.value)}
                    placeholder="e.g. 🎉 Eid Special Offer! 20% off on all items — limited time only!"
                    className="font-body resize-none min-h-[80px]"
                    maxLength={300}
                    data-ocid="announcement-message-input"
                  />
                  <p className="text-xs text-muted-foreground font-body text-right">
                    {annMessage.length}/300
                  </p>
                </div>

                {/* Toggle + Save row */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="ann-toggle"
                      checked={annActive}
                      onCheckedChange={handleToggleAnnouncement}
                      disabled={togglingAnn}
                      data-ocid="announcement-toggle"
                    />
                    <Label
                      htmlFor="ann-toggle"
                      className="font-body text-sm cursor-pointer select-none"
                    >
                      {annActive ? (
                        <span className="text-emerald-600 font-semibold">
                          Active (Visible on homepage)
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          Inactive (Hidden)
                        </span>
                      )}
                    </Label>
                  </div>
                  <Button
                    className="gradient-gold-accent text-primary-foreground font-body font-semibold gap-2"
                    onClick={handleSaveAnnouncement}
                    disabled={savingAnn || !annMessage.trim()}
                    data-ocid="announcement-save-btn"
                  >
                    {savingAnn ? "Saving..." : "Save Announcement"}
                  </Button>
                </div>

                {/* Preview */}
                {annMessage.trim() && (
                  <div
                    className="rounded-lg overflow-hidden border border-amber-200"
                    style={{
                      background:
                        "linear-gradient(90deg, oklch(0.72 0.18 55) 0%, oklch(0.65 0.20 130) 50%, oklch(0.72 0.18 55) 100%)",
                    }}
                  >
                    <div className="px-4 py-2.5 flex items-center gap-2.5">
                      <span className="bg-white/20 rounded-full p-1">
                        <Megaphone className="h-3.5 w-3.5 text-white" />
                      </span>
                      <p className="text-white font-body text-sm font-semibold flex-1 line-clamp-1">
                        {annMessage}
                      </p>
                      <span className="text-white/60 text-xs font-body">
                        Preview
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Quick actions */}
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-5">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ADMIN_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <Link
                    to={link.to}
                    className="group block bg-card border border-border/60 rounded-lg p-6 shadow-luxury hover:shadow-luxury-hover hover:border-primary/40 transition-smooth"
                    data-ocid={`admin-nav-${link.label.toLowerCase()}`}
                  >
                    <link.icon className="h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-smooth" />
                    <h3 className="font-display font-bold text-foreground text-lg">
                      {link.label}
                    </h3>
                    <p className="text-sm text-muted-foreground font-body mt-1">
                      {link.desc}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Change Password Dialog — Step 1: Verify current password + send code */}
      <Dialog
        open={pwStep === "verify"}
        onOpenChange={(v) => !v && setPwStep("idle")}
      >
        <DialogContent className="bg-card border-border/60 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Change Password — Verify Identity
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5 py-2">
            {/* Info box */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 text-sm font-body text-foreground">
              <p className="font-semibold text-primary mb-1">
                Username (Phone)
              </p>
              <p className="text-muted-foreground">
                03057393786 — this will remain the same
              </p>
            </div>

            {/* Current password */}
            <div className="grid gap-2">
              <Label className="font-body text-sm">Current Password *</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Your current password"
                className="font-body"
                data-ocid="cp-current-password"
              />
            </div>

            {/* Send verification code */}
            <Button
              className="gradient-gold-accent text-primary-foreground font-body gap-2"
              onClick={handleSendCode}
              disabled={changingPw || !currentPassword.trim()}
              data-ocid="cp-send-code-btn"
            >
              {changingPw ? "Verifying..." : "Generate Verification Code"}
            </Button>

            {/* Code input — visible only after code is sent */}
            {sentCode && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3"
              >
                <div className="bg-muted border border-border rounded-lg px-4 py-3 text-sm font-body">
                  <p className="text-muted-foreground text-xs mb-1">
                    Your 6-digit verification code:
                  </p>
                  <p className="font-mono text-2xl font-bold text-primary tracking-[0.3em]">
                    {sentCode}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter this code below to confirm your identity.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label className="font-body text-sm">
                    Enter 6-Digit Code *
                  </Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={enteredCode}
                    onChange={(e) =>
                      setEnteredCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    placeholder="XXXXXX"
                    className="font-mono text-center text-xl tracking-widest"
                    data-ocid="cp-code-input"
                  />
                </div>
              </motion.div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPwStep("idle")}
              className="font-body border-border"
            >
              Cancel
            </Button>
            <Button
              className="gradient-gold-accent text-primary-foreground font-body"
              onClick={handleVerifyCode}
              disabled={enteredCode.length !== 6 || !sentCode}
              data-ocid="cp-verify-code-btn"
            >
              Verify Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog — Step 2: Enter new password */}
      <Dialog
        open={pwStep === "newpass"}
        onOpenChange={(v) => !v && setPwStep("idle")}
      >
        <DialogContent className="bg-card border-border/60 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              Set New Password
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <p className="text-sm text-muted-foreground font-body">
              Verification successful! Please enter your new password below.
            </p>

            {/* New password */}
            <div className="grid gap-2">
              <Label className="font-body text-sm">New Password *</Label>
              <div className="relative">
                <Input
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="font-body pr-10"
                  data-ocid="cp-new-password"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowNewPw((v) => !v)}
                  aria-label={showNewPw ? "Hide password" : "Show password"}
                >
                  {showNewPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="grid gap-2">
              <Label className="font-body text-sm">
                Confirm New Password *
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="font-body pr-10"
                  data-ocid="cp-confirm-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPw((v) => !v)}
                  aria-label={showConfirmPw ? "Hide password" : "Show password"}
                >
                  {showConfirmPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-destructive font-body">
                  Passwords do not match
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPwStep("idle")}
              className="font-body border-border"
            >
              Cancel
            </Button>
            <Button
              className="gradient-gold-accent text-primary-foreground font-body"
              onClick={handleChangePassword}
              disabled={
                changingPw ||
                !newPassword ||
                newPassword !== confirmPassword ||
                newPassword.length < 6
              }
              data-ocid="cp-save-btn"
            >
              {changingPw ? "Saving..." : "Save Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
