import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="w-full min-h-screen bg-white px-20 lg:px-16 md:px-0 sm:px-0 xs:px-6">
        <div className="w-full mx-auto flex flex-col gap-8 lg:w-[900px] md:w-full sm:w-full xs:w-full">
          <h1 className="text-primary text-3xl font-semibold text-center">
            Tentang Kami
          </h1>
          <div className="relative w-full h-[449px] lg:h-[400px] md:h-[350px] sm:h-[300px] xs:h-[250px] rounded-[15px] shadow-md overflow-hidden bg-cover bg-center about-image">
            <div className="absolute left-12 top-[169px] lg:left-10 lg:top-[150px] md:left-8 md:top-[120px] sm:left-6 sm:top-[100px] xs:left-4 xs:top-[60px] w-[430px] lg:w-[400px] md:w-[350px] sm:w-[80%] xs:w-[90%] flex flex-col gap-3 text-white">
              <h2 className="text-2xl lg:text-xl md:text-xl sm:text-lg xs:text-lg font-bold">
                Liburan Sesuai Mood? Bisa Banget!
              </h2>
              <p className="text-base lg:text-base md:text-sm sm:text-sm xs:text-sm font-semibold">
                Lagi pengen adventure? Atau healing tipis-tipis? <br className="hidden xs:hidden sm:hidden md:block" />
                Sistem rekomendasi kami siap jadi temen setia cari destinasi yang sesuai vibe kamu. <br className="hidden xs:hidden sm:hidden md:block" />
                Gak perlu repot mikir, tinggal pilih aja!
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default About;