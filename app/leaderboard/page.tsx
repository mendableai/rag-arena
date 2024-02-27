import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import supabase from "@/lib/supabase";
import RealTimeScore from "./realtime-score";

export default async function Leaderboard() {

  const {data} = await supabase.from("leaderboard").select();
  return (
    <div className="w-full max-w-4xl mx-auto mt-28 min-h-[calc(100vh-16.3rem)]">
      <Table className="divide-y divide-gray-200 dark:divide-gray-800">
        <TableHeader>
          <TableRow className="text-left">
            <TableHead>Rank</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Elo</TableHead>
            <TableHead>Votes</TableHead>
            <TableHead className="min-w-32">Times Tested</TableHead>
            <TableHead className="max-w-80">Description</TableHead>
            <TableHead>Link</TableHead>
            <TableHead className="text-transparent">Trophy</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        <RealTimeScore retriever={data ?? []} />
        </TableBody>
      </Table>
    </div>
  );
}
