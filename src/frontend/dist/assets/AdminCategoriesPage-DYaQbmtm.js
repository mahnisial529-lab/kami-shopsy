import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Link, S as Skeleton } from "./index-BXOuU6Ia.js";
import { P as Plus, a as Play, b as Pencil, F as FileUploader, A as AlertDialog, c as AlertDialogContent, d as AlertDialogHeader, e as AlertDialogTitle, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./FileUploader-DK0uLcij.js";
import { d as Layout, e as Button, m as motion, f as ue } from "./Layout-H0oWhtqi.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-2csGYuT2.js";
import { I as Input } from "./input-D4WMgf_h.js";
import { L as Label } from "./label-yw5-sppB.js";
import { u as useAdmin } from "./useAdmin-P_X9nPXL.js";
import { a as useCategories, n as useAddCategory, o as useUpdateCategory, p as useDeleteCategory } from "./useBackend-DPbAOe5Q.js";
import { C as ChevronRight } from "./chevron-right-Bt0E1e50.js";
import { L as LayoutGrid } from "./layout-grid-Dtz_L7M8.js";
import { T as Trash2 } from "./trash-2-Dr2PRRgE.js";
import "./index-COJdbZaO.js";
import "./index-CHfX5RCr.js";
const EMPTY_FORM = {
  name: "",
  description: "",
  imageUrl: "",
  videoUrl: ""
};
function AdminCategoriesPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAdmin();
  reactExports.useEffect(() => {
    if (!isLoggedIn) navigate({ to: "/admin/login" });
  }, [isLoggedIn, navigate]);
  const { data: categories, isLoading } = useCategories();
  const { mutateAsync: addCategory, isPending: adding } = useAddCategory();
  const { mutateAsync: updateCategory, isPending: updating } = useUpdateCategory();
  const { mutateAsync: deleteCategory, isPending: deleting } = useDeleteCategory();
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  function openAdd() {
    setForm(EMPTY_FORM);
    setEditTarget(null);
    setShowForm(true);
  }
  function openEdit(cat) {
    setForm({
      name: cat.name,
      description: cat.description,
      imageUrl: cat.imageUrl,
      videoUrl: cat.videoUrl ?? ""
    });
    setEditTarget(cat);
    setShowForm(true);
  }
  async function handleSave() {
    if (!form.name.trim()) {
      ue.error("Name is required");
      return;
    }
    try {
      const payload = {
        name: form.name,
        description: form.description,
        imageUrl: form.imageUrl,
        videoUrl: form.videoUrl || void 0
      };
      if (editTarget) {
        await updateCategory({ id: editTarget.id, ...payload });
        ue.success("Category updated!");
      } else {
        await addCategory(payload);
        ue.success("Category added!");
      }
      setShowForm(false);
    } catch {
      ue.error("Failed to save category");
    }
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id);
      ue.success("Category deleted");
      setDeleteTarget(null);
    } catch {
      ue.error("Failed to delete category");
    }
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Categories" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Manage Categories" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "gradient-gold-accent text-primary-foreground font-body gap-2 shadow-luxury transition-smooth",
            onClick: openAdd,
            "data-ocid": "add-category-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
              "Add Category"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-background py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4", children: ["c1", "c2", "c3", "c4", "c5", "c6"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 rounded-lg" }, k)) }) : categories && categories.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4",
        "data-ocid": "admin-categories-grid",
        children: categories.map((cat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: i * 0.05 },
            className: "bg-card border border-border/60 rounded-lg p-4 shadow-luxury flex items-center gap-4",
            "data-ocid": `admin-category-${String(cat.id)}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0", children: [
                cat.imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: cat.imageUrl,
                    alt: cat.name,
                    className: "h-14 w-14 rounded object-cover border border-border/40"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-6 w-6 text-muted-foreground" }) }),
                cat.videoUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 bg-primary rounded-full p-0.5 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-2.5 w-2.5 text-primary-foreground fill-current" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground truncate", children: cat.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body line-clamp-1 mt-0.5", children: cat.description || "No description" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 flex-shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "icon",
                    variant: "ghost",
                    className: "h-8 w-8 text-muted-foreground hover:text-primary transition-smooth",
                    onClick: () => openEdit(cat),
                    "aria-label": "Edit",
                    "data-ocid": `edit-cat-${String(cat.id)}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "icon",
                    variant: "ghost",
                    className: "h-8 w-8 text-muted-foreground hover:text-destructive transition-smooth",
                    onClick: () => setDeleteTarget(cat),
                    "aria-label": "Delete",
                    "data-ocid": `delete-cat-${String(cat.id)}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                  }
                )
              ] })
            ]
          },
          String(cat.id)
        ))
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-20 text-muted-foreground",
        "data-ocid": "admin-categories-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-14 w-14 mx-auto mb-4 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-semibold mb-2", children: "No categories yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "gradient-gold-accent text-primary-foreground font-body gap-2 mt-4",
              onClick: openAdd,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                " Add First Category"
              ]
            }
          )
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showForm, onOpenChange: setShowForm, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-card border-border/60 max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-xl", children: editTarget ? "Edit Category" : "Add Category" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm", children: "Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.name,
              onChange: (e) => setForm((p) => ({ ...p, name: e.target.value })),
              placeholder: "Category name",
              className: "font-body",
              "data-ocid": "category-name-input"
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
              "data-ocid": "category-desc-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm", children: "Category Image" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FileUploader,
            {
              accept: "image",
              currentUrl: form.imageUrl,
              onUploaded: (url) => setForm((p) => ({ ...p, imageUrl: url })),
              label: "Upload Image",
              ocid: "category-img-upload"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-body text-sm", children: "Category Video (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FileUploader,
            {
              accept: "video",
              currentUrl: form.videoUrl,
              onUploaded: (url) => setForm((p) => ({ ...p, videoUrl: url })),
              label: "Upload Video",
              ocid: "category-video-upload"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
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
            "data-ocid": "category-save-btn",
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { className: "font-display", children: "Delete Category?" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground font-body", children: [
            'Are you sure you want to delete "',
            deleteTarget == null ? void 0 : deleteTarget.name,
            '"? This will also remove all products in this category.'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "font-body", children: "Cancel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                className: "bg-destructive text-destructive-foreground font-body hover:bg-destructive/90",
                onClick: handleDelete,
                disabled: deleting,
                "data-ocid": "category-delete-confirm",
                children: deleting ? "Deleting..." : "Delete"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  AdminCategoriesPage as default
};
