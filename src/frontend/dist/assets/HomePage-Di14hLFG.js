import { r as reactExports, j as jsxRuntimeExports, u as useNavigate, a as useQueryClient, L as Link, S as Skeleton } from "./index-BXOuU6Ia.js";
import { c as createLucideIcon, M as MotionConfigContext, i as isHTMLElement, u as useConstant, P as PresenceContext, a as usePresence, b as useIsomorphicLayoutEffect, L as LayoutGroupContext, m as motion, d as Layout, X, B as Badge, e as Button } from "./Layout-H0oWhtqi.js";
import { I as Input } from "./input-D4WMgf_h.js";
import { C as ChevronLeft, S as Star } from "./star-B4U1Jn8l.js";
import { C as ChevronRight } from "./chevron-right-Bt0E1e50.js";
import { u as useIsBackendReady, a as useCategories, b as useGetAnnouncement } from "./useBackend-DPbAOe5Q.js";
import { M as Megaphone } from "./megaphone-C-CgOKAz.js";
import { S as ShoppingBag } from "./shopping-bag-BsMCx6FH.js";
import { S as Search, L as LoaderCircle, R as RefreshCw } from "./search-DGeZlAr5.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode);
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  var _a;
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = ((_a = children.props) == null ? void 0 : _a.ref) ?? (children == null ? void 0 : children.ref);
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender == null ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove == null ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
const SLIDES = [
  {
    id: 1,
    title: "Stunning Red Elegance",
    subtitle: "Fashion-forward styles for the modern woman",
    tag: "LADIES FASHION",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80&fit=crop&crop=top",
    fallbackImageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80",
    fallbackGradient: "linear-gradient(135deg, oklch(0.30 0.18 15) 0%, oklch(0.22 0.20 10) 50%, oklch(0.18 0.14 350) 100%)"
  },
  {
    id: 2,
    title: "Elegance Redefined",
    subtitle: "Premium quality fashion for every occasion",
    tag: "PREMIUM FASHION",
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80",
    fallbackImageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
    fallbackGradient: "linear-gradient(135deg, oklch(0.28 0.08 40) 0%, oklch(0.22 0.12 35) 40%, oklch(0.18 0.10 55) 100%)"
  },
  {
    id: 3,
    title: "Luxury Fragrances",
    subtitle: "Explore our exclusive perfume collection",
    tag: "FRAGRANCES",
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=1200&q=80",
    fallbackImageUrl: "https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=1200&q=80",
    fallbackGradient: "linear-gradient(135deg, oklch(0.20 0.10 280) 0%, oklch(0.25 0.12 270) 50%, oklch(0.18 0.08 290) 100%)"
  },
  {
    id: 4,
    title: "Beautiful Interiors",
    subtitle: "Transform your home with our decor collection",
    tag: "HOME DECOR",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
    fallbackImageUrl: "https://images.unsplash.com/photo-1493552152660-f915ab47ae9d?w=1200&q=80",
    fallbackGradient: "linear-gradient(135deg, oklch(0.18 0.06 120) 0%, oklch(0.22 0.10 100) 50%, oklch(0.20 0.08 140) 100%)"
  },
  {
    id: 5,
    title: "Men's Style",
    subtitle: "Classic and modern styles for men",
    tag: "MEN'S COLLECTION",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
    fallbackImageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&q=80",
    fallbackGradient: "linear-gradient(135deg, oklch(0.20 0.12 200) 0%, oklch(0.18 0.14 180) 50%, oklch(0.24 0.10 210) 100%)"
  },
  {
    id: 6,
    title: "Men's Fashion Collection",
    subtitle: "Trendy styles for every occasion",
    tag: "NEW ARRIVALS",
    imageUrl: "/assets/images/user-slide-man-fashion.jpeg",
    fallbackImageUrl: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&q=80",
    fallbackGradient: "linear-gradient(135deg, oklch(0.22 0.10 220) 0%, oklch(0.18 0.13 210) 50%, oklch(0.25 0.08 230) 100%)"
  },
  {
    id: 7,
    title: "Ladies Fashion",
    subtitle: "Elegant styles for modern women",
    tag: "LATEST COLLECTION",
    imageUrl: "/assets/images/user-slide-lady-red.jpeg",
    fallbackImageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80",
    fallbackGradient: "linear-gradient(135deg, oklch(0.28 0.18 12) 0%, oklch(0.22 0.20 8) 50%, oklch(0.18 0.14 350) 100%)"
  },
  {
    id: 8,
    title: "Kids Collection",
    subtitle: "Adorable outfits for your little ones",
    tag: "BABY & KIDS",
    imageUrl: "/assets/images/user-slide-kids.jpeg",
    fallbackImageUrl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=1200&q=80",
    fallbackGradient: "linear-gradient(135deg, oklch(0.30 0.14 60) 0%, oklch(0.25 0.16 50) 50%, oklch(0.20 0.12 70) 100%)"
  }
];
function SlideBackground({ slide }) {
  const [imgState, setImgState] = reactExports.useState(
    "primary"
  );
  const src = imgState === "primary" ? slide.imageUrl : imgState === "fallback" ? slide.fallbackImageUrl : null;
  function handleError() {
    if (imgState === "primary") setImgState("fallback");
    else setImgState("gradient");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
    src ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src,
        alt: slide.title,
        className: "w-full h-full object-cover",
        onError: handleError,
        draggable: false
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "w-full h-full",
        style: { background: slide.fallbackGradient }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/45" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute bottom-0 left-0 right-0 h-24 pointer-events-none",
        style: {
          background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 pointer-events-none",
        style: {
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.25) 100%)"
        }
      }
    )
  ] });
}
function HeroSlider() {
  const [current, setCurrent] = reactExports.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = reactExports.useState(true);
  const goTo = reactExports.useCallback((index) => {
    setCurrent(index);
  }, []);
  const next = reactExports.useCallback(() => {
    setCurrent((prev2) => (prev2 + 1) % SLIDES.length);
  }, []);
  const prev = reactExports.useCallback(() => {
    setCurrent((prev2) => (prev2 - 1 + SLIDES.length) % SLIDES.length);
  }, []);
  reactExports.useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 5e3);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);
  const slide = SLIDES[current];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative w-full h-56 md:h-auto md:min-h-full overflow-hidden",
      onMouseEnter: () => setIsAutoPlaying(false),
      onMouseLeave: () => setIsAutoPlaying(true),
      "aria-label": "Featured collections slideshow",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 1.04 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.97 },
            transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
            className: "absolute inset-0 flex flex-col items-center justify-center p-6 md:p-10 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SlideBackground, { slide }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-col items-center text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, y: -12 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.15 },
                    className: "mb-3 px-4 py-1.5 rounded-full text-xs font-body font-bold tracking-[0.15em] border border-white/30 bg-white/10 text-white backdrop-blur-sm",
                    children: slide.tag
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.h2,
                  {
                    initial: { opacity: 0, y: 16 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.22 },
                    className: "font-display font-bold text-2xl md:text-4xl leading-tight mb-2 text-white drop-shadow-lg",
                    children: slide.title
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.p,
                  {
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.3 },
                    className: "text-white/80 font-body text-sm md:text-base max-w-xs leading-relaxed drop-shadow",
                    children: slide.subtitle
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { scaleX: 0 },
                    animate: { scaleX: 1 },
                    transition: { delay: 0.38, duration: 0.5 },
                    className: "mt-4 h-0.5 w-16 rounded-full bg-white/60"
                  }
                )
              ] })
            ]
          },
          slide.id
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: prev,
            "aria-label": "Previous slide",
            className: "absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/55 text-white rounded-full p-1.5 transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
            "data-ocid": "hero-slide-prev",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: next,
            "aria-label": "Next slide",
            className: "absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/55 text-white rounded-full p-1.5 transition-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
            "data-ocid": "hero-slide-next",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20", children: SLIDES.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "aria-label": `Go to slide ${i + 1}: ${s.title}`,
            onClick: () => goTo(i),
            className: "transition-smooth rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
            style: {
              width: i === current ? "24px" : "8px",
              height: "8px",
              backgroundColor: i === current ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.40)"
            },
            "data-ocid": `hero-slide-dot-${i}`
          },
          s.id
        )) })
      ]
    }
  );
}
const CATEGORY_ICONS = {
  Perfume: "🌸",
  "Ladies Collection": "👗",
  "Mens Collection": "👔",
  "Baby Collection": "🍼",
  "Home Decor": "🏡",
  Jewellery: "💎",
  "Bridal Wear": "👰",
  Footwear: "👠",
  Bags: "👜",
  Skincare: "✨",
  Electronics: "📱",
  Accessories: "🎀"
};
function HomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isBackendReady = useIsBackendReady();
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError,
    refetch,
    isFetching
  } = useCategories();
  const { data: announcement } = useGetAnnouncement();
  const [announcementDismissed, setAnnouncementDismissed] = reactExports.useState(false);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  reactExports.useEffect(() => {
    document.title = "Kami Shopsy - Pakistan Online Store | Shop Now";
  }, []);
  const showBanner = !announcementDismissed && announcement != null && announcement.isActive === true && typeof announcement.message === "string" && announcement.message.trim() !== "";
  const isLoading = !isBackendReady || categoriesLoading || isFetching && !categories;
  function handleSearch(e) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate({
        to: "/category/$id",
        params: { id: "all" },
        search: { q }
      });
    }
  }
  function handleRetry() {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    void refetch();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showBanner && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -40 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -40 },
        transition: { duration: 0.4, ease: "easeOut" },
        className: "relative overflow-hidden",
        "data-ocid": "announcement-banner",
        style: {
          background: "linear-gradient(90deg, oklch(0.72 0.18 55) 0%, oklch(0.65 0.20 130) 50%, oklch(0.72 0.18 55) 100%)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 pointer-events-none",
              style: {
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4 py-3 flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0 bg-white/20 rounded-full p-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-4 w-4 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "flex-1 text-white font-body font-semibold text-sm leading-snug", children: announcement == null ? void 0 : announcement.message }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setAnnouncementDismissed(true),
                className: "flex-shrink-0 text-white/80 hover:text-white transition-smooth rounded-full p-1 hover:bg-white/20",
                "aria-label": "Dismiss announcement",
                "data-ocid": "announcement-dismiss",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            )
          ] })
        ]
      },
      "announcement-banner"
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative overflow-hidden bg-card border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-0 md:px-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 min-h-[480px] md:min-h-[520px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-center gap-5 px-6 md:px-12 py-12 order-2 md:order-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-primary/10 text-primary border-primary/20 font-body tracking-widest uppercase text-xs px-4 py-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 mr-1 fill-current inline-block" }),
              "Premium Pakistani Store"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.h1,
          {
            className: "font-display text-4xl md:text-5xl font-bold text-foreground leading-tight",
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay: 0.1 },
            children: [
              "Welcome to",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-luxury-accent", children: "Kami Shopsy" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.p,
          {
            className: "text-muted-foreground font-body text-base max-w-sm",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 0.25 },
            children: "Discover premium fashion, fragrances, home decor & more — quality guaranteed with fast delivery across Pakistan."
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            className: "flex flex-wrap gap-3",
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.35 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "lg",
                  className: "gradient-gold-accent text-primary-foreground font-body font-semibold gap-2 shadow-luxury hover:shadow-luxury-hover transition-smooth",
                  asChild: true,
                  "data-ocid": "hero-shop-now",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#categories", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5" }),
                    "Shop Now"
                  ] })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "lg",
                  className: "font-body border-primary/30 text-primary hover:bg-primary/5 transition-smooth",
                  asChild: true,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Link,
                    {
                      to: "/category/$id",
                      params: { id: "all" },
                      search: { q: void 0 },
                      children: [
                        "View All Products",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 ml-2" })
                      ]
                    }
                  )
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.form,
          {
            onSubmit: handleSearch,
            className: "flex gap-2 mt-1 max-w-sm",
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.45 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "search",
                    placeholder: "Search products...",
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    className: "pl-9 font-body bg-background border-border/60 focus:border-primary/50",
                    "data-ocid": "hero-search-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  variant: "outline",
                  className: "border-primary/30 text-primary hover:bg-primary/5 font-body",
                  "data-ocid": "hero-search-btn",
                  children: "Search"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            className: "flex gap-6 text-sm text-muted-foreground pt-1",
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 0.5 },
            children: [
              { label: "12+", sub: "Categories" },
              { label: "200+", sub: "Products" },
              { label: "Free", sub: "Delivery" }
            ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-foreground text-xl leading-none", children: s.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: s.sub })
            ] }, s.label))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, scale: 1.03 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.7 },
          className: "relative order-1 md:order-2 h-56 md:h-auto overflow-hidden",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeroSlider, {})
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "categories", className: "bg-background py-14 md:py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: "text-center mb-10",
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-3xl md:text-4xl font-bold text-foreground mb-3", children: [
              "Shop by ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-luxury-accent", children: "Category" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body", children: "Explore our curated collections" })
          ]
        }
      ),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        !isBackendReady && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground font-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          "Connecting to store…"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", children: [
          "c1",
          "c2",
          "c3",
          "c4",
          "c5",
          "c6",
          "c7",
          "c8",
          "c9",
          "c10",
          "c11",
          "c12"
        ].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" }, k)) })
      ] }) : isError ? (
        // Only show error AFTER backend is ready and the query actually failed
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "text-center py-16 text-muted-foreground",
            "data-ocid": "categories-error",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-12 w-12 mx-auto mb-4 opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-lg font-semibold", children: "Could not load categories" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1 mb-5", children: "Please try again." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  onClick: handleRetry,
                  "data-ocid": "categories-retry",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-2" }),
                    "Try Again"
                  ]
                }
              )
            ]
          }
        )
      ) : categories && categories.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6",
          "data-ocid": "categories-grid",
          children: categories.map((cat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 16 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { delay: i * 0.06 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/category/$id",
                  params: { id: String(cat.id) },
                  search: { q: void 0 },
                  className: "group block",
                  "data-ocid": `category-card-${String(cat.id)}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-xl overflow-hidden bg-card border border-border/60 shadow-luxury hover:shadow-luxury-hover transition-smooth hover:border-primary/40 hover:-translate-y-1", children: [
                    cat.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: cat.imageUrl,
                        alt: cat.name,
                        className: "w-full h-32 object-cover transition-smooth group-hover:scale-105"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-32 flex items-center justify-center bg-muted text-5xl", children: CATEGORY_ICONS[cat.name] ?? "🛍️" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm text-foreground group-hover:text-primary transition-smooth truncate", children: cat.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-smooth flex-shrink-0" })
                    ] })
                  ] })
                }
              )
            },
            String(cat.id)
          ))
        }
      ) : (
        // Only show "No categories" if backend IS ready AND query succeeded with empty array
        // (This should rarely happen — backend always seeds 12 categories on startup)
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "text-center py-16 text-muted-foreground",
            "data-ocid": "categories-empty",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-12 w-12 mx-auto mb-4 opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-lg", children: "No categories yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1 mb-5", children: "Check back soon!" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  onClick: handleRetry,
                  "data-ocid": "categories-empty-retry",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-2" }),
                    "Refresh"
                  ]
                }
              )
            ]
          }
        )
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/30 border-y border-border/40 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-6 text-center", children: [
      { icon: "🚚", title: "Free Delivery", desc: "On all orders" },
      { icon: "📱", title: "EasyPaisa", desc: "03457393786" },
      { icon: "💬", title: "WhatsApp Orders", desc: "Instant confirm" },
      {
        icon: "✨",
        title: "Premium Quality",
        desc: "Handpicked items"
      }
    ].map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        className: "flex flex-col items-center gap-2",
        initial: { opacity: 0, y: 10 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { delay: i * 0.1 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-3xl", children: f.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-sm", children: f.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: f.desc })
        ]
      },
      f.title
    )) }) }) })
  ] });
}
export {
  HomePage as default
};
