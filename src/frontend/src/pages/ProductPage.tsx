import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Share2,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { useCartContext } from "../contexts/CartContext";
import {
  useAddReview,
  useAllProducts,
  useCategories,
  useGetProductReviews,
} from "../hooks/useBackend";
import type { Review } from "../types";

/** Free Delivery badge — store-wide policy */
function FreeDeliveryBadge() {
  return (
    <div className="flex items-center gap-1.5 text-sm font-body font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 w-fit">
      <Truck className="h-4 w-4 flex-shrink-0" />
      Free Delivery
    </div>
  );
}

/** Star rating display */
function StarRating({
  rating,
  max = 5,
}: {
  rating: number;
  max?: number;
}) {
  const stars = [1, 2, 3, 4, 5].slice(0, max);
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => (
        <Star
          key={`star-${star}`}
          className={`h-4 w-4 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`}
        />
      ))}
    </div>
  );
}

/** Relative time — simple human-readable format */
function relativeTime(createdAt: bigint): string {
  const ms = Number(createdAt) / 1_000_000; // nanoseconds to ms
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(ms).toLocaleDateString("en-PK");
}

/** Single review card */
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border border-border/60 rounded-lg p-4 bg-card flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-body font-semibold text-sm text-foreground">
            {review.reviewerName}
          </p>
          <p className="text-xs text-muted-foreground font-body">
            {relativeTime(review.createdAt)}
          </p>
        </div>
        <StarRating rating={Number(review.rating)} />
      </div>
      <p className="text-sm text-muted-foreground font-body leading-relaxed">
        {review.comment}
      </p>
    </div>
  );
}

