
// playground global variables

import { create } from "zustand";

interface SelectedSplitOptionState {
    selectedSplitOption: number;
    setSelectedSplitOption: (value: number) => void;
}
export const useSelectedSplitOptionStore = create<SelectedSplitOptionState>((set) => ({
    selectedSplitOption: 0,
    setSelectedSplitOption: (value: number) => set(() => ({ selectedSplitOption: value })),
}))

interface CustomPlaygroundChunksState {
    customPlaygroundChunks: string[];
    setCustomPlaygroundChunks: (value: string[]) => void;
}
export const useCustomPlaygroundChunksStore = create<CustomPlaygroundChunksState>((set) => ({
    customPlaygroundChunks: [],
    setCustomPlaygroundChunks: (value: string[]) => set(() => ({ customPlaygroundChunks: value })),
}))

interface SelectedVectorStoreState {
    selectedVectorStore: string;
    setSelectedVectorStore: (value: string) => void;
}
export const useSelectedVectorStore = create<SelectedVectorStoreState>((set) => ({
    selectedVectorStore: "",
    setSelectedVectorStore: (value: string) => set(() => ({ selectedVectorStore: value })),
}))

interface InMemoryState {
    inMemory: boolean;
    setInMemory: (value: boolean) => void;
}
export const useInMemoryStore = create<InMemoryState>((set) => ({
    inMemory: false,
    setInMemory: (value: boolean) => set(() => ({ inMemory: value })),
}))

interface SelectedPlaygroundLlmState {
    selectedPlaygroundLlm: string;
    setSelectedPlaygroundLlm: (value: string) => void;
}

export const useSelectedPlaygroundLlmStore = create<SelectedPlaygroundLlmState>((set) => ({
    selectedPlaygroundLlm: "",
    setSelectedPlaygroundLlm: (value: string) => set(() => ({ selectedPlaygroundLlm: value })),
}))

interface SelectedPlaygroundRetrieverState {
    selectedPlaygroundRetriever: string;
    setSelectedPlaygroundRetriever: (value: string) => void;
}

export const useSelectedPlaygroundRetrieverStore = create<SelectedPlaygroundRetrieverState>((set) => ({
    selectedPlaygroundRetriever: "",
    setSelectedPlaygroundRetriever: (value: string) => set(() => ({ selectedPlaygroundRetriever: value })),
}))

