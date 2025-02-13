import Link from "next/link";

export default function HeroSection() {
  return (
    <div id="home" className="relative h-screen w-full">
      {/* Video Background */}
      <video autoPlay loop muted playsInline crossOrigin="anonymous" className="absolute top-0 left-0 w-screen h-screen object-cover">
        <source src="https://res.cloudinary.com/dztilubhi/video/upload/v1738596113/terraria/vet-examining-sick-dog.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 from-5% via-black/60 via-70% to-violet-300/70 to-100%" />
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl md:text-6xl font-serif mb-4">
            Merawat dengan Cinta, <br />
            <span className="text-orange-500">Menjaga dengan Keahlian</span>
          </h1>
          <p className="text-base md:text-lg text-gray-200 mb-8">Dengan pengalaman lebih dari 10 tahun, kami menyediakan solusi perawatan yang berkualitas.</p>
          <Link href="#booking">
            <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg transition-colors">Booking Sekarang</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
