import HeroSection from "../components/sections/hero-section";
import AboutSection from "../components/sections/about-section";
import FeaturesSection from "../components/sections/features-section";
import ToursSection from "../components/sections/tours-section";
import DestinationsSection from "../components/sections/destinations-section";
import FeaturedToursSection from "../components/sections/featured-tours-section";
import TestimonialsSection from "../components/sections/testimonials-section";
import HowItWorksSection from "../components/sections/how-it-works-section";
import ContactSection from "../components/sections/contact-section";
import CTASection from "../components/sections/cta-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <ToursSection />
      <DestinationsSection />
      <FeaturedToursSection />
      <TestimonialsSection />
      <HowItWorksSection />
      <ContactSection />
      <CTASection />
    </>
  );
}