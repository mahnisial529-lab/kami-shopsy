import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  Eye,
  ShoppingCart,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { useAdmin } from "../hooks/useAdmin";
import { useAllOrders, useUpdateOrderStatus } from "../hooks/useBackend";
import type { Order } from "../types";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: React.ElementType; cls: string }> = {
    pending: {
      icon: Clock,
      cls: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    },
    confirmed: {
      icon: CheckCircle,
      cls: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    shipped: {
      icon: CheckCircle,
      cls: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    },
    delivered: {
      icon: CheckCircle,
      cls: "bg-green-500/10 text-green-600 border-green-500/20",
    },
    cancelled: {
      icon: XCircle,
      cls: "bg-destructive/10 text-destructive border-destructive/20",
    },
  };
  const { icon: Icon, cls } = config[status] ?? config.pending;
  return (
    <Badge className={`font-body capitalize gap-1 ${cls}`}>
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
}

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAdmin();
  useEffect(() => {
    if (!isLoggedIn) navigate({ to: "/admin/login" });
  }, [isLoggedIn, navigate]);

  const { data: orders, isLoading } = useAllOrders();
  const { mutateAsync: updateStatus, isPending: updating } =
    useUpdateOrderStatus();
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  async function handleStatusChange(order: Order, status: string) {
    try {
      await updateStatus({ id: order.id, status });
      toast.success(`Order #${String(order.id)} marked as ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  }

  function formatDate(ts: bigint) {
    return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <Layout>
      <div className="bg-card border-b border-border/60">
        <div className="container mx-auto px-4 py-5">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground font-body mb-2">
            <Link
              to="/admin/dashboard"
              className="hover:text-primary transition-smooth"
            >
              Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-primary">Orders</span>
          </nav>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Manage Orders
          </h1>
        </div>
      </div>

      <section className="bg-background py-10">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {["o1", "o2", "o3", "o4", "o5"].map((k) => (
                <Skeleton key={k} className="h-20 rounded-lg" />
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="flex flex-col gap-3" data-ocid="admin-orders-list">
              {[...orders]
                .sort((a, b) => Number(b.createdAt - a.createdAt))
                .map((order, i) => (
                  <motion.div
                    key={String(order.id)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-card border border-border/60 rounded-lg p-4 shadow-luxury flex flex-col sm:flex-row sm:items-center gap-4"
                    data-ocid={`admin-order-${String(order.id)}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-body font-semibold text-sm text-foreground">
                          Order #{String(order.id)}
                        </span>
                        <StatusBadge status={order.status} />
                        <Badge
                          variant="outline"
                          className="font-body text-xs border-border text-muted-foreground"
                        >
                          {order.paymentMethod}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-body">
                        <strong className="text-foreground">
                          {order.customerName}
                        </strong>{" "}
                        · {order.phone} · {order.city}
                      </p>
                      <p className="text-xs text-muted-foreground font-body mt-0.5">
                        {order.items.length} item(s) · PKR{" "}
                        {Number(order.totalAmount).toLocaleString()} ·{" "}
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center flex-shrink-0 flex-wrap">
                      <Select
                        value={order.status}
                        onValueChange={(v) => handleStatusChange(order, v)}
                        disabled={updating}
                      >
                        <SelectTrigger
                          className="w-36 font-body text-xs h-8"
                          data-ocid={`order-status-${String(order.id)}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem
                              key={s}
                              value={s}
                              className="font-body capitalize text-sm"
                            >
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs border-border text-muted-foreground hover:text-primary hover:border-primary/40 gap-1 font-body transition-smooth"
                        onClick={() => setViewOrder(order)}
                        data-ocid={`view-order-${String(order.id)}`}
                      >
                        <Eye className="h-3 w-3" /> Details
                      </Button>
                    </div>
                  </motion.div>
                ))}
            </div>
          ) : (
            <div
              className="text-center py-20 text-muted-foreground"
              data-ocid="admin-orders-empty"
            >
              <ShoppingCart className="h-14 w-14 mx-auto mb-4 opacity-30" />
              <p className="font-display text-xl font-semibold mb-2">
                No orders yet
              </p>
              <p className="font-body text-sm">
                Orders will appear here once customers place them.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Order detail dialog */}
      {viewOrder && (
        <Dialog
          open={!!viewOrder}
          onOpenChange={(v) => !v && setViewOrder(null)}
        >
          <DialogContent className="bg-card border-border/60 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                Order #{String(viewOrder.id)}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              {/* Customer info */}
              <div className="flex flex-col gap-1">
                <p className="font-body text-sm">
                  <span className="text-muted-foreground">Customer:</span>{" "}
                  <strong>{viewOrder.customerName}</strong>
                </p>
                <p className="font-body text-sm">
                  <span className="text-muted-foreground">Phone:</span>{" "}
                  {viewOrder.phone}
                </p>
                <p className="font-body text-sm">
                  <span className="text-muted-foreground">Address:</span>{" "}
                  {viewOrder.address}, {viewOrder.city}
                </p>
                <p className="font-body text-sm">
                  <span className="text-muted-foreground">Payment:</span>{" "}
                  {viewOrder.paymentMethod}
                </p>
                <p className="font-body text-sm">
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <StatusBadge status={viewOrder.status} />
                </p>
              </div>
              <Separator />
              {/* Items */}
              <div className="flex flex-col gap-2">
                <p className="font-display font-semibold text-sm text-foreground">
                  Items
                </p>
                {viewOrder.items.map((item) => (
                  <div
                    key={String(item.productId)}
                    className="flex justify-between items-center text-sm font-body"
                  >
                    <span className="text-foreground">
                      {item.productName} × {String(item.quantity)}
                    </span>
                    <span className="text-primary font-semibold">
                      PKR {Number(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-display font-semibold text-foreground">
                  Total
                </span>
                <span className="font-display text-xl font-bold text-primary">
                  PKR {Number(viewOrder.totalAmount).toLocaleString()}
                </span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
}
