import Footer from '@/components/dashboard/Footer'
import Navbar from '@/components/dashboard/Narbar'
import Sidebar from '@/components/dashboard/Sidebar'

interface ProtectedLayoutProps {
  children: React.ReactNode;
};

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-grow">
        {/* <Sidebar /> */}
        <main className=" w-full flex-1 flex flex-col">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

export default ProtectedLayout;