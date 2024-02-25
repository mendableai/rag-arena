"use server";

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PRIVATE_KEY!);

export async function voteFunction(retriever: string) {
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
