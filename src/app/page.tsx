import AboutSection from "@/components/home/AboutSection";
import BookingSection from "@/components/home/BookingSection";
import FacilitySection from "@/components/home/FacilitySection";
import HeroSection from "@/components/home/HeroSection";
import ServiceSection from "@/components/home/ServiceSection";

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />
        <AboutSection />
        <FacilitySection />
        <ServiceSection />
        <BookingSection />
      </main>
    </>
  );
}
