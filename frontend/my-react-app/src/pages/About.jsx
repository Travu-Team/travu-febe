import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="border border-red-500 w-full min-w-[1024px] min-h-screen bg-white px-20">
        <div className="w-[1104px] w-full mx-auto flex flex-col gap-8">
          <h1 className="text-primary text-3xl font-semibold text-center">
            Tentang Kami
          </h1>
          <div className="relative w-full h-[250px] md:h-[449px] rounded-[15px] shadow-md overflow-hidden bg-cover bg-center about-image">
            <div className="absolute left-4 md:left-12 top-[60px] md:top-[169px] w-[90%] md:w-[430px] flex flex-col gap-3 text-white">
              <h2 className="text-xl md:text-2xl font-bold">
                Liburan Sesuai Mood? Bisa Banget!
              </h2>
              <p className="text-sm md:text-base font-semibold">
                Lagi pengen adventure? Atau healing tipis-tipis? <br />
                Sistem rekomendasi kami siap jadi temen setia cari destinasi yang sesuai vibe kamu. <br />
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