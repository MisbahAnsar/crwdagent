import FaqSection from "../components/home/FaqSection";
import Features from "../components/home/Features";
import Footer from "../components/home/Footer";
import Hero from "../components/home/Hero";
import HeroFloatingCards from "../components/home/HeroFloatingCards";
import HowItWorks from "../components/home/HowItWorks";
import Navbar from "../components/home/Navbar";
import Pricing from "../components/home/Pricing";
import PageShell from "../components/home/PageShell";

export default function Home() {
  return (
    <PageShell>
      <Navbar />
      <main className="space-y-16 sm:space-y-20">
        <div className="relative">
          <HeroFloatingCards />
          <Hero />
        </div>
        <Features />
        <HowItWorks />
        <Pricing />
        <FaqSection />
        {/* <CtaSection /> */}
        <Footer />
      </main>
    </PageShell>
  );
}
