import Footer from '@/components/dashboard/Footer'
import Navbar from '@/components/dashboard/Narbar'
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-gradient-to-br from-slate-100 to-slate-200">
        {/* <Sidebar /> */}
        <main className=" w-full flex-1 flex flex-col">{children}</main>
        <div className='container justify-end items-center flex mb-10'>
           <Link href="/dashboard" className='flex bg-slate-100 hover:bg-slate-200 transition-colors p-2 rounded-md'><ArrowLeft /> Back Home</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProtectedLayout;