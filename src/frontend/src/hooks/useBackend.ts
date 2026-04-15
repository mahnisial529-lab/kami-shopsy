import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  Announcement,
  Category,
  CategoryId,
  Order,
  OrderId,
  PlaceOrderRequest,
  Product,
  ProductId,
  Review,
} from "../types";

function useBackendActor() {
  return useActor(createActor);
}

// Exponential backoff — starts at 1s, caps at 30s for critical queries
const retryDelayCritical = (attempt: number) =>
  Math.min(1000 * 1.8 ** attempt, 30000);

/**
 * Returns true once the actor is initialised and not mid-fetch.
 * Gate every data query behind this so we never emit an empty-array success
 * while the backend connection is still warming up.
 */
export function useIsBackendReady(): boolean {
  const { actor, isFetching } = useBackendActor();
  return !!actor && !isFetching;
}

// ── Categories ────────────────────────────────────────────────────────────────

export function useCategories() {
  const { actor, isFetching } = useBackendActor();
  const isReady = !!actor && !isFetching;

  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.getCategories();
      // Normalise: ensure every category has safe string fields
      return result.map((c) => ({
        ...c,
        id: c.id,
        name: typeof c.name === "string" ? c.name : String(c.id),
        description: typeof c.description === "string" ? c.description : "",
        imageUrl: typeof c.imageUrl === "string" ? c.imageUrl : "",
      }));
    },
    // Only run when actor is fully ready — never return [] on a cold actor
    enabled: isReady,
    // Never treat old data as fresh — always re-validate on mount
    staleTime: 0,
    gcTime: 300000,
    retry: 10,
    retryDelay: retryDelayCritical,
  });
}

// ── Products ──────────────────────────────────────────────────────────────────

export function useAllProducts() {
  const { actor, isFetching } = useBackendActor();
  const isReady = !!actor && !isFetching;

  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getAllProducts();
    },
    enabled: isReady,
    retry: 8,
    staleTime: 0,
    retryDelay: retryDelayCritical,
  });
}

export function useProductsByCategory(categoryId: CategoryId | null) {
  const { actor, isFetching } = useBackendActor();
  const isReady = !!actor && !isFetching;

  return useQuery<Product[]>({
    queryKey: ["products", "category", String(categoryId)],
    queryFn: async () => {
      if (!actor || categoryId === null) throw new Error("Actor not ready");
      return actor.getProductsByCategory(categoryId);
    },
    enabled: isReady && categoryId !== null,
    retry: 8,
    staleTime: 0,
    retryDelay: retryDelayCritical,
  });
}

// Product slots — returns all 20 slots for a category (includes empty ones for admin view).
export function useProductSlots(categoryId: CategoryId | null) {
  const { actor } = useBackendActor();
  return useQuery<Product[]>({
    queryKey: ["productSlots", String(categoryId)],
    queryFn: async () => {
      if (!actor || categoryId === null) return [];
      try {
        // Try backend getProductSlots if available
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const backendActor = actor as unknown as Record<
          string,
          (...args: unknown[]) => Promise<unknown>
        >;
        if (typeof backendActor.getProductSlots === "function") {
          return (await backendActor.getProductSlots(categoryId)) as Product[];
        }
      } catch {
        // fallback
      }
      // Fallback: get all products and filter by category
      const all = await actor.getAllProducts();
      return all.filter((p) => p.categoryId === categoryId);
    },
    enabled: !!actor && categoryId !== null,
  });
}

