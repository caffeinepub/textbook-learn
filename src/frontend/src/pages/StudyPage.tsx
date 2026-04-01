import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useGetBook,
  useGetChapterSummary,
  useGetChapters,
  useGetFlashcards,
  useSearchBook,
} from "@/hooks/useQueries";
import {
  type Bookmark as BM,
  addBookmark,
  getBookBookmarks,
  removeBookmark,
} from "@/utils/bookmarks";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function QATab({ bookId }: { bookId: bigint }) {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const { data: results, isFetching } = useSearchBook(bookId, submitted);
  const { data: book } = useGetBook(bookId);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSubmitted(query);
  };

  const handleBookmark = (snippet: string, chapterTitle: string) => {
    addBookmark({
      bookId: bookId.toString(),
      bookName: book?.name ?? "Unknown Book",
      chapterTitle,
      content: snippet,
    });
    toast.success("Passage bookmarked!");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "oklch(0.68 0.035 240)" }}
          />
          <Input
            placeholder="Ask a question from the textbook…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 bg-card/50 border-border/60"
            data-ocid="qa.search_input"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={!query.trim()}
          style={{
            background: "oklch(0.77 0.12 200)",
            color: "oklch(0.12 0.04 240)",
          }}
          data-ocid="qa.submit_button"
        >
          Search
        </Button>
      </div>

      {isFetching && (
        <div className="space-y-3" data-ocid="qa.loading_state">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      )}

      {!isFetching && submitted && results && results.length === 0 && (
        <div
          className="glass-card rounded-xl p-8 text-center"
          data-ocid="qa.empty_state"
        >
          <p className="text-foreground font-medium">No results found</p>
          <p
            className="text-sm mt-1"
            style={{ color: "oklch(0.68 0.035 240)" }}
          >
            Try different keywords or a shorter question
          </p>
        </div>
      )}

      {!isFetching && results && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs" style={{ color: "oklch(0.68 0.035 240)" }}>
            {results.length} results for &ldquo;{submitted}&rdquo;
          </p>
          {results.map((result, idx) => (
            <motion.div
              key={`${result.segment.id}-${idx}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card rounded-xl p-5 group"
              data-ocid={`qa.item.${idx + 1}`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      color: "oklch(0.77 0.12 200)",
                      borderColor: "oklch(0.77 0.12 200 / 0.4)",
                    }}
                  >
                    {result.segment.chapterTitle}
                  </Badge>
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.55 0.03 240)" }}
                  >
                    Page {result.segment.pageNumber.toString()}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={() =>
                    handleBookmark(result.snippet, result.segment.chapterTitle)
                  }
                  data-ocid={`qa.item.${idx + 1}`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </Button>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "oklch(0.87 0.012 240)",
                  borderLeft: "3px solid oklch(0.77 0.12 200)",
                  paddingLeft: "0.75rem",
                }}
              >
                {result.snippet || result.segment.content.slice(0, 300)}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {!submitted && (
        <div
          className="glass-card rounded-xl p-8 text-center"
          data-ocid="qa.empty_state"
        >
          <Search
            className="w-10 h-10 mx-auto mb-3"
            style={{ color: "oklch(0.55 0.06 220)" }}
          />
          <p className="font-medium text-foreground">
            Ask anything from your textbook
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: "oklch(0.68 0.035 240)" }}
          >
            Type a question above and press Enter or click Search
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {[
              "What is Newton's first law?",
              "Define photosynthesis",
              "Explain cell division",
            ].map((q) => (
              <button
                key={q}
                type="button"
                className="text-xs px-3 py-1.5 rounded-full border border-border/60 hover:border-cyan/50 transition-colors"
                style={{ color: "oklch(0.68 0.035 240)" }}
                onClick={() => {
                  setQuery(q);
                  setSubmitted(q);
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SummariesTab({ bookId }: { bookId: bigint }) {
  const { data: chapters, isLoading: chaptersLoading } = useGetChapters(bookId);
  const [selectedChapter, setSelectedChapter] = useState<bigint | null>(null);
  const { data: summary, isFetching: summaryLoading } = useGetChapterSummary(
    bookId,
    selectedChapter,
  );

  useEffect(() => {
    if (chapters && chapters.length > 0 && selectedChapter === null) {
      setSelectedChapter(chapters[0].index);
    }
  }, [chapters, selectedChapter]);

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      <div className="lg:w-64 shrink-0">
        <h3 className="font-semibold text-sm mb-3 text-foreground">Chapters</h3>
        {chaptersLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
          </div>
        ) : (
          <ScrollArea className="h-80 lg:h-[calc(100vh-320px)]">
            <div className="space-y-1 pr-2">
              {chapters?.map((ch) => (
                <button
                  key={ch.index.toString()}
                  type="button"
                  onClick={() => setSelectedChapter(ch.index)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all"
                  style={{
                    background:
                      selectedChapter === ch.index
                        ? "oklch(0.77 0.12 200 / 0.15)"
                        : "transparent",
                    color:
                      selectedChapter === ch.index
                        ? "oklch(0.77 0.12 200)"
                        : "oklch(0.68 0.035 240)",
                    borderLeft:
                      selectedChapter === ch.index
                        ? "3px solid oklch(0.77 0.12 200)"
                        : "3px solid transparent",
                  }}
                  data-ocid="summaries.tab"
                >
                  {ch.title}
                  <span className="block text-xs mt-0.5 opacity-60">
                    {ch.segmentCount.toString()} pages
                  </span>
                </button>
              ))}
              {(!chapters || chapters.length === 0) && (
                <p
                  className="text-sm text-center py-8"
                  style={{ color: "oklch(0.68 0.035 240)" }}
                >
                  No chapters found
                </p>
              )}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="flex-1">
        {summaryLoading ? (
          <div className="space-y-3" data-ocid="summaries.loading_state">
            <Skeleton className="h-6 w-1/3 rounded" />
            <Skeleton className="h-4 rounded" />
            <Skeleton className="h-4 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
            <Skeleton className="h-4 rounded" />
          </div>
        ) : summary ? (
          <motion.div
            key={selectedChapter?.toString()}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6"
          >
            <h3 className="font-semibold text-foreground mb-4">
              {chapters?.find((c) => c.index === selectedChapter)?.title ??
                "Summary"}
            </h3>
            <p
              className="text-sm leading-relaxed whitespace-pre-line"
              style={{ color: "oklch(0.87 0.012 240)" }}
            >
              {summary}
            </p>
          </motion.div>
        ) : (
          <div
            className="glass-card rounded-xl p-8 text-center"
            data-ocid="summaries.empty_state"
          >
            <BookOpen
              className="w-10 h-10 mx-auto mb-3"
              style={{ color: "oklch(0.55 0.06 220)" }}
            />
            <p className="font-medium text-foreground">
              Select a chapter to see its summary
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function FlashcardsTab({ bookId }: { bookId: bigint }) {
  const { data: chapters } = useGetChapters(bookId);
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const chapterBigInt = selectedChapter ? BigInt(selectedChapter) : null;
  const { data: flashcards, isFetching } = useGetFlashcards(
    bookId,
    chapterBigInt,
  );
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = flashcards ?? [];
  const currentCard = cards[cardIndex];

  const nextCard = () => {
    setFlipped(false);
    setTimeout(
      () => setCardIndex((i) => Math.min(i + 1, cards.length - 1)),
      150,
    );
  };
  const prevCard = () => {
    setFlipped(false);
    setTimeout(() => setCardIndex((i) => Math.max(i - 1, 0)), 150);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset card state when chapter changes
  useEffect(() => {
    setCardIndex(0);
    setFlipped(false);
  }, [selectedChapter]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Select value={selectedChapter} onValueChange={setSelectedChapter}>
          <SelectTrigger
            className="w-64 bg-card/50 border-border/60"
            data-ocid="flashcards.select"
          >
            <SelectValue placeholder="Select a chapter" />
          </SelectTrigger>
          <SelectContent>
            {chapters?.map((ch) => (
              <SelectItem key={ch.index.toString()} value={ch.index.toString()}>
                {ch.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {cards.length > 0 && (
          <span className="text-sm" style={{ color: "oklch(0.68 0.035 240)" }}>
            {cardIndex + 1} / {cards.length} cards
          </span>
        )}
      </div>

      {isFetching && (
        <div
          className="flex justify-center py-12"
          data-ocid="flashcards.loading_state"
        >
          <Loader2
            className="w-8 h-8 animate-spin"
            style={{ color: "oklch(0.77 0.12 200)" }}
          />
        </div>
      )}

      {!isFetching && !selectedChapter && (
        <div
          className="glass-card rounded-xl p-12 text-center"
          data-ocid="flashcards.empty_state"
        >
          <p className="font-medium text-foreground">
            Select a chapter above to load flashcards
          </p>
        </div>
      )}

      {!isFetching && selectedChapter && cards.length === 0 && (
        <div
          className="glass-card rounded-xl p-12 text-center"
          data-ocid="flashcards.empty_state"
        >
          <p className="font-medium text-foreground">
            No flashcards for this chapter yet
          </p>
        </div>
      )}

      {!isFetching && currentCard && (
        <div className="max-w-xl mx-auto w-full">
          <button
            type="button"
            className="card-flip cursor-pointer h-64 w-full"
            onClick={() => setFlipped((f) => !f)}
            data-ocid="flashcards.canvas_target"
          >
            <div className={`card-inner ${flipped ? "flipped" : ""}`}>
              <div className="card-face glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <Badge
                  className="mb-4 text-xs"
                  style={{
                    background: "oklch(0.77 0.12 200 / 0.2)",
                    color: "oklch(0.77 0.12 200)",
                  }}
                >
                  Question
                </Badge>
                <p className="text-lg font-semibold text-foreground">
                  {currentCard.question}
                </p>
                <p
                  className="text-xs mt-4"
                  style={{ color: "oklch(0.55 0.03 240)" }}
                >
                  Click to reveal answer
                </p>
              </div>
              <div
                className="card-back card-face rounded-2xl p-8 flex flex-col items-center justify-center text-center"
                style={{
                  background: "oklch(0.77 0.12 200 / 0.15)",
                  border: "1px solid oklch(0.77 0.12 200 / 0.4)",
                }}
              >
                <Badge
                  className="mb-4 text-xs"
                  style={{
                    background: "oklch(0.82 0.14 75 / 0.2)",
                    color: "oklch(0.82 0.14 75)",
                  }}
                >
                  Answer
                </Badge>
                <p className="text-base text-foreground leading-relaxed">
                  {currentCard.answer}
                </p>
              </div>
            </div>
          </button>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={prevCard}
              disabled={cardIndex === 0}
              className="border-border/60"
              data-ocid="flashcards.pagination_prev"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFlipped(false);
                setCardIndex(0);
              }}
              data-ocid="flashcards.button"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-2" /> Restart
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextCard}
              disabled={cardIndex === cards.length - 1}
              className="border-border/60"
              data-ocid="flashcards.pagination_next"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function BookmarksTab({ bookId }: { bookId: bigint }) {
  const [bookmarks, setBookmarks] = useState<BM[]>(() =>
    getBookBookmarks(bookId.toString()),
  );

  const handleDelete = (id: string) => {
    removeBookmark(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    toast.success("Bookmark removed");
  };

  if (bookmarks.length === 0) {
    return (
      <div
        className="glass-card rounded-xl p-12 text-center"
        data-ocid="bookmarks.empty_state"
      >
        <Bookmark
          className="w-10 h-10 mx-auto mb-3"
          style={{ color: "oklch(0.55 0.06 220)" }}
        />
        <p className="font-medium text-foreground">No bookmarks yet</p>
        <p className="text-sm mt-1" style={{ color: "oklch(0.68 0.035 240)" }}>
          In the Q&amp;A tab, click the bookmark icon on any result to save it
          here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm" style={{ color: "oklch(0.68 0.035 240)" }}>
        {bookmarks.length} saved passage{bookmarks.length !== 1 ? "s" : ""}
      </p>
      {bookmarks.map((bm, idx) => (
        <motion.div
          key={bm.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ delay: idx * 0.05 }}
          className="glass-card rounded-xl p-5 group"
          data-ocid={`bookmarks.item.${idx + 1}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{
                    color: "oklch(0.82 0.14 75)",
                    borderColor: "oklch(0.82 0.14 75 / 0.4)",
                  }}
                >
                  {bm.chapterTitle}
                </Badge>
                <span
                  className="text-xs"
                  style={{ color: "oklch(0.55 0.03 240)" }}
                >
                  {new Date(bm.savedAt).toLocaleDateString()}
                </span>
              </div>
              <p
                className="text-sm leading-relaxed line-clamp-3"
                style={{ color: "oklch(0.87 0.012 240)" }}
              >
                {bm.content}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
              onClick={() => handleDelete(bm.id)}
              data-ocid={`bookmarks.delete_button.${idx + 1}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function StudyPage() {
  const { bookId } = useParams({ from: "/study/$bookId" });
  const navigate = useNavigate();
  const bookIdBigInt = BigInt(bookId);
  const { data: book, isLoading: bookLoading } = useGetBook(bookIdBigInt);

  return (
    <div className="min-h-screen page-bg">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: "/" })}
            className="gap-2"
            data-ocid="study.button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </Button>
          {bookLoading ? (
            <Skeleton className="h-6 w-48" data-ocid="study.loading_state" />
          ) : (
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "oklch(0.82 0.14 75 / 0.2)" }}
              >
                <BookOpen
                  className="w-4 h-4"
                  style={{ color: "oklch(0.82 0.14 75)" }}
                />
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-foreground">
                  {book?.name ?? "Textbook"}
                </h1>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.68 0.035 240)" }}
                >
                  {book?.totalSegments.toString()} pages indexed
                </p>
              </div>
            </div>
          )}
        </div>

        <Tabs defaultValue="qa" className="w-full">
          <TabsList
            className="mb-6 p-1 rounded-xl border border-border/60"
            style={{ background: "oklch(0.205 0.048 237 / 0.6)" }}
          >
            <TabsTrigger
              value="qa"
              className="rounded-lg data-[state=active]:text-foreground"
              data-ocid="study.tab"
            >
              Q&amp;A
            </TabsTrigger>
            <TabsTrigger
              value="summaries"
              className="rounded-lg data-[state=active]:text-foreground"
              data-ocid="study.tab"
            >
              Summaries
            </TabsTrigger>
            <TabsTrigger
              value="flashcards"
              className="rounded-lg data-[state=active]:text-foreground"
              data-ocid="study.tab"
            >
              Flashcards
            </TabsTrigger>
            <TabsTrigger
              value="bookmarks"
              className="rounded-lg data-[state=active]:text-foreground"
              data-ocid="study.tab"
            >
              Bookmarks
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="qa">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <QATab bookId={bookIdBigInt} />
              </motion.div>
            </TabsContent>
            <TabsContent value="summaries">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <SummariesTab bookId={bookIdBigInt} />
              </motion.div>
            </TabsContent>
            <TabsContent value="flashcards">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <FlashcardsTab bookId={bookIdBigInt} />
              </motion.div>
            </TabsContent>
            <TabsContent value="bookmarks">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <BookmarksTab bookId={bookIdBigInt} />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
