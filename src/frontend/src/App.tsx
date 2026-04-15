import { Skeleton } from "@/components/ui/skeleton";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { CartContextProvider } from "./contexts/CartContext";

// Lazy-loaded pages
const HomePage = lazy(() => import("./pages/HomePage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const AdminCategoriesPage = lazy(() => import("./pages/AdminCategoriesPage"));
const AdminProductsPage = lazy(() => import("./pages/AdminProductsPage"));
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"));

function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 flex flex-col gap-4">
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((k) => (
          <Skeleton key={k} className="h-36 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// Root route — CartContextProvider wraps ALL routes so every page can use useCartContext
const rootRoute = createRootRoute({
  component: () => (
    <CartContextProvider>
      <Suspense fallback={<PageSkeleton />}>
        <Outlet />
      </Suspense>
    </CartContextProvider>
  ),
});

// Routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <HomePage />,
});
const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/category/$id",
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  component: () => <CategoryPage />,
});
const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: () => <ProductPage />,
});
const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: () => <CheckoutPage />,
});
const orderSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order-success",
  component: () => <OrderSuccessPage />,
});
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: () => <AdminLoginPage />,
});
const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: () => <AdminDashboardPage />,
});
const adminCategoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/categories",
  component: () => <AdminCategoriesPage />,
});
const adminProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/products",
  component: () => <AdminProductsPage />,
});
const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/orders",
  component: () => <AdminOrdersPage />,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  categoryRoute,
  productRoute,
  checkoutRoute,
  orderSuccessRoute,
  adminLoginRoute,
  adminDashboardRoute,
  adminCategoriesRoute,
  adminProductsRoute,
  adminOrdersRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
