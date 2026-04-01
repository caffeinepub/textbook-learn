import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Book,
  ChapterInfo,
  Flashcard,
  SearchResult,
  SegmentInput,
} from "../backend.d";
import { useActor } from "./useActor";

// Cast actor to any so we can access backend methods
// (the generated backend.ts has an empty interface; methods are defined in backend.d.ts)
type Actor = {
  listBooks(): Promise<Book[]>;
  getBook(
    bookId: bigint,
  ): Promise<{ __kind__: "Some"; value: Book } | { __kind__: "None" }>;
  getChapters(bookId: bigint): Promise<ChapterInfo[]>;
  searchBook(bookId: bigint, query: string): Promise<SearchResult[]>;
  getChapterSummary(bookId: bigint, chapterIndex: bigint): Promise<string>;
  getFlashcards(bookId: bigint, chapterIndex: bigint): Promise<Flashcard[]>;
  createBook(name: string): Promise<bigint>;
  addSegments(bookId: bigint, segments: SegmentInput[]): Promise<boolean>;
  deleteBook(bookId: bigint): Promise<boolean>;
};

export function useListBooks() {
  const { actor, isFetching } = useActor();
  return useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as unknown as Actor).listBooks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBook(bookId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["book", bookId?.toString()],
    queryFn: async () => {
      if (!actor || bookId === null) return null;
      const result = await (actor as unknown as Actor).getBook(bookId);
      if (result.__kind__ === "Some") return result.value;
      return null;
    },
    enabled: !!actor && !isFetching && bookId !== null,
  });
}

export function useGetChapters(bookId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<ChapterInfo[]>({
    queryKey: ["chapters", bookId?.toString()],
    queryFn: async () => {
      if (!actor || bookId === null) return [];
      return (actor as unknown as Actor).getChapters(bookId);
    },
    enabled: !!actor && !isFetching && bookId !== null,
  });
}

export function useSearchBook(bookId: bigint | null, query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<SearchResult[]>({
    queryKey: ["search", bookId?.toString(), query],
    queryFn: async () => {
      if (!actor || bookId === null || !query.trim()) return [];
      return (actor as unknown as Actor).searchBook(bookId, query);
    },
    enabled:
      !!actor && !isFetching && bookId !== null && query.trim().length > 0,
  });
}

export function useGetChapterSummary(
  bookId: bigint | null,
  chapterIndex: bigint | null,
) {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["summary", bookId?.toString(), chapterIndex?.toString()],
    queryFn: async () => {
      if (!actor || bookId === null || chapterIndex === null) return "";
      return (actor as unknown as Actor).getChapterSummary(
        bookId,
        chapterIndex,
      );
    },
    enabled: !!actor && !isFetching && bookId !== null && chapterIndex !== null,
  });
}

export function useGetFlashcards(
  bookId: bigint | null,
  chapterIndex: bigint | null,
) {
  const { actor, isFetching } = useActor();
  return useQuery<Flashcard[]>({
    queryKey: ["flashcards", bookId?.toString(), chapterIndex?.toString()],
    queryFn: async () => {
      if (!actor || bookId === null || chapterIndex === null) return [];
      return (actor as unknown as Actor).getFlashcards(bookId, chapterIndex);
    },
    enabled: !!actor && !isFetching && bookId !== null && chapterIndex !== null,
  });
}

export function useCreateBook() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      segments,
    }: { name: string; segments: SegmentInput[] }) => {
      if (!actor) throw new Error("No actor");
      const a = actor as unknown as Actor;
      const bookId = await a.createBook(name);
      const BATCH = 50;
      for (let i = 0; i < segments.length; i += BATCH) {
        await a.addSegments(bookId, segments.slice(i, i + BATCH));
      }
      return bookId;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useDeleteBook() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (bookId: bigint) => {
      if (!actor) throw new Error("No actor");
      return (actor as unknown as Actor).deleteBook(bookId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["books"] });
    },
  });
}
