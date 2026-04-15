import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Link, S as Skeleton } from "./index-BXOuU6Ia.js";
import { c as createLucideIcon, d as Layout, m as motion, B as Badge, e as Button, S as ShoppingCart, f as ue } from "./Layout-H0oWhtqi.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-2csGYuT2.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BwunmBjS.js";
import { S as Separator } from "./separator-DCjx-yZk.js";
import { u as useAdmin } from "./useAdmin-P_X9nPXL.js";
import { i as useAllOrders, w as useUpdateOrderStatus } from "./useBackend-DPbAOe5Q.js";
import { C as ChevronRight } from "./chevron-right-Bt0E1e50.js";
import { E as Eye } from "./eye-BoN2CPM0.js";
import { C as CircleCheckBig } from "./circle-check-big-D0undJsH.js";
import "./index-COJdbZaO.js";
import "./index-12XgadAA.js";
import "./index-C-blUD9-.js";
import "./index-CHfX5RCr.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode);
const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled"
];
function StatusBadge({ status }) {
  const config = {
    pending: {
      icon: Clock,
      cls: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
    },
    confirmed: {
      icon: CircleCheckBig,
      cls: "bg-blue-500/10 text-blue-600 border-blue-500/20"
    },
    shipped: {
      icon: CircleCheckBig,
      cls: "bg-purple-500/10 text-purple-600 border-purple-500/20"
    },
    delivered: {
      icon: CircleCheckBig,
      cls: "bg-green-500/10 text-green-600 border-green-500/20"
    },
    cancelled: {
      icon: CircleX,
      cls: "bg-destructive/10 text-destructive border-destructive/20"
    }
  };
  const { icon: Icon, cls } = config[status] ?? config.pending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: `font-body capitalize gap-1 ${cls}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" }),
    status
  ] });
}
function AdminOrdersPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAdmin();
  reactExports.useEffect(() => {
    if (!isLoggedIn) navigate({ to: "/admin/login" });
  }, [isLoggedIn, navigate]);
  const { data: orders, isLoading } = useAllOrders();
  const { mutateAsync: updateStatus, isPending: updating } = useUpdateOrderStatus();
  const [viewOrder, setViewOrder] = reactExports.useState(null);
  async function handleStatusChange(order, status) {
    try {
      await updateStatus({ id: order.id, status });
      ue.success(`Order #${String(order.id)} marked as ${status}`);
    } catch {
      ue.error("Failed to update status");
    }
  }
  function formatDate(ts) {
    return new Date(Number(ts) / 1e6).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-2 text-sm text-muted-foreground font-body mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/admin/dashboard",
            className: "hover:text-primary transition-smooth",
            children: "Dashboard"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Orders" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Manage Orders" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: ["o1", "o2", "o3", "o4", "o5"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-lg" }, k)) }) : orders && orders.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", "data-ocid": "admin-orders-list", children: [...orders].sort((a, b) => Number(b.createdAt - a.createdAt)).map((order, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: i * 0.04 },
        className: "bg-card border border-border/60 rounded-lg p-4 shadow-luxury flex flex-col sm:flex-row sm:items-center gap-4",
        "data-ocid": `admin-order-${String(order.id)}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-body font-semibold text-sm text-foreground", children: [
                "Order #",
                String(order.id)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: order.status }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "font-body text-xs border-border text-muted-foreground",
                  children: order.paymentMethod
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground font-body", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: order.customerName }),
              " ",
              "· ",
              order.phone,
              " · ",
              order.city
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body mt-0.5", children: [
              order.items.length,
              " item(s) · PKR",
              " ",
              Number(order.totalAmount).toLocaleString(),
              " ·",
              " ",
              formatDate(order.createdAt)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center flex-shrink-0 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: order.status,
                onValueChange: (v) => handleStatusChange(order, v),
                disabled: updating,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "w-36 font-body text-xs h-8",
                      "data-ocid": `order-status-${String(order.id)}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: STATUS_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectItem,
                    {
                      value: s,
                      className: "font-body capitalize text-sm",
                      children: s
                    },
                    s
                  )) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "h-8 text-xs border-border text-muted-foreground hover:text-primary hover:border-primary/40 gap-1 font-body transition-smooth",
                onClick: () => setViewOrder(order),
                "data-ocid": `view-order-${String(order.id)}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3 w-3" }),
                  " Details"
                ]
              }
            )
          ] })
        ]
      },
      String(order.id)
    )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-20 text-muted-foreground",
        "data-ocid": "admin-orders-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-14 w-14 mx-auto mb-4 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-semibold mb-2", children: "No orders yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm", children: "Orders will appear here once customers place them." })
        ]
      }
    ) }) }),
    viewOrder && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!viewOrder,
        onOpenChange: (v) => !v && setViewOrder(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-card border-border/60 max-h-[80vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display text-xl", children: [
            "Order #",
            String(viewOrder.id)
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Customer:" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: viewOrder.customerName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Phone:" }),
                " ",
                viewOrder.phone
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Address:" }),
                " ",
                viewOrder.address,
                ", ",
                viewOrder.city
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Payment:" }),
                " ",
                viewOrder.paymentMethod
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Status:" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: viewOrder.status })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground", children: "Items" }),
              viewOrder.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex justify-between items-center text-sm font-body",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground", children: [
                      item.productName,
                      " × ",
                      String(item.quantity)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-primary font-semibold", children: [
                      "PKR ",
                      Number(item.price * item.quantity).toLocaleString()
                    ] })
                  ]
                },
                String(item.productId)
              ))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-foreground", children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-xl font-bold text-primary", children: [
                "PKR ",
                Number(viewOrder.totalAmount).toLocaleString()
              ] })
            ] })
          ] })
        ] })
      }
    )
  ] });
}
export {
  AdminOrdersPage as default
};
