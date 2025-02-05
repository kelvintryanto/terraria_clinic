const AboutSection = () => {
  return (
    <div className="h-screen w-full p-10 bg-gradient-to-br from-orange-200/70 from-5% to-orange-600/70 to-100%">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">
          {/* Welcome Text */}
          Welcome to Klinik Anjing Terraria
        </h1>

        {/* video klinik */}
        <div className="flex gap-10 w-full my-8 justify-center items-center">
          {/* <div className="grid-cols-1">
            <iframe width="100%" height={300} src="https://www.youtube.com/embed/JPdHOnI-27U" title="Penitipan Anjing Terbesar & Terbaik Di Indonesia - DOG HOTEL RUMAH TERRARIA" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" className="rounded-xl" />
          </div>

          <div className="grid-cols-1">
            <iframe width="100%" height={300} src="https://www.youtube.com/embed/sS5kGKatkmE" title="IMS - Sarana perawatan anjing" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" className="rounded-xl"></iframe>
          </div> */}

          <div className="lg:w-1/3 md:w-1/2 sm:w-4/5 w-full">
            <iframe width="100%" height={300} src="https://www.youtube.com/embed/jB4voBKFRxw" title="Rumah Terraria" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" className="rounded-xl"></iframe>
          </div>
        </div>

        <div className="flex flex-wrap w-full lg:w-2/3 justify-center items-center text-center text-xl">
          {/* About Us */}
          Rumah Terraria Berdiri sejak Tahun 2004, Dengan Luas area 5.000m2 yang di lengkapi dengan berbagai macam fasilitas untuk Anjing kesayangan anda. Lapangan yang Luas untuk kesayangan anda Bermain, Berlari , Bersosialisasi, Berlatih, Dan Lainnya. Kami memiliki Kapasitas Penitipan 300 ekor, Kolam Renang untuk hewan ( Tidak Menggunakan kaporit ), Coffee shop, Tempat berlatih memberikan kenyamanan bagi Anjing kesayangan Anda. Disamping itu, Anjing Anda juga akan dirawat dan dilatih oleh para pelatih yang handal dan Terpercaya.
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
