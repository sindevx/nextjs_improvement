import Link from "next/link";
import Image from "next/image";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <div className="grid grid-cols-[1fr_3fr] min-h-screen">
      {/* <Sidebar /> */}
      <main className="flex flex-col gap-8 p-8">
        {/* <Header /> */}
        <div className="text-4xl font-bold my-8">
          Welcome to Learn Next.js
        </div>
      </main>
    </div>
  );
}

