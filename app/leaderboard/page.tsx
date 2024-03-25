import Footer from "@/components/theme/footer";
import Header from "@/components/theme/header";
import MainLeaderboard from "./components/main-leaderboard";
export const dynamic = 'force-dynamic';

export default async function Leaderboard() {
  return (
    <div>
      <Header />
      <MainLeaderboard />
      <Footer />
    </div>
  );
}
