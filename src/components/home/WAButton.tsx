import Image from "next/image";
import Link from "next/link";

const WAbutton = () => {
  return (
    <>
      <div className="flex flex-col fixed bottom-5 right-5 gap-5">
        <div className="flex flex-col items-center gap-1">
          <Link href="https://wa.me/6281381539922" target="_blank" className=" bg-green-400 text-white rounded-full shadow-lg w-fit">
            <Image src="/whatsapp/wa_white.png" alt="Contact Me on WhatsApp" className="w-10 h-10 lg:h-12 lg:w-12" width={300} height={300} />
          </Link>
          <h1 className="text-white text-base font-bold">Admin 1</h1>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Link href="https://wa.me/62811800790" target="_blank" className=" bg-green-400 text-white rounded-full shadow-lg w-fit">
            <Image src="/whatsapp/wa_white.png" alt="Contact Me on WhatsApp" className="w-10 h-10 lg:h-12 lg:w-12" width={300} height={300} />
          </Link>
          <h1 className="text-white text-base font-bold">Admin 2</h1>
        </div>
      </div>
    </>
  );
};

export default WAbutton;
