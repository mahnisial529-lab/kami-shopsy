import Types "types/store";
import List "mo:core/List";

module {
  // Old and new actor stable state shapes are identical —
  // all fields (including discountEnabled / discountPercent on Product)
  // already exist in the previously deployed canister.
  // This migration is a no-op identity that satisfies the compatibility checker.

  type OldActor = {
    adminPasswordHashBox : { var val : Text };
    announcementBox : { var val : ?Types.Announcement };
    categories : List.List<Types.Category>;
    nextCategoryIdBox : { var val : Nat };
    nextOrderIdBox : { var val : Nat };
    nextProductIdBox : { var val : Nat };
    nextReviewIdBox : { var val : Nat };
    orders : List.List<Types.Order>;
    products : List.List<Types.Product>;
    reviews : List.List<Types.Review>;
  };

  type NewActor = {
    adminPasswordHashBox : { var val : Text };
    announcementBox : { var val : ?Types.Announcement };
    categories : List.List<Types.Category>;
    nextCategoryIdBox : { var val : Nat };
    nextOrderIdBox : { var val : Nat };
    nextProductIdBox : { var val : Nat };
    nextReviewIdBox : { var val : Nat };
    orders : List.List<Types.Order>;
    products : List.List<Types.Product>;
    reviews : List.List<Types.Review>;
  };

  public func run(old : OldActor) : NewActor {
    {
      adminPasswordHashBox = old.adminPasswordHashBox;
      announcementBox = old.announcementBox;
      categories = old.categories;
      nextCategoryIdBox = old.nextCategoryIdBox;
      nextOrderIdBox = old.nextOrderIdBox;
      nextProductIdBox = old.nextProductIdBox;
      nextReviewIdBox = old.nextReviewIdBox;
      orders = old.orders;
      products = old.products;
      reviews = old.reviews;
    };
  };
};
