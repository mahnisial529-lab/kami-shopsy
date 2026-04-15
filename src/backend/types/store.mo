module {
  public type CategoryId = Nat;
  public type ProductId = Nat;
  public type OrderId = Nat;

  public type Category = {
    id : CategoryId;
    name : Text;
    description : Text;
    imageUrl : Text;
    videoUrl : ?Text;
  };

  public type Product = {
    id : ProductId;
    categoryId : CategoryId;
    name : Text;
    description : Text;
    price : Nat;
    imageUrls : [Text];
    videoUrl : ?Text;
    available : Bool;
    slotIndex : Nat;
    discountEnabled : Bool;
    discountPercent : Nat;
  };

  public type OrderItem = {
    productId : ProductId;
    productName : Text;
    price : Nat;
    quantity : Nat;
  };

  public type Order = {
    id : OrderId;
    items : [OrderItem];
    customerName : Text;
    phone : Text;
    address : Text;
    city : Text;
    paymentMethod : Text; // 'cod' or 'easypaisa'
    status : Text; // 'pending' | 'paid' | 'delivered'
    totalAmount : Nat;
    createdAt : Int;
  };

  public type PlaceOrderRequest = {
    items : [OrderItem];
    customerName : Text;
    phone : Text;
    address : Text;
    city : Text;
    paymentMethod : Text;
  };

  public type Announcement = {
    id : Text;
    message : Text;
    isActive : Bool;
    createdAt : Int;
  };

  public type Review = {
    id : Nat;
    productId : Nat;
    reviewerName : Text;
    rating : Nat;
    comment : Text;
    createdAt : Int;
  };
};
