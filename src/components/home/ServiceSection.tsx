const ServiceSection = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-t from-purple-200 from-5% via-white/50 via-50% to-purple-300 to-90%">
      <div className="flex flex-col items-center justify-center p-10 relative">
        <h1 className="text-3xl font-bold">
          {/* Layanan*/}
          Layanan
        </h1>

        <div className="absolute top-0 left-0 w-full -z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#273036" fill-opacity="0.7" d="M0,32L120,26.7C240,21,480,11,720,32C960,53,1200,107,1320,133.3L1440,160L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ServiceSection;
