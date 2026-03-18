import CtaSection from "../components/home/CtaSection";
import FaqSection from "../components/home/FaqSection";
import Features from "../components/home/Features";
import Footer from "../components/home/Footer";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import Navbar from "../components/home/Navbar";
import PageShell from "../components/home/PageShell";

export default function Home() {
  return (
    <PageShell>
      <Navbar />
      <main className="mt-14 space-y-16 sm:space-y-20">
        <Hero />
        <Features />
        <HowItWorks />
        <FaqSection />
        <CtaSection />
        <Footer />
      </main>
    </PageShell>
  );
}
