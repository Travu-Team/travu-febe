import { useState } from 'react'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ButtonCustom from '../components/Button';
ButtonCustom

const DestinationPlan = () => {
  const [isEditing, setIsEditing] = useState(false); // Tambahkan state
  
  // Definisikan fungsi fetchUserData
  const fetchUserData = async () => {
    try {
      // Implementasi fetch data sesuai kebutuhan Anda
      console.log('Fetching user data...');
      // const response = await apiClient.get(API_CONFIG.ENDPOINTS.PROFILE);
      // Handle response
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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
