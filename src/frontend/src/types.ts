// Re-export backend types
export type {
  Announcement,
  Category,
  Product,
  Order,
  OrderItem,
  PlaceOrderRequest,
  CategoryId,
  ProductId,
  OrderId,
  Review,
} from "./backend.d";

// Cart types
export interface CartItem {
  productId: bigint;
  productName: string;
  price: bigint;
  quantity: number;
  imageUrl: string; // first image from imageUrls[], kept for cart display
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: bigint;
}

// Admin types
export interface AdminState {
  isLoggedIn: boolean;
  token: string | null;
}

// UI helper types
export interface NotificationState {
  message: string;
  type: "success" | "error" | "info";
}

// Slot types for the admin product grid
export interface ProductSlot {
  slotIndex: number; // 1-20
  product: import("./backend.d").Product | null; // null = empty slot
}
