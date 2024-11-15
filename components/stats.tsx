import prisma from "@/prisma/database";

export default async function Stats() {
  const cafes = await prisma.cafe.count();
  const comments = await prisma.comment.count();
  const user = await prisma.user.count();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-4xl h-full w-full flex-row items-center justify-center px-4 py-12 backdrop-blur-md sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <h1 className="text-center text-4xl text-[#6B4423] font-extrabold">
            İstatistikler
          </h1>
          <div className="mx-auto grid max-w-screen-lg grid-cols-1 gap-y-4 gap-x-8 mt-12 text-center sm:text-left md:grid-cols-3">
            <div className="bg-white/10 relative mb-3 rounded-3xl border px-12 py-10 text-left shadow backdrop-blur-lg lg:px-12">
              <p className="relative text-3xl font-black text-[#6B4423] sm:text-5xl">
                {cafes}
              </p>
              <p className="relative mt-5 text-lg text-[#6B4423]">
                Sayfamızda bulunan kafe sayısı.
              </p>
            </div>

            <div className="bg-white/10 relative mb-3 rounded-3xl border px-12 py-10 text-left shadow backdrop-blur-lg lg:px-12">
              <p className="relative text-3xl font-black text-[#6B4423] sm:text-5xl">
                {comments}
              </p>
              <p className="relative mt-5 text-lg text-[#6B4423]">
                Sayfamızda bulunan yorum sayısı.
              </p>
            </div>

            <div className="bg-white/10 relative mb-3 rounded-3xl border px-12 py-10 text-left shadow backdrop-blur-lg lg:px-12">
              <p className="relative text-3xl font-black text-[#6B4423] sm:text-5xl">
                {user}
              </p>
              <p className="relative mt-5 text-lg text-[#6B4423]">
                Sayfamızda bulunan kullanıcı sayısı.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
