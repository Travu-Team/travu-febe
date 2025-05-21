import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ButtonCustom from '../components/Button';
ButtonCustom

const DestinationPlan = () => {
  return (
    <div>
      <Navbar />
        <ButtonCustom
            type="button"
            onClick={(e) => {
            e.preventDefault();
            setIsEditing(false);
            fetchUserData();
            }}
                className="bg-white text-primary border border-primary"
            >   
                Tambah Data            
        </ButtonCustom>
      <Footer />
    </div>
  );
};

export default DestinationPlan;
