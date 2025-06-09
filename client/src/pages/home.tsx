import Header from "@/components/header";
import Hero from "@/components/hero";
import Features from "@/components/features";
import TopCameras from "@/components/top-cameras";
import Products from "@/components/products";

import News from "@/components/news";
import FloatingJarvis from "@/components/floating-jarvis";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <Products />
        <Features />
        <TopCameras />
        <News />
        <Contact />
      </main>
      <Footer />
      <FloatingJarvis />
    </div>
  );
}
