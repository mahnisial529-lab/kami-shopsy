import { u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-BXOuU6Ia.js";
import { c as createLucideIcon, d as Layout, m as motion, e as Button, f as ue } from "./Layout-H0oWhtqi.js";
import { I as Input } from "./input-D4WMgf_h.js";
import { L as Label } from "./label-yw5-sppB.js";
import { u as useAdmin } from "./useAdmin-P_X9nPXL.js";
import { h as useAdminLogin } from "./useBackend-DPbAOe5Q.js";
import { E as EyeOff } from "./eye-off-D-IRyu0X.js";
import { E as Eye } from "./eye-BoN2CPM0.js";
import "./index-CHfX5RCr.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode);
function AdminLoginPage() {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAdmin();
  const { mutateAsync: adminLogin, isPending, isActorReady } = useAdminLogin();
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (isLoggedIn) navigate({ to: "/admin/dashboard" });
  }, [isLoggedIn, navigate]);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const success = await adminLogin(password);
      if (success) {
        login("admin-authenticated");
        ue.success("Welcome back, Admin!");
        navigate({ to: "/admin/dashboard" });
      } else {
        ue.error("Incorrect password. Please try again.");
      }
    } catch {
      ue.error("Login failed. Please try again.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { hideFooter: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 max-w-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
      className: "bg-card border border-border/60 rounded-xl shadow-luxury p-8 flex flex-col gap-6",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-3 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-8 w-8 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Admin Login" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body mt-1", children: "Kami Shopsy Store Management" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", className: "font-body text-sm", children: "Phone Number (Username)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "phone",
                type: "tel",
                value: "03057393786",
                readOnly: true,
                className: "font-body bg-muted text-muted-foreground cursor-not-allowed",
                "data-ocid": "admin-phone"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", className: "font-body text-sm", children: "Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "password",
                  type: showPassword ? "text" : "password",
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  placeholder: "Enter your password",
                  required: true,
                  className: "font-body pr-10",
                  "data-ocid": "admin-password",
                  autoFocus: true
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "icon",
                  className: "absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground transition-smooth",
                  onClick: () => setShowPassword((v) => !v),
                  "aria-label": showPassword ? "Hide password" : "Show password",
                  children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              size: "lg",
              className: "w-full gradient-gold-accent text-primary-foreground font-body font-semibold shadow-luxury hover:shadow-luxury-hover transition-smooth mt-2",
              disabled: isPending || !isActorReady,
              "data-ocid": "admin-login-submit",
              children: isPending ? "Verifying..." : !isActorReady ? "Connecting..." : "Login"
            }
          ),
          !isActorReady && !isPending && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-muted-foreground font-body", children: "Connecting to store — please wait a moment…" })
        ] })
      ]
    }
  ) }) }) });
}
export {
  AdminLoginPage as default
};
