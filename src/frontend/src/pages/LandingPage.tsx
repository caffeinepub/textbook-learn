import { Footer } from "@/components/Footer";
import { UploadDropzone } from "@/components/UploadDropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useListBooks } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Brain,
  MessageSquare,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Instant Q&A",
    desc: "Ask any question from your textbook and get relevant passages with exact context.",
  },
  {
    icon: Brain,
    title: "Chapter Summaries",
    desc: "Auto-generated summaries of every chapter so you can review faster.",
  },
  {
    icon: Zap,
    title: "Flashcards",
    desc: "Smart flashcards auto-created from each chapter for active recall practice.",
  },
  {
    icon: Bookmark,
    title: "Bookmarks",
    desc: "Save important passages and revisit them anytime from your bookmark list.",
  },
];

const HOW_STEPS = [
  {
    step: "01",
    title: "Upload your PDF",
    desc: "Drag and drop any textbook PDF. We extract all text instantly.",
  },
  {
    step: "02",
    title: "Auto-scan & index",
    desc: "TextBook Learn scans every page, detects chapters, and indexes all content.",
  },
  {
    step: "03",
    title: "Study smarter",
    desc: "Ask questions, read summaries, flip flashcards, and bookmark passages.",
  },
];

const PREVIEW_CHAPTERS = [
  "1. Motion in a Straight Line",
  "2. Laws of Motion",
  "3. Work & Energy",
  "4. Gravitation",
  "5. Thermodynamics",
];

