import { Button } from "@/components/ui/button";
import { ShoppingBag, Calculator } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function Hero() {
  const { t } = useLanguage();

  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="hero-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              {t("hero-title")}
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              {t("hero-desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => handleScrollTo("products")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold"
                size="lg"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {t("view-products")}
              </Button>
              <Button
                onClick={() => handleScrollTo("calculator")}
                variant="outline"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-11 rounded-md border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold bg-[#96bf13]"
                size="lg"
              >
                <Calculator className="mr-2 h-5 w-5" />
                {t("nav-calculator")}
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Smart security cameras and home automation system"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
