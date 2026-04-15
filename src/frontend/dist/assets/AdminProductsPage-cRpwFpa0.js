import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Link, S as Skeleton } from "./index-BXOuU6Ia.js";
import { M as MultiImageUploader, F as FileUploader, A as AlertDialog, c as AlertDialogContent, d as AlertDialogHeader, e as AlertDialogTitle, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction, b as Pencil, a as Play, P as Plus } from "./FileUploader-DK0uLcij.js";
import { d as Layout, B as Badge, e as Button, f as ue, m as motion } from "./Layout-H0oWhtqi.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-2csGYuT2.js";
import { I as Input } from "./input-D4WMgf_h.js";
import { L as Label } from "./label-yw5-sppB.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BwunmBjS.js";
import { P as Package, S as Switch } from "./switch-CnzIUDWu.js";
import { u as useAdmin } from "./useAdmin-P_X9nPXL.js";
import { a as useCategories, q as useProductSlots, r as useInitializeCategorySlots, s as useAddProduct, t as useUpdateProduct, v as useDeleteProduct } from "./useBackend-DPbAOe5Q.js";
import { C as ChevronRight } from "./chevron-right-Bt0E1e50.js";
import { T as Trash2 } from "./trash-2-Dr2PRRgE.js";
import "./index-COJdbZaO.js";
import "./index-CHfX5RCr.js";
import "./index-12XgadAA.js";
import "./index-C-blUD9-.js";
const TOTAL_SLOTS = 20;
const SLOT_NUMBERS = Array.from({ length: TOTAL_SLOTS }, (_, i) => i + 1);
function makeEmptyForm(catId, slot) {
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
    discountPercent: 0
  };
}
function buildSlotMap(products) {
  const map = /* @__PURE__ */ new Map();
  const unslotted = [];
  for (const p of products) {
    const rawSlot = p.slotIndex;
    const si = rawSlot !== void 0 ? Number(rawSlot) : 0;
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
function AdminProductsPage() {
  var _a;
  const navigate = useNavigate();
  const { isLoggedIn } = useAdmin();
  reactExports.useEffect(() => {
    if (!isLoggedIn) navigate({ to: "/admin/login" });
  }, [isLoggedIn, navigate]);
  const { data: categories } = useCategories();
  const [activeCatId, setActiveCatId] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (categories && categories.length > 0 && !activeCatId) {
      setActiveCatId(String(categories[0].id));
    }
  }, [categories, activeCatId]);
  const categoryBigInt = activeCatId ? BigInt(activeCatId) : null;
  const { data: slotProducts, isLoading: slotsLoading } = useProductSlots(categoryBigInt);
  const { mutate: initSlots } = useInitializeCategorySlots();
  const { mutateAsync: addProduct, isPending: adding } = useAddProduct();
  const { mutateAsync: updateProduct, isPending: updating } = useUpdateProduct();
  const { mutateAsync: deleteProduct, isPending: deleting } = useDeleteProduct();
  reactExports.useEffect(() => {
    if (categoryBigInt !== null) {
      initSlots(categoryBigInt);
    }
  }, [categoryBigInt, initSlots]);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(makeEmptyForm("", 1));
  const slotMap = buildSlotMap(slotProducts ?? []);
  function openSlot(slotIndex) {
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
        discountPercent: Number(existing.discountPercent ?? 0)
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
      ue.error("Name is required");
      return;
    }
    if (!form.price || Number.isNaN(Number(form.price))) {
      ue.error("Valid price is required");
      return;
    }
    if (!form.categoryId) {
      ue.error("Please select a category");
      return;
    }
    try {
      const payload = {
        categoryId: BigInt(form.categoryId),
        name: form.name,
        description: form.description,
        price: BigInt(Math.round(Number(form.price))),
        imageUrls: form.imageUrls,
        videoUrl: form.videoUrl || void 0,
        available: form.available,
        slotIndex: form.slotIndex,
        discountEnabled: form.discountEnabled,
        discountPercent: BigInt(
          form.discountEnabled ? Math.round(form.discountPercent) : 0
        )
      };
      if (editTarget) {
        await updateProduct({ id: editTarget.id, ...payload });
        ue.success("Product updated!");
      } else {
        await addProduct(payload);
        ue.success("Product added!");
      }
      setShowForm(false);
    } catch {
      ue.error("Failed to save product");
    }
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget.id);
      ue.success("Product deleted");
      setDeleteTarget(null);
      setShowForm(false);
    } catch {
      ue.error("Failed to delete product");
    }
  }
  const activeCatName = ((_a = categories == null ? void 0 : categories.find((c) => String(c.id) === activeCatId)) == null ? void 0 : _a.name) ?? "";
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Products" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Manage Products" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body mt-0.5", children: "20 slots per category — click any slot to add or edit a product" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: activeCatId, onValueChange: setActiveCatId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "w-52 font-body text-sm",
              "data-ocid": "filter-category",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select category" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: categories == null ? void 0 : categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectItem,
            {
              value: String(c.id),
              className: "font-body",
              children: c.name
            },
            String(c.id)
          )) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto px-4", children: [
      activeCatId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-semibold text-foreground", children: activeCatName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "font-body text-xs", children: [
          slotMap.size,
          " / ",
          TOTAL_SLOTS,
          " filled"
        ] })
      ] }),
      slotsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3", children: SLOT_NUMBERS.map((slotNum) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 rounded-xl" }, slotNum)) }) : !activeCatId ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "text-center py-20 text-muted-foreground",
          "data-ocid": "no-category-selected",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-14 w-14 mx-auto mb-4 opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-semibold", children: "Select a category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body mt-1", children: "Choose a category above to manage its product slots" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3",
          "data-ocid": "admin-slots-grid",
          children: SLOT_NUMBERS.map((slotNum) => {
            const product = slotMap.get(slotNum);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              SlotCard,
              {
                slotIndex: slotNum,
                product: product ?? null,
                onClick: () => openSlot(slotNum)
              },
              slotNum
            );
          })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showForm, onOpenChange: setShowForm, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-card border-border/60 max-h-[90vh] overflow-y-auto sm:max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl", children: editTarget ? `Edit — Slot ${form.slotIndex}` : `Add Product — Slot ${form.slotIndex}` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm", children: "Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.name,
              onChange: (e) => setForm((p) => ({ ...p, name: e.target.value })),
              placeholder: "Product name",
              className: "font-body",
              "data-ocid": "product-name-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.description,
              onChange: (e) => setForm((p) => ({ ...p, description: e.target.value })),
              placeholder: "Short description",
              className: "font-body",
              "data-ocid": "product-desc-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm", children: "Price (PKR) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: "0",
              value: form.price,
              onChange: (e) => setForm((p) => ({ ...p, price: e.target.value })),
              placeholder: "e.g. 1500",
              className: "font-body",
              "data-ocid": "product-price-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm font-semibold", children: "Product Photos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body -mt-1", children: "Ek ya zyada photos add karein — pehli photo main thumbnail hogi" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            MultiImageUploader,
            {
              images: form.imageUrls,
              onChange: (urls) => setForm((p) => ({ ...p, imageUrls: urls })),
              maxImages: 10,
              ocid: "product-img-upload"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm", children: "Product Video (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FileUploader,
            {
              accept: "video",
              currentUrl: form.videoUrl,
              onUploaded: (url) => setForm((p) => ({ ...p, videoUrl: url })),
              label: "Upload Video",
              ocid: "product-video-upload"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm", children: "Category *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.categoryId,
              onValueChange: (v) => setForm((p) => ({ ...p, categoryId: v })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "font-body",
                    "data-ocid": "product-category-select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select category" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: categories == null ? void 0 : categories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectItem,
                  {
                    value: String(c.id),
                    className: "font-body",
                    children: c.name
                  },
                  String(c.id)
                )) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              id: "available",
              checked: form.available,
              onCheckedChange: (v) => setForm((p) => ({ ...p, available: v })),
              "data-ocid": "product-available-switch"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "available",
              className: "font-body text-sm cursor-pointer",
              children: "Available for sale"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border/60 rounded-lg p-3 bg-muted/20 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                id: "discount-enabled",
                checked: form.discountEnabled,
                onCheckedChange: (v) => setForm((p) => ({
                  ...p,
                  discountEnabled: v,
                  discountPercent: v ? p.discountPercent || 10 : 0
                })),
                "data-ocid": "product-discount-switch"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "discount-enabled",
                className: "font-body text-sm cursor-pointer font-semibold",
                children: "Enable Sale / Off"
              }
            ),
            form.discountEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full font-body", children: [
              form.discountPercent,
              "% OFF"
            ] })
          ] }),
          form.discountEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-xs text-muted-foreground", children: "Discount Percentage (1–99)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: "1",
                max: "99",
                value: form.discountPercent,
                onChange: (e) => setForm((p) => ({
                  ...p,
                  discountPercent: Math.min(
                    99,
                    Math.max(1, Number(e.target.value) || 0)
                  )
                })),
                placeholder: "e.g. 20",
                className: "font-body w-32",
                "data-ocid": "product-discount-input"
              }
            ),
            form.price && Number(form.price) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body", children: [
              "PKR ",
              Number(form.price).toLocaleString(),
              " →",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-500 font-semibold", children: [
                "PKR",
                " ",
                Math.round(
                  Number(form.price) * (1 - form.discountPercent / 100)
                ).toLocaleString()
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex-col-reverse sm:flex-row gap-2", children: [
        editTarget && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            className: "font-body border-destructive/40 text-destructive hover:bg-destructive/10 gap-1.5 mr-auto",
            onClick: () => setDeleteTarget(editTarget),
            disabled: deleting,
            "data-ocid": "product-delete-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
              " Delete Slot"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setShowForm(false),
            className: "font-body border-border",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "gradient-gold-accent text-primary-foreground font-body",
            onClick: handleSave,
            disabled: adding || updating,
            "data-ocid": "product-save-btn",
            children: adding || updating ? "Saving..." : "Save"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialog,
      {
        open: !!deleteTarget,
        onOpenChange: (v) => !v && setDeleteTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "bg-card border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display", children: "Delete Product?" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground font-body", children: [
            'Are you sure you want to delete "',
            deleteTarget == null ? void 0 : deleteTarget.name,
            '"? The slot will become empty.'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "font-body", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                className: "bg-destructive text-destructive-foreground font-body hover:bg-destructive/90",
                onClick: handleDelete,
                disabled: deleting,
                "data-ocid": "product-delete-confirm",
                children: deleting ? "Deleting..." : "Delete"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function SlotCard({ slotIndex, product, onClick }) {
  var _a, _b;
  const isFilled = product !== null && product.name.trim() !== "";
  const thumbUrl = isFilled && product ? ((_a = product.imageUrls) == null ? void 0 : _a[0]) ?? "" : "";
  const photoCount = isFilled && product ? ((_b = product.imageUrls) == null ? void 0 : _b.length) ?? 0 : 0;
  if (isFilled && product) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.button,
      {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { delay: (slotIndex - 1) * 0.025 },
        onClick,
        className: "group relative bg-card border border-border/60 rounded-xl overflow-hidden shadow-luxury text-left hover:shadow-xl hover:border-primary/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "data-ocid": `slot-card-${slotIndex}`,
        "aria-label": `Edit slot ${slotIndex}: ${product.name}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2 z-10 bg-primary/90 text-primary-foreground text-xs font-bold font-body px-1.5 py-0.5 rounded-md leading-none", children: slotIndex }),
          product.discountEnabled && Number(product.discountPercent) > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] font-bold font-body px-1.5 py-0.5 rounded-md leading-none", children: [
            Number(product.discountPercent),
            "% OFF"
          ] }) : photoCount > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 right-2 z-10 bg-background/80 text-foreground text-[10px] font-bold font-body px-1.5 py-0.5 rounded-md leading-none border border-border/40", children: [
            photoCount,
            " pics"
          ] }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-200 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card/90 rounded-full p-2 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4 text-primary" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-square w-full overflow-hidden bg-muted", children: [
            thumbUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: thumbUrl,
                alt: product.name,
                className: "h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-10 w-10 text-muted-foreground/40" }) }),
            product.videoUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[4.5rem] right-2 bg-primary rounded-full p-1 shadow-sm z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3 w-3 text-primary-foreground fill-current" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body font-semibold text-xs text-foreground line-clamp-1 leading-tight", children: product.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-primary font-display font-bold text-sm mt-0.5", children: [
              "PKR ",
              Number(product.price).toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: product.available ? "default" : "secondary",
                className: "text-[10px] mt-1 font-body px-1.5 py-0",
                children: product.available ? "Active" : "Hidden"
              }
            )
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { delay: (slotIndex - 1) * 0.025 },
      onClick,
      className: "group relative border-2 border-dashed border-border/50 hover:border-primary/60 rounded-xl bg-muted/20 hover:bg-primary/5 transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[11rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      "data-ocid": `slot-empty-${slotIndex}`,
      "aria-label": `Add product to slot ${slotIndex}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2 text-xs font-bold font-body text-muted-foreground/60", children: slotIndex }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted rounded-full p-2.5 group-hover:bg-primary/10 transition-colors duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-body text-muted-foreground group-hover:text-primary transition-colors duration-200 text-center px-2 leading-tight", children: [
          "Slot ",
          slotIndex,
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] opacity-70", children: "Tap to Add" })
        ] })
      ]
    }
  );
}
export {
  AdminProductsPage as default
};
