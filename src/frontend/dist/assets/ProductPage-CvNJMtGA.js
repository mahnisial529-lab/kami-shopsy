import { b as useParams, u as useNavigate, d as useCartContext, r as reactExports, j as jsxRuntimeExports, S as Skeleton, L as Link } from "./index-BXOuU6Ia.js";
import { c as createLucideIcon, d as Layout, e as Button, m as motion, B as Badge, f as ue } from "./Layout-H0oWhtqi.js";
import { I as Input } from "./input-D4WMgf_h.js";
import { L as Label } from "./label-yw5-sppB.js";
import { T as Textarea } from "./textarea-C3QnmwpL.js";
import { c as useAllProducts, a as useCategories, e as useGetProductReviews, f as useAddReview } from "./useBackend-DPbAOe5Q.js";
import { C as ChevronRight } from "./chevron-right-Bt0E1e50.js";
import { C as ChevronLeft, S as Star } from "./star-B4U1Jn8l.js";
import { S as Share2, T as Truck } from "./truck-USu8-J1q.js";
import { S as ShoppingBag } from "./shopping-bag-BsMCx6FH.js";
import "./index-CHfX5RCr.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", key: "1lielz" }]
];
const MessageSquare = createLucideIcon("message-square", __iconNode);
function FreeDeliveryBadge() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm font-body font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 w-fit", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-4 w-4 flex-shrink-0" }),
    "Free Delivery"
  ] });
}
function StarRating({
  rating,
  max = 5
}) {
  const stars = [1, 2, 3, 4, 5].slice(0, max);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5", children: stars.map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Star,
    {
      className: `h-4 w-4 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`
    },
    `star-${star}`
  )) });
}
function relativeTime(createdAt) {
  const ms = Number(createdAt) / 1e6;
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 6e4);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(ms).toLocaleDateString("en-PK");
}
function ReviewCard({ review }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 rounded-lg p-4 bg-card flex flex-col gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body font-semibold text-sm text-foreground", children: review.reviewerName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: relativeTime(review.createdAt) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StarRating, { rating: Number(review.rating) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body leading-relaxed", children: review.comment })
  ] });
}
function StarPicker({
  value,
  onChange
}) {
  const [hovered, setHovered] = reactExports.useState(0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: () => onChange(star),
      onMouseEnter: () => setHovered(star),
      onMouseLeave: () => setHovered(0),
      "aria-label": `Rate ${star} stars`,
      className: "transition-transform hover:scale-110",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Star,
        {
          className: `h-6 w-6 transition-colors ${star <= (hovered || value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40 hover:text-amber-300"}`
        }
      )
    },
    star
  )) });
}
function ProductPage() {
  const { id } = useParams({ from: "/product/$id" });
  const navigate = useNavigate();
  const { data: products, isLoading } = useAllProducts();
  const { data: categories } = useCategories();
  const { addItem } = useCartContext();
  const [shareCopied, setShareCopied] = reactExports.useState(false);
  const [activeImg, setActiveImg] = reactExports.useState(0);
  const prevIdRef = reactExports.useRef("");
  const productIdBigInt = (() => {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  })();
  const { data: reviews = [], isLoading: reviewsLoading } = useGetProductReviews(productIdBigInt);
  const { mutateAsync: addReview, isPending: isSubmittingReview } = useAddReview();
  const [showAllReviews, setShowAllReviews] = reactExports.useState(false);
  const [reviewName, setReviewName] = reactExports.useState("");
  const [reviewRating, setReviewRating] = reactExports.useState(0);
  const [reviewComment, setReviewComment] = reactExports.useState("");
  const product = products == null ? void 0 : products.find((p) => String(p.id) === id);
  const category = categories == null ? void 0 : categories.find(
    (c) => product && c.id === product.categoryId
  );
  const imageUrls = (product == null ? void 0 : product.imageUrls) && product.imageUrls.length > 0 ? product.imageUrls : [];
  if (id !== prevIdRef.current) {
    prevIdRef.current = id;
    setActiveImg(0);
  }
  reactExports.useEffect(() => {
    if (product == null ? void 0 : product.name) {
      document.title = `${product.name} - Kami Shopsy`;
    } else {
      document.title = "Product - Kami Shopsy";
    }
  }, [product == null ? void 0 : product.name]);
  function prevImg() {
    setActiveImg((i) => (i - 1 + imageUrls.length) % imageUrls.length);
  }
  function nextImg() {
    setActiveImg((i) => (i + 1) % imageUrls.length);
  }
  function handleShare() {
    const url = `${window.location.origin}/product/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setShareCopied(true);
      ue.success("Link copied! Share it with friends 🔗");
      setTimeout(() => setShareCopied(false), 2500);
    }).catch(() => {
      ue.error("Could not copy link");
    });
  }
  function handleAddToCart() {
    if (!product) return;
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      imageUrl: imageUrls[0] ?? ""
    });
    ue.success(`${product.name} added to cart!`);
  }
  function handleBuyNow() {
    if (!product) return;
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      imageUrl: imageUrls[0] ?? ""
    });
    navigate({ to: "/checkout" });
  }
  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!productIdBigInt) return;
    if (!reviewName.trim()) {
      ue.error("Please enter your name");
      return;
    }
    if (reviewRating === 0) {
      ue.error("Select a rating (1-5 stars)");
      return;
    }
    if (!reviewComment.trim()) {
      ue.error("Write your review");
      return;
    }
    try {
      await addReview({
        productId: productIdBigInt,
        reviewerName: reviewName.trim(),
        rating: BigInt(reviewRating),
        comment: reviewComment.trim()
      });
      ue.success("Review submitted successfully! Thank you");
      setReviewName("");
      setReviewRating(0);
      setReviewComment("");
    } catch {
      ue.error("Failed to submit review. Please try again.");
    }
  }
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 5);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48 mb-6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-96 rounded-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-3/4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-1/3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
        ] })
      ] })
    ] }) });
  }
  if (!product) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-foreground mb-4", children: "Product not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", className: "font-body", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Back to Home" }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex items-center gap-2 text-sm text-muted-foreground font-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-primary transition-smooth", children: "Home" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" }),
      category && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/category/$id",
            params: { id: String(category.id) },
            search: { q: void 0 },
            className: "hover:text-primary transition-smooth",
            children: category.name
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary truncate max-w-[200px]", children: product.name })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "mb-6 gap-2 text-muted-foreground hover:text-primary transition-smooth font-body",
          onClick: () => navigate({
            to: "/category/$id",
            params: { id: String(product.categoryId) },
            search: { q: void 0 }
          }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
            "Back"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.5 },
            className: "rounded-lg overflow-hidden bg-card border border-border/60 shadow-luxury flex flex-col",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden", children: [
                imageUrls.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: imageUrls[activeImg],
                    alt: product.name,
                    className: "w-full h-96 object-cover transition-opacity duration-300"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-96 flex items-center justify-center bg-muted text-7xl", children: "🛍️" }),
                imageUrls.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: prevImg,
                      className: "absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border/60 rounded-full p-1.5 shadow-md transition-smooth",
                      "aria-label": "Previous photo",
                      "data-ocid": "img-prev",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5 text-foreground" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: nextImg,
                      className: "absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border/60 rounded-full p-1.5 shadow-md transition-smooth",
                      "aria-label": "Next photo",
                      "data-ocid": "img-next",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5 text-foreground" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5", children: imageUrls.map((url, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setActiveImg(i),
                      className: `rounded-full transition-all duration-200 ${i === activeImg ? "w-5 h-2 bg-primary" : "w-2 h-2 bg-background/70 hover:bg-background"}`,
                      "aria-label": `Go to photo ${i + 1}`,
                      "data-ocid": `img-dot-${i}`
                    },
                    `dot-${url.slice(-12)}`
                  )) })
                ] })
              ] }),
              imageUrls.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 p-3 bg-muted/30 overflow-x-auto", children: imageUrls.map((url, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveImg(i),
                  className: `flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-all duration-150 ${i === activeImg ? "border-primary shadow-sm" : "border-border/40 hover:border-primary/50"}`,
                  "aria-label": `View photo ${i + 1}`,
                  "data-ocid": `img-thumb-${i}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: url,
                      alt: `View ${i + 1}`,
                      className: "w-full h-full object-cover"
                    }
                  )
                },
                url.slice(-20)
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.5, delay: 0.1 },
            className: "flex flex-col gap-5",
            children: [
              category && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "w-fit bg-primary/10 text-primary border-primary/20 font-body", children: category.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold text-foreground leading-tight", children: product.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
                (() => {
                  const discEnabled = product.discountEnabled ?? false;
                  const discPct = Number(product.discountPercent ?? 0);
                  const originalPrice = Number(product.price);
                  if (discEnabled && discPct > 0) {
                    const discountedPrice = Math.round(
                      originalPrice * (1 - discPct / 100)
                    );
                    const savings = originalPrice - discountedPrice;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-4xl font-bold text-red-500", children: [
                          "PKR ",
                          discountedPrice.toLocaleString()
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-red-500 text-white text-sm font-bold font-body px-2.5 py-1 rounded-full", children: [
                          discPct,
                          "% OFF"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground font-body text-base line-through", children: [
                        "PKR ",
                        originalPrice.toLocaleString()
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-emerald-600 font-body text-sm font-semibold", children: [
                        "You save: PKR ",
                        savings.toLocaleString()
                      ] })
                    ] });
                  }
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-4xl font-bold text-primary", children: [
                    "PKR ",
                    originalPrice.toLocaleString()
                  ] });
                })(),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "gap-1.5 font-body border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 transition-smooth ml-auto",
                    onClick: handleShare,
                    "aria-label": "Share product",
                    "data-ocid": "product-share",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4" }),
                      shareCopied ? "Copied!" : "Share"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FreeDeliveryBadge, {}),
              reviews.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  StarRating,
                  {
                    rating: Math.round(
                      reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground font-body", children: [
                  "(",
                  reviews.length,
                  " review",
                  reviews.length !== 1 ? "s" : "",
                  ")"
                ] })
              ] }),
              product.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body leading-relaxed", children: product.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: product.available ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-500/10 text-green-600 border-green-500/20 font-body", children: "In Stock" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "font-body", children: "Out of Stock" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "lg",
                    className: "flex-1 gradient-gold-accent text-primary-foreground font-body font-semibold gap-2 shadow-luxury hover:shadow-luxury-hover transition-smooth",
                    disabled: !product.available,
                    onClick: handleBuyNow,
                    "data-ocid": "product-buy-now",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5" }),
                      "Buy Now"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "lg",
                    variant: "outline",
                    className: "flex-1 border-primary/30 text-primary hover:bg-primary/5 font-body transition-smooth",
                    disabled: !product.available,
                    onClick: handleAddToCart,
                    "data-ocid": "product-add-cart",
                    children: "Add to Cart"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Orders confirmed via WhatsApp · Cash on Delivery & EasyPaisa accepted" })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/30 border-t border-border/40 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 max-w-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Customer Reviews" }),
        reviews.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/10 text-primary border-primary/20 font-body", children: reviews.length })
      ] }),
      reviewsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3 mb-8", children: [1, 2].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-lg" }, k)) }) : reviews.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-8 text-muted-foreground mb-8 border border-dashed border-border/60 rounded-xl",
          "data-ocid": "reviews-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-10 w-10 mx-auto mb-3 opacity-20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground", children: "Be the first to review!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1 font-body", children: "Share your experience with this product" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 mb-8", "data-ocid": "reviews-list", children: [
        displayedReviews.map((review) => /* @__PURE__ */ jsxRuntimeExports.jsx(ReviewCard, { review }, String(review.id))),
        reviews.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            className: "self-center font-body border-primary/30 text-primary hover:bg-primary/5",
            onClick: () => setShowAllReviews((v) => !v),
            "data-ocid": "reviews-load-more",
            children: showAllReviews ? "Show less" : `${reviews.length - 5} more reviews`
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border/60 rounded-xl p-6 shadow-luxury", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-amber-400 fill-amber-400" }),
          "Write a Review"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: handleReviewSubmit,
            className: "flex flex-col gap-4",
            "data-ocid": "review-form",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "review-name", className: "font-body text-sm", children: "Your Name *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "review-name",
                    placeholder: "e.g. Ahmed Ali",
                    value: reviewName,
                    onChange: (e) => setReviewName(e.target.value),
                    required: true,
                    className: "font-body border-border/60",
                    "data-ocid": "review-name-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm", children: "Rating *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StarPicker, { value: reviewRating, onChange: setReviewRating }),
                reviewRating > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: [
                  "",
                  "Not satisfied",
                  "Okay",
                  "Good",
                  "Very good",
                  "Excellent!"
                ][reviewRating] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "review-comment", className: "font-body text-sm", children: "Review *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    id: "review-comment",
                    placeholder: "What did you think? Share your thoughts on quality, delivery, or anything else...",
                    value: reviewComment,
                    onChange: (e) => setReviewComment(e.target.value),
                    required: true,
                    rows: 3,
                    className: "font-body border-border/60 resize-none",
                    "data-ocid": "review-comment-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  className: "self-start gradient-gold-accent text-primary-foreground font-body font-semibold shadow-luxury hover:shadow-luxury-hover transition-smooth",
                  disabled: isSubmittingReview,
                  "data-ocid": "review-submit",
                  children: isSubmittingReview ? "Submitting..." : "Submit Review"
                }
              )
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  ProductPage as default
};
