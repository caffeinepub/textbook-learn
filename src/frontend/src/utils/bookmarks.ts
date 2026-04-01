export interface Bookmark {
  id: string;
  bookId: string;
  bookName: string;
  chapterTitle: string;
  content: string;
  savedAt: string;
}

const KEY = "textbook_bookmarks";

export function getBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addBookmark(bm: Omit<Bookmark, "id" | "savedAt">): Bookmark {
  const bookmarks = getBookmarks();
  const newBm: Bookmark = {
    ...bm,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify([newBm, ...bookmarks]));
  return newBm;
}

export function removeBookmark(id: string): void {
  const bookmarks = getBookmarks().filter((b) => b.id !== id);
  localStorage.setItem(KEY, JSON.stringify(bookmarks));
}

export function getBookBookmarks(bookId: string): Bookmark[] {
  return getBookmarks().filter((b) => b.bookId === bookId);
}
