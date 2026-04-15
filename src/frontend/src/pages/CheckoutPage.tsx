import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, ShoppingBag, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import { useCartContext } from "../contexts/CartContext";
import { usePlaceOrder } from "../hooks/useBackend";

export default function CheckoutPage() {
  const {
    items,
    totalAmount,
    totalItems,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCartContext();
  const navigate = useNavigate();
  const { mutateAsync: placeOrder, isPending } = usePlaceOrder();

  useEffect(() => {
    document.title = "Checkout - Kami Shopsy";
  }, []);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    payment: "Cash on Delivery",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    try {
      const order = await placeOrder({
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        paymentMethod: form.payment,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          quantity: BigInt(i.quantity),
          price: i.price,
        })),
      });

      // Build WhatsApp message with full order details
      const itemLines = items
        .map(
          (i) =>
            `\u2022 ${i.productName} x${i.quantity} = PKR ${Number(i.price * BigInt(i.quantity)).toLocaleString()}`,
        )
        .join("\n");
      const waMessage = [
        "\uD83D\uDECD\uFE0F *New Order \u2014 Kami Shopsy*",
        `Order ID: #${String(order.id)}`,
        "",
        "*Customer:*",
        `Name: ${form.name}`,
        `Phone: ${form.phone}`,
        `Address: ${form.address}, ${form.city}`,
        "",
        "*Items:*",
        itemLines,
        "",
        `*Total: PKR ${Number(totalAmount).toLocaleString()}*`,
        `Payment: ${form.payment}`,
      ].join("\n");

      window.open(
        `https://wa.me/923457393786?text=${encodeURIComponent(waMessage)}`,
        "_blank",
        "noopener,noreferrer",
      );

      clearCart();
      navigate({
        to: "/order-success",
        search: { orderId: String(order.id), name: form.name },
      });
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  }

  return (
    <Layout>
      {/* Header bar */}
      <div className="bg-card border-b border-border/60">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground font-body">
            <Link to="/" className="hover:text-primary transition-smooth">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-primary">Checkout</span>
          </nav>
          <h1 className="font-display text-3xl font-bold text-foreground mt-2">
            Checkout
          </h1>
        </div>
      </div>

      <section className="bg-background py-10">
        <div className="container mx-auto px-4">
          {items.length === 0 ? (
            <div className="text-center py-20" data-ocid="cart-empty">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-30" />
              <p className="font-display text-2xl font-bold text-foreground mb-2">
                Your cart is empty
              </p>
              <p className="text-muted-foreground font-body mb-6">
                Add some products first!
              </p>
              <Button
                asChild
                className="gradient-gold-accent text-primary-foreground font-body"
              >
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-10">
              {/* Cart items */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-4"
              >
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Cart ({totalItems} items)
                </h2>
                {items.map((item) => (
                  <div
                    key={String(item.productId)}
                    className="flex gap-3 bg-card border border-border/60 rounded-lg p-3 shadow-luxury"
                    data-ocid={`cart-item-${String(item.productId)}`}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-16 w-16 rounded object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                        🛍️
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-sm text-foreground line-clamp-1">
                        {item.productName}
                      </p>
                      <p className="text-primary font-display font-bold text-sm mt-0.5">
                        PKR {Number(item.price).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6 text-xs border-border"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          −
                        </Button>
                        <span className="font-body text-sm w-6 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6 text-xs border-border"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive transition-smooth h-8 w-8 flex-shrink-0"
                      onClick={() => removeItem(item.productId)}
                      aria-label="Remove item"
                      data-ocid={`cart-remove-${String(item.productId)}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-body font-semibold text-foreground">
                    Total
                  </span>
                  <span className="font-display text-2xl font-bold text-primary">
                    PKR {Number(totalAmount).toLocaleString()}
                  </span>
                </div>
              </motion.div>

              {/* Delivery form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Delivery Details
                  </h2>

                  <div className="flex flex-col gap-4 bg-card border border-border/60 rounded-lg p-5 shadow-luxury">
                    <div className="grid gap-2">
                      <Label className="font-body text-sm" htmlFor="name">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        className="font-body"
                        data-ocid="checkout-name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="font-body text-sm" htmlFor="phone">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="03XXXXXXXXX"
                        required
                        className="font-body"
                        data-ocid="checkout-phone"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="font-body text-sm" htmlFor="address">
                        Address *
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Street address, house number"
                        required
                        className="font-body"
                        data-ocid="checkout-address"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="font-body text-sm" htmlFor="city">
                        City *
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Your city"
                        required
                        className="font-body"
                        data-ocid="checkout-city"
                      />
                    </div>
                  </div>

                  {/* Payment method */}
                  <div className="flex flex-col gap-3">
                    <Label className="font-body text-sm font-semibold text-foreground">
                      Payment Method *
                    </Label>
                    <RadioGroup
                      value={form.payment}
                      onValueChange={(v) =>
                        setForm((prev) => ({ ...prev, payment: v }))
                      }
                      className="flex flex-col gap-3"
                      data-ocid="checkout-payment"
                    >
                      <div className="flex items-center gap-3 bg-card border border-border/60 rounded-lg p-4 shadow-luxury hover:border-primary/40 transition-smooth cursor-pointer">
                        <RadioGroupItem value="Cash on Delivery" id="cod" />
                        <Label
                          htmlFor="cod"
                          className="font-body cursor-pointer flex-1"
                        >
                          <span className="font-semibold text-foreground">
                            Cash on Delivery
                          </span>
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            Pay when your order arrives
                          </span>
                        </Label>
                        <span className="text-2xl">💵</span>
                      </div>
                      <div className="flex items-center gap-3 bg-card border border-border/60 rounded-lg p-4 shadow-luxury hover:border-primary/40 transition-smooth cursor-pointer">
                        <RadioGroupItem value="EasyPaisa" id="easypaisa" />
                        <Label
                          htmlFor="easypaisa"
                          className="font-body cursor-pointer flex-1"
                        >
                          <span className="font-semibold text-foreground">
                            EasyPaisa
                          </span>
                          <span className="block text-xs text-muted-foreground mt-0.5">
                            Send to: 03457393786
                          </span>
                        </Label>
                        <span className="text-2xl">📱</span>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gradient-gold-accent text-primary-foreground font-body font-semibold shadow-luxury hover:shadow-luxury-hover transition-smooth"
                    disabled={isPending}
                    data-ocid="checkout-submit"
                  >
                    {isPending ? "Placing Order..." : "Place Order"}
                  </Button>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
