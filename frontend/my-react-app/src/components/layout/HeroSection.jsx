import React from "react";

const HeroSection = () => {
  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat text-left text-base sm:text-[20px] lg:text-[24px] text-[#3a59d1] font-poppins relative overflow-hidden"
      style={{
        backgroundImage: "url('../image/bg.svg')",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.8px]"></div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-2 h-2 bg-[#3a59d1]/20 rounded-full animate-float-slow"
          style={{ top: "20%", left: "10%", animationDelay: "0s" }}
        ></div>
        <div
          className="absolute w-3 h-3 bg-[#47bb8e]/20 rounded-full animate-float-medium"
          style={{ top: "60%", left: "20%", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute w-1 h-1 bg-[#3a59d1]/30 rounded-full animate-float-fast"
          style={{ top: "30%", left: "80%", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-2 h-2 bg-[#47bb8e]/25 rounded-full animate-float-slow"
          style={{ top: "80%", left: "70%", animationDelay: "3s" }}
        ></div>
      </div>

      <div className="w-full flex justify-center bg-cover bg-top bg-no-repeat text-[#3a59d1] font-poppins relative overflow-hidden">
        {/* Background and overlay elements remain the same */}

        <div className="w-full max-w-[1112px] px-4 lg:px-0 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0 relative z-10">
          {/* Left Panel - Content */}
          <div className="flex flex-col items-start justify-center gap-4 lg:gap-[17px] w-full lg:w-auto animate-slide-in-left">
            {/* Tagline */}
            <div className="w-full max-w-[349px]">
              <div className="font-medium text-2xl lg:text-[24px] hover:scale-105 transition-transform duration-300">
                #TravelwithU
              </div>
            </div>

            {/* Headline */}
            <div className="flex flex-col items-start justify-start text-3xl lg:text-[36px] mt-1 w-full">
              <div className="w-full max-w-[430px] space-y-1.5">
                <p className="m-0 font-medium text-black">
                  Bantu penuhi{" "}
                  <span className="font-semibold transition-colors duration-300 hover:text-[#3a59d1]">
                    minat destinasi wisatamu,
                  </span>
                </p>
                <p className="m-0 font-medium text-black">Siap jelajahi</p>
                <p className="m-0 font-bold bg-[conic-gradient(from_256.62deg_at_50%50%,#47bb8e_-33.72deg,#3a59d1_241.19deg,#47bb8e_326.28deg,_#3a59d1_601.19deg)] bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                  Indonesia
                </p>
              </div>
            </div>

            {/* Button */}
            <button className="bg-[#3a59d1] text-white text-lg lg:text-[20px] font-semibold py-3 lg:py-[15px] px-6 lg:px-[24px] rounded-[14px] shadow-md hover:brightness-110 hover:scale-105 transition-transform duration-300 relative overflow-hidden group mt-4">
              <span className="relative z-10">Lihat Selengkapnya</span>
              <div className="absolute inset-0 bg-white/10 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            </button>
          </div>

          {/* Right Panel Image - Visible on lg screens and up */}
          <div className="hidden lg:flex lg:items-center lg:justify-end w-full max-w-[585px] animate-slide-in-right">
            <img
              src="/image/right-panel.svg"
              alt="Travel Destination"
              className="w-full h-auto max-h-[485px] object-contain hover:scale-105 hover:rotate-1 transition-all duration-500 hover:shadow-2xl"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(90deg);
          }
        }

        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(270deg);
          }
        }

        @keyframes slide-in-left {
          0% {
            opacity: 0;
            transform: translateX(-50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          0% {
            opacity: 0;
            transform: translateX(50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes gradient-shift {
          0%,
          100% {
            filter: hue-rotate(0deg);
          }
          50% {
            filter: hue-rotate(20deg);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }

        .animate-slide-in-left {
          animation: slide-in-left 1s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 1s ease-out 0.3s both;
        }

        .animate-gradient-shift {
          animation: gradient-shift 3s ease infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          .w-[1112px] {
            flex-direction: column;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;