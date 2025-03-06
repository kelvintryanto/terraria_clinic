"use client";

import { motion } from "framer-motion";
import { ClipboardPlus, HandHeart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { registerAction } from "./action";

const formVariants = {
  hidden: (isMobile: boolean) => ({
    x: isMobile ? 0 : 100,
    y: isMobile ? 50 : 0,
    opacity: 0,
  }),
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const imageVariants = {
  hidden: (isMobile: boolean) => ({
    x: isMobile ? 0 : -100,
    y: isMobile ? -50 : 0,
    opacity: 0,
  }),
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const inputVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const labelVariants = {
  unfocused: {
    y: 10,
    scale: 1,
    opacity: 0,
  },
  focused: {
    y: -10,
    scale: 0.85,
    opacity: 1,
    color: "rgb(251 146 60)",
  },
};

const formFields = [
  { id: "name", name: "name", type: "text", label: "Nama Lengkap" },
  { id: "email", name: "email", type: "email", label: "Email" },
  { id: "phone", name: "phone", type: "text", label: "No. Handphone" },
  { id: "address", name: "address", type: "text", label: "Alamat" },
  { id: "password", name: "password", type: "password", label: "Password" },
  {
    id: "confirmPassword",
    name: "confirmPassword",
    type: "password",
    label: "Ulangi Password",
  },
];

const Register = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [state, dispatch] = useActionState(registerAction, {
    error: null,
    success: false,
    pending: false,
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 1024);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [filledInputs, setFilledInputs] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(formFields.map((field) => [field.id, false]))
  );

  const handleFocus = (id: string) => setFocusedInput(id);
  const handleBlur = () => setFocusedInput(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilledInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value.length > 0,
    }));
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-violet-800/80 via-[#6032A2] to-[#371D5C]">
      <div className="flex w-full items-center justify-center px-4 py-8">
        <div className="flex w-full max-w-4xl justify-center gap-x-6">
          {/* Left side - Illustration */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            custom={isMobile}
            className="hidden lg:flex w-5/12 flex-col"
          >
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-800/50 to-transparent rounded-2xl" />
              <Image
                src="https://i.pinimg.com/236x/5d/65/ab/5d65ab3d364e83e2c472d474c2528016.jpg"
                alt="Clinic"
                className="rounded-2xl object-cover"
                fill
                priority
                unoptimized
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-0 left-0 right-0 p-6 text-white"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center space-x-2 text-xl"
                >
                  <h3>Merawat dengan</h3>
                  <span className="font-bold text-orange-400">Cinta</span>
                  <HandHeart className="text-orange-400 h-6 w-6" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="flex items-center space-x-2 text-xl mt-2"
                >
                  <h3>Menjaga dengan</h3>
                  <span className="font-bold text-orange-400">Pengalaman</span>
                  <ClipboardPlus className="text-orange-400 h-6 w-6" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Register form */}
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            custom={isMobile}
            className="w-full lg:w-7/12 h-full space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2 text-center"
            >
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Daftar Akun Baru
              </h1>
              <p className="text-sm text-orange-300/80">
                Silakan isi data diri Anda
              </p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-red-500/10 p-4 text-sm text-red-200 border border-red-500/20"
              >
                {decodeURIComponent(error)}
              </motion.div>
            )}

            <form action={dispatch} className="space-y-4">
              <div className="space-y-4">
                {formFields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    variants={inputVariants}
                    custom={index}
                    className="space-y-2"
                  >
                    <div className="relative">
                      <motion.label
                        htmlFor={field.id}
                        animate={
                          focusedInput === field.id || filledInputs[field.id]
                            ? "focused"
                            : "unfocused"
                        }
                        variants={labelVariants}
                        className="absolute left-3 text-sm pointer-events-none transition-all duration-200"
                      >
                        {field.label}
                      </motion.label>
                      <input
                        id={field.id}
                        name={field.name}
                        type={field.type}
                        placeholder={field.label}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/50 focus:border-orange-400/50 focus:outline-none focus:ring-1 focus:ring-orange-400/50 transition-all duration-200 placeholder:opacity-100 focus:placeholder:opacity-0"
                        disabled={state.pending}
                        onFocus={() => handleFocus(field.id)}
                        onBlur={() => handleBlur()}
                        onChange={handleChange}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={state.pending}
                className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 px-4 py-3 font-medium text-white hover:from-orange-600 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:ring-offset-2 focus:ring-offset-violet-800 disabled:opacity-50 mt-6"
              >
                {state.pending ? "Mendaftar..." : "Daftar"}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center text-sm"
            >
              <p className="text-white/70">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="text-orange-400 hover:text-orange-300 hover:underline"
                >
                  Masuk
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
