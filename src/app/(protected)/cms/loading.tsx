import Image from "next/image";

const Loading = () => {
  return (
    <div className="flex bg-violet-800 h-screen w-full items-center justify-center">
      <Image
        src="/loading/dualring.png"
        className="animate-spin"
        alt="loading..."
        width={200}
        height={200}
      />
    </div>
  );
};

export default Loading;
