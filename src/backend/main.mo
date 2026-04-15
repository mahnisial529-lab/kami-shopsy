import Types "types/store";
import StoreLib "lib/store";
import StoreApi "mixins/store-api";
import Migration "migration";

import List "mo:core/List";


(with migration = Migration.run)
actor {
  let categories = List.empty<Types.Category>();
  let products = List.empty<Types.Product>();
  let orders = List.empty<Types.Order>();
  let reviews = List.empty<Types.Review>();

  let nextCategoryIdBox = { var val : Nat = 1 };
  let nextProductIdBox = { var val : Nat = 1 };
  let nextOrderIdBox = { var val : Nat = 1 };
  let nextReviewIdBox = { var val : Nat = 1 };

  // Admin password for 03057393786 / Kamran@uet786 — stored as hash
  let adminPasswordHashBox = { var val : Text = StoreLib.hashPassword("Kamran@uet786") };

  // Seed initial data once (idempotent: only runs when lists are empty)
  if (categories.size() == 0) {
    let nextCatId = StoreLib.seedCategories(categories, nextCategoryIdBox.val);
    nextCategoryIdBox.val := nextCatId;
  };

  if (products.size() == 0) {
    // Initialize 20 empty product slots for each of the 12 categories
    var nextProdId = nextProductIdBox.val;
    var catId : Nat = 1;
    while (catId <= 12) {
      nextProdId := StoreLib.initializeCategorySlots(products, nextProdId, catId);
      catId += 1;
    };
    nextProductIdBox.val := nextProdId;
  };

  let announcementBox : { var val : ?Types.Announcement } = { var val = null };

  include StoreApi(
    categories,
    products,
    orders,
    reviews,
    nextCategoryIdBox,
    nextProductIdBox,
    nextOrderIdBox,
    nextReviewIdBox,
    adminPasswordHashBox,
    announcementBox,
  );
};
