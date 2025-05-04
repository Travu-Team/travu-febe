import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const About = () => {
  return (
    <>
    <Navbar />
    <div className="w-full min-h-screen bg-[#F2F2F2] px-20 py-10">
      <div className="w-[1104px] flex flex-col gap-8 px-20">
        <div className="text-[#3A59D1] text-3xl font-semibold text-center">
          Tentang Kami
        </div>
        <div className="w-full">
        <div className="relative max-w-[956px] h-[449px] rounded-[15px] shadow-md overflow-hidden bg-cover bg-center about-image">
            <div className="absolute left-12 top-[169px] w-[430px] flex flex-col gap-3 text-white">
              <h2 className="text-2xl font-bold">Liburan Sesuai Mood? Bisa Banget!</h2>
              <p className="text-sm font-semibold w-[369px]">
                Lagi pengen adventure? Atau healing tipis-tipis? <br />Sistem rekomendasi kami siap jadi
                temen setia cari destinasi yang sesuai vibe kamu. <br />Gak perlu repot mikir, tinggal pilih aja!
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
