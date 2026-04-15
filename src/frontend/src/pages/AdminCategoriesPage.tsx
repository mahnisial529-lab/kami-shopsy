import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  LayoutGrid,
  Pencil,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileUploader } from "../components/FileUploader";
import { Layout } from "../components/Layout";
import { useAdmin } from "../hooks/useAdmin";
import {
  useAddCategory,
  useCategories,
  useDeleteCategory,
  useUpdateCategory,
} from "../hooks/useBackend";
import type { Category } from "../types";

type CategoryForm = {
  name: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
};

const EMPTY_FORM: CategoryForm = {
  name: "",
  description: "",
  imageUrl: "",
  videoUrl: "",
};

export default function AdminCategoriesPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAdmin();
  useEffect(() => {
    if (!isLoggedIn) navigate({ to: "/admin/login" });
  }, [isLoggedIn, navigate]);

  const { data: categories, isLoading } = useCategories();
  const { mutateAsync: addCategory, isPending: adding } = useAddCategory();
  const { mutateAsync: updateCategory, isPending: updating } =
    useUpdateCategory();
  const { mutateAsync: deleteCategory, isPending: deleting } =
    useDeleteCategory();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditTarget(null);
    setShowForm(true);
  }

  function openEdit(cat: Category) {
    setForm({
      name: cat.name,
      description: cat.description,
      imageUrl: cat.imageUrl,
      videoUrl: cat.videoUrl ?? "",
    });
    setEditTarget(cat);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    try {
      const payload = {
        name: form.name,
        description: form.description,
        imageUrl: form.imageUrl,
        videoUrl: form.videoUrl || undefined,
      };
      if (editTarget) {
        await updateCategory({ id: editTarget.id, ...payload });
        toast.success("Category updated!");
      } else {
        await addCategory(payload);
        toast.success("Category added!");
      }
      setShowForm(false);
    } catch {
      toast.error("Failed to save category");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCategory(deleteTarget.id);
      toast.success("Category deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete category");
    }
  }

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
            <span className="text-primary">Categories</span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Manage Categories
            </h1>
            <Button
              className="gradient-gold-accent text-primary-foreground font-body gap-2 shadow-luxury transition-smooth"
              onClick={openAdd}
              data-ocid="add-category-btn"
            >
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>
      </div>

      <section className="bg-background py-10">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {["c1", "c2", "c3", "c4", "c5", "c6"].map((k) => (
                <Skeleton key={k} className="h-28 rounded-lg" />
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              data-ocid="admin-categories-grid"
            >
              {categories.map((cat, i) => (
                <motion.div
                  key={String(cat.id)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border/60 rounded-lg p-4 shadow-luxury flex items-center gap-4"
                  data-ocid={`admin-category-${String(cat.id)}`}
                >
                  <div className="relative flex-shrink-0">
                    {cat.imageUrl ? (
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="h-14 w-14 rounded object-cover border border-border/40"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded bg-muted flex items-center justify-center">
                        <LayoutGrid className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    {cat.videoUrl && (
                      <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-0.5 shadow-sm">
                        <Play className="h-2.5 w-2.5 text-primary-foreground fill-current" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-foreground truncate">
                      {cat.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-body line-clamp-1 mt-0.5">
                      {cat.description || "No description"}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-primary transition-smooth"
                      onClick={() => openEdit(cat)}
                      aria-label="Edit"
                      data-ocid={`edit-cat-${String(cat.id)}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive transition-smooth"
                      onClick={() => setDeleteTarget(cat)}
                      aria-label="Delete"
                      data-ocid={`delete-cat-${String(cat.id)}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div
              className="text-center py-20 text-muted-foreground"
              data-ocid="admin-categories-empty"
            >
              <LayoutGrid className="h-14 w-14 mx-auto mb-4 opacity-30" />
              <p className="font-display text-xl font-semibold mb-2">
                No categories yet
              </p>
              <Button
                className="gradient-gold-accent text-primary-foreground font-body gap-2 mt-4"
                onClick={openAdd}
              >
                <Plus className="h-4 w-4" /> Add First Category
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-card border-border/60 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editTarget ? "Edit Category" : "Add Category"}
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
                placeholder="Category name"
                className="font-body"
                data-ocid="category-name-input"
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
                data-ocid="category-desc-input"
              />
            </div>

            {/* Image Upload */}
            <div className="grid gap-2">
              <Label className="font-body text-sm">Category Image</Label>
              <FileUploader
                accept="image"
                currentUrl={form.imageUrl}
                onUploaded={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
                label="Upload Image"
                ocid="category-img-upload"
              />
            </div>

            {/* Video Upload */}
            <div className="grid gap-2">
              <Label className="font-body text-sm">
                Category Video (optional)
              </Label>
              <FileUploader
                accept="video"
                currentUrl={form.videoUrl}
                onUploaded={(url) => setForm((p) => ({ ...p, videoUrl: url }))}
                label="Upload Video"
                ocid="category-video-upload"
              />
            </div>
          </div>
          <DialogFooter>
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
              data-ocid="category-save-btn"
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
              Delete Category?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground font-body">
            Are you sure you want to delete "{deleteTarget?.name}"? This will
            also remove all products in this category.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground font-body hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={deleting}
              data-ocid="category-delete-confirm"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
