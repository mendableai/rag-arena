// playground global variables

import { create } from "zustand";

interface SelectedSplitOptionState {
    selectedSplitOption: string;
    setSelectedSplitOption: (value: string) => void;
}
export const useSelectedSplitOptionStore = create<SelectedSplitOptionState>((set) => ({
    selectedSplitOption: "split_by_character",
    setSelectedSplitOption: (value: string) => set(() => ({ selectedSplitOption: value })),
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

interface SelectedPlaygroundLlmState {
    selectedPlaygroundLlm: string;
    setSelectedPlaygroundLlm: (value: string) => void;
}

export const useSelectedPlaygroundLlmStore = create<SelectedPlaygroundLlmState>((set) => ({
    selectedPlaygroundLlm: "mistral",
    setSelectedPlaygroundLlm: (value: string) => set(() => ({ selectedPlaygroundLlm: value })),
}))

interface SelectedPlaygroundRetrieverState {
    selectedPlaygroundRetriever: string;
    setSelectedPlaygroundRetriever: (value: string) => void;
}

export const useSelectedPlaygroundRetrieverStore = create<SelectedPlaygroundRetrieverState>((set) => ({
    selectedPlaygroundRetriever: "vector_store",
    setSelectedPlaygroundRetriever: (value: string) => set(() => ({ selectedPlaygroundRetriever: value })),
}))

