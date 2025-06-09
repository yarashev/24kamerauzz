import Header from "@/components/header";
import Hero from "@/components/hero";
import Features from "@/components/features";
import Products from "@/components/products";
import Calculator from "@/components/calculator";
import News from "@/components/news";
import JarvisChat from "@/components/jarvis-chat";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <Features />
        <Products />
        <Calculator />
        <News />
        <JarvisChat />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
