import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Loader2,
  Megaphone,
  RefreshCw,
  Search,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { HeroSlider } from "../components/HeroSlider";
import { Layout } from "../components/Layout";
import {
  useCategories,
  useGetAnnouncement,
  useIsBackendReady,
} from "../hooks/useBackend";

const CATEGORY_ICONS: Record<string, string> = {
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
  Accessories: "🎀",
};

export default function HomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isBackendReady = useIsBackendReady();
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError,
    refetch,
    isFetching,
  } = useCategories();
  const { data: announcement } = useGetAnnouncement();
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Kami Shopsy - Pakistan Online Store | Shop Now";
  }, []);

  const showBanner =
    !announcementDismissed &&
    announcement != null &&
    announcement.isActive === true &&
    typeof announcement.message === "string" &&
    announcement.message.trim() !== "";

  // Show loading skeleton while:
  // 1. Backend actor is still initialising (not yet ready)
  // 2. Query is actively loading/fetching
  // 3. We have no data yet (first load)
  const isLoading =
    !isBackendReady || categoriesLoading || (isFetching && !categories);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate({
        to: "/category/$id",
        params: { id: "all" },
        search: { q },
      });
    }
  }

  function handleRetry() {
    // Re-invalidate and refetch categories from scratch
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    void refetch();
  }

  return (
    <Layout>
      {/* ── Announcement Banner ── */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            key="announcement-banner"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative overflow-hidden"
            data-ocid="announcement-banner"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.72 0.18 55) 0%, oklch(0.65 0.20 130) 50%, oklch(0.72 0.18 55) 100%)",
            }}
          >
            {/* Decorative shimmer line */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
              }}
            />
            <div className="container mx-auto px-4 py-3 flex items-center gap-3">
              <span className="flex-shrink-0 bg-white/20 rounded-full p-1.5">
                <Megaphone className="h-4 w-4 text-white" />
              </span>
              <p className="flex-1 text-white font-body font-semibold text-sm leading-snug">
                {announcement?.message}
              </p>
              <button
                type="button"
                onClick={() => setAnnouncementDismissed(true)}
                className="flex-shrink-0 text-white/80 hover:text-white transition-smooth rounded-full p-1 hover:bg-white/20"
                aria-label="Dismiss announcement"
                data-ocid="announcement-dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero — split layout with generated image */}
      <section className="relative overflow-hidden bg-card border-b border-border/60">
        <div className="container mx-auto px-0 md:px-0">
          <div className="grid md:grid-cols-2 min-h-[480px] md:min-h-[520px]">
            {/* Left: text content */}
            <div className="flex flex-col justify-center gap-5 px-6 md:px-12 py-12 order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="bg-primary/10 text-primary border-primary/20 font-body tracking-widest uppercase text-xs px-4 py-1">
                  <Star className="h-3 w-3 mr-1 fill-current inline-block" />
                  Premium Pakistani Store
                </Badge>
              </motion.div>
              <motion.h1
                className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Welcome to{" "}
                <span className="text-luxury-accent">Kami Shopsy</span>
              </motion.h1>
              <motion.p
                className="text-muted-foreground font-body text-base max-w-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                Discover premium fashion, fragrances, home decor &amp; more —
                quality guaranteed with fast delivery across Pakistan.
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Button
                  size="lg"
                  className="gradient-gold-accent text-primary-foreground font-body font-semibold gap-2 shadow-luxury hover:shadow-luxury-hover transition-smooth"
                  asChild
                  data-ocid="hero-shop-now"
                >
                  <a href="#categories">
                    <ShoppingBag className="h-5 w-5" />
                    Shop Now
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="font-body border-primary/30 text-primary hover:bg-primary/5 transition-smooth"
                  asChild
                >
                  <Link
                    to="/category/$id"
                    params={{ id: "all" }}
                    search={{ q: undefined }}
                  >
                    View All Products
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>

              {/* Search bar */}
              <motion.form
                onSubmit={handleSearch}
                className="flex gap-2 mt-1 max-w-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 font-body bg-background border-border/60 focus:border-primary/50"
                    data-ocid="hero-search-input"
                  />
                </div>
                <Button
                  type="submit"
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/5 font-body"
                  data-ocid="hero-search-btn"
                >
                  Search
                </Button>
              </motion.form>
              <motion.div
                className="flex gap-6 text-sm text-muted-foreground pt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[
                  { label: "12+", sub: "Categories" },
                  { label: "200+", sub: "Products" },
                  { label: "Free", sub: "Delivery" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col gap-0.5">
                    <span className="font-display font-bold text-foreground text-xl leading-none">
                      {s.label}
                    </span>
                    <span className="text-xs">{s.sub}</span>
                  </div>
                ))}
              </motion.div>
            </div>
            {/* Right: hero slideshow */}
            <motion.div
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative order-1 md:order-2 h-56 md:h-auto overflow-hidden"
            >
              <HeroSlider />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="bg-background py-14 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Shop by <span className="text-luxury-accent">Category</span>
            </h2>
            <p className="text-muted-foreground font-body">
              Explore our curated collections
            </p>
          </motion.div>

          {/* Loading state — shown while actor initialises OR while first fetch is in-flight */}
          {isLoading ? (
            <div>
              {/* "Connecting..." pill shown while backend actor warms up */}
              {!isBackendReady && (
                <div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground font-body">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting to store…
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[
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
                  "c12",
                ].map((k) => (
                  <Skeleton key={k} className="h-40 rounded-xl" />
                ))}
              </div>
            </div>
          ) : isError ? (
            // Only show error AFTER backend is ready and the query actually failed
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="categories-error"
            >
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="font-body text-lg font-semibold">
                Could not load categories
              </p>
              <p className="text-sm mt-1 mb-5">Please try again.</p>
              <Button
                variant="outline"
                onClick={handleRetry}
                data-ocid="categories-retry"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : categories && categories.length > 0 ? (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6"
              data-ocid="categories-grid"
            >
              {categories.map((cat, i) => (
                <motion.div
                  key={String(cat.id)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to="/category/$id"
                    params={{ id: String(cat.id) }}
                    search={{ q: undefined }}
                    className="group block"
                    data-ocid={`category-card-${String(cat.id)}`}
                  >
                    <div className="relative rounded-xl overflow-hidden bg-card border border-border/60 shadow-luxury hover:shadow-luxury-hover transition-smooth hover:border-primary/40 hover:-translate-y-1">
                      {cat.imageUrl ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="w-full h-32 object-cover transition-smooth group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-32 flex items-center justify-center bg-muted text-5xl">
                          {CATEGORY_ICONS[cat.name] ?? "🛍️"}
                        </div>
                      )}
                      <div className="p-3 flex items-center justify-between">
                        <p className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-smooth truncate">
                          {cat.name}
                        </p>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-smooth flex-shrink-0" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            // Only show "No categories" if backend IS ready AND query succeeded with empty array
            // (This should rarely happen — backend always seeds 12 categories on startup)
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="categories-empty"
            >
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="font-body text-lg">No categories yet</p>
              <p className="text-sm mt-1 mb-5">Check back soon!</p>
              <Button
                variant="outline"
                onClick={handleRetry}
                data-ocid="categories-empty-retry"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-muted/30 border-y border-border/40 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: "🚚", title: "Free Delivery", desc: "On all orders" },
              { icon: "📱", title: "EasyPaisa", desc: "03457393786" },
              { icon: "💬", title: "WhatsApp Orders", desc: "Instant confirm" },
              {
                icon: "✨",
                title: "Premium Quality",
                desc: "Handpicked items",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-3xl">{f.icon}</span>
                <p className="font-display font-semibold text-foreground text-sm">
                  {f.title}
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
