import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PlaceOrderRequest {
    customerName: string;
    paymentMethod: string;
    city: string;
    address: string;
    phone: string;
    items: Array<OrderItem>;
}
export interface Review {
    id: bigint;
    createdAt: bigint;
    productId: bigint;
    reviewerName: string;
    comment: string;
    rating: bigint;
}
export interface Category {
    id: CategoryId;
    name: string;
    description: string;
    imageUrl: string;
    videoUrl?: string;
}
export interface OrderItem {
    productId: ProductId;
    productName: string;
    quantity: bigint;
    price: bigint;
}
export type CategoryId = bigint;
export interface Announcement {
    id: string;
    createdAt: bigint;
    isActive: boolean;
    message: string;
}
export type ProductId = bigint;
export interface Order {
    id: OrderId;
    customerName: string;
    status: string;
    paymentMethod: string;
    city: string;
    createdAt: bigint;
    totalAmount: bigint;
    address: string;
    phone: string;
    items: Array<OrderItem>;
}
export type OrderId = bigint;
export interface Product {
    id: ProductId;
    categoryId: CategoryId;
    imageUrls: Array<string>;
    name: string;
    description: string;
    discountPercent: bigint;
    discountEnabled: boolean;
    available: boolean;
    slotIndex: bigint;
    price: bigint;
    videoUrl?: string;
}
export interface backendInterface {
    addCategory(name: string, description: string, imageUrl: string, videoUrl: string | null): Promise<Category>;
    addProduct(categoryId: CategoryId, name: string, description: string, price: bigint, imageUrls: Array<string>, videoUrl: string | null, available: boolean, slotIndex: bigint, discountEnabled: boolean, discountPercent: bigint): Promise<Product>;
    addReview(productId: bigint, reviewerName: string, rating: bigint, comment: string): Promise<{
        __kind__: "ok";
        ok: Review;
    } | {
        __kind__: "err";
        err: string;
    }>;
    adminLogin(password: string): Promise<boolean>;
    deleteCategory(id: CategoryId): Promise<boolean>;
    deleteProduct(id: ProductId): Promise<boolean>;
    getActiveAnnouncement(): Promise<Announcement | null>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCategories(): Promise<Array<Category>>;
    getProductReviews(productId: bigint): Promise<Array<Review>>;
    getProductSlots(categoryId: CategoryId): Promise<Array<Product>>;
    getProductsByCategory(categoryId: CategoryId): Promise<Array<Product>>;
    initializeCategorySlots(categoryId: CategoryId): Promise<boolean>;
    placeOrder(req: PlaceOrderRequest): Promise<Order>;
    setAdminPassword(oldPassword: string, newPassword: string): Promise<boolean>;
    setAnnouncement(message: string, isActive: boolean): Promise<boolean>;
    toggleAnnouncement(isActive: boolean): Promise<boolean>;
    updateCategory(id: CategoryId, name: string, description: string, imageUrl: string, videoUrl: string | null): Promise<boolean>;
    updateOrderStatus(id: OrderId, status: string): Promise<boolean>;
    updateProduct(id: ProductId, categoryId: CategoryId, name: string, description: string, price: bigint, imageUrls: Array<string>, videoUrl: string | null, available: boolean, slotIndex: bigint, discountEnabled: boolean, discountPercent: bigint): Promise<boolean>;
}
