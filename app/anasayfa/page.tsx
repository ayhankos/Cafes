import Navbar from "@/components/navbar";
import GetUserSession from "@/utils/user/get";
import Hero from "./hero/page";
import Footer from "@/components/footer";
import CafeCategorySlider from "@/components/swiperCategory";
import Stats from "@/components/stats";
import SSS from "@/components/SSS";
import { Icon } from "@iconify/react";

export default async function Main() {
  const user = await GetUserSession();

  const rows = 5;
  const cols = 5;
  const offsetFactor = 0.15;
  const iconCount = rows * cols;

  const icons = Array.from({ length: iconCount }).map((_, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;

    const x =
      (col + 0.5 + (Math.random() * 2 - 1) * offsetFactor) * (100 / cols);
    const y =
      (row + 0.5 + (Math.random() * 2 - 1) * offsetFactor) * (100 / rows);

    return { x, y };
  });

  return (
    <div className="relative">
      <div className="absolute inset-0 w-full h-full -z-99">
        {icons.map((icon, index) => (
          <Icon
            key={index}
            icon="hugeicons:coffee-02"
            className="absolute text-black/20 animate-float"
            style={{
              fontSize: `${Math.random() * 2 + 1}rem`,
              left: `${icon.x}%`,
              top: `${icon.y}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <Navbar user={user} />
      <Hero />
      <CafeCategorySlider />
      <Stats />
      <SSS />
      <Footer />
    </div>
  );
}
