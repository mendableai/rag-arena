"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import supabase from "@/lib/supabase";
import { TrophyIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Retriever = {
  id: number;
  retriever: string;
  elo: number;
  votes: number;
  times_tested: number;
  full_name: string;
  description: string;
  link: string;
};

const renderTrophy = (index: number) => {
  const colors = ["#D4AF37", "#C0C0C0", "#CD7F32"];
  return index < 3 ? (
    <TrophyIcon className={`text-[${colors[index]}] w-5 h-5`} />
  ) : null;
};

export default function RealTimeScore({
  retriever,
}: {
  retriever: Retriever[];
}) {
  const [retrieverList, setRetrieverList] = useState<Retriever[]>(
    [...retriever].sort((a, b) => b.votes - a.votes)
  );

  useEffect(() => {
    const channel = supabase
      .channel("realtime leaderboard")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "leaderboard",
        },
        (payload) => {
          setRetrieverList((prevList) => {
            const updatedList = prevList.map((item) =>
              item.id === (payload.new as Retriever).id
                ? (payload.new as Retriever)
                : item
            );
            return updatedList.sort((a, b) => b.votes - a.votes);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return (
    <>
      {retrieverList.map((entry, index) => (
        <TableRow
          key={entry.id}
          className={`bg-${index % 2 === 0 ? "gray-100" : "white"} dark:bg-${
            index % 2 === 0 ? "gray-800" : "gray-900"
          }`}
        >
          <TableCell>{index + 1}</TableCell>
          <TableCell>
            <a
              style={{ textDecoration: "underline" }}
              href={entry.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {entry.full_name}
            </a>
          </TableCell>
          <TableCell>{entry.elo}</TableCell>
          <TableCell>{entry.votes}</TableCell>
          <TableCell>{entry.times_tested}</TableCell>
          <TableCell>{entry.description}</TableCell>

          <TableCell>{renderTrophy(index)}</TableCell>
        </TableRow>
      ))}
    </>
  );
}
