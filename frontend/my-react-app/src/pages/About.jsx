import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <div className="min-h-screen w-full bg-white">
        <header>
          <Navbar />
        </header>
        <main className="w-full min-h-screen bg-white px-20 lg:px-16 md:px-0 sm:px-0 xs:px-6 py-10">
          <div className="w-full mx-auto flex flex-col gap-8 max-w-[1200px]">
            <h1 className="text-primary text-3xl font-semibold text-center">
              Tentang Kami
            </h1>

            <div className="relative w-full h-[650px] lg:h-[600px] md:h-[550px] sm:h-[500px] xs:h-[450px] rounded-[15px] shadow-md overflow-hidden bg-cover bg-[center_0px] about-image ">
              {/* Konten teks */}
              <div
                className="absolute z-20 left-12 top-1/2 -translate-y-1/2 
                      lg:left-10 md:left-8 sm:left-6 xs:left-4 
                      w-[500px] lg:w-[450px] md:w-[400px] sm:w-[85%] xs:w-[90%] 
                      flex flex-col gap-4 text-white"
              >
                <h2 className="text-3xl lg:text-2xl md:text-xl sm:text-lg font-bold leading-snug">
                  Liburan Sesuai Mood? Bisa Banget!
                </h2>
                <p className="text-lg lg:text-base md:text-sm sm:text-sm font-medium leading-relaxed">
                  Lagi pengen adventure? Atau healing tipis-tipis? <br />
                  Sistem rekomendasi kami siap jadi temen setia <br /> cari
                  destinasi yang sesuai vibe kamu. Gak perlu <br /> repot mikir,
                  tinggal pilih aja!
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default About;
