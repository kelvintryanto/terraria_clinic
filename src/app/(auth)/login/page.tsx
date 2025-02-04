import Link from "next/link";

const Login = async () => {
  return (
    <div className="flex h-screen items-center justify-center w-screen md:px-40 px-4">
      <div className="flex w-full md:w-3/4 justify-center gap-5 text-orange-900">
        {/* card kiri */}
        <div className="hidden md:flex flex-col p-12 bg-white/10 rounded-xl shadow-md w-1/2 items-center justify-end relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-[url('https://i.pinimg.com/236x/5d/65/ab/5d65ab3d364e83e2c472d474c2528016.jpg')] bg-cover bg-center -z-10"></div>

          <div className="rounded-full p-10 mt-56">{/* <Image src="/logo.png" alt="logo" width={100} height={100} /> */}</div>
          <h3 className="">Merawat dengan Cinta,</h3>
          <h3 className="">Menjaga dengan Keahlian</h3>
        </div>

        {/* card kanan */}
        <div className="flex flex-col p-4 bg-white/10 rounded-xl shadow-md w-full md:w-1/2 items-center justify-center">
          <h1 className="text-center text-md md:text-2xl font-bold text-orange-900">Selamat datang di Terraria Clinic</h1>
          <h2 className="text-center text-sm md:text-md text-orange-700 mb-8">Silakan masukkan ke Akun Anda terlebih dahulu</h2>
          <form className="flex flex-col gap-4 w-full p-5">
            <input type="text" placeholder="Username" className="w-full rounded-md p-3 border-2 border-orange-700 focus:border-orange-500 focus:border-2" />
            <input type="password" placeholder="Password" className="w-full rounded-md p-3 border-2 border-orange-700 focus:border-orange-500 focus:border-2" />
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

export default Login;