function ProductPreview() {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-border/60 shadow-card"
      style={{ background: "oklch(0.175 0.043 240)" }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-border/40"
        style={{ background: "oklch(0.155 0.04 240)" }}
      >
        <div className="w-3 h-3 rounded-full bg-red-400/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
        <div className="w-3 h-3 rounded-full bg-green-400/70" />
        <div className="flex-1" />
        <div
          className="px-3 py-1 rounded text-xs"
          style={{
            background: "oklch(0.205 0.048 237)",
            color: "oklch(0.68 0.035 240)",
          }}
        >
          textbooklearn.app/study/physics-11
        </div>
        <div className="flex-1" />
      </div>

      <div className="grid grid-cols-3 gap-0" style={{ minHeight: "280px" }}>
        <div className="border-r border-border/30 p-4 space-y-2">
          <p
            className="text-xs font-semibold mb-3"
            style={{ color: "oklch(0.77 0.12 200)" }}
          >
            CHAPTERS
          </p>
          {PREVIEW_CHAPTERS.map((ch, i) => (
            <div
              key={ch}
              className="text-xs px-2 py-1.5 rounded cursor-pointer transition-colors"
              style={{
                background:
                  i === 1 ? "oklch(0.77 0.12 200 / 0.15)" : "transparent",
                color:
                  i === 1 ? "oklch(0.77 0.12 200)" : "oklch(0.68 0.035 240)",
                borderLeft:
                  i === 1
                    ? "2px solid oklch(0.77 0.12 200)"
                    : "2px solid transparent",
              }}
            >
              {ch}
            </div>
          ))}
        </div>

        <div className="p-4 space-y-3">
          <p
            className="text-xs font-semibold"
            style={{ color: "oklch(0.77 0.12 200)" }}
          >
            Q&amp;A SEARCH
          </p>
          <div
            className="rounded px-3 py-2 text-xs"
            style={{
              background: "oklch(0.235 0.055 235)",
              color: "oklch(0.68 0.035 240)",
            }}
          >
            What is Newton’s first law?
          </div>
          <div
            className="rounded p-3 text-xs leading-relaxed"
            style={{
              background: "oklch(0.77 0.12 200 / 0.1)",
              color: "oklch(0.87 0.012 240)",
              borderLeft: "3px solid oklch(0.77 0.12 200)",
            }}
          >
            <span style={{ color: "oklch(0.77 0.12 200)" }}>
              Ch. 2, Page 48:{" "}
            </span>
            An object at rest stays at rest, and an object in motion stays in
            motion unless acted upon by a net external force.
          </div>
          <div
            className="rounded p-3 text-xs leading-relaxed"
            style={{
              background: "oklch(0.77 0.12 200 / 0.05)",
              color: "oklch(0.68 0.035 240)",
            }}
          >
            <span style={{ color: "oklch(0.77 0.12 200)" }}>
              Ch. 2, Page 51:{" "}
            </span>
            This is also known as the law of inertia.
          </div>
        </div>

        <div className="border-l border-border/30 p-4 space-y-4">
          <p
            className="text-xs font-semibold"
            style={{ color: "oklch(0.77 0.12 200)" }}
          >
            PROGRESS
          </p>
          {[
            { label: "Chapter 1", val: 80 },
            { label: "Chapter 2", val: 45 },
            { label: "Chapter 3", val: 20 },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span style={{ color: "oklch(0.68 0.035 240)" }}>
                  {item.label}
                </span>
                <span style={{ color: "oklch(0.77 0.12 200)" }}>
                  {item.val}%
                </span>
              </div>
              <Progress value={item.val} className="h-1.5" />
            </div>
          ))}
          <div
            className="mt-4 rounded-lg p-3 text-center"
            style={{ background: "oklch(0.82 0.14 75 / 0.12)" }}
          >
            <div
              className="text-2xl font-bold"
              style={{ color: "oklch(0.82 0.14 75)" }}
            >
              147
            </div>
            <div className="text-xs" style={{ color: "oklch(0.68 0.035 240)" }}>
              Flashcards Ready
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookLibrary() {
  const { data: books, isLoading } = useListBooks();
  const navigate = useNavigate();

  return (
    <section id="library" className="py-16" data-ocid="library.section">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              My Study Library
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "oklch(0.68 0.035 240)" }}
            >
              Your uploaded textbooks
            </p>
          </div>
          <Badge
            variant="outline"
            className="border-border/60"
            style={{ color: "oklch(0.77 0.12 200)" }}
          >
            {books?.length ?? 0} Books
          </Badge>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                className="h-40 rounded-xl"
                data-ocid="library.loading_state"
              />
            ))}
          </div>
        ) : books && books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book, idx) => (
              <motion.div
                key={book.id.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card rounded-xl p-5 cursor-pointer hover:border-cyan/50 transition-all group"
                onClick={() =>
                  navigate({
                    to: "/study/$bookId",
                    params: { bookId: book.id.toString() },
                  })
                }
                data-ocid={`library.item.${idx + 1}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-12 rounded-lg flex items-center justify-center"
                    style={{ background: "oklch(0.77 0.12 200 / 0.2)" }}
                  >
                    <BookOpen
                      className="w-5 h-5"
                      style={{ color: "oklch(0.77 0.12 200)" }}
                    />
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      color: "oklch(0.68 0.035 240)",
                      borderColor: "oklch(0.37 0.06 220)",
                    }}
                  >
                    {book.totalSegments.toString()} pages
                  </Badge>
                </div>
                <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-3">
                  {book.name}
                </h3>
                <Progress
                  value={Math.min(100, Number(book.totalSegments) / 3)}
                  className="h-1.5 mb-2"
                />
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs"
                    style={{ color: "oklch(0.68 0.035 240)" }}
                  >
                    {new Date(
                      Number(book.uploadedAt) / 1_000_000,
                    ).toLocaleDateString()}
                  </span>
                  <Button
                    size="sm"
                    className="text-xs h-7 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: "oklch(0.77 0.12 200)",
                      color: "oklch(0.12 0.04 240)",
                    }}
                    data-ocid={`library.item.${idx + 1}`}
                  >
                    Open <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div
            className="glass-card rounded-xl p-12 text-center"
            data-ocid="library.empty_state"
          >
            <BookOpen
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "oklch(0.55 0.06 220)" }}
            />
            <p className="font-semibold text-foreground mb-1">No books yet</p>
            <p className="text-sm" style={{ color: "oklch(0.68 0.035 240)" }}>
              Upload your first textbook PDF above to get started
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen page-bg">
      <main>
        <section className="pt-16 pb-8 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-10 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge
                  className="mb-5 px-4 py-1.5 text-xs font-medium"
                  style={{
                    background: "oklch(0.77 0.12 200 / 0.15)",
                    color: "oklch(0.77 0.12 200)",
                    border: "1px solid oklch(0.77 0.12 200 / 0.3)",
                  }}
                >
                  ✦ AI-Powered Textbook Study Platform
                </Badge>
                <h1
                  className="text-5xl md:text-6xl font-display font-bold leading-[1.1] mb-5"
                  style={{ color: "oklch(0.965 0.01 240)" }}
                >
                  Turn Any Textbook Into{" "}
                  <span
                    className="block"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.77 0.12 200), oklch(0.82 0.14 75))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Your Personal Tutor
                  </span>
                </h1>
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: "oklch(0.68 0.035 240)" }}
                >
                  Upload any PDF textbook — Physics, Chemistry, History, Math —
                  and instantly unlock AI-powered Q&amp;A, chapter summaries,
                  flashcards, and smart bookmarks.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto mb-16"
            >
              <UploadDropzone />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="max-w-5xl mx-auto mb-20"
            >
              <div className="text-center mb-6">
                <h2
                  className="text-xl font-semibold"
                  style={{ color: "oklch(0.68 0.035 240)" }}
                >
                  See it in action
                </h2>
              </div>
              <div className="cyan-glow rounded-2xl">
                <ProductPreview />
              </div>
            </motion.div>
          </div>
        </section>

        <section id="how" className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-foreground mb-3">
                Everything You Need to Ace Your Exams
              </h2>
              <p
                className="text-base"
                style={{ color: "oklch(0.68 0.035 240)" }}
              >
                Four powerful study tools, all from one textbook upload
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FEATURES.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-xl p-6 hover:border-cyan/30 transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: "oklch(0.77 0.12 200 / 0.15)" }}
                  >
                    <feat.icon
                      className="w-5 h-5"
                      style={{ color: "oklch(0.77 0.12 200)" }}
                    />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {feat.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "oklch(0.68 0.035 240)" }}
                  >
                    {feat.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-foreground mb-3">
                How It Works
              </h2>
              <p
                className="text-base"
                style={{ color: "oklch(0.68 0.035 240)" }}
              >
                Three steps to smarter studying
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {HOW_STEPS.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="glass-card rounded-xl p-6 text-center"
                >
                  <div
                    className="text-4xl font-display font-bold mb-3"
                    style={{ color: "oklch(0.37 0.06 220)" }}
                  >
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p
                    className="text-sm"
                    style={{ color: "oklch(0.68 0.035 240)" }}
                  >
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 px-4">
          <div className="container mx-auto">
            <div className="glass-card rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: "10,000+", label: "Books Analyzed" },
                { value: "2M+", label: "Questions Answered" },
                { value: "98%", label: "Student Satisfaction" },
                { value: "50+", label: "Subjects Covered" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="text-3xl font-display font-bold mb-1"
                    style={{ color: "oklch(0.77 0.12 200)" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: "oklch(0.68 0.035 240)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <BookLibrary />
      </main>
      <Footer />
    </div>
  );
}
