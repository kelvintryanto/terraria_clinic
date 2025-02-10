import Image from "next/image";

const ServiceSection = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-violet-800/80 to-violet-800">
      <div className="h-full flex flex-col items-center p-10 relative">
        <h1 className="text-3xl font-bold text-orange-500">
          {/* Layanan*/}
          Layanan Kami
        </h1>

        {/* Service Content */}
        <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 p-0 mt-8 md:p-10 md:gap-10 w-full">
          {/* Service Content 1: Konsultasi */}
          <div className="group flex flex-col items-center justify-center text-center gap-1 bg-white/20 backdrop-blur-md p-3 rounded-lg border-4 border-amber-600 shadow-lg">
            <Image src="/layanan/consultation.png" alt="Consultation" width={200} height={200} />
            <h2 className="text-lg md:text-xl font-bold text-white">Konsultasi</h2>
            <p className="text-sm md:text-base text-gray-200">Pemeriksaan dan saran terbaik untuk kesehatan anjing dari dokter hewan profesional</p>
          </div>

          {/* Service Content 2: Vaksinasi */}
          <div className="flex flex-col items-center justify-center text-center gap-1 bg-white/20 backdrop-blur-md p-3 rounded-lg border-4 border-amber-600 shadow-lg ">
            <Image src="/layanan/vaccine.png" alt="Vaccine" width={200} height={200} />
            <h2 className="text-lg md:text-xl font-bold text-white">Vaksinasi</h2>
            <p className="text-sm md:text-base text-gray-200">Memperkuat sistem imun anjing dengan vaksinasi yang aman dan direkomendasikan</p>
          </div>

          {/* Service Content 3: Laboratorium */}
          <div className="flex flex-col items-center justify-center text-center gap-1 bg-white/20 backdrop-blur-md p-3 rounded-lg border-4 border-amber-600 shadow-lg ">
            <Image src="/layanan/laboratory.png" alt="Laboratory" width={200} height={200} />
            <h2 className="text-lg md:text-xl font-bold text-white">Laboratorium</h2>
            <p className="text-sm md:text-base text-gray-200">Pemeriksaan Laboratorium akurat untuk mendeteksi penyakit lebih awal dan memastikan kesehatan optimal</p>
          </div>

          {/* Service Content 4: Akupunktur */}
          <div className="flex flex-col items-center justify-center text-center gap-1 bg-white/20 backdrop-blur-md p-3 rounded-lg border-4 border-amber-600 shadow-lg ">
            <Image src="/layanan/acupuncture.png" alt="Acupuncture" width={200} height={200} />
            <h2 className="text-lg md:text-xl font-bold text-white">Akupunktur</h2>
            <p className="text-sm md:text-base text-gray-200">Terapi akupunktur untuk membantu meredakan nyeri, meningkatkan mobilitas dan mempercepat pemulihan</p>
          </div>

          {/* Service Content 5: USG */}
          <div className="flex flex-col items-center justify-center text-center gap-1 bg-white/20 backdrop-blur-md p-3 rounded-lg border-4 border-amber-600 shadow-lg ">
            <Image src="/layanan/usg.png" alt="USG" width={200} height={200} />
            <h2 className="text-lg md:text-xl font-bold text-white">USG</h2>
            <p className="text-sm md:text-base text-gray-200">Teknologi USG modern untuk diagnosa lebih akurat dalam mendeteksi kondisi kesehatan anjing</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#273036" fillOpacity="0.1" d="M0,64L34.3,80C68.6,96,137,128,206,128C274.3,128,343,96,411,112C480,128,549,192,617,224C685.7,256,754,256,823,234.7C891.4,213,960,171,1029,170.7C1097.1,171,1166,213,1234,197.3C1302.9,181,1371,107,1406,69.3L1440,32L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z"></path>
          </svg>
        </div>

        <div className="absolute top-0 left-0 w-full z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#273036" fillOpacity="0.1" d="M0,32L120,26.7C240,21,480,11,720,32C960,53,1200,107,1320,133.3L1440,160L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ServiceSection;
