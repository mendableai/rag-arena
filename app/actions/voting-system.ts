"use server";

import supabase from '@/lib/supabase';

export type Retriever = {
    id: number,
    retriever: string,
    elo: number,
    votes: number,
    times_tested: number,
    full_name: string,
    description: string,
    link: string,
}

export async function addTimesTestedForBoth(retriever: string[]) {

    if (retriever[0] === retriever[1]) {
        return false;
    }

    try {
        for (const singleRetriever of retriever) {
            const { data, error: selectError } = await supabase
                .from('leaderboard')
                .select('times_tested')
                .eq('retriever', singleRetriever);

            if (selectError) {
                console.error(selectError);
                throw selectError;
            }

            if (data.length > 0) {
                const { error: updateError } = await supabase
                    .from('leaderboard')
                    .update({ times_tested: data[0].times_tested + 1 })
                    .eq('retriever', singleRetriever);

                if (updateError) {
                    console.error(updateError);
                    throw updateError;
                }
            } else {
                console.error("Retriever not found");
                throw new Error("Retriever not found");
            }
        }

        return true;
    } catch (e) {
        return false;
    }
}

export async function voteFunction(retriever: string) {
    // Retrieve total times tested for all retrievers to calculate average
    const { data: allRetrieversData, error: allRetrieversError } = await supabase
        .from('leaderboard')
        .select('times_tested');

    if (allRetrieversError) {
        console.error(allRetrieversError);
        throw allRetrieversError;
    }


    const totalTimesTested = allRetrieversData.reduce((acc, curr) => acc + curr.times_tested, 0);
    const averageTimesTested = allRetrieversData.length > 0 ? totalTimesTested / allRetrieversData.length : 0;

    const { data, error: selectError } = await supabase
        .from('leaderboard')
        .select('votes, times_tested, elo')
        .eq('retriever', retriever);

    if (selectError) {
        console.error(selectError);
        throw selectError;
    }

    const eloAdjustment = calculateEloAdjustment(data[0].times_tested, averageTimesTested);

    const newElo = Math.max(0, data[0].elo + eloAdjustment);

    const { error: updateError } = await supabase
        .from('leaderboard')
        .update({ votes: data[0].votes + 1, elo: newElo.toFixed(2) })
        .eq('retriever', retriever);

    if (updateError) {
        console.error(updateError);
        throw updateError;
    }


    return true;
}

function calculateEloAdjustment(timesTested: number, averageTimesTested: number): number {

    if (averageTimesTested === 0) return 10;
    const adjustmentFactor = timesTested / averageTimesTested;
    return (1 / adjustmentFactor) * 10;
}

