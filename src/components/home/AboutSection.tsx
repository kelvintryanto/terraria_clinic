const AboutSection = () => {
  return (
    <div className="w-full bg-gradient-to-b from-violet-800/80 to-violet-800">
      <div className="flex flex-col items-center justify-center p-10 relative h-full">
        <h1 className="flex gap-1 text-2xl md:text-3xl lg:text-4xl font-bold">
          {/* Welcome Text */}
          <span className="text-gray-200">Welcome to</span>
          <div className="flex">
            <span className="text-orange-500">Terraria</span>
            <span className="text-purple-500">Vet</span>
          </div>
        </h1>

        {/* video klinik */}
        <div className="flex gap-10 w-full my-5 justify-center p-5">
          <div className="lg:w-1/3 md:w-1/2 sm:w-4/5 w-full">
            <iframe width="100%" height={300} src="https://www.youtube.com/embed/jB4voBKFRxw" title="Rumah Terraria" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className="rounded-xl"></iframe>
          </div>

          <div className="flex flex-wrap w-full lg:w-2/3 items-center text-base text-gray-200 space-y-4 gap-1">
            {/* About Us */}
            <p>
              Berawal dari kecintaan keluarga kami terhadap hewan, khususnya anjing, serta impian Kakek & Nenek kami untuk memiliki hotel hewan, <strong>Rumah Terraria</strong> akhirnya berdiri pada tahun 2005.
            </p>
            <p>Seiring waktu, kami menyadari bahwa penitipan hewan tidak hanya sekadar menyediakan tempat yang nyaman, tetapi juga harus dilengkapi dengan berbagai layanan pendukung, seperti pelatihan, tempat bermain, perawatan, rekreasi, hingga transportasi. Namun, ada satu hal yang masih kurang—fasilitas pemeriksaan kesehatan.</p>
            <p>
              Dari situlah <strong>TerrariaVet</strong> lahir, sebagai bentuk komitmen kami untuk memberikan perawatan kesehatan terbaik bagi anjing kesayangan Anda. Dengan bimbingan para profesional dan tenaga medis berpengalaman, kami hadir untuk membantu Anda menjaga kesehatan dan kesejahteraan hewan peliharaan melalui layanan konsultasi dan pemeriksaan berkualitas.
            </p>
            <p>
              Di <strong>TerrariaVet</strong>, kesehatan dan kebahagiaan mereka adalah prioritas utama kami.
            </p>
            <p className="text-lg font-semibold">Woooff… Woooff… 🐶✨</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#273036" fillOpacity="0.1" d="M0,192L60,192C120,192,240,192,360,176C480,160,600,128,720,96C840,64,960,32,1080,58.7C1200,85,1320,171,1380,213.3L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>

        <div className="absolute top-0 left-0 w-full -z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#273036" fillOpacity="0.7" d="M0,320L40,304C80,288,160,256,240,213.3C320,171,400,117,480,112C560,107,640,149,720,186.7C800,224,880,256,960,261.3C1040,267,1120,245,1200,250.7C1280,256,1360,288,1400,304L1440,320L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
