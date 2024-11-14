import Navbar from "@/components/navbar";
import GetUserSession from "@/utils/user/get";
import Hero from "./hero/page";
import Footer from "@/components/footer";
import { Swiper } from "swiper/types";
import CafeCategorySlider from "@/components/swiperCategory";

export default async function Main() {
  const user = await GetUserSession();
  return (
    <div className="relative min-h-screen">
      <Navbar user={user} />
      <Hero />
      <CafeCategorySlider />
      <Footer />
    </div>
  );
}