/** Interactive star rating picker */
function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={`Rate ${star} stars`}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/40 hover:text-amber-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams({ from: "/product/$id" });
  const navigate = useNavigate();
  const { data: products, isLoading } = useAllProducts();
  const { data: categories } = useCategories();
  const { addItem } = useCartContext();
  const [shareCopied, setShareCopied] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const prevIdRef = useRef<string>("");

  // Reviews state
  const productIdBigInt: bigint | null = (() => {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  })();
  const { data: reviews = [], isLoading: reviewsLoading } =
    useGetProductReviews(productIdBigInt);
  const { mutateAsync: addReview, isPending: isSubmittingReview } =
    useAddReview();

  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const product = products?.find((p) => String(p.id) === id);
  const category = categories?.find(
    (c) => product && c.id === product.categoryId,
  );

  // Normalise imageUrls — backend may return array
  const imageUrls: string[] =
    product?.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [];

  // Reset slide index when navigating to a different product
  if (id !== prevIdRef.current) {
    prevIdRef.current = id;
    setActiveImg(0);
  }

  useEffect(() => {
    if (product?.name) {
      document.title = `${product.name} - Kami Shopsy`;
    } else {
      document.title = "Product - Kami Shopsy";
    }
  }, [product?.name]);

  function prevImg() {
    setActiveImg((i) => (i - 1 + imageUrls.length) % imageUrls.length);
  }

  function nextImg() {
    setActiveImg((i) => (i + 1) % imageUrls.length);
  }

  function handleShare() {
    const url = `${window.location.origin}/product/${id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setShareCopied(true);
        toast.success("Link copied! Share it with friends 🔗");
        setTimeout(() => setShareCopied(false), 2500);
      })
      .catch(() => {
        toast.error("Could not copy link");
      });
  }

  function handleAddToCart() {
    if (!product) return;
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      imageUrl: imageUrls[0] ?? "",
    });
    toast.success(`${product.name} added to cart!`);
  }

  function handleBuyNow() {
    if (!product) return;
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      imageUrl: imageUrls[0] ?? "",
    });
    navigate({ to: "/checkout" });
  }

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productIdBigInt) return;
    if (!reviewName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (reviewRating === 0) {
      toast.error("Select a rating (1-5 stars)");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Write your review");
      return;
    }
    try {
      await addReview({
        productId: productIdBigInt,
        reviewerName: reviewName.trim(),
        rating: BigInt(reviewRating),
        comment: reviewComment.trim(),
      });
      toast.success("Review submitted successfully! Thank you");
      setReviewName("");
      setReviewRating(0);
      setReviewComment("");
    } catch {
      toast.error("Failed to submit review. Please try again.");
    }
  }

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 5);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid md:grid-cols-2 gap-10">
            <Skeleton className="h-96 rounded-lg" />
            <div className="flex flex-col gap-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="font-display text-2xl font-bold text-foreground mb-4">
            Product not found
          </p>
          <Button asChild variant="outline" className="font-body">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border/60">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground font-body">
            <Link to="/" className="hover:text-primary transition-smooth">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            {category && (
              <>
                <Link
                  to="/category/$id"
                  params={{ id: String(category.id) }}
                  search={{ q: undefined }}
                  className="hover:text-primary transition-smooth"
                >
                  {category.name}
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span className="text-primary truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product detail */}
      <section className="bg-background py-10">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 gap-2 text-muted-foreground hover:text-primary transition-smooth font-body"
            onClick={() =>
              navigate({
                to: "/category/$id",
                params: { id: String(product.categoryId) },
                search: { q: undefined },
              })
            }
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Image / Carousel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-lg overflow-hidden bg-card border border-border/60 shadow-luxury flex flex-col"
            >
              {/* Main image */}
              <div className="relative overflow-hidden">
                {imageUrls.length > 0 ? (
                  <img
                    src={imageUrls[activeImg]}
                    alt={product.name}
                    className="w-full h-96 object-cover transition-opacity duration-300"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center bg-muted text-7xl">
                    🛍️
                  </div>
                )}

                {/* Prev / Next arrows — only show when multiple images */}
                {imageUrls.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImg}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border/60 rounded-full p-1.5 shadow-md transition-smooth"
                      aria-label="Previous photo"
                      data-ocid="img-prev"
                    >
                      <ChevronLeft className="h-5 w-5 text-foreground" />
                    </button>
                    <button
                      type="button"
                      onClick={nextImg}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border border-border/60 rounded-full p-1.5 shadow-md transition-smooth"
                      aria-label="Next photo"
                      data-ocid="img-next"
                    >
                      <ChevronRight className="h-5 w-5 text-foreground" />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                      {imageUrls.map((url, i) => (
                        <button
                          key={`dot-${url.slice(-12)}`}
                          type="button"
                          onClick={() => setActiveImg(i)}
                          className={`rounded-full transition-all duration-200 ${
                            i === activeImg
                              ? "w-5 h-2 bg-primary"
                              : "w-2 h-2 bg-background/70 hover:bg-background"
                          }`}
                          aria-label={`Go to photo ${i + 1}`}
                          data-ocid={`img-dot-${i}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails strip — only when multiple images */}
              {imageUrls.length > 1 && (
                <div className="flex gap-2 p-3 bg-muted/30 overflow-x-auto">
                  {imageUrls.map((url, i) => (
                    <button
                      key={url.slice(-20)}
                      type="button"
                      onClick={() => setActiveImg(i)}
                      className={`flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-all duration-150 ${
                        i === activeImg
                          ? "border-primary shadow-sm"
                          : "border-border/40 hover:border-primary/50"
                      }`}
                      aria-label={`View photo ${i + 1}`}
                      data-ocid={`img-thumb-${i}`}
                    >
                      <img
                        src={url}
                        alt={`View ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col gap-5"
            >
              {category && (
                <Badge className="w-fit bg-primary/10 text-primary border-primary/20 font-body">
                  {category.name}
                </Badge>
              )}
              <h1 className="font-display text-3xl font-bold text-foreground leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                {(() => {
                  const discEnabled = product.discountEnabled ?? false;
                  const discPct = Number(product.discountPercent ?? 0);
                  const originalPrice = Number(product.price);
                  if (discEnabled && discPct > 0) {
                    const discountedPrice = Math.round(
                      originalPrice * (1 - discPct / 100),
                    );
                    const savings = originalPrice - discountedPrice;
                    return (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="font-display text-4xl font-bold text-red-500">
                            PKR {discountedPrice.toLocaleString()}
                          </p>
                          <span className="bg-red-500 text-white text-sm font-bold font-body px-2.5 py-1 rounded-full">
                            {discPct}% OFF
                          </span>
                        </div>
                        <p className="text-muted-foreground font-body text-base line-through">
                          PKR {originalPrice.toLocaleString()}
                        </p>
                        <p className="text-emerald-600 font-body text-sm font-semibold">
                          You save: PKR {savings.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return (
                    <p className="font-display text-4xl font-bold text-primary">
                      PKR {originalPrice.toLocaleString()}
                    </p>
                  );
                })()}
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 font-body border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 transition-smooth ml-auto"
                  onClick={handleShare}
                  aria-label="Share product"
                  data-ocid="product-share"
                >
                  <Share2 className="h-4 w-4" />
                  {shareCopied ? "Copied!" : "Share"}
                </Button>
              </div>

              {/* Free Delivery badge */}
              <FreeDeliveryBadge />

              {/* Review summary */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating
                    rating={Math.round(
                      reviews.reduce((sum, r) => sum + Number(r.rating), 0) /
                        reviews.length,
                    )}
                  />
                  <span className="text-sm text-muted-foreground font-body">
                    ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                  </span>
                </div>
              )}

              {product.description && (
                <p className="text-muted-foreground font-body leading-relaxed">
                  {product.description}
                </p>
              )}
              <div className="flex items-center gap-2">
                {product.available ? (
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 font-body">
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="font-body">
                    Out of Stock
                  </Badge>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Button
                  size="lg"
                  className="flex-1 gradient-gold-accent text-primary-foreground font-body font-semibold gap-2 shadow-luxury hover:shadow-luxury-hover transition-smooth"
                  disabled={!product.available}
                  onClick={handleBuyNow}
                  data-ocid="product-buy-now"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Buy Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 border-primary/30 text-primary hover:bg-primary/5 font-body transition-smooth"
                  disabled={!product.available}
                  onClick={handleAddToCart}
                  data-ocid="product-add-cart"
                >
                  Add to Cart
                </Button>
              </div>

              <p className="text-xs text-muted-foreground font-body">
                Orders confirmed via WhatsApp · Cash on Delivery & EasyPaisa
                accepted
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Reviews Section ── */}
      <section className="bg-muted/30 border-t border-border/40 py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-bold text-foreground">
              Customer Reviews
            </h2>
            {reviews.length > 0 && (
              <Badge className="bg-primary/10 text-primary border-primary/20 font-body">
                {reviews.length}
              </Badge>
            )}
          </div>

          {/* Existing reviews */}
          {reviewsLoading ? (
            <div className="flex flex-col gap-3 mb-8">
              {[1, 2].map((k) => (
                <Skeleton key={k} className="h-20 rounded-lg" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div
              className="text-center py-8 text-muted-foreground mb-8 border border-dashed border-border/60 rounded-xl"
              data-ocid="reviews-empty"
            >
              <Star className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p className="font-display font-semibold text-foreground">
                Be the first to review!
              </p>
              <p className="text-sm mt-1 font-body">
                Share your experience with this product
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 mb-8" data-ocid="reviews-list">
              {displayedReviews.map((review) => (
                <ReviewCard key={String(review.id)} review={review} />
              ))}
              {reviews.length > 5 && (
                <Button
                  variant="outline"
                  className="self-center font-body border-primary/30 text-primary hover:bg-primary/5"
                  onClick={() => setShowAllReviews((v) => !v)}
                  data-ocid="reviews-load-more"
                >
                  {showAllReviews
                    ? "Show less"
                    : `${reviews.length - 5} more reviews`}
                </Button>
              )}
            </div>
          )}

          {/* Write a review form */}
          <div className="bg-card border border-border/60 rounded-xl p-6 shadow-luxury">
            <h3 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              Write a Review
            </h3>
            <form
              onSubmit={handleReviewSubmit}
              className="flex flex-col gap-4"
              data-ocid="review-form"
            >
              <div className="grid gap-1.5">
                <Label htmlFor="review-name" className="font-body text-sm">
                  Your Name *
                </Label>
                <Input
                  id="review-name"
                  placeholder="e.g. Ahmed Ali"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  required
                  className="font-body border-border/60"
                  data-ocid="review-name-input"
                />
              </div>

              <div className="grid gap-1.5">
                <Label className="font-body text-sm">Rating *</Label>
                <StarPicker value={reviewRating} onChange={setReviewRating} />
                {reviewRating > 0 && (
                  <p className="text-xs text-muted-foreground font-body">
                    {
                      [
                        "",
                        "Not satisfied",
                        "Okay",
                        "Good",
                        "Very good",
                        "Excellent!",
                      ][reviewRating]
                    }
                  </p>
                )}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="review-comment" className="font-body text-sm">
                  Review *
                </Label>
                <Textarea
                  id="review-comment"
                  placeholder="What did you think? Share your thoughts on quality, delivery, or anything else..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  rows={3}
                  className="font-body border-border/60 resize-none"
                  data-ocid="review-comment-input"
                />
              </div>

              <Button
                type="submit"
                className="self-start gradient-gold-accent text-primary-foreground font-body font-semibold shadow-luxury hover:shadow-luxury-hover transition-smooth"
                disabled={isSubmittingReview}
                data-ocid="review-submit"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
