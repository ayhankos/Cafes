import Navbar from "@/components/navbar";
import GetUserSession from "@/utils/user/get";
import Image from "next/image";

export default async function Main() {
  const user = await GetUserSession();
  return (
    <div className="">
      <Navbar user={user} />
    </div>
  );
}
