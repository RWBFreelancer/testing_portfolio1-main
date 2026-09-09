import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/hero/HeroSection";
import HoloDeck from "@/components/hero/HoloDeck";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import EducationSection from "@/components/sections/EducationSection";
import ContactSection from "@/components/contact/ContactSection";
import { useTheme } from "@/hooks/useTheme";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Rey Binay-an — AI Automation Engineer" },
      {
        name: "description",
        content:
          "Rey Binay-an builds AI voice agents, chatbots, and n8n workflow systems for small and medium businesses: law firms, ecommerce brands, and service businesses. Baguio City, Philippines. Available for remote contract work.",
      },
      { property: "og:title", content: "Rey Binay-an — AI Automation Engineer" },
      {
        property: "og:description",
        content: "AI voice agents, chatbots, and workflow systems for real business bottlenecks.",
      },
    ],
  }),
});

function Index() {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen text-foreground">
      <Navbar theme={theme} onThemeToggle={toggle} />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <HoloDeck />
        <AboutSection />
        <EducationSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
