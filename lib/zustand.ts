import { create } from 'zustand';

interface VoteState {
    hasVoted: boolean;
    setHasVoted: (value: boolean) => void;
}

export const useVoteStore = create<VoteState>((set) => ({
    hasVoted: false,
    setHasVoted: (value: boolean) => set(() => ({ hasVoted: value })),
}))


interface AllRandomState {
    allRandom: boolean;
    setAllRandom: (value: boolean) => void;
}

export const useAllRandomStore = create<AllRandomState>((set) => ({
    allRandom: true,
    setAllRandom: (value: boolean) => set(() => ({ allRandom: value })),
}))


interface InProcessState{
    inProcess: boolean;
    setInProcess: (value: boolean) => void;
}

export const useInProcessStore = create<InProcessState>((set) => ({
    inProcess: false,
    setInProcess: (value: boolean) => set(() => ({ inProcess: value })),
}))
