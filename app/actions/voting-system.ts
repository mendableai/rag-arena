"use server";

import supabase from '@/lib/supabase';

export type Retriever = {
    id: number,
    retriever: string,
    votes: number,
    times_tested: number,
    full_name: string,
    description: string,
    link: string,
}

export async function voteFunction(retriever: Retriever[]) {
    const { data, error: selectError } = await supabase
        .from('leaderboard')
        .select('votes')
        .eq('retriever', retriever);

    if (selectError) {
        throw selectError;
    }

    if (data && data.length > 0) {
        const { error: updateError } = await supabase
            .from('leaderboard')
            .update({ votes: data[0].votes + 1 })
            .eq('retriever', retriever);

        if (updateError) {
            console.error(updateError);
            throw updateError;
        }
    } else {
        const { error: insertError } = await supabase
            .from('leaderboard')
            .insert([
                { retriever: retriever, votes: 1 },
            ]);

        if (insertError) {
            console.error(insertError);
            throw insertError;
        }
    }

    return true;
}
