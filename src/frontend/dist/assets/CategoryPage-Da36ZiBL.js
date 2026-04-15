import { b as useParams, c as useSearch, u as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Link, S as Skeleton } from "./index-BXOuU6Ia.js";
import { c as createLucideIcon, d as Layout, B as Badge, X, e as Button, m as motion, S as ShoppingCart, f as ue } from "./Layout-H0oWhtqi.js";
import { I as Input } from "./input-D4WMgf_h.js";
import { u as useIsBackendReady, a as useCategories, c as useAllProducts, d as useProductsByCategory } from "./useBackend-DPbAOe5Q.js";
import { C as ChevronRight } from "./chevron-right-Bt0E1e50.js";
import { S as Search, L as LoaderCircle, R as RefreshCw } from "./search-DGeZlAr5.js";
import { E as Eye } from "./eye-BoN2CPM0.js";
import { S as Share2, T as Truck } from "./truck-USu8-J1q.js";
import { S as ShoppingBag } from "./shopping-bag-BsMCx6FH.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode);
function formatPrice(price) {
  if (price == null) return "0";
  try {
    return Number(price).toLocaleString();
  } catch {
    return "0";
  }
}
function calcDiscounted(price, discountEnabled, discountPercent) {
  if (!discountEnabled || Number(discountPercent) <= 0) return null;
  return Math.round(Number(price) * (1 - Number(discountPercent) / 100));
}
function FreeDeliveryBadge() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs font-body font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 w-fit", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-3 w-3 flex-shrink-0" }),
    "Free Delivery"
  ] });
}
function CategoryPage() {
  const { id } = useParams({ from: "/category/$id" });
  const { q: searchParam } = useSearch({ from: "/category/$id" });
  const navigate = useNavigate();
  const isAll = id === "all";
  const isBackendReady = useIsBackendReady();
  let categoryId = null;
  if (!isAll) {
    try {
      categoryId = BigInt(id);
    } catch {
      categoryId = null;
    }
  }
  const { data: categories } = useCategories();
  const {
    data: allProducts,
    isLoading: allLoading,
    isError: allError,
    isFetching: allFetching,
    refetch: refetchAll
  } = useAllProducts();
  const {
    data: catProducts,
    isLoading: catLoading,
    isError: catError,
    isFetching: catFetching,
    refetch: refetchCat
  } = useProductsByCategory(categoryId);
  const [copiedId, setCopiedId] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState(searchParam ?? "");
  reactExports.useEffect(() => {
    setSearchQuery(searchParam ?? "");
  }, [searchParam]);
  const rawLoading = isAll ? allLoading : catLoading;
  const rawFetching = isAll ? allFetching : catFetching;
  const isError = isAll ? allError : catError;
  const refetch = isAll ? refetchAll : refetchCat;
  const rawProducts = isAll ? allProducts : catProducts;
  const isLoading = !isBackendReady || rawLoading || rawFetching && !rawProducts;
  const products = searchQuery.trim() && rawProducts ? rawProducts.filter(
    (p) => (p.name ?? "").toLowerCase().includes(searchQuery.trim().toLowerCase())
  ) : rawProducts;
  const category = categories == null ? void 0 : categories.find((c) => String(c.id) === id);
  const invalidId = !isAll && categoryId === null;
  reactExports.useEffect(() => {
    if (isAll) {
      document.title = "All Products - Kami Shopsy";
    } else if (category == null ? void 0 : category.name) {
      document.title = `${category.name} - Kami Shopsy`;
    } else {
      document.title = "Products - Kami Shopsy";
    }
  }, [isAll, category == null ? void 0 : category.name]);
  function handleShare(productId) {
    const pid = String(productId);
    const url = `${window.location.origin}/product/${pid}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(pid);
      ue.success("Link copied!");
      setTimeout(() => setCopiedId(null), 2e3);
    }).catch(() => {
      ue.error("Could not copy link");
    });
  }
  function handleSearchSubmit(e) {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate({
      to: "/category/$id",
      params: { id },
      search: { q: q || void 0 }
    });
  }
  function clearSearch() {
    setSearchQuery("");
    navigate({ to: "/category/$id", params: { id }, search: { q: void 0 } });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-2 text-sm text-muted-foreground mb-3 font-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-smooth", children: "Home" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: isAll ? "All Products" : (category == null ? void 0 : category.name) ?? "Category" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground", children: isAll ? "All Products" : (category == null ? void 0 : category.name) ?? "Products" }),
      (category == null ? void 0 : category.description) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1 font-body", children: category.description })
    ] }) }),
    !isAll && categories && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-background border-b border-border/40 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-3 flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/category/$id",
          params: { id: "all" },
          search: { q: void 0 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-smooth font-body whitespace-nowrap",
              children: "All"
            }
          )
        }
      ),
      categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/category/$id",
          params: { id: String(c.id) },
          search: { q: void 0 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: String(c.id) === id ? "default" : "outline",
              className: `cursor-pointer transition-smooth font-body whitespace-nowrap ${String(c.id) === id ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 hover:border-primary/40"}`,
              children: c.name
            }
          )
        },
        String(c.id)
      ))
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-background border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSearchSubmit, className: "flex gap-2 max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "search",
            placeholder: "Search products...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "pl-9 pr-8 font-body border-border/60 focus:border-primary/50",
            "data-ocid": "category-search-input"
          }
        ),
        searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: clearSearch,
            className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth",
            "aria-label": "Clear search",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          variant: "outline",
          className: "border-primary/30 text-primary hover:bg-primary/5 font-body",
          "data-ocid": "category-search-btn",
          children: "Search"
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: invalidId ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-20 text-muted-foreground",
        "data-ocid": "products-invalid",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-14 w-14 mx-auto mb-4 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-semibold mb-2", children: "Category not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm mb-6", children: "This category does not exist." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Go Home" }) })
        ]
      }
    ) : isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      !isBackendReady && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground font-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        "Connecting to store…"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5", children: ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-lg" }, k)) })
    ] }) : isError ? (
      // Only shown after backend is confirmed ready and query failed
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-20 text-muted-foreground",
          "data-ocid": "products-error",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-14 w-14 mx-auto mb-4 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-semibold mb-2", children: "Something went wrong" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm mb-6", children: "Could not load products. Please try again." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  onClick: () => refetch(),
                  "data-ocid": "products-retry",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-2" }),
                    "Try Again"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Go Home" }) })
            ] })
          ]
        }
      )
    ) : products && products.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5",
        "data-ocid": "products-grid",
        children: products.map((product, i) => {
          var _a;
          const discounted = calcDiscounted(
            product.price,
            product.discountEnabled ?? false,
            product.discountPercent ?? BigInt(0)
          );
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { delay: i * 0.06 },
              className: "group bg-card border border-border/60 rounded-lg overflow-hidden shadow-luxury hover:shadow-luxury-hover hover:border-primary/40 transition-smooth flex flex-col",
              "data-ocid": `product-card-${String(product.id)}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/product/$id",
                    params: { id: String(product.id) },
                    className: "relative block overflow-hidden",
                    children: [
                      ((_a = product.imageUrls) == null ? void 0 : _a[0]) ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: product.imageUrls[0],
                          alt: product.name ?? "Product",
                          className: "w-full h-44 object-cover transition-smooth group-hover:scale-105",
                          onError: (e) => {
                            e.currentTarget.style.display = "none";
                          }
                        }
                      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-44 bg-muted flex items-center justify-center text-5xl", children: "🛍️" }),
                      discounted !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 left-2 bg-red-500 text-white text-xs font-bold font-body px-2 py-0.5 rounded-full shadow-sm", children: [
                        Number(product.discountPercent),
                        "% OFF"
                      ] }),
                      product.available === false && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/70 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "font-body", children: "Out of Stock" }) })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex flex-col gap-2 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-body font-semibold text-sm text-foreground line-clamp-2 leading-tight", children: product.name ?? "—" }),
                  discounted !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-red-500 font-display font-bold text-base", children: [
                      "PKR ",
                      discounted.toLocaleString()
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground font-body text-xs line-through", children: [
                      "PKR ",
                      formatPrice(product.price)
                    ] })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-primary font-display font-bold text-base", children: [
                    "PKR ",
                    formatPrice(product.price)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FreeDeliveryBadge, {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 mt-auto", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        className: "w-full text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth font-semibold",
                        asChild: true,
                        "data-ocid": `product-shop-now-${String(product.id)}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Link,
                          {
                            to: "/product/$id",
                            params: { id: String(product.id) },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-3 w-3 mr-1" }),
                              "Shop Now"
                            ]
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          size: "sm",
                          variant: "outline",
                          className: "flex-1 text-xs border-border hover:border-primary/40 hover:text-primary transition-smooth",
                          asChild: true,
                          "data-ocid": `product-visit-${String(product.id)}`,
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            Link,
                            {
                              to: "/product/$id",
                              params: { id: String(product.id) },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3 w-3 mr-1" }),
                                "Visit"
                              ]
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          size: "sm",
                          variant: "outline",
                          className: "flex-1 px-2 text-xs border-border hover:border-primary/40 hover:text-primary transition-smooth",
                          onClick: () => handleShare(product.id),
                          "aria-label": "Share product",
                          "data-ocid": `product-share-${String(product.id)}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3 w-3 mr-1" }),
                            copiedId === String(product.id) ? "✓ Copied" : "Share"
                          ]
                        }
                      )
                    ] })
                  ] })
                ] })
              ]
            },
            String(product.id)
          );
        })
      }
    ) : searchQuery.trim() ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-20 text-muted-foreground",
        "data-ocid": "products-no-search",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-14 w-14 mx-auto mb-4 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-semibold mb-2", children: "No products found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-body text-sm mb-6", children: [
            'No products matching "',
            searchQuery,
            '"'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: clearSearch, children: "Clear Search" })
        ]
      }
    ) : (
      // Only show "No products" when backend is confirmed ready
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-20 text-muted-foreground",
          "data-ocid": "products-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-14 w-14 mx-auto mb-4 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-semibold mb-2", children: "No products yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm", children: "Products will appear here once added by admin." })
          ]
        }
      )
    ) }) })
  ] });
}
export {
  CategoryPage as default
};
