import { ChatBots } from "@/components/main-tool/chatbots";
import Header from "@/components/theme/header";

export default function Main() {

  return (
    <>
      <Header />
      <div className="h-[750px] max-w-6xl border m-auto mt-24">
        <ChatBots/>
      </div>
    </>
  );
}
