import MainLeaderboard from "@/components/leaderboard";
import Footer from "@/components/theme/footer";
import Header from "@/components/theme/header";

export default async function Leaderboard() {
  return (
    <div>
      <Header />
      <MainLeaderboard />
      <Footer />
    </div>
  );
}
