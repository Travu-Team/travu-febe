import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <div className="min-h-screen w-full bg-white">
        <header>
          <Navbar />
        </header>
        <main className="w-full min-h-screen bg-white px-4 sm:px-6 md:px-8 lg:px-16 py-10">
          {/* Bagian judul tetap di dalam max-width */}
          <div className="w-full mx-auto flex flex-col gap-6 md:gap-8 max-w-[1200px]">
            <h1 className="text-primary text-2xl sm:text-3xl font-semibold text-center">
              Tentang Kami
            </h1>
          </div>

          {/* Pindahkan gambar keluar dari max-width */}
          <div className="w-full mt-6">
            <div className="relative w-full h-[450px] sm:h-[500px]md:h-[400px] lg:h-[450px] rounded-[15px] shadow-md overflow-hidden bg-cover bg-center about-image">
              {/* Konten teks - Desktop */}
              <div
                className="hidden md:flex absolute z-20 left-12 lg:left-10 top-1/2 -translate-y-1/2 
                      w-[500px] lg:w-[450px] flex-col gap-4 text-white"
              >
                <h2 className="text-3xl lg:text-2xl font-bold leading-snug">
                  Liburan Sesuai Mood? Bisa Banget!
                </h2>
                <p className="text-lg lg:text-base font-medium leading-relaxed">
                  Lagi pengen adventure? Atau healing tipis-tipis? <br />
                  Sistem rekomendasi kami siap jadi temen setia <br /> cari
                  destinasi yang sesuai vibe kamu. Gak perlu <br /> repot mikir,
                  tinggal pilih aja!
                </p>
              </div>

              {/* Konten teks - Mobile */}
              <div className="md:hidden absolute z-20 inset-0 bg-black/60 flex items-end justify-center text-white">
                <div className="px-6 py-6 text-center">
                  <h2 className="text-xl font-bold mb-2">
                    Liburan Sesuai Mood? Bisa Banget!
                  </h2>
                  <p className="text-sm font-medium leading-relaxed">
                    Lagi pengen adventure? Atau healing <br />
                    tipis-tipis? Sistem rekomendasi kami siap jadi temen setia
                    cari destinasi yang sesuai vibe kamu. Gak perlu repot mikir,
                    <br />
                    tinggal pilih aja!
                  </p>
                </div>
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
