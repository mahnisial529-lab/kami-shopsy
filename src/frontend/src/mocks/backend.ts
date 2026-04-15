import type { backendInterface } from "../backend";

const sampleCategories = [
  { id: BigInt(1), name: "Perfume", description: "Luxury fragrances for every occasion", imageUrl: "/assets/images/placeholder.svg" },
  { id: BigInt(2), name: "Ladies Collection", description: "Elegant clothing and accessories for women", imageUrl: "/assets/images/placeholder.svg" },
  { id: BigInt(3), name: "Mens Collection", description: "Stylish clothing and accessories for men", imageUrl: "/assets/images/placeholder.svg" },
  { id: BigInt(4), name: "Baby Collection", description: "Adorable clothing and toys for babies", imageUrl: "/assets/images/placeholder.svg" },
  { id: BigInt(5), name: "Home Decor", description: "Beautiful pieces for your home", imageUrl: "/assets/images/placeholder.svg" },
  { id: BigInt(6), name: "Jewelry", description: "Exquisite jewelry and accessories", imageUrl: "/assets/images/placeholder.svg" },
  { id: BigInt(7), name: "Footwear", description: "Stylish shoes for every occasion", imageUrl: "/assets/images/placeholder.svg" },
  { id: BigInt(8), name: "Bags & Purses", description: "Handcrafted bags and purses", imageUrl: "/assets/images/placeholder.svg" },
  { id: BigInt(9), name: "Skincare", description: "Premium skincare products", imageUrl: "/assets/images/placeholder.svg" },
  { id: BigInt(10), name: "Makeup", description: "Luxury makeup and cosmetics", imageUrl: "/assets/images/placeholder.svg" },
  { id: BigInt(11), name: "Kidswear", description: "Fun and colorful clothing for kids", imageUrl: "/assets/images/placeholder.svg" },
  { id: BigInt(12), name: "Wedding Collection", description: "Bridal and wedding special collection", imageUrl: "/assets/images/placeholder.svg" },
];

const sampleProducts = [
  { id: BigInt(1), categoryId: BigInt(1), name: "Rose Noir Perfume", description: "A luxurious dark floral fragrance", available: true, imageUrls: ["/assets/images/placeholder.svg"], price: BigInt(2500), slotIndex: BigInt(1), discountEnabled: false, discountPercent: BigInt(0) },
  { id: BigInt(2), categoryId: BigInt(1), name: "Oud Al Rashid", description: "Premium oud-based oriental fragrance", available: true, imageUrls: ["/assets/images/placeholder.svg"], price: BigInt(3200), slotIndex: BigInt(2), discountEnabled: false, discountPercent: BigInt(0) },
  { id: BigInt(3), categoryId: BigInt(2), name: "Silk Embroidered Suit", description: "Hand-embroidered silk fabric suit", available: true, imageUrls: ["/assets/images/placeholder.svg"], price: BigInt(4500), slotIndex: BigInt(1), discountEnabled: false, discountPercent: BigInt(0) },
  { id: BigInt(4), categoryId: BigInt(2), name: "Lawn Printed 3-Piece", description: "Premium lawn fabric with digital print", available: true, imageUrls: ["/assets/images/placeholder.svg"], price: BigInt(2800), slotIndex: BigInt(2), discountEnabled: false, discountPercent: BigInt(0) },
  { id: BigInt(5), categoryId: BigInt(3), name: "Kurta Shalwar Set", description: "Classic Pakistani men's kurta shalwar", available: true, imageUrls: ["/assets/images/placeholder.svg"], price: BigInt(1800), slotIndex: BigInt(1), discountEnabled: false, discountPercent: BigInt(0) },
];

const sampleOrders = [
  {
    id: BigInt(1),
    customerName: "Ahmed Khan",
    status: "Pending",
    paymentMethod: "Cash on Delivery",
    city: "Lahore",
    createdAt: BigInt(Date.now() * 1000000),
    totalAmount: BigInt(7000),
    address: "123 Main Street, Gulberg",
    phone: "03001234567",
    items: [
      { productId: BigInt(1), productName: "Rose Noir Perfume", quantity: BigInt(1), price: BigInt(2500) },
      { productId: BigInt(3), productName: "Silk Embroidered Suit", quantity: BigInt(1), price: BigInt(4500) },
    ],
  },
];

export const mockBackend: backendInterface = {
  addCategory: async (name, description, imageUrl, videoUrl) => ({
    id: BigInt(13),
    name,
    description,
    imageUrl,
    videoUrl: videoUrl ?? undefined,
  }),
  addProduct: async (categoryId, name, description, price, imageUrls, videoUrl, available, slotIndex, discountEnabled, discountPercent) => ({
    id: BigInt(100),
    categoryId,
    name,
    description,
    price,
    imageUrls,
    videoUrl: videoUrl ?? undefined,
    available: available ?? false,
    slotIndex: slotIndex ?? BigInt(0),
    discountEnabled: discountEnabled ?? false,
    discountPercent: discountPercent ?? BigInt(0),
  }),
  adminLogin: async (password) => password === "Kamran@uet786",
  deleteCategory: async () => true,
  deleteProduct: async () => true,
  getAllOrders: async () => sampleOrders,
  getAllProducts: async () => sampleProducts,
  getCategories: async () => sampleCategories,
  getProductSlots: async (categoryId) =>
    sampleProducts.filter((p) => p.categoryId === categoryId),
  getProductsByCategory: async (categoryId) =>
    sampleProducts.filter((p) => p.categoryId === categoryId),
  initializeCategorySlots: async () => true,
  placeOrder: async (req) => ({
    id: BigInt(2),
    customerName: req.customerName,
    status: "Pending",
    paymentMethod: req.paymentMethod,
    city: req.city,
    createdAt: BigInt(Date.now() * 1000000),
    totalAmount: req.items.reduce((acc, item) => acc + item.price * item.quantity, BigInt(0)),
    address: req.address,
    phone: req.phone,
    items: req.items,
  }),
  setAdminPassword: async () => true,
  updateCategory: async () => true,
  updateOrderStatus: async () => true,
  updateProduct: async () => true,
  getActiveAnnouncement: async () => null,
  setAnnouncement: async () => true,
  toggleAnnouncement: async () => true,
  addReview: async (_productId, reviewerName, rating, comment) => ({
    __kind__: "ok" as const,
    ok: {
      id: BigInt(1),
      productId: _productId,
      reviewerName,
      rating,
      comment,
      createdAt: BigInt(Date.now() * 1_000_000),
    },
  }),
  getProductReviews: async () => [],
};
