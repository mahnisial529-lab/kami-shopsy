import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  Package,
  Pencil,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileUploader, MultiImageUploader } from "../components/FileUploader";
import { Layout } from "../components/Layout";
import { useAdmin } from "../hooks/useAdmin";
import {
  useAddProduct,
  useCategories,
  useDeleteProduct,
  useInitializeCategorySlots,
  useProductSlots,
  useUpdateProduct,
} from "../hooks/useBackend";
import type { Product } from "../types";

const TOTAL_SLOTS = 20;
const SLOT_NUMBERS = Array.from({ length: TOTAL_SLOTS }, (_, i) => i + 1);

type ProductForm = {
  name: string;
  description: string;
  price: string;
  imageUrls: string[];
  videoUrl: string;
  categoryId: string;
  available: boolean;
  slotIndex: number;
  discountEnabled: boolean;
  discountPercent: number;
};

function makeEmptyForm(catId: string, slot: number): ProductForm {
  return {
    name: "",
    description: "",
    price: "",
    imageUrls: [],
    videoUrl: "",
    categoryId: catId,
    available: true,
    slotIndex: slot,
    discountEnabled: false,
    discountPercent: 0,
  };
}

// Build a map of slotIndex -> Product from a product array.
function buildSlotMap(products: Product[]): Map<number, Product> {
  const map = new Map<number, Product>();
  const unslotted: Product[] = [];

  for (const p of products) {
    const rawSlot = (p as Product & { slotIndex?: bigint }).slotIndex;
    const si = rawSlot !== undefined ? Number(rawSlot) : 0;
    if (si >= 1 && si <= TOTAL_SLOTS) {
      map.set(si, p);
    } else {
      unslotted.push(p);
    }
  }

  let nextSlot = 1;
  for (const p of unslotted) {
    while (map.has(nextSlot) && nextSlot <= TOTAL_SLOTS) nextSlot++;
    if (nextSlot <= TOTAL_SLOTS) {
      map.set(nextSlot, p);
      nextSlot++;
    }
  }

  return map;
}

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAdmin();
  useEffect(() => {
    if (!isLoggedIn) navigate({ to: "/admin/login" });
  }, [isLoggedIn, navigate]);

  const { data: categories } = useCategories();
  const [activeCatId, setActiveCatId] = useState<string>("");

  useEffect(() => {
    if (categories && categories.length > 0 && !activeCatId) {
      setActiveCatId(String(categories[0].id));
    }
  }, [categories, activeCatId]);

  const categoryBigInt = activeCatId ? BigInt(activeCatId) : null;

  const { data: slotProducts, isLoading: slotsLoading } =
    useProductSlots(categoryBigInt);
  const { mutate: initSlots } = useInitializeCategorySlots();
  const { mutateAsync: addProduct, isPending: adding } = useAddProduct();
  const { mutateAsync: updateProduct, isPending: updating } =
    useUpdateProduct();
  const { mutateAsync: deleteProduct, isPending: deleting } =
    useDeleteProduct();

  useEffect(() => {
    if (categoryBigInt !== null) {
      initSlots(categoryBigInt);
    }
  }, [categoryBigInt, initSlots]);

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(makeEmptyForm("", 1));

  const slotMap = buildSlotMap(slotProducts ?? []);

  function openSlot(slotIndex: number) {
    const existing = slotMap.get(slotIndex);
    if (existing) {
      setForm({
        name: existing.name,
        description: existing.description,
        price: String(existing.price),
        imageUrls: existing.imageUrls ?? [],
        videoUrl: existing.videoUrl ?? "",
        categoryId: String(existing.categoryId),
        available: existing.available,
        slotIndex,
        discountEnabled: existing.discountEnabled ?? false,
        discountPercent: Number(existing.discountPercent ?? 0),
      });
      setEditTarget(existing);
    } else {
      setForm(makeEmptyForm(activeCatId, slotIndex));
      setEditTarget(null);
    }
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!form.price || Number.isNaN(Number(form.price))) {
      toast.error("Valid price is required");
      return;
    }
    if (!form.categoryId) {
      toast.error("Please select a category");
      return;
    }
    try {
      const payload = {
        categoryId: BigInt(form.categoryId),
        name: form.name,
        description: form.description,
        price: BigInt(Math.round(Number(form.price))),
        imageUrls: form.imageUrls,
        videoUrl: form.videoUrl || undefined,
        available: form.available,
        slotIndex: form.slotIndex,
        discountEnabled: form.discountEnabled,
        discountPercent: BigInt(
          form.discountEnabled ? Math.round(form.discountPercent) : 0,
        ),
      };
      if (editTarget) {
        await updateProduct({ id: editTarget.id, ...payload });
        toast.success("Product updated!");
      } else {
        await addProduct(payload);
        toast.success("Product added!");
      }
      setShowForm(false);
    } catch {
      toast.error("Failed to save product");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      toast.success("Product deleted");
      setDeleteTarget(null);
      setShowForm(false);
    } catch {
      toast.error("Failed to delete product");
    }
  }

  const activeCatName =
    categories?.find((c) => String(c.id) === activeCatId)?.name ?? "";

  return (
    <Layout>
      {/* Header */}
      <div className="bg-card border-b border-border/60">
        <div className="container mx-auto px-4 py-5">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground font-body mb-2">
            <Link
              to="/admin/dashboard"
              className="hover:text-primary transition-smooth"
            >
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-primary">Products</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Manage Products
              </h1>
              <p className="text-sm text-muted-foreground font-body mt-0.5">
                20 slots per category — click any slot to add or edit a product
              </p>
            </div>
            <Select value={activeCatId} onValueChange={setActiveCatId}>
              <SelectTrigger
                className="w-52 font-body text-sm"
                data-ocid="filter-category"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((c) => (
                  <SelectItem
                    key={String(c.id)}
                    value={String(c.id)}
                    className="font-body"
                  >
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Slot grid */}
      <section className="bg-background py-8">
        <div className="container mx-auto px-4">
          {activeCatId && (
            <div className="mb-5 flex items-center gap-2">
              <span className="font-display text-lg font-semibold text-foreground">
                {activeCatName}
              </span>
              <Badge variant="secondary" className="font-body text-xs">
                {slotMap.size} / {TOTAL_SLOTS} filled
              </Badge>
            </div>
          )}

          {slotsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {SLOT_NUMBERS.map((slotNum) => (
                <Skeleton key={slotNum} className="h-44 rounded-xl" />
              ))}
            </div>
          ) : !activeCatId ? (
            <div
              className="text-center py-20 text-muted-foreground"
              data-ocid="no-category-selected"
            >
              <Package className="h-14 w-14 mx-auto mb-4 opacity-30" />
              <p className="font-display text-xl font-semibold">
                Select a category
              </p>
              <p className="text-sm font-body mt-1">
                Choose a category above to manage its product slots
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
              data-ocid="admin-slots-grid"
            >
              {SLOT_NUMBERS.map((slotNum) => {
                const product = slotMap.get(slotNum);
                return (
                  <SlotCard
                    key={slotNum}
                    slotIndex={slotNum}
                    product={product ?? null}
                    onClick={() => openSlot(slotNum)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-card border-border/60 max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editTarget
                ? `Edit — Slot ${form.slotIndex}`
                : `Add Product — Slot ${form.slotIndex}`}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="grid gap-2">
              <Label className="font-body text-sm">Name *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Product name"
                className="font-body"
                data-ocid="product-name-input"
              />
            </div>
            <div className="grid gap-2">
              <Label className="font-body text-sm">Description</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Short description"
                className="font-body"
                data-ocid="product-desc-input"
              />
            </div>
            <div className="grid gap-2">
              <Label className="font-body text-sm">Price (PKR) *</Label>
              <Input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) =>
                  setForm((p) => ({ ...p, price: e.target.value }))
                }
                placeholder="e.g. 1500"
                className="font-body"
                data-ocid="product-price-input"
              />
            </div>

            {/* Multi-image upload */}
            <div className="grid gap-2">
              <Label className="font-body text-sm font-semibold">
                Product Photos
              </Label>
              <p className="text-xs text-muted-foreground font-body -mt-1">
                Ek ya zyada photos add karein — pehli photo main thumbnail hogi
              </p>
              <MultiImageUploader
                images={form.imageUrls}
                onChange={(urls) => setForm((p) => ({ ...p, imageUrls: urls }))}
                maxImages={10}
                ocid="product-img-upload"
              />
            </div>

            {/* Video Upload */}
            <div className="grid gap-2">
              <Label className="font-body text-sm">
                Product Video (optional)
              </Label>
              <FileUploader
                accept="video"
                currentUrl={form.videoUrl}
                onUploaded={(url) => setForm((p) => ({ ...p, videoUrl: url }))}
                label="Upload Video"
                ocid="product-video-upload"
              />
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label className="font-body text-sm">Category *</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => setForm((p) => ({ ...p, categoryId: v }))}
              >
                <SelectTrigger
                  className="font-body"
                  data-ocid="product-category-select"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((c) => (
                    <SelectItem
                      key={String(c.id)}
                      value={String(c.id)}
                      className="font-body"
                    >
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="available"
                checked={form.available}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, available: v }))
                }
                data-ocid="product-available-switch"
              />
              <Label
                htmlFor="available"
                className="font-body text-sm cursor-pointer"
              >
                Available for sale
              </Label>
            </div>

            {/* Sale / Discount Toggle */}
            <div className="border border-border/60 rounded-lg p-3 bg-muted/20 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Switch
                  id="discount-enabled"
                  checked={form.discountEnabled}
                  onCheckedChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      discountEnabled: v,
                      discountPercent: v ? p.discountPercent || 10 : 0,
                    }))
                  }
                  data-ocid="product-discount-switch"
                />
                <Label
                  htmlFor="discount-enabled"
                  className="font-body text-sm cursor-pointer font-semibold"
                >
                  Enable Sale / Off
                </Label>
                {form.discountEnabled && (
                  <span className="ml-auto text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full font-body">
                    {form.discountPercent}% OFF
                  </span>
                )}
              </div>
              {form.discountEnabled && (
                <div className="grid gap-1.5">
                  <Label className="font-body text-xs text-muted-foreground">
                    Discount Percentage (1–99)
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="99"
                    value={form.discountPercent}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        discountPercent: Math.min(
                          99,
                          Math.max(1, Number(e.target.value) || 0),
                        ),
                      }))
                    }
                    placeholder="e.g. 20"
                    className="font-body w-32"
                    data-ocid="product-discount-input"
                  />
                  {form.price && Number(form.price) > 0 && (
                    <p className="text-xs text-muted-foreground font-body">
                      PKR {Number(form.price).toLocaleString()} →{" "}
                      <span className="text-red-500 font-semibold">
                        PKR{" "}
                        {Math.round(
                          Number(form.price) * (1 - form.discountPercent / 100),
                        ).toLocaleString()}
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            {editTarget && (
              <Button
                variant="outline"
                className="font-body border-destructive/40 text-destructive hover:bg-destructive/10 gap-1.5 mr-auto"
                onClick={() => setDeleteTarget(editTarget)}
                disabled={deleting}
                data-ocid="product-delete-btn"
              >
                <Trash2 className="h-4 w-4" /> Delete Slot
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="font-body border-border"
            >
              Cancel
            </Button>
            <Button
              className="gradient-gold-accent text-primary-foreground font-body"
              onClick={handleSave}
              disabled={adding || updating}
              data-ocid="product-save-btn"
            >
              {adding || updating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-card border-border/60">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete Product?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground font-body">
            Are you sure you want to delete "{deleteTarget?.name}"? The slot
            will become empty.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground font-body hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deleting}
              data-ocid="product-delete-confirm"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}

// ─── Slot Card ───────────────────────────────────────────────────────────────

interface SlotCardProps {
  slotIndex: number;
  product: Product | null;
  onClick: () => void;
}

function SlotCard({ slotIndex, product, onClick }: SlotCardProps) {
  const isFilled = product !== null && product.name.trim() !== "";
  const thumbUrl = isFilled && product ? (product.imageUrls?.[0] ?? "") : "";
  const photoCount = isFilled && product ? (product.imageUrls?.length ?? 0) : 0;

  if (isFilled && product) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: (slotIndex - 1) * 0.025 }}
        onClick={onClick}
        className="group relative bg-card border border-border/60 rounded-xl overflow-hidden shadow-luxury text-left hover:shadow-xl hover:border-primary/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        data-ocid={`slot-card-${slotIndex}`}
        aria-label={`Edit slot ${slotIndex}: ${product.name}`}
      >
        {/* Slot badge */}
        <div className="absolute top-2 left-2 z-10 bg-primary/90 text-primary-foreground text-xs font-bold font-body px-1.5 py-0.5 rounded-md leading-none">
          {slotIndex}
        </div>

        {/* Discount badge — visible to admin at a glance */}
        {product.discountEnabled && Number(product.discountPercent) > 0 ? (
          <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] font-bold font-body px-1.5 py-0.5 rounded-md leading-none">
            {Number(product.discountPercent)}% OFF
          </div>
        ) : photoCount > 1 ? (
          <div className="absolute top-2 right-2 z-10 bg-background/80 text-foreground text-[10px] font-bold font-body px-1.5 py-0.5 rounded-md leading-none border border-border/40">
            {photoCount} pics
          </div>
        ) : null}

        {/* Edit overlay */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-200 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-card/90 rounded-full p-2 shadow-lg">
            <Pencil className="h-4 w-4 text-primary" />
          </div>
        </div>

        {/* Image */}
        <div className="aspect-square w-full overflow-hidden bg-muted">
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Package className="h-10 w-10 text-muted-foreground/40" />
            </div>
          )}
          {product.videoUrl && (
            <div className="absolute bottom-[4.5rem] right-2 bg-primary rounded-full p-1 shadow-sm z-10">
              <Play className="h-3 w-3 text-primary-foreground fill-current" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-2.5">
          <p className="font-body font-semibold text-xs text-foreground line-clamp-1 leading-tight">
            {product.name}
          </p>
          <p className="text-primary font-display font-bold text-sm mt-0.5">
            PKR {Number(product.price).toLocaleString()}
          </p>
          <Badge
            variant={product.available ? "default" : "secondary"}
            className="text-[10px] mt-1 font-body px-1.5 py-0"
          >
            {product.available ? "Active" : "Hidden"}
          </Badge>
        </div>
      </motion.button>
    );
  }

  // Empty slot
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: (slotIndex - 1) * 0.025 }}
      onClick={onClick}
      className="group relative border-2 border-dashed border-border/50 hover:border-primary/60 rounded-xl bg-muted/20 hover:bg-primary/5 transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[11rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      data-ocid={`slot-empty-${slotIndex}`}
      aria-label={`Add product to slot ${slotIndex}`}
    >
      <div className="absolute top-2 left-2 text-xs font-bold font-body text-muted-foreground/60">
        {slotIndex}
      </div>
      <div className="bg-muted rounded-full p-2.5 group-hover:bg-primary/10 transition-colors duration-200">
        <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
      </div>
      <span className="text-xs font-body text-muted-foreground group-hover:text-primary transition-colors duration-200 text-center px-2 leading-tight">
        Slot {slotIndex}
        <br />
        <span className="text-[10px] opacity-70">Tap to Add</span>
      </span>
    </motion.button>
  );
}
