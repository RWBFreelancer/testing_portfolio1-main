import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/hero/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import SkillsSection from "@/components/sections/SkillsSection";
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
          "Rey Binay-an builds AI voice agents, chatbots and workflow systems that automate repetitive operations and elevate customer experience.",
      },
      { property: "og:title", content: "Rey Binay-an — AI Automation Engineer" },
      {
        property: "og:description",
        content:
          "AI voice agents, chatbots, and workflow systems for real business bottlenecks.",
      },
    ],
  }),
});

function Index() {
  const { theme, toggle } = useTheme();
  return (
    <div className="min-h-screen text-foreground">
      <Navbar theme={theme} onThemeToggle={toggle} />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <EducationSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
