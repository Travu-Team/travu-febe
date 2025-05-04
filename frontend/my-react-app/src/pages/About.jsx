import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
    <Navbar />
    <div className="border-2 w-full min-h-screen bg-[#F2F2F2] flex flex-col items-center justify-center">
      <div className="w-[1104px] flex flex-col items-center gap-8">
        <div className="text-center text-[#3A59D1] text-3xl font-semibold">
          Tentang Kami
        </div>
        <div className="w-full">
        <div className="relative max-w-[956px] h-[449px] rounded-[15px] shadow-md overflow-hidden bg-cover bg-center about-image">
            <div className="absolute left-12 top-[169px] w-[430px] flex flex-col gap-3 text-white">
              <h2 className="text-xl font-bold">Liburan Sesuai Mood? Bisa Banget!</h2>
              <p className="text-sm font-semibold w-[369px]">
                Lagi pengen adventure? Atau healing tipis-tipis? Sistem rekomendasi kami siap jadi
                temen setia cari destinasi yang sesuai vibe kamu. Gak perlu repot mikir, tinggal pilih aja!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default About;
