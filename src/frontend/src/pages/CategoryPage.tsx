import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Link,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import {
  AlertCircle,
  ChevronRight,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  Share2,
  ShoppingBag,
  ShoppingCart,
  Truck,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import {
  useAllProducts,
  useCategories,
  useIsBackendReady,
  useProductsByCategory,
} from "../hooks/useBackend";
import type { Product } from "../types";

/** Safe numeric formatter — returns '0' if value is falsy */
function formatPrice(price: bigint | undefined | null): string {
  if (price == null) return "0";
  try {
    return Number(price).toLocaleString();
  } catch {
    return "0";
  }
}

/** Compute discounted price — returns null if discount not active */
function calcDiscounted(
  price: bigint,
  discountEnabled: boolean,
  discountPercent: bigint,
): number | null {
  if (!discountEnabled || Number(discountPercent) <= 0) return null;
  return Math.round(Number(price) * (1 - Number(discountPercent) / 100));
}

/** Free Delivery badge used on every product card */
function FreeDeliveryBadge() {
  return (
    <div className="flex items-center gap-1 text-xs font-body font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 w-fit">
      <Truck className="h-3 w-3 flex-shrink-0" />
      Free Delivery
    </div>
  );
}

export default function CategoryPage() {
  const { id } = useParams({ from: "/category/$id" });
  const { q: searchParam } = useSearch({ from: "/category/$id" });
  const navigate = useNavigate();
  const isAll = id === "all";
  const isBackendReady = useIsBackendReady();

  // Safe BigInt conversion — returns null if id is not a valid integer
  let categoryId: bigint | null = null;
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
    refetch: refetchAll,
  } = useAllProducts();
  const {
    data: catProducts,
    isLoading: catLoading,
    isError: catError,
    isFetching: catFetching,
    refetch: refetchCat,
  } = useProductsByCategory(categoryId);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParam ?? "");

  // Sync search input when URL param changes
  useEffect(() => {
    setSearchQuery(searchParam ?? "");
  }, [searchParam]);

  const rawLoading = isAll ? allLoading : catLoading;
  const rawFetching = isAll ? allFetching : catFetching;
  const isError = isAll ? allError : catError;
  const refetch = isAll ? refetchAll : refetchCat;
  const rawProducts: Product[] | undefined = isAll ? allProducts : catProducts;

  // Show loading when backend not ready, or query still in flight with no data
  const isLoading =
    !isBackendReady || rawLoading || (rawFetching && !rawProducts);

  // Client-side search filter
  const products: Product[] | undefined =
    searchQuery.trim() && rawProducts
      ? rawProducts.filter((p) =>
          (p.name ?? "")
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase()),
        )
      : rawProducts;

  const category = categories?.find((c) => String(c.id) === id);

  // If categoryId is invalid (non-numeric), show error
  const invalidId = !isAll && categoryId === null;

  useEffect(() => {
    if (isAll) {
      document.title = "All Products - Kami Shopsy";
    } else if (category?.name) {
      document.title = `${category.name} - Kami Shopsy`;
    } else {
      document.title = "Products - Kami Shopsy";
    }
  }, [isAll, category?.name]);

  function handleShare(productId: bigint) {
    const pid = String(productId);
    const url = `${window.location.origin}/product/${pid}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopiedId(pid);
        toast.success("Link copied!");
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => {
        toast.error("Could not copy link");
      });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate({
      to: "/category/$id",
      params: { id },
      search: { q: q || undefined },
    });
  }

  function clearSearch() {
    setSearchQuery("");
    navigate({ to: "/category/$id", params: { id }, search: { q: undefined } });
  }

  return (
    <Layout>
      {/* Breadcrumb + heading */}
      <div className="bg-card border-b border-border/60">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-3 font-body">
            <Link to="/" className="hover:text-primary transition-smooth">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-primary">
              {isAll ? "All Products" : (category?.name ?? "Category")}
            </span>
          </nav>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {isAll ? "All Products" : (category?.name ?? "Products")}
          </h1>
          {category?.description && (
            <p className="text-muted-foreground mt-1 font-body">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Category pills */}
      {!isAll && categories && (
        <div className="bg-background border-b border-border/40 overflow-x-auto">
          <div className="container mx-auto px-4 py-3 flex gap-2">
            <Link
              to="/category/$id"
              params={{ id: "all" }}
              search={{ q: undefined }}
            >
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-smooth font-body whitespace-nowrap"
              >
                All
              </Badge>
            </Link>
            {categories.map((c) => (
              <Link
                key={String(c.id)}
                to="/category/$id"
                params={{ id: String(c.id) }}
                search={{ q: undefined }}
              >
                <Badge
                  variant={String(c.id) === id ? "default" : "outline"}
                  className={`cursor-pointer transition-smooth font-body whitespace-nowrap ${String(c.id) === id ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 hover:border-primary/40"}`}
                >
                  {c.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Search bar */}
      <div className="bg-background border-b border-border/40">
        <div className="container mx-auto px-4 py-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 font-body border-border/60 focus:border-primary/50"
                data-ocid="category-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/5 font-body"
              data-ocid="category-search-btn"
            >
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Products grid */}
      <section className="bg-background py-10">
        <div className="container mx-auto px-4">
          {invalidId ? (
            <div
              className="text-center py-20 text-muted-foreground"
              data-ocid="products-invalid"
            >
              <AlertCircle className="h-14 w-14 mx-auto mb-4 opacity-30" />
              <p className="font-display text-xl font-semibold mb-2">
                Category not found
              </p>
              <p className="font-body text-sm mb-6">
                This category does not exist.
              </p>
              <Button asChild variant="outline">
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          ) : isLoading ? (
            <div>
              {/* Connecting pill while backend warms up */}
              {!isBackendReady && (
                <div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground font-body">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting to store…
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"].map((k) => (
                  <Skeleton key={k} className="h-64 rounded-lg" />
                ))}
              </div>
            </div>
          ) : isError ? (
            // Only shown after backend is confirmed ready and query failed
            <div
              className="text-center py-20 text-muted-foreground"
              data-ocid="products-error"
            >
              <AlertCircle className="h-14 w-14 mx-auto mb-4 opacity-30" />
              <p className="font-display text-xl font-semibold mb-2">
                Something went wrong
              </p>
              <p className="font-body text-sm mb-6">
                Could not load products. Please try again.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  data-ocid="products-retry"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button asChild variant="outline">
                  <Link to="/">Go Home</Link>
                </Button>
              </div>
            </div>
          ) : products && products.length > 0 ? (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5"
              data-ocid="products-grid"
            >
              {products.map((product, i) => {
                const discounted = calcDiscounted(
                  product.price,
                  product.discountEnabled ?? false,
                  product.discountPercent ?? BigInt(0),
                );
                return (
                  <motion.div
                    key={String(product.id)}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="group bg-card border border-border/60 rounded-lg overflow-hidden shadow-luxury hover:shadow-luxury-hover hover:border-primary/40 transition-smooth flex flex-col"
                    data-ocid={`product-card-${String(product.id)}`}
                  >
                    {/* Image */}
                    <Link
                      to="/product/$id"
                      params={{ id: String(product.id) }}
                      className="relative block overflow-hidden"
                    >
                      {product.imageUrls?.[0] ? (
                        <img
                          src={product.imageUrls[0]}
                          alt={product.name ?? "Product"}
                          className="w-full h-44 object-cover transition-smooth group-hover:scale-105"
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-44 bg-muted flex items-center justify-center text-5xl">
                          🛍️
                        </div>
                      )}
                      {/* Sale badge — top-left corner */}
                      {discounted !== null && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold font-body px-2 py-0.5 rounded-full shadow-sm">
                          {Number(product.discountPercent)}% OFF
                        </div>
                      )}
                      {product.available === false && (
                        <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                          <Badge variant="secondary" className="font-body">
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                    </Link>

                    {/* Info */}
                    <div className="p-3 flex flex-col gap-2 flex-1">
                      <h3 className="font-body font-semibold text-sm text-foreground line-clamp-2 leading-tight">
                        {product.name ?? "—"}
                      </h3>
                      {discounted !== null ? (
                        <div className="flex flex-col gap-0.5">
                          <p className="text-red-500 font-display font-bold text-base">
                            PKR {discounted.toLocaleString()}
                          </p>
                          <p className="text-muted-foreground font-body text-xs line-through">
                            PKR {formatPrice(product.price)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-primary font-display font-bold text-base">
                          PKR {formatPrice(product.price)}
                        </p>
                      )}
                      {/* Free Delivery badge */}
                      <FreeDeliveryBadge />
                      <div className="flex flex-col gap-1.5 mt-auto">
                        <Button
                          size="sm"
                          className="w-full text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth font-semibold"
                          asChild
                          data-ocid={`product-shop-now-${String(product.id)}`}
                        >
                          <Link
                            to="/product/$id"
                            params={{ id: String(product.id) }}
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Shop Now
                          </Link>
                        </Button>
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs border-border hover:border-primary/40 hover:text-primary transition-smooth"
                            asChild
                            data-ocid={`product-visit-${String(product.id)}`}
                          >
                            <Link
                              to="/product/$id"
                              params={{ id: String(product.id) }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Visit
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 px-2 text-xs border-border hover:border-primary/40 hover:text-primary transition-smooth"
                            onClick={() => handleShare(product.id)}
                            aria-label="Share product"
                            data-ocid={`product-share-${String(product.id)}`}
                          >
                            <Share2 className="h-3 w-3 mr-1" />
                            {copiedId === String(product.id)
                              ? "✓ Copied"
                              : "Share"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : searchQuery.trim() ? (
            <div
              className="text-center py-20 text-muted-foreground"
              data-ocid="products-no-search"
            >
              <Search className="h-14 w-14 mx-auto mb-4 opacity-30" />
              <p className="font-display text-xl font-semibold mb-2">
                No products found
              </p>
              <p className="font-body text-sm mb-6">
                No products matching &quot;{searchQuery}&quot;
              </p>
              <Button variant="outline" onClick={clearSearch}>
                Clear Search
              </Button>
            </div>
          ) : (
            // Only show "No products" when backend is confirmed ready
            <div
              className="text-center py-20 text-muted-foreground"
              data-ocid="products-empty"
            >
              <ShoppingBag className="h-14 w-14 mx-auto mb-4 opacity-30" />
              <p className="font-display text-xl font-semibold mb-2">
                No products yet
              </p>
              <p className="font-body text-sm">
                Products will appear here once added by admin.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
