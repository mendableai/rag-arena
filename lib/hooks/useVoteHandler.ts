import { addTimesTestedForBoth, voteFunction } from "@/app/actions/voting-system";
import aplyToast from "@/lib/aplyToaster";
import { retrieverInfo } from "@/lib/constants";
import { useInProcessStore, useVoteStore } from "@/lib/zustand";

export const useVoteHandler = (retriever: any, allRandom: boolean) => {
    const { hasVoted, setHasVoted } = useVoteStore();
    const { setInProcess } = useInProcessStore();

    const handleVote = async (retrieverIndex: number) => {
        if (hasVoted || !allRandom) return;

        const addTestCount = await addTimesTestedForBoth(retriever);

        if (!addTestCount) {
            aplyToast("Error adding test count");
            return;
        }

        const response = await voteFunction(retriever[retrieverIndex]);

        setInProcess(false);
        if (!response) {
            aplyToast("Error voting");
            return;
        }

        aplyToast(
            `Vote recorded for ${retrieverInfo[retriever[retrieverIndex] as keyof typeof retrieverInfo]?.fullName
            }!`
        );
        setHasVoted(true);
    };

    return handleVote;
};