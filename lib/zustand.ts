import { paulgrahamtext } from '@/app/playground/components/paulgrahamtext';
import { DocumentInterface } from '@langchain/core/documents';
import { Message } from 'ai';
import { create } from 'zustand';

interface ChatSession {
    chatHistory: Message[];
    retrieverSelection: string;
    loading: boolean;
}
interface ChatSessionsState {
    chatSessions: Array<ChatSession>;
    setChatSessions: (sessions: Array<ChatSession> | ((sessions: Array<ChatSession>) => Array<ChatSession>)) => void;
}
export const useChatSessionsStore = create<ChatSessionsState>((set) => ({
    chatSessions: [
        { chatHistory: [], retrieverSelection: "random", loading: false },
        { chatHistory: [], retrieverSelection: "random", loading: false },
    ],
    setChatSessions: (updater) => set((state) => ({
        chatSessions: typeof updater === 'function' ? updater(state.chatSessions) : updater,
    })),
}));

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


interface InProcessState {
    inProcess: boolean;
    setInProcess: (value: boolean) => void;
}
export const useInProcessStore = create<InProcessState>((set) => ({
    inProcess: false,
    setInProcess: (value: boolean) => set(() => ({ inProcess: value })),
}))


interface CustomDocumentState {
    customDocuments: DocumentInterface<Record<string, any>>[];
    setCustomDocuments: (value: DocumentInterface<Record<string, any>>[]) => void;
}

export const useCustomDocumentStore = create<CustomDocumentState>((set) => ({
    customDocuments: [],
    setCustomDocuments: (value: DocumentInterface<Record<string, any>>[]) => set(() => ({ customDocuments: value })),
}))

interface SmallScreenState {
    isSmallScreen: boolean;
    setIsSmallScreen: (value: boolean) => void;
}

export const useSmallScreenStore = create<SmallScreenState>((set) => ({
    isSmallScreen: false,
    setIsSmallScreen: (value: boolean) => set(() => ({ isSmallScreen: value })),
}))



interface ChosenModelState {
    chosenModel: string;
    setChosenModel: (value: string) => void;
}
export const useChosenModelStore = create<ChosenModelState>((set) => ({
    chosenModel: "mistral",
    setChosenModel: (value: string) => set(() => ({ chosenModel: value })),
}))

// playground global variables

interface RawTextState {
    rawText: string;
    setRawText: (value: string) => void;
}
export const useRawTextStore = create<RawTextState>((set) => ({
    rawText: paulgrahamtext,
    setRawText: (value: string) => set(() => ({ rawText: value })),
}))


interface SelectedSplitOptionState {
    selectedSplitOption: number;
    setSelectedSplitOption: (value: number) => void;
}
export const useSelectedSplitOptionStore = create<SelectedSplitOptionState>((set) => ({
    selectedSplitOption: 0,
    setSelectedSplitOption: (value: number) => set(() => ({ selectedSplitOption: value })),
}))


interface SplitResultState {
    splitResult: string[];
    setSplitResult: (value: string[]) => void;
}
export const useSplitResultStore = create<SplitResultState>((set) => ({
    splitResult: [],
    setSplitResult: (value: string[]) => set(() => ({ splitResult: value })),
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
    inMemory: true,
    setInMemory: (value: boolean) => set(() => ({ inMemory: value })),
}))

