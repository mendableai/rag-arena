import { ChatBots } from "@/components/main-tool/chatbots";
import Footer from "@/components/theme/footer";
import Header from "@/components/theme/header";

export default function Main() {
  return (
    <>
      <Header />
      <div className="h-[700px] max-w-6xl border m-auto mt-24">
        <ChatBots />
      </div>
      <Footer />
    </>
  );
}
