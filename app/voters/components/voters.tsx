import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import supabase from "@/lib/supabase";
import RealTimeVotersScore from "./realtime-voters-score";

export default async function Voters() {
  const { data } = await supabase.from("voters").select();
  return (
    <div className="w-full max-w-4xl mx-auto mt-4 min-h-[calc(100vh-16.3rem)]">
      <Table className="divide-y divide-gray-200 dark:divide-gray-800">
        <TableHeader>
          <TableRow className="text-left">
            <TableHead className="text-center">Rank</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Votes</TableHead>
            <TableHead className="text-transparent">Trophy</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <RealTimeVotersScore voters={data ?? []} />
        </TableBody>
      </Table>
    </div>
  );
}
