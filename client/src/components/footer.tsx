import { useLanguage } from "@/hooks/use-language";
import { MessageCircle, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  const { t, language } = useLanguage();

  const footerSections = [
    {
      title: t("products-footer"),
      links: [
        { text: t("security-cameras"), href: "#" },
        { text: t("solar-panels"), href: "#" },
        { text: t("accessories"), href: "#" },
        { text: t("systems"), href: "#" }
      ]
    },
    {
      title: t("services-footer"),
      links: [
        { text: t("installation"), href: "#" },
        { text: t("technical-service"), href: "#" },
        { text: t("consultation"), href: "#" },
        { text: t("support"), href: "#" }
      ]
    },
    {
      title: t("company-footer"),
      links: [
        { text: t("about-us"), href: "#" },
        { text: t("news"), href: "#news" },
        { text: t("contact"), href: "#contact" },
        { text: t("privacy-policy"), href: "#" }
      ]
    }
  ];

  const socialLinks = [
    { icon: MessageCircle, href: "https://t.me/24kameraBot", label: "Telegram" },
    { icon: Instagram, href: "https://www.instagram.com/24kamera.uz", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" }
  ];

  const handleLinkClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.getElementById(href.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <footer className="bg-secondary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h4 className="text-xl font-bold mb-4">
              <span className="bg-primary px-2 py-1 rounded">24</span>kamera.uz
            </h4>
            <p className="text-gray-300 mb-4">
              {t("company-desc")}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleLinkClick(social.href)}
                    className="text-gray-300 hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-6 w-6" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h5 className="font-semibold mb-4">{section.title}</h5>
              <ul className="space-y-2 text-gray-300">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="hover:text-white transition-colors text-left"
                    >
                      {link.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8 text-center text-gray-300">
          <p>
            &copy; 2025 24kamera.uz - {t("rights-reserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
