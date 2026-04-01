import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;

export interface Book {
    id: bigint;
    name: string;
    uploadedAt: bigint;
    totalSegments: bigint;
}

export interface Segment {
    id: bigint;
    bookId: bigint;
    chapterIndex: bigint;
    chapterTitle: string;
    pageNumber: bigint;
    content: string;
}

export interface SearchResult {
    segment: Segment;
    snippet: string;
}

export interface ChapterInfo {
    index: bigint;
    title: string;
    segmentCount: bigint;
}

export interface Flashcard {
    question: string;
    answer: string;
}

export interface SegmentInput {
    chapterIndex: bigint;
    chapterTitle: string;
    pageNumber: bigint;
    content: string;
}

export interface backendInterface {
    createBook(name: string): Promise<bigint>;
    listBooks(): Promise<Book[]>;
    getBook(bookId: bigint): Promise<Option<Book>>;
    deleteBook(bookId: bigint): Promise<boolean>;
    addSegments(bookId: bigint, segments: SegmentInput[]): Promise<boolean>;
    searchBook(bookId: bigint, query: string): Promise<SearchResult[]>;
    getChapters(bookId: bigint): Promise<ChapterInfo[]>;
    getChapterSegments(bookId: bigint, chapterIndex: bigint): Promise<Segment[]>;
    getChapterSummary(bookId: bigint, chapterIndex: bigint): Promise<string>;
    getFlashcards(bookId: bigint, chapterIndex: bigint): Promise<Flashcard[]>;
}
