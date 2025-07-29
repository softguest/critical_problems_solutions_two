import ChatSection from "@/components/chat-section";
import ChatComponent from "@/components/chatBox/ChatComponent";

export default function Dashboard() {

  return (
    <div className="flex flex-col min-h-screen">
      <div className="md:h-[500px] bg-blue-900"></div>
      {/* <ChatSection /> */}
      <ChatComponent />
    </div>
  );
}