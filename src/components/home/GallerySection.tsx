const GallerySection = () => {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-violet-100 from-5% to-violet-300 to-90%">
      <div className="flex flex-col items-center justify-center p-10 relative">
        <h1 className="text-3xl font-bold">
          {/* Layanan*/}
          Gallery
        </h1>

        <div className="absolute top-0 left-0 w-full -z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#273036" fillOpacity="0.2" d="M0,320L48,309.3C96,299,192,277,288,229.3C384,181,480,107,576,112C672,117,768,203,864,218.7C960,235,1056,181,1152,144C1248,107,1344,85,1392,74.7L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GallerySection;
