/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import supabase from "@/lib/supabase";
import { TrophyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import styles from './realtime-score.module.css';

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
    <TrophyIcon style={{ color: colors[index], width: '20px', height: '20px' }} />
  ) : null;
};

export default function RealTimeScore({
  retriever,
}: {
  retriever: Retriever[];
}) {
  const [retrieverList, setRetrieverList] = useState<Retriever[]>(
    [...retriever].sort((a, b) => ((b.votes / b.times_tested) * 1000) - ((a.votes / a.times_tested) * 1000))
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
            return updatedList.sort((a, b) => ((b.votes / b.times_tested) * 1000) - ((a.votes / a.times_tested) * 1000));
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
          <TableCell>
            <a
              className={styles.link}
              href={entry.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {entry.full_name}
            </a>
          </TableCell>
          <TableCell className={styles.centerText}>
            {((entry.votes / entry.times_tested)*1000).toFixed(0)}
          </TableCell>
          <TableCell className={styles.centerText}>{entry.votes}</TableCell>
          <TableCell className={styles.centerText}>{entry.times_tested}</TableCell>
          <TableCell>{entry.description}</TableCell>

          <TableCell>{renderTrophy(index)}</TableCell>
        </TableRow>
      ))}
    </>
  );
}
