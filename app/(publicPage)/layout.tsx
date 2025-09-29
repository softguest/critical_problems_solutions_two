// import React from 'react'

// const Layout = ({ children }) => {
//   return (
//         <div className="min-h-screen bg-background">
//             <Header />
//             {children}
//         </div>
//   )
// }

// export default Layout

import Footer from '@/components/dashboard/Footer'
import Navbar from '@/components/dashboard/Narbar'
import Sidebar from '@/components/dashboard/Sidebar'
import GetStarted from '@/components/home/GetStarted';
import { Header } from '@/components/home/Header';

interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const PublicLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className=''>
        <div className="flex flex-grow">
          <main className="w-full flex-1 flex flex-col">{children}</main>
        </div>
      </div>
      <GetStarted />
      <Footer />
    </div>
  );
}

export default PublicLayout;