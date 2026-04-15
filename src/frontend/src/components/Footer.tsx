import { CreditCard, Phone } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="bg-card border-t border-border/60 mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/assets/images/kami-shopsy-logo.jpeg"
                alt="Kami Shopsy Logo"
                className="h-10 w-10 rounded-full object-cover border-2 border-primary/60 shadow-luxury flex-shrink-0"
              />
              <span className="font-display text-lg font-bold text-primary">
                Kami Shopsy
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Premium Pakistani fashion & lifestyle products. Quality you can
              trust, delivered to your doorstep.
            </p>
          </div>

          {/* Payment */}
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-sm font-semibold text-foreground tracking-wide uppercase">
              Payment Methods
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Cash on Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>EasyPaisa: 03457393786</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-sm font-semibold text-foreground tracking-wide uppercase">
              Contact & Orders
            </h3>
            <a
              href="https://wa.me/923457393786"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth"
              data-ocid="footer-whatsapp"
            >
              <SiWhatsapp className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>WhatsApp: 03457393786</span>
            </a>
            <p className="text-xs text-muted-foreground">
              Orders confirmed via WhatsApp
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {year} Kami Shopsy. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with love using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline transition-smooth"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
