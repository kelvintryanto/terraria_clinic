"use client";

import { useEffect } from "react";
import Link from "next/link";

const FacilitySection = () => {
  useEffect(() => {
    if (window.location.hash === "#fasilitas") {
      const fasilitasElement = document.getElementById("fasilitas");
      if (fasilitasElement) {
        fasilitasElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div
      id="fasilitas"
      className="w-full h-full bg-gradient-to-t from-violet-800/80 to-violet-800 pt-14"
    >
      <div className="flex p-3 md:px-10 h-full rounded-md w-full">
        <div className="flex flex-col md:flex-row items-center justify-evenly p-3 md:p-8 bg-white/10 rounded-md w-full backdrop-blur-sm">
          <div className="flex flex-col gap-1 w-full md:w-2/3 p-3">
            <h1 className="text-orange-500 text-2xl md:text-3xl lg:text-4xl font-bold">
              Fasilitas Kami
            </h1>
            <h3 className="text-sm md:text-base text-gray-300">
              Rumah Terraria hadir dengan berbagai fasilitas terbaik untuk
              mempercepat pemulihan sahabat kesayangan Anda. Dari layanan rawat
              inap yang nyaman hingga area bermain yang luas, kami memastikan
              setiap hewan mendapatkan perawatan dengan penuh kasih dan
              perhatian.
            </h3>
          </div>

          <Link
            href="https://www.rumah-terraria.com/"
            target="_blank"
            className="flex justify-center items-center rounded-md bg-gradient-to-br from-orange-500 to-amber-300 py-2 px-4 text-white font-bold hover:bg-gradient-to-br hover:from-orange-400 hover:to-amber-200 hover:-rotate-1 transition-all duration-300 text-sm md:text-lg w-full md:w-fit text-center"
          >
            Rumah Terraria - One Stop Dog’s Entertainment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FacilitySection;
