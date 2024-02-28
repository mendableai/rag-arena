import { useAllRandomStore, useChatSessionsStore, useInProcessStore, useVoteStore } from "../zustand";

export const useRefresher = () => {
    const { chatSessions, setChatSessions } = useChatSessionsStore();
    const { setHasVoted } = useVoteStore();
    const { setAllRandom } = useAllRandomStore();
    const { setInProcess } = useInProcessStore();

    return () => {
        setChatSessions([
            { chatHistory: [], retrieverSelection: "random", loading: false },
            { chatHistory: [], retrieverSelection: "random", loading: false },
        ]);
        setHasVoted(false);
        setAllRandom(true);
        setInProcess(false);

    }
};

