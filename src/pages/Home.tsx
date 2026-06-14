import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Products from '../components/Products';
import Payment from '../components/Payment';
import Reviews from '../components/Reviews';
import Contacts from '../components/Contacts';
import Footer from '../components/Footer';
import UsernameModal from '../components/UsernameModal';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Products />
      <Payment />
      <Reviews />
      <Contacts />
      <Footer />
      <UsernameModal />
    </>
  );
}
