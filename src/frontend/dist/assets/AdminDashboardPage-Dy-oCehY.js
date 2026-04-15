import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, S as Skeleton, L as Link } from "./index-BXOuU6Ia.js";
import { c as createLucideIcon, S as ShoppingCart, d as Layout, e as Button, m as motion, f as ue } from "./Layout-H0oWhtqi.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-2csGYuT2.js";
import { I as Input } from "./input-D4WMgf_h.js";
import { L as Label } from "./label-yw5-sppB.js";
import { P as Package, S as Switch } from "./switch-CnzIUDWu.js";
import { T as Textarea } from "./textarea-C3QnmwpL.js";
import { a as useCategories, c as useAllProducts, i as useAllOrders, h as useAdminLogin, j as useActor, b as useGetAnnouncement, k as useSetAnnouncement, l as useToggleAnnouncement, m as createActor } from "./useBackend-DPbAOe5Q.js";
import { u as useAdmin } from "./useAdmin-P_X9nPXL.js";
import { L as LayoutGrid } from "./layout-grid-Dtz_L7M8.js";
import { M as Megaphone } from "./megaphone-C-CgOKAz.js";
import { E as EyeOff } from "./eye-off-D-IRyu0X.js";
import { E as Eye } from "./eye-BoN2CPM0.js";
import "./index-COJdbZaO.js";
import "./index-CHfX5RCr.js";
import "./index-C-blUD9-.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
      key: "1s6t7t"
    }
  ],
  ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
];
const KeyRound = createLucideIcon("key-round", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
const ADMIN_LINKS = [
  {
    to: "/admin/categories",
    label: "Categories",
    icon: LayoutGrid,
    desc: "Add, edit, delete product categories"
  },
  {
    to: "/admin/products",
    label: "Products",
    icon: Package,
    desc: "Manage product listings and prices"
  },
  {
    to: "/admin/orders",
    label: "Orders",
    icon: ShoppingCart,
    desc: "View and manage customer orders"
  }
];
function generateCode() {
  return String(Math.floor(1e5 + Math.random() * 9e5));
}
function AdminDashboardPage() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAdmin();
  const { data: categories, isLoading: catLoading } = useCategories();
  const { data: products, isLoading: prodLoading } = useAllProducts();
  const { data: orders, isLoading: ordLoading } = useAllOrders();
  const { mutateAsync: adminLogin } = useAdminLogin();
  const { actor } = useActor(createActor);
  const { data: announcement, isLoading: annLoading } = useGetAnnouncement();
  const { mutateAsync: setAnnouncement, isPending: savingAnn } = useSetAnnouncement();
  const { mutateAsync: toggleAnnouncement, isPending: togglingAnn } = useToggleAnnouncement();
  const [annMessage, setAnnMessage] = reactExports.useState("");
  const [annActive, setAnnActive] = reactExports.useState(false);
  const annInitialized = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (!annInitialized.current && announcement !== void 0) {
      annInitialized.current = true;
      setAnnMessage((announcement == null ? void 0 : announcement.message) ?? "");
      setAnnActive((announcement == null ? void 0 : announcement.isActive) ?? false);
    }
  }, [announcement]);
  const [pwStep, setPwStep] = reactExports.useState("idle");
  const [currentPassword, setCurrentPassword] = reactExports.useState("");
  const [sentCode, setSentCode] = reactExports.useState("");
  const [enteredCode, setEnteredCode] = reactExports.useState("");
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [showNewPw, setShowNewPw] = reactExports.useState(false);
  const [showConfirmPw, setShowConfirmPw] = reactExports.useState(false);
  const [changingPw, setChangingPw] = reactExports.useState(false);
  const codeRef = reactExports.useRef("");
  reactExports.useEffect(() => {
    if (!isLoggedIn) navigate({ to: "/admin/login" });
  }, [isLoggedIn, navigate]);
  function handleLogout() {
    logout();
    navigate({ to: "/" });
  }
  async function handleSaveAnnouncement() {
    if (!annMessage.trim()) {
      ue.error("Announcement message cannot be empty");
      return;
    }
    try {
      await setAnnouncement({
        message: annMessage.trim(),
        isActive: annActive
      });
      ue.success("Announcement saved successfully!");
    } catch {
      ue.error("Failed to save announcement. Please try again.");
    }
  }
  async function handleToggleAnnouncement(checked) {
    setAnnActive(checked);
    try {
      await toggleAnnouncement(checked);
      ue.success(
        checked ? "Announcement is now active!" : "Announcement has been deactivated!"
      );
    } catch {
      setAnnActive(!checked);
      ue.error("Failed to update. Please try again.");
    }
  }
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
      ue.error("Please enter your current password first");
      return;
    }
    setChangingPw(true);
    try {
      const valid = await adminLogin(currentPassword);
      if (!valid) {
        ue.error("Current password is incorrect");
        setChangingPw(false);
        return;
      }
      const code = generateCode();
      codeRef.current = code;
      setSentCode(code);
      ue.success(`Verification code generated: ${code}`, {
        duration: 3e4,
        description: "This code is valid for 30 seconds. Please note it down."
      });
    } catch {
      ue.error("Something went wrong. Please try again.");
    } finally {
      setChangingPw(false);
    }
  }
  function handleVerifyCode() {
    if (enteredCode !== codeRef.current) {
      ue.error("Incorrect code. Please try again.");
      return;
    }
    setPwStep("newpass");
    setEnteredCode("");
    ue.success("Code verified successfully!");
  }
  async function handleChangePassword() {
    if (!newPassword.trim() || newPassword.length < 6) {
      ue.error("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      ue.error("Passwords do not match");
      return;
    }
    if (!actor) {
      ue.error("System is not ready. Please wait.");
      return;
    }
    setChangingPw(true);
    try {
      const success = await actor.setAdminPassword(
        currentPassword,
        newPassword
      );
      if (success) {
        ue.success("Password changed successfully!");
        setPwStep("idle");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        codeRef.current = "";
      } else {
        ue.error("Failed to change password. Please try again.");
      }
    } catch {
      ue.error("Something went wrong. Please try again.");
    } finally {
      setChangingPw(false);
    }
  }
  const stats = [
    {
      label: "Categories",
      value: (categories == null ? void 0 : categories.length) ?? 0,
      icon: LayoutGrid,
      loading: catLoading
    },
    {
      label: "Products",
      value: (products == null ? void 0 : products.length) ?? 0,
      icon: Package,
      loading: prodLoading
    },
    {
      label: "Orders",
      value: (orders == null ? void 0 : orders.length) ?? 0,
      icon: ShoppingCart,
      loading: ordLoading
    },
    {
      label: "Revenue",
      value: `PKR ${Number((orders == null ? void 0 : orders.reduce((s, o) => s + o.totalAmount, BigInt(0))) ?? BigInt(0)).toLocaleString()}`,
      icon: TrendingUp,
      loading: ordLoading
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-5 flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Admin Dashboard" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body mt-0.5", children: "Kami Shopsy Store Management" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "gap-2 border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-smooth font-body",
            onClick: openChangePassword,
            "data-ocid": "admin-change-password-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-4 w-4" }),
              "Change Password"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "gap-2 border-border text-muted-foreground hover:border-destructive/40 hover:text-destructive transition-smooth font-body",
            onClick: handleLogout,
            "data-ocid": "admin-logout",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" }),
              "Logout"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 flex flex-col gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: stats.map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: i * 0.08 },
          className: "bg-card border border-border/60 rounded-lg p-5 shadow-luxury flex flex-col gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-body uppercase tracking-wide", children: stat.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: "h-4 w-4 text-primary opacity-60" })
            ] }),
            stat.loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-20" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-foreground", children: stat.value })
          ]
        },
        stat.label
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.35 },
          className: "bg-card border border-border/60 rounded-lg p-6 shadow-luxury",
          "data-ocid": "announcement-section",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-amber-100 border border-amber-200 rounded-lg p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-5 w-5 text-amber-600" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground", children: "Announcement Banner" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Display a special offer or message on the homepage" })
              ] })
            ] }),
            annLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-32" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "ann-message",
                    className: "font-body text-sm font-semibold",
                    children: "Announcement Message"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "ann-message",
                    value: annMessage,
                    onChange: (e) => setAnnMessage(e.target.value),
                    placeholder: "e.g. 🎉 Eid Special Offer! 20% off on all items — limited time only!",
                    className: "font-body resize-none min-h-[80px]",
                    maxLength: 300,
                    "data-ocid": "announcement-message-input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body text-right", children: [
                  annMessage.length,
                  "/300"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      id: "ann-toggle",
                      checked: annActive,
                      onCheckedChange: handleToggleAnnouncement,
                      disabled: togglingAnn,
                      "data-ocid": "announcement-toggle"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "ann-toggle",
                      className: "font-body text-sm cursor-pointer select-none",
                      children: annActive ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 font-semibold", children: "Active (Visible on homepage)" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Inactive (Hidden)" })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    className: "gradient-gold-accent text-primary-foreground font-body font-semibold gap-2",
                    onClick: handleSaveAnnouncement,
                    disabled: savingAnn || !annMessage.trim(),
                    "data-ocid": "announcement-save-btn",
                    children: savingAnn ? "Saving..." : "Save Announcement"
                  }
                )
              ] }),
              annMessage.trim() && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "rounded-lg overflow-hidden border border-amber-200",
                  style: {
                    background: "linear-gradient(90deg, oklch(0.72 0.18 55) 0%, oklch(0.65 0.20 130) 50%, oklch(0.72 0.18 55) 100%)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2.5 flex items-center gap-2.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-white/20 rounded-full p-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-3.5 w-3.5 text-white" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-body text-sm font-semibold flex-1 line-clamp-1", children: annMessage }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/60 text-xs font-body", children: "Preview" })
                  ] })
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground mb-5", children: "Quick Actions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: ADMIN_LINKS.map((link, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.96 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: 0.2 + i * 0.08 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: link.to,
                className: "group block bg-card border border-border/60 rounded-lg p-6 shadow-luxury hover:shadow-luxury-hover hover:border-primary/40 transition-smooth",
                "data-ocid": `admin-nav-${link.label.toLowerCase()}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(link.icon, { className: "h-8 w-8 text-primary mb-3 group-hover:scale-110 transition-smooth" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground text-lg", children: link.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body mt-1", children: link.desc })
                ]
              }
            )
          },
          link.to
        )) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: pwStep === "verify",
        onOpenChange: (v) => !v && setPwStep("idle"),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-card border-border/60 max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-xl flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5 text-primary" }),
            "Change Password — Verify Identity"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 text-sm font-body text-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-primary mb-1", children: "Username (Phone)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "03057393786 — this will remain the same" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm", children: "Current Password *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "password",
                  value: currentPassword,
                  onChange: (e) => setCurrentPassword(e.target.value),
                  placeholder: "Your current password",
                  className: "font-body",
                  "data-ocid": "cp-current-password"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "gradient-gold-accent text-primary-foreground font-body gap-2",
                onClick: handleSendCode,
                disabled: changingPw || !currentPassword.trim(),
                "data-ocid": "cp-send-code-btn",
                children: changingPw ? "Verifying..." : "Generate Verification Code"
              }
            ),
            sentCode && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 8 },
                animate: { opacity: 1, y: 0 },
                className: "flex flex-col gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted border border-border rounded-lg px-4 py-3 text-sm font-body", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-1", children: "Your 6-digit verification code:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-2xl font-bold text-primary tracking-[0.3em]", children: sentCode }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Enter this code below to confirm your identity." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm", children: "Enter 6-Digit Code *" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        type: "text",
                        inputMode: "numeric",
                        maxLength: 6,
                        value: enteredCode,
                        onChange: (e) => setEnteredCode(
                          e.target.value.replace(/\D/g, "").slice(0, 6)
                        ),
                        placeholder: "XXXXXX",
                        className: "font-mono text-center text-xl tracking-widest",
                        "data-ocid": "cp-code-input"
                      }
                    )
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setPwStep("idle"),
                className: "font-body border-border",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "gradient-gold-accent text-primary-foreground font-body",
                onClick: handleVerifyCode,
                disabled: enteredCode.length !== 6 || !sentCode,
                "data-ocid": "cp-verify-code-btn",
                children: "Verify Code"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: pwStep === "newpass",
        onOpenChange: (v) => !v && setPwStep("idle"),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-card border-border/60 max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-xl flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "h-5 w-5 text-primary" }),
            "Set New Password"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "Verification successful! Please enter your new password below." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm", children: "New Password *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: showNewPw ? "text" : "password",
                    value: newPassword,
                    onChange: (e) => setNewPassword(e.target.value),
                    placeholder: "At least 6 characters",
                    className: "font-body pr-10",
                    "data-ocid": "cp-new-password",
                    autoFocus: true
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "icon",
                    className: "absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground",
                    onClick: () => setShowNewPw((v) => !v),
                    "aria-label": showNewPw ? "Hide password" : "Show password",
                    children: showNewPw ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm", children: "Confirm New Password *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: showConfirmPw ? "text" : "password",
                    value: confirmPassword,
                    onChange: (e) => setConfirmPassword(e.target.value),
                    placeholder: "Re-enter your password",
                    className: "font-body pr-10",
                    "data-ocid": "cp-confirm-password"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "icon",
                    className: "absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground",
                    onClick: () => setShowConfirmPw((v) => !v),
                    "aria-label": showConfirmPw ? "Hide password" : "Show password",
                    children: showConfirmPw ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
                  }
                )
              ] }),
              confirmPassword && newPassword !== confirmPassword && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive font-body", children: "Passwords do not match" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setPwStep("idle"),
                className: "font-body border-border",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "gradient-gold-accent text-primary-foreground font-body",
                onClick: handleChangePassword,
                disabled: changingPw || !newPassword || newPassword !== confirmPassword || newPassword.length < 6,
                "data-ocid": "cp-save-btn",
                children: changingPw ? "Saving..." : "Save Password"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  AdminDashboardPage as default
};
