import { BookOpen } from "lucide-react";
import { SiGithub, SiX } from "react-icons/si";

export function Footer() {
  const year = new Date().getFullYear();
  const attribution = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  const platformLinks = [
    "Upload Textbook",
    "Q&A Search",
    "Chapter Summaries",
    "Flashcards",
  ];
  const resourceLinks = [
    "Study Guide",
    "Sample Books",
    "API Docs",
    "Community",
  ];
  const companyLinks = [
    "About Us",
    "Pricing",
    "Privacy Policy",
    "Terms of Service",
  ];

  return (
    <footer
      className="border-t border-border/50 mt-16"
      style={{ background: "oklch(0.155 0.04 240)" }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold gold-glow"
                style={{
                  background: "oklch(0.82 0.14 75)",
                  color: "oklch(0.12 0.04 240)",
                }}
              >
                TB
              </div>
              <span className="font-display font-bold text-foreground">
                TextBook Learn
              </span>
            </div>
            <p className="text-sm" style={{ color: "oklch(0.68 0.035 240)" }}>
              Your AI-powered study companion. Upload any textbook and master it
              faster.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan transition-colors"
                style={{ color: "oklch(0.68 0.035 240)" }}
              >
                <SiGithub className="w-5 h-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan transition-colors"
                style={{ color: "oklch(0.68 0.035 240)" }}
              >
                <SiX className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4
              className="font-semibold text-sm mb-4"
              style={{ color: "oklch(0.965 0.01 240)" }}
            >
              Platform
            </h4>
            <ul className="space-y-2">
              {platformLinks.map((item) => (
                <li key={item}>
                  <a
                    href="/"
                    className="text-sm hover:text-cyan transition-colors"
                    style={{ color: "oklch(0.68 0.035 240)" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="font-semibold text-sm mb-4"
              style={{ color: "oklch(0.965 0.01 240)" }}
            >
              Resources
            </h4>
            <ul className="space-y-2">
              {resourceLinks.map((item) => (
                <li key={item}>
                  <a
                    href="/"
                    className="text-sm hover:text-cyan transition-colors"
                    style={{ color: "oklch(0.68 0.035 240)" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="font-semibold text-sm mb-4"
              style={{ color: "oklch(0.965 0.01 240)" }}
            >
              Company
            </h4>
            <ul className="space-y-2">
              {companyLinks.map((item) => (
                <li key={item}>
                  <a
                    href="/"
                    className="text-sm hover:text-cyan transition-colors"
                    style={{ color: "oklch(0.68 0.035 240)" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "oklch(0.55 0.03 240)" }}>
            © {year}. Built with ❤️ using{" "}
            <a
              href={attribution}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan transition-colors"
              style={{ color: "oklch(0.77 0.12 200)" }}
            >
              caffeine.ai
            </a>
          </p>
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "oklch(0.55 0.03 240)" }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>TextBook Learn — Study smarter, not harder</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