// Initialize 20 empty slots for a category
export function useInitializeCategorySlots() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation<boolean, Error, CategoryId>({
    mutationFn: async (categoryId) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.initializeCategorySlots(categoryId);
      return true;
    },
    onSuccess: (_data, categoryId) => {
      qc.invalidateQueries({ queryKey: ["productSlots", String(categoryId)] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ── Orders ────────────────────────────────────────────────────────────────────

export function useAllOrders() {
  const { actor } = useBackendActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor,
  });
}

export function usePlaceOrder() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation<Order, Error, PlaceOrderRequest>({
    mutationFn: async (req) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.placeOrder(req);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export function useAdminLogin() {
  const { actor, isFetching } = useBackendActor();
  const mutation = useMutation<boolean, Error, string>({
    mutationFn: async (password) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.adminLogin(password);
    },
  });
  // Expose actor readiness so the login page can disable submit while actor loads
  return { ...mutation, isActorReady: !!actor && !isFetching };
}

// ── Categories CRUD ───────────────────────────────────────────────────────────

export function useAddCategory() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation<
    Category,
    Error,
    { name: string; description: string; imageUrl: string; videoUrl?: string }
  >({
    mutationFn: async ({ name, description, imageUrl, videoUrl }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addCategory(name, description, imageUrl, videoUrl ?? null);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation<
    boolean,
    Error,
    {
      id: CategoryId;
      name: string;
      description: string;
      imageUrl: string;
      videoUrl?: string;
    }
  >({
    mutationFn: async ({ id, name, description, imageUrl, videoUrl }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateCategory(
        id,
        name,
        description,
        imageUrl,
        videoUrl ?? null,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useDeleteCategory() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation<boolean, Error, CategoryId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteCategory(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// ── Products CRUD ─────────────────────────────────────────────────────────────

export function useAddProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation<
    Product,
    Error,
    {
      categoryId: CategoryId;
      name: string;
      description: string;
      price: bigint;
      imageUrls: string[];
      videoUrl?: string;
      available: boolean;
      slotIndex?: number;
      discountEnabled: boolean;
      discountPercent: bigint;
    }
  >({
    mutationFn: async ({
      categoryId,
      name,
      description,
      price,
      imageUrls,
      videoUrl,
      available,
      slotIndex,
      discountEnabled,
      discountPercent,
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addProduct(
        categoryId,
        name,
        description,
        price,
        imageUrls,
        videoUrl ?? null,
        available,
        BigInt(slotIndex ?? 0),
        discountEnabled,
        discountPercent,
      );
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({
        queryKey: ["productSlots", String(vars.categoryId)],
      });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation<
    boolean,
    Error,
    {
      id: ProductId;
      categoryId: CategoryId;
      name: string;
      description: string;
      price: bigint;
      imageUrls: string[];
      videoUrl?: string;
      available: boolean;
      slotIndex?: number;
      discountEnabled: boolean;
      discountPercent: bigint;
    }
  >({
    mutationFn: async ({
      id,
      categoryId,
      name,
      description,
      price,
      imageUrls,
      videoUrl,
      available,
      slotIndex,
      discountEnabled,
      discountPercent,
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateProduct(
        id,
        categoryId,
        name,
        description,
        price,
        imageUrls,
        videoUrl ?? null,
        available,
        BigInt(slotIndex ?? 0),
        discountEnabled,
        discountPercent,
      );
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({
        queryKey: ["productSlots", String(vars.categoryId)],
      });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation<boolean, Error, ProductId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation<boolean, Error, { id: OrderId; status: string }>({
    mutationFn: async ({ id, status }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateOrderStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

// ── Announcement hooks ────────────────────────────────────────────────────────

export function useGetAnnouncement() {
  const { actor } = useBackendActor();
  return useQuery<Announcement | null>({
    queryKey: ["announcement"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getActiveAnnouncement();
      } catch {
        return null;
      }
    },
    enabled: !!actor,
    staleTime: 60000,
    retry: 3,
  });
}

export function useSetAnnouncement() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation<boolean, Error, { message: string; isActive: boolean }>({
    mutationFn: async ({ message, isActive }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.setAnnouncement(message, isActive);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcement"] }),
  });
}

export function useToggleAnnouncement() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation<boolean, Error, boolean>({
    mutationFn: async (isActive) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.toggleAnnouncement(isActive);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcement"] }),
  });
}

// ── Review hooks ──────────────────────────────────────────────────────────────

export function useGetProductReviews(productId: bigint | null) {
  const { actor } = useBackendActor();
  return useQuery<Review[]>({
    queryKey: ["reviews", String(productId)],
    queryFn: async () => {
      if (!actor || productId === null) return [];
      return actor.getProductReviews(productId);
    },
    enabled: !!actor && productId !== null,
    staleTime: 30000,
    retry: 3,
  });
}

export function useAddReview() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation<
    Review,
    Error,
    {
      productId: bigint;
      reviewerName: string;
      rating: bigint;
      comment: string;
    }
  >({
    mutationFn: async ({ productId, reviewerName, rating, comment }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.addReview(
        productId,
        reviewerName,
        rating,
        comment,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["reviews", String(vars.productId)],
      });
    },
  });
}
