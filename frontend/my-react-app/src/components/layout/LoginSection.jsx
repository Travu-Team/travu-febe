import React from "react";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

const LoginSection = () => {
  return (
    <section className="flex justify-center items-center min-h-[500px] py-12 px-4 sm:px-6">
      <MotionDiv
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-2xl w-full max-w-6xl overflow-hidden shadow-xl"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left Image - Full height on desktop */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end p-8 lg:p-12 bg-blue-700/20">
            <img
              src="/image/karakter.svg"
              alt="Karakter Travu"
              className="w-full max-w-[280px] lg:max-w-none lg:h-[400px] object-contain object-center animate-float"
            />
          </div>

          {/* Right Content - Centered both horizontally and vertically */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12 space-y-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              Perjalanan yang <span className="text-yellow-300">Baik</span> adalah
              perjalanan tanpa <span className="font-extrabold block">Penyesalan</span>
            </h1>
            <p className="text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed">
              Mulai perjalananmu bersama Travu hanya dengan login, pilih minat,
              dan temukan wisata yang paling cocok buat kamu
            </p>
            <div className="pt-2">
              <a
                href="/login"
                className="inline-block bg-white hover:bg-gray-50 text-blue-600 font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Login Yuk!
              </a>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}</style>
      </MotionDiv>
    </section>
  );
};

export default LoginSection;