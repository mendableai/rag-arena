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

export async function addTimesTestedForBoth(retrievers: string[], user: any) {
    if (retrievers.length !== 2 || retrievers[0] === retrievers[1]) {
        console.error("Invalid input: Array must contain two different retrievers.");
        return false;
    }

    try {
        const { error } = await supabase
            .rpc('increment_times_tested_for_both', { retriever_ids: retrievers });

        if (error) {
            console.error(error);
            throw error;
        }

        if (user) {
            incrementVoteForGitHubUser(user);
        }

        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

export async function voteFunction(retriever: string) {
    try {
        const { error } = await supabase
            .rpc('increment_vote', { retriever_param: retriever });

        if (error) {
            console.error(error);
            throw error;
        }

        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}


export async function incrementVoteForGitHubUser(githubUser: string) {
    try {
        const { error } = await supabase
            .rpc('increment_or_create_vote', { github_username: githubUser });

        if (error) {
            console.error(error);
            throw error;
        }

        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}

