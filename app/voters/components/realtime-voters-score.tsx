"use client";
import styles from '@/app/leaderboard/components/realtime-score.module.css';
import { TableCell, TableRow } from "@/components/ui/table";
import supabase from "@/lib/supabase";
import { TrophyIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Voters = {
  id: number;
  created_at: string;
  github_username: string;
  votes: number;
};

const renderTrophy = (index: number) => {
  const colors = ["#D4AF37", "#C0C0C0", "#CD7F32"];
  return index < 3 ? (
    <TrophyIcon style={{ color: colors[index] }} className={styles.trophyIcon} />
  ) : null;
};

export default function RealTimeVotersScore({
    voters,
}: {
    voters: Voters[];
}) {
  const [retrieverList, setRetrieverList] = useState<Voters[]>(
    voters.sort((a, b) => b.votes - a.votes).slice(0, 10)
  );

  useEffect(() => {
    const channel = supabase
      .channel("realtime voters")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "voters",
        },
        (payload) => {
          setRetrieverList((prevList) => {
            const updatedList = prevList.map((item) =>
              item.id === (payload.new as Voters).id
                ? (payload.new as Voters)
                : item
            );
            return updatedList.sort((a, b) => b.votes - a.votes).slice(0, 10);
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
          className={index % 2 === 0 ? styles.evenRow : styles.oddRow}
        >
          <TableCell className={styles.centerText}>{index + 1}</TableCell>
          <TableCell className={styles.centerText}>
            <a
              className={styles.link}
              href={`https://github.com/${entry.github_username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {entry.github_username}
            </a>
          </TableCell>
          <TableCell className={styles.centerText}>{entry.votes}</TableCell>
          <TableCell className={styles.centerText}>{renderTrophy(index)}</TableCell>
        </TableRow>
      ))}
    </>
  );
}
