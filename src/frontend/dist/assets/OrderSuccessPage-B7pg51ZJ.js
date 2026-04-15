import { j as jsxRuntimeExports, L as Link } from "./index-BXOuU6Ia.js";
import { c as createLucideIcon, d as Layout, m as motion, e as Button } from "./Layout-H0oWhtqi.js";
import { C as CircleCheckBig } from "./circle-check-big-D0undJsH.js";
import { S as ShoppingBag } from "./shopping-bag-BsMCx6FH.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }]
];
const MessageCircle = createLucideIcon("message-circle", __iconNode);
function getSearchParam(key) {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(key) ?? "";
}
function OrderSuccessPage() {
  const orderId = getSearchParam("orderId");
  const customerName = getSearchParam("name");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background min-h-[70vh] flex items-center justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-xl text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: "spring", duration: 0.6 },
        className: "mb-6",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 w-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-12 w-12 text-primary" }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.3 },
        className: "flex flex-col gap-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl font-bold text-foreground", children: [
            "Order Placed!",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { role: "img", "aria-label": "celebrate", children: "🎉" })
          ] }),
          customerName && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground font-body text-base", children: [
            "Thank you,",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: customerName }),
            "! Your order has been received."
          ] }),
          !customerName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-lg", children: "Thank you for shopping with Kami Shopsy. Your order has been received successfully." }),
          orderId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border border-border/40 rounded-xl p-4 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body uppercase tracking-wider mb-1", children: "Order ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "font-display font-bold text-foreground text-2xl",
                "data-ocid": "order-id-display",
                children: [
                  "#",
                  orderId
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-lg p-5 shadow-luxury text-left flex flex-col gap-3 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "What happens next?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-col gap-2", children: [
              "We will contact you on WhatsApp shortly to confirm your order",
              "For EasyPaisa payments: send to 03457393786",
              "Your order will be packed and dispatched promptly",
              "Delivery will be arranged to your address"
            ].map((step) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "li",
              {
                className: "flex items-start gap-2 text-sm text-muted-foreground font-body",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-primary flex-shrink-0 mt-0.5" }),
                  step
                ]
              },
              step
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "https://wa.me/923457393786",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "w-full",
              "data-ocid": "order-whatsapp",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "lg",
                  className: "w-full btn-whatsapp font-body font-semibold gap-2 transition-smooth",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5" }),
                    "Contact on WhatsApp"
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              asChild: true,
              variant: "outline",
              size: "lg",
              className: "w-full border-primary/30 text-primary hover:bg-primary/5 font-body transition-smooth",
              "data-ocid": "order-continue-shopping",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5 mr-2" }),
                "Continue Shopping"
              ] })
            }
          )
        ]
      }
    )
  ] }) }) });
}
export {
  OrderSuccessPage as default
};
