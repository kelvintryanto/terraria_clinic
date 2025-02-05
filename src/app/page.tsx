import AboutSection from "@/components/home/AboutSection";
import GallerySection from "@/components/home/GallerySection";
import HeroSection from "@/components/home/HeroSection";
import ServiceSection from "@/components/home/ServiceSection";

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />
        <AboutSection />
        <ServiceSection />
        <GallerySection />
      </main>
    </>
  );
}
