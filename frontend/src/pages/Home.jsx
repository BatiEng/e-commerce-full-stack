import { useContext, useEffect } from "react";
import BestSeller from "../components/BestSeller";
import Hero from "../components/Hero";
import LatestCollection from "../components/LatestCollection";
import NewsLetterBox from "../components/NewsLetterBox";
import OurPolicy from "../components/OurPolicy";
import { ShopContext } from "../context/ShopContext";

function Home() {
  const { calculateTotalProduct } = useContext(ShopContext);

  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsLetterBox />
    </div>
  );
}

export default Home;
