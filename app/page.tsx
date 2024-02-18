import { mails } from "@/components/data";
import { Mail } from "@/components/main-tool/mail";
import Header from "@/components/theme/header";

export default function MailPage() {
  return (
    <>
      <Header />
      <div className="h-[700px] max-w-6xl border m-auto mt-24">
        <Mail mails={mails} />
      </div>
    </>
  );
}
