"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const BookingSection = () => {
  useEffect(() => {
    if (window.location.hash === "#booking") {
      const bookingElement = document.getElementById("booking");
      if (bookingElement) {
        bookingElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div id="booking" className="w-full bg-violet-800">
      <div className="flex flex-col items-center justify-center p-3 pt-20 relative md:px-10">
        <div className="flex flex-col md:flex-row items-center justify-evenly p-3 md:p-8 bg-white/10 rounded-md w-full backdrop-blur-sm">
          <div className="flex flex-col gap-1 w-full md:w-2/3 p-3">
            <h1 className="text-orange-500 text-2xl md:text-3xl lg:text-4xl font-bold">Booking Dokter</h1>
            <h3 className="text-sm md:text-base text-gray-300">TerrariaVet menyediakan layanan booking dokter yang praktis dan cepat, memastikan sahabat kesayangan Anda mendapatkan perawatan tepat waktu. Dengan tim profesional dan penuh kasih, kami siap membantu menjaga kesehatan mereka dengan sepenuh hati.</h3>
          </div>

          <div className="flex flex-col gap-5 w-full md:w-fit">
            <Link href="https://wa.me/6281381539922" target="_blank" className="flex justify-center items-center rounded-md bg-gradient-to-br from-green-600 to-green-500 py-2 px-4 text-white font-bold hover:bg-gradient-to-br hover:from-green-500 hover:to-green-400 transition-all duration-300 text-sm md:text-lg w-full md:w-fit text-center gap-1">
              <span>
                <Image src="/whatsapp/wa_white.png" alt="Admin" width={24} height={20} />
              </span>
              <span>Admin 1</span>
            </Link>
            <Link href="https://wa.me/62811800790" target="_blank" className="flex justify-center items-center rounded-md bg-gradient-to-br from-green-600 to-green-500 py-2 px-4 text-white font-bold hover:bg-gradient-to-br hover:from-green-500 hover:to-green-400 transition-all duration-300 text-sm md:text-lg w-full md:w-fit text-center gap-1">
              <span>
                <Image src="/whatsapp/wa_white.png" alt="Admin" width={24} height={20} />
              </span>
              <span>Admin 2</span>
            </Link>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full -z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#273036" fillOpacity="0.7" d="M0,320L48,309.3C96,299,192,277,288,229.3C384,181,480,107,576,112C672,117,768,203,864,218.7C960,235,1056,181,1152,144C1248,107,1344,85,1392,74.7L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BookingSection;
