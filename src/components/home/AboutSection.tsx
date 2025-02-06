const AboutSection = () => {
  return (
    <div className="w-full bg-gradient-to-b from-purple-200 from-5% via-white/50 via-50% to-purple-300 to-100%">
      <div className="flex flex-col items-center justify-center p-10 relative">
        <h1 className="text-3xl font-bold">
          {/* Welcome Text */}
          Welcome to Klinik Anjing Terraria
        </h1>

        {/* video klinik */}
        <div className="flex gap-10 w-full my-5 justify-center p-5">
          {/* <div className="grid-cols-1">
            <iframe width="100%" height={300} src="https://www.youtube.com/embed/JPdHOnI-27U" title="Penitipan Anjing Terbesar & Terbaik Di Indonesia - DOG HOTEL RUMAH TERRARIA" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" className="rounded-xl" />
          </div>

          <div className="grid-cols-1">
            <iframe width="100%" height={300} src="https://www.youtube.com/embed/sS5kGKatkmE" title="IMS - Sarana perawatan anjing" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" className="rounded-xl"></iframe>
          </div> */}

          <div className="lg:w-1/3 md:w-1/2 sm:w-4/5 w-full">
            <iframe width="100%" height={300} src="https://www.youtube.com/embed/jB4voBKFRxw" title="Rumah Terraria" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" className="rounded-xl"></iframe>
          </div>

          <div className="flex flex-wrap w-full lg:w-2/3 items-center text-base">
            {/* About Us */}
            <p>Berawal dari Hobby keluarga yang sayang dengan hewan dan impian Kakek Nenek saya adalah Memiliki Hotel untuk hewan khususnya (Anjing). Dan akhirnya di Tahun 2005 kami bisa mewujudkan impiannya dengan membuka Rumah Terraria.</p>
            <br />
            <p>Fasilitas penitipan yang di lengkapi dengan pelayanan jasa lainnya seperti pelatihan, tempat bermain, perawatan, rekreasi , transportasi dll. Belum lengkap jika tempat seperti kami tidak miliki Fasilitas pemeriksaan. Singkat cerita akhirnya kami memiliki Ruang Pemeriksaan kesehatan untuk anjing kesayangan anda.</p>
            <br />
            <p>“TERRARIAVET” adalah salah satu fasilitas pelengkap yang kami wujudkan dari impian Kakek & Nenek saya. Walaupun membutuhkan komitmen, waktu, perhatian, cinta dan tanggung jawab penuh yang wajib dilakukan dengan benar dengan panduan konsultan perawatan hewan peliharaan kami.</p>
            <br />
            <p>Kami berusaha untuk membantu Anda menjaga dan mengelola kesehatan dan gizi hewan peliharaan Anda melalui konsultasi perawatan hewan peliharaan yang berorientasi pada pelayanan kami.</p>
            <br />
            <p>Di TerrariaVet, kami mengutamakan kesehatan mereka dan mendapatkan perawatan berkualitas yang mereka pantas dapatkan.</p>
            <br />
            <br />
            <p>Woooff… Woooff…</p>
          </div>
        </div>

        {/* <div className="absolute bottom-0 left-0 w-full -z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#273036" fill-opacity="0.2" d="M0,192L60,192C120,192,240,192,360,176C480,160,600,128,720,96C840,64,960,32,1080,58.7C1200,85,1320,171,1380,213.3L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div> */}

        <div className="absolute top-0 left-0 w-full -z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#273036" fill-opacity="0.2" d="M0,320L40,304C80,288,160,256,240,213.3C320,171,400,117,480,112C560,107,640,149,720,186.7C800,224,880,256,960,261.3C1040,267,1120,245,1200,250.7C1280,256,1360,288,1400,304L1440,320L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
