import Header from "@/components/header";
import Hero from "@/components/hero";
import Features from "@/components/features";
import TopCameras from "@/components/top-cameras";
import Products from "@/components/products";
import Masters from "@/components/masters";
import News from "@/components/news";
import FloatingJarvis from "@/components/floating-jarvis";
import Contact from "@/components/contact";
import Footer from "@/components/footer";
import AdminPanel from "@/components/admin-panel";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <Products />
        <Features />
        <TopCameras />
        <Masters />
        <News />
        <Contact />
      </main>
      <Footer />
      <FloatingJarvis />
      <AdminPanel />
    </div>
  );
}
