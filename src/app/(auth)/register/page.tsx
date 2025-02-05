import { ClipboardPlus, HandHeart } from "lucide-react";
import Link from "next/link";

const Register = () => {
  return (
    <div className="flex h-screen items-center justify-center w-screen md:px-40 px-4 mt-5">
      <div className="flex w-full justify-center gap-5 text-orange-900">
        {/* card kiri */}
        <div className="hidden lg:flex flex-col p-12 bg-white/10 rounded-xl shadow-md w-1/2 xl:w-1/3 items-center justify-end relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 from-5% via-black/60 via-70% to-white/70 to-100% z-0" />
          <div className="absolute inset-0 bg-[url('https://i.pinimg.com/236x/5d/65/ab/5d65ab3d364e83e2c472d474c2528016.jpg')] bg-cover bg-center -z-10"></div>

          <div className="absolute flex flex-col justify-end items-center rounded-full p-10 mt-56 z-10 h-full">
            {/* <Image src="/logo.png" alt="logo" width={100} height={100} /> */}

            <div className="flex text-sm text-white items-center md:text-base xl:text-xl">
              <h3>Merawat dengan </h3>
              <span className="font-bold text-red-500 mx-1">Cinta</span>
              <span className="flex mx-1">
                <HandHeart />
              </span>
            </div>
            <div className="flex text-sm text-white items-center md:text-base xl:text-xl">
              <h3>Menjaga dengan</h3>
              <span className="flex mx-1 text-orange-600 font-bold">Keahlian</span>
              <span>
                <ClipboardPlus />
              </span>
            </div>
          </div>
        </div>

        {/* card kanan */}
        <div className="flex flex-col p-4 bg-white/10 rounded-xl shadow-md w-full md:w-full lg:w-3/5 xl:w-1/2 items-center justify-center">
          <h1 className="text-center text-md md:text-xl font-bold text-orange-900">Daftar</h1>
          <h2 className="text-center text-sm md:text-md text-orange-700 mb-8">Silakan isi data diri Anda terlebih</h2>
          <form className="flex flex-col gap-4 w-full p-5">
            <input type="text" placeholder="Nama" className="w-full rounded-md p-2 border-2 border-orange-700 focus:border-orange-500 focus:border-2" />
            <input type="text" placeholder="Email" className="w-full rounded-md p-2 border-2 border-orange-700 focus:border-orange-500 focus:border-2" />
            <input type="text" placeholder="No. Handphone" className="w-full rounded-md p-2 border-2 border-orange-700 focus:border-orange-500 focus:border-2" />
            <input type="password" placeholder="Password" className="w-full rounded-md p-2 border-2 border-orange-700 focus:border-orange-500 focus:border-2" />
            <input type="repeatpassword" placeholder="Ulangi Password" className="w-full rounded-md p-2 border-2 border-orange-700 focus:border-orange-500 focus:border-2" />
            <button className="w-full rounded-md p-2 bg-gradient-to-r from-orange-500 to-orange-300 text-orange-900 shadow-md hover:bg-gradient-to-r hover:from-orange-600 hover:to-orange-400 transition-colors mt-8">Masuk</button>
          </form>
          <p className="text-center text-sm md:text-md text-orange-700">
            Belum punya akun?{" "}
            <Link href="/register" className="text-orange-500 hover:underline">
              Daftar
            </Link>
          </p>
          <p className="text-center text-sm md:text-md text-orange-700">
            Lupa password?{" "}
            <Link href="/forgot-password" className="text-orange-500 hover:underline">
              Lupa password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
