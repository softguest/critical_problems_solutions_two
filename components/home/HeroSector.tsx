"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    // <section className="relative bg-gradient-to-r from-white via-sky-50 to-sky-100">
    //   <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
    //     {/* Left Content */}
    //     <div className="space-y-6">
    //       <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
    //         Ask <span className="text-sky-500">AI Anything</span> <br />
    //         Get Instant, <span className="text-sky-500">Clear Answers</span>
    //       </h1>
    //       <p className="text-lg text-gray-600 max-w-lg">
    //         Powered by advanced AI, our platform helps you ask questions in 
    //         natural language and receive accurate, easy-to-understand answers — 
    //         anytime, anywhere.
    //       </p>
    //       <div className="flex gap-4">
    //         <Link href="/problems" className="cursor-pointer">
    //           <Button size="lg" className="bg-sky-600 hover:bg-sky-700">
    //             Start Asking
    //           </Button>
    //         </Link>
    //         <Link href="/categories" className="cursor-pointer">
    //           <Button size="lg" variant="outline">
    //             Learn More
    //           </Button>
    //         </Link>
    //       </div>
    //     </div>

    //     {/* Right Image */}
    //     <div className="flex justify-center relative">
    //       <div className="w-[400px] h-[400px] rounded-2xl ">
    //         <Image
    //           src="/resource/aiman.png" // replace with your AI Q&A illustration
    //           alt="User asking AI questions"
    //           width={500}
    //           height={500}
    //           className="w-full h-full object-cover"
    //           priority
    //         />
    //       </div>
    //     </div>
    //   </div>
    // </section>
    <section className="relative bg-gradient-to-r from-white via-slate-50 to-slate-100">
  <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    
    {/* Left Content */}
    <div className="space-y-6">
      <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
        Ask <span className="text-sky-500">AI Anything</span> <br />
        Get Instant, <span className="text-sky-500">Clear Answers</span>
      </h1>
      <p className="text-lg text-gray-600 max-w-lg">
        Powered by advanced AI, our platform helps you ask questions in 
        natural language and receive accurate, easy-to-understand answers — 
        anytime, anywhere.
      </p>
      <div className="flex gap-4">
        <Link href="/problems" className="cursor-pointer">
          <Button size="lg" className="bg-sky-600 hover:bg-sky-700">
            Start Asking
          </Button>
        </Link>
        <Link href="/categories" className="cursor-pointer">
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </Link>
      </div>
    </div>

    {/* Right Image */}
    <div className="flex justify-center relative">
      <div className="w-[320px] h-[320px] relative">
        <Image
          src="/resource/aiman.png"
          alt="User asking AI questions"
          width={500}
          height={500}
          className="w-full h-full object-cover drop-shadow-2xl"
          priority
        />
      </div>
    </div>
  </div>
</section>

  );
}
