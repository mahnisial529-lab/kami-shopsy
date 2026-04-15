import Types "../types/store";
import StoreLib "../lib/store";
import List "mo:core/List";
import Time "mo:core/Time";
mixin (
  categories : List.List<Types.Category>,
  products : List.List<Types.Product>,
  orders : List.List<Types.Order>,
  reviews : List.List<Types.Review>,
  nextCategoryId : { var val : Nat },
  nextProductId : { var val : Nat },
  nextOrderId : { var val : Nat },
  nextReviewId : { var val : Nat },
  adminPasswordHash : { var val : Text },
  announcementBox : { var val : ?Types.Announcement },
) {

  // ─── Public: read-only ───────────────────────────────────────────────────

  public query func getCategories() : async [Types.Category] {
    StoreLib.getCategories(categories);
  };

  public query func getProductsByCategory(categoryId : Types.CategoryId) : async [Types.Product] {
    StoreLib.getProductsByCategory(products, categoryId);
  };

  public query func getAllProducts() : async [Types.Product] {
    StoreLib.getAllProducts(products);
  };

  // ─── Public: place order ─────────────────────────────────────────────────

  public func placeOrder(req : Types.PlaceOrderRequest) : async Types.Order {
    let id = nextOrderId.val;
    nextOrderId.val += 1;
    StoreLib.placeOrder(orders, id, req, Time.now());
  };

  // ─── Admin: auth ──────────────────────────────────────────────────────────

  public func adminLogin(password : Text) : async Bool {
    StoreLib.verifyPassword(adminPasswordHash.val, password);
  };

  public func setAdminPassword(oldPassword : Text, newPassword : Text) : async Bool {
    if (not StoreLib.verifyPassword(adminPasswordHash.val, oldPassword)) {
      return false;
    };
    adminPasswordHash.val := StoreLib.hashPassword(newPassword);
    true;
  };

  // ─── Admin: categories ───────────────────────────────────────────────────

  public func addCategory(name : Text, description : Text, imageUrl : Text, videoUrl : ?Text) : async Types.Category {
    let id = nextCategoryId.val;
    nextCategoryId.val += 1;
    StoreLib.addCategory(categories, id, name, description, imageUrl, videoUrl);
  };

  public func updateCategory(id : Types.CategoryId, name : Text, description : Text, imageUrl : Text, videoUrl : ?Text) : async Bool {
    StoreLib.updateCategory(categories, id, name, description, imageUrl, videoUrl);
  };

  public func deleteCategory(id : Types.CategoryId) : async Bool {
    StoreLib.deleteCategory(categories, id);
  };

  // ─── Admin: products ─────────────────────────────────────────────────────

  public func addProduct(
    categoryId : Types.CategoryId,
    name : Text,
    description : Text,
    price : Nat,
    imageUrls : [Text],
    videoUrl : ?Text,
    available : Bool,
    slotIndex : Nat,
    discountEnabled : Bool,
    discountPercent : Nat,
  ) : async Types.Product {
    let id = nextProductId.val;
    nextProductId.val += 1;
    StoreLib.addProduct(products, id, categoryId, name, description, price, imageUrls, videoUrl, available, slotIndex, discountEnabled, discountPercent);
  };

  public func updateProduct(
    id : Types.ProductId,
    categoryId : Types.CategoryId,
    name : Text,
    description : Text,
    price : Nat,
    imageUrls : [Text],
    videoUrl : ?Text,
    available : Bool,
    slotIndex : Nat,
    discountEnabled : Bool,
    discountPercent : Nat,
  ) : async Bool {
    StoreLib.updateProduct(products, id, categoryId, name, description, price, imageUrls, videoUrl, available, slotIndex, discountEnabled, discountPercent);
  };

  public func deleteProduct(id : Types.ProductId) : async Bool {
    StoreLib.deleteProduct(products, id);
  };

  // Returns all 20 slots for a category (sorted by slotIndex).
  public query func getProductSlots(categoryId : Types.CategoryId) : async [Types.Product] {
    StoreLib.getProductSlots(products, categoryId);
  };

  // Initializes 20 empty slots for a category (idempotent). Returns true on success.
  public func initializeCategorySlots(categoryId : Types.CategoryId) : async Bool {
    let nextId = nextProductId.val;
    let updated = StoreLib.initializeCategorySlots(products, nextId, categoryId);
    nextProductId.val := updated;
    true;
  };

  // ─── Admin: orders ───────────────────────────────────────────────────────

  public query func getAllOrders() : async [Types.Order] {
    StoreLib.getAllOrders(orders);
  };

  public func updateOrderStatus(id : Types.OrderId, status : Text) : async Bool {
    StoreLib.updateOrderStatus(orders, id, status);
  };

  // ─── Public: announcements ───────────────────────────────────────────────

  public query func getActiveAnnouncement() : async ?Types.Announcement {
    announcementBox.val;
  };

  // ─── Admin: announcements ────────────────────────────────────────────────

  public func setAnnouncement(message : Text, isActive : Bool) : async Bool {
    announcementBox.val := ?{
      id = "announcement-1";
      message;
      isActive;
      createdAt = Time.now();
    };
    true;
  };

  public func toggleAnnouncement(isActive : Bool) : async Bool {
    switch (announcementBox.val) {
      case null { false };
      case (?existing) {
        announcementBox.val := ?{ existing with isActive };
        true;
      };
    };
  };

  // ─── Public: reviews ────────────────────────────────────────────────────

  public func addReview(productId : Nat, reviewerName : Text, rating : Nat, comment : Text) : async { #ok : Types.Review; #err : Text } {
    if (rating < 1 or rating > 5) {
      return #err("Rating must be between 1 and 5");
    };
    if (reviewerName == "") {
      return #err("Reviewer name cannot be empty");
    };
    let id = nextReviewId.val;
    nextReviewId.val += 1;
    let review = StoreLib.addReview(reviews, id, productId, reviewerName, rating, comment, Time.now());
    #ok(review);
  };

  public query func getProductReviews(productId : Nat) : async [Types.Review] {
    StoreLib.getProductReviews(reviews, productId);
  };
};
