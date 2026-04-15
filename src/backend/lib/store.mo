import Types "../types/store";
import List "mo:core/List";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Order "mo:core/Order";

module {
  // ─── Password helpers ────────────────────────────────────────────────────
  // Simple deterministic hash: djb2 variant with position mixing.
  // Deterministic and collision-resistant enough for a single-admin canister.

  public func hashPassword(password : Text) : Text {
    var h : Nat = 5381;
    var i : Nat = 0;
    for (c in password.toIter()) {
      let blob = Text.fromChar(c).encodeUtf8();
      let code : Nat = Nat.fromNat8(blob[0]);
      h := (h * 33 + code + i * 7) % 4294967296;
      i += 1;
    };
    "KS:" # h.toText();
  };

  public func verifyPassword(storedHash : Text, password : Text) : Bool {
    storedHash == hashPassword(password);
  };

  // ─── Category helpers ────────────────────────────────────────────────────

  public func getCategories(categories : List.List<Types.Category>) : [Types.Category] {
    categories.toArray();
  };

  public func getCategoryById(categories : List.List<Types.Category>, id : Types.CategoryId) : ?Types.Category {
    categories.find(func(c) { c.id == id });
  };

  public func addCategory(
    categories : List.List<Types.Category>,
    nextId : Nat,
    name : Text,
    description : Text,
    imageUrl : Text,
    videoUrl : ?Text,
  ) : Types.Category {
    let cat : Types.Category = { id = nextId; name; description; imageUrl; videoUrl };
    categories.add(cat);
    cat;
  };

  public func updateCategory(
    categories : List.List<Types.Category>,
    id : Types.CategoryId,
    name : Text,
    description : Text,
    imageUrl : Text,
    videoUrl : ?Text,
  ) : Bool {
    switch (categories.findIndex(func(c) { c.id == id })) {
      case null { false };
      case (?idx) {
        let existing = categories.at(idx);
        categories.put(idx, { existing with name; description; imageUrl; videoUrl });
        true;
      };
    };
  };

  public func deleteCategory(categories : List.List<Types.Category>, id : Types.CategoryId) : Bool {
    switch (categories.findIndex(func(c) { c.id == id })) {
      case null { false };
      case (?idx) {
        let size = categories.size();
        var i = idx;
        while (i + 1 < size) {
          categories.put(i, categories.at(i + 1));
          i += 1;
        };
        ignore categories.removeLast();
        true;
      };
    };
  };

  // ─── Product helpers ─────────────────────────────────────────────────────

  public func getAllProducts(products : List.List<Types.Product>) : [Types.Product] {
    products.toArray();
  };

  public func getProductsByCategory(products : List.List<Types.Product>, categoryId : Types.CategoryId) : [Types.Product] {
    products.filter(func(p) { p.categoryId == categoryId and p.available and p.name != "" }).toArray();
  };

  public func getProductById(products : List.List<Types.Product>, id : Types.ProductId) : ?Types.Product {
    products.find(func(p) { p.id == id });
  };

  public func addProduct(
    products : List.List<Types.Product>,
    nextId : Nat,
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
  ) : Types.Product {
    let prod : Types.Product = { id = nextId; categoryId; name; description; price; imageUrls; videoUrl; available; slotIndex; discountEnabled; discountPercent };
    products.add(prod);
    prod;
  };

  public func updateProduct(
    products : List.List<Types.Product>,
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
  ) : Bool {
    switch (products.findIndex(func(p) { p.id == id })) {
      case null { false };
      case (?idx) {
        let existing = products.at(idx);
        products.put(idx, { existing with categoryId; name; description; price; imageUrls; videoUrl; available; slotIndex; discountEnabled; discountPercent });
        true;
      };
    };
  };

  public func deleteProduct(products : List.List<Types.Product>, id : Types.ProductId) : Bool {
    switch (products.findIndex(func(p) { p.id == id })) {
      case null { false };
      case (?idx) {
        let size = products.size();
        var i = idx;
        while (i + 1 < size) {
          products.put(i, products.at(i + 1));
          i += 1;
        };
        ignore products.removeLast();
        true;
      };
    };
  };

  // ─── Order helpers ───────────────────────────────────────────────────────

  public func getAllOrders(orders : List.List<Types.Order>) : [Types.Order] {
    orders.toArray();
  };

  public func placeOrder(
    orders : List.List<Types.Order>,
    nextId : Nat,
    req : Types.PlaceOrderRequest,
    createdAt : Int,
  ) : Types.Order {
    var total : Nat = 0;
    for (item in req.items.values()) {
      total += item.price * item.quantity;
    };
    let order : Types.Order = {
      id = nextId;
      items = req.items;
      customerName = req.customerName;
      phone = req.phone;
      address = req.address;
      city = req.city;
      paymentMethod = req.paymentMethod;
      status = "pending";
      totalAmount = total;
      createdAt;
    };
    orders.add(order);
    order;
  };

  public func updateOrderStatus(orders : List.List<Types.Order>, id : Types.OrderId, status : Text) : Bool {
    switch (orders.findIndex(func(o) { o.id == id })) {
      case null { false };
      case (?idx) {
        let existing = orders.at(idx);
        orders.put(idx, { existing with status });
        true;
      };
    };
  };

  // ─── Seed data ───────────────────────────────────────────────────────────
  // Category IDs:
  //  1 = Perfume
  //  2 = Ladies Collection
  //  3 = Mens Collection
  //  4 = Baby Collection
  //  5 = Home Decor
  //  6 = Kitchen Items
  //  7 = Electronics
  //  8 = Shoes
  //  9 = Bags
  // 10 = Jewelry
  // 11 = Kids Toys
  // 12 = Sports & Fitness

  public func seedCategories(categories : List.List<Types.Category>, nextCategoryId : Nat) : Nat {
    let cats : [(Text, Text)] = [
      ("Perfume", "Premium fragrances for men and women"),
      ("Ladies Collection", "Trendy outfits and fashion for women"),
      ("Mens Collection", "Stylish clothing and accessories for men"),
      ("Baby Collection", "Cute and comfortable items for babies"),
      ("Home Decor", "Beautiful decorations for your home"),
      ("Kitchen Items", "Essential kitchen tools and accessories"),
      ("Electronics", "Latest gadgets and electronics"),
      ("Shoes", "Footwear for all occasions"),
      ("Bags", "Handbags, purses, and backpacks"),
      ("Jewelry", "Elegant jewelry and accessories"),
      ("Kids Toys", "Fun toys and games for children"),
      ("Sports & Fitness", "Sports equipment and fitness accessories"),
    ];
    var id = nextCategoryId;
    for ((name, description) in cats.values()) {
      categories.add({ id; name; description; imageUrl = ""; videoUrl = null });
      id += 1;
    };
    id;
  };

  // Initialize exactly 20 empty product slots for a category.
  // Idempotent: does nothing if 20 slots already exist for this category.
  // Returns the updated nextProductId.
  public func initializeCategorySlots(
    products : List.List<Types.Product>,
    nextProductId : Nat,
    categoryId : Types.CategoryId,
  ) : Nat {
    let existing = products.filter(func(p) { p.categoryId == categoryId });
    if (existing.size() >= 20) {
      return nextProductId;
    };
    var id = nextProductId;
    var slot : Nat = existing.size() + 1;
    while (slot <= 20) {
      products.add({
        id;
        categoryId;
        name = "";
        description = "";
        price = 0;
        imageUrls = [];
        videoUrl = null;
        available = false;
        slotIndex = slot;
        discountEnabled = false;
        discountPercent = 0;
      });
      id += 1;
      slot += 1;
    };
    id;
  };

  // ─── Announcement helpers ────────────────────────────────────────────────

  public func getActiveAnnouncement(announcementBox : { var val : ?Types.Announcement }) : ?Types.Announcement {
    announcementBox.val;
  };

  public func setAnnouncement(announcementBox : { var val : ?Types.Announcement }, message : Text, isActive : Bool, createdAt : Int) : Bool {
    announcementBox.val := ?{
      id = "announcement-1";
      message;
      isActive;
      createdAt;
    };
    true;
  };

  public func toggleAnnouncement(announcementBox : { var val : ?Types.Announcement }, isActive : Bool) : Bool {
    switch (announcementBox.val) {
      case null { false };
      case (?existing) {
        announcementBox.val := ?{ existing with isActive };
        true;
      };
    };
  };

  // ─── Review helpers ──────────────────────────────────────────────────────

  public func addReview(
    reviews : List.List<Types.Review>,
    nextId : Nat,
    productId : Nat,
    reviewerName : Text,
    rating : Nat,
    comment : Text,
    createdAt : Int,
  ) : Types.Review {
    let review : Types.Review = { id = nextId; productId; reviewerName; rating; comment; createdAt };
    reviews.add(review);
    review;
  };

  public func getProductReviews(reviews : List.List<Types.Review>, productId : Nat) : [Types.Review] {
    let filtered = reviews.filter(func(r) { r.productId == productId });
    let arr = filtered.toArray();
    arr.sort(func(a : Types.Review, b : Types.Review) : Order.Order {
      // Most recent first: larger createdAt (later timestamp) comes first
      if (a.createdAt > b.createdAt) { #less }
      else if (a.createdAt < b.createdAt) { #greater }
      else { #equal };
    });
  };

  // Returns all 20 product slots for a category, sorted by slotIndex.
  // If slots don't exist yet they should be created first via initializeCategorySlots.
  public func getProductSlots(products : List.List<Types.Product>, categoryId : Types.CategoryId) : [Types.Product] {
    let slots = products.filter(func(p) { p.categoryId == categoryId });
    let arr = slots.toArray();
    arr.sort(func(a : Types.Product, b : Types.Product) : Order.Order {
      Nat.compare(a.slotIndex, b.slotIndex)
    });
  };
};
