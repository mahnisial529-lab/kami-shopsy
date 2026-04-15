import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { CheckCircle, MessageCircle, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { Layout } from "../components/Layout";

function getSearchParam(key: string): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(key) ?? "";
}

export default function OrderSuccessPage() {
  const orderId = getSearchParam("orderId");
  const customerName = getSearchParam("name");

  return (
    <Layout>
      <section className="bg-background min-h-[70vh] flex items-center justify-center py-20">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="mb-6"
          >
            <div className="h-24 w-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-4"
          >
            <h1 className="font-display text-4xl font-bold text-foreground">
              Order Placed!{" "}
              <span role="img" aria-label="celebrate">
                🎉
              </span>
            </h1>
            {customerName && (
              <p className="text-muted-foreground font-body text-base">
                Thank you,{" "}
                <span className="font-semibold text-foreground">
                  {customerName}
                </span>
                ! Your order has been received.
              </p>
            )}
            {!customerName && (
              <p className="text-muted-foreground font-body text-lg">
                Thank you for shopping with Kami Shopsy. Your order has been
                received successfully.
              </p>
            )}

            {orderId && (
              <div className="bg-muted/30 border border-border/40 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1">
                  Order ID
                </p>
                <p
                  className="font-display font-bold text-foreground text-2xl"
                  data-ocid="order-id-display"
                >
                  #{orderId}
                </p>
              </div>
            )}

            <div className="bg-card border border-border/60 rounded-lg p-5 shadow-luxury text-left flex flex-col gap-3 mt-2">
              <h2 className="font-display font-semibold text-foreground">
                What happens next?
              </h2>
              <ul className="flex flex-col gap-2">
                {[
                  "We will contact you on WhatsApp shortly to confirm your order",
                  "For EasyPaisa payments: send to 03457393786",
                  "Your order will be packed and dispatched promptly",
                  "Delivery will be arranged to your address",
                ].map((step) => (
                  <li
                    key={step}
                    className="flex items-start gap-2 text-sm text-muted-foreground font-body"
                  >
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="https://wa.me/923457393786"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
              data-ocid="order-whatsapp"
            >
              <Button
                size="lg"
                className="w-full btn-whatsapp font-body font-semibold gap-2 transition-smooth"
              >
                <MessageCircle className="h-5 w-5" />
                Contact on WhatsApp
              </Button>
            </a>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full border-primary/30 text-primary hover:bg-primary/5 font-body transition-smooth"
              data-ocid="order-continue-shopping"
            >
              <Link to="/">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
