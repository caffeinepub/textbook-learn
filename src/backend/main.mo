import Char "mo:core/Char";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";

actor {

  // ---- Types ----
  type BookId = Nat;
  type SegmentId = Nat;

  type Book = {
    id : BookId;
    name : Text;
    uploadedAt : Int;
    totalSegments : Nat;
  };

  type Segment = {
    id : SegmentId;
    bookId : BookId;
    chapterIndex : Nat;
    chapterTitle : Text;
    pageNumber : Nat;
    content : Text;
  };

  type SearchResult = {
    segment : Segment;
    snippet : Text;
  };

  type ChapterInfo = {
    index : Nat;
    title : Text;
    segmentCount : Nat;
  };

  type Flashcard = {
    question : Text;
    answer : Text;
  };

  type SegmentInput = {
    chapterIndex : Nat;
    chapterTitle : Text;
    pageNumber : Nat;
    content : Text;
  };

  // ---- Stable State ----
  stable var nextBookId : BookId = 0;
  stable var nextSegmentId : SegmentId = 0;
  stable let books : Map.Map<BookId, Book> = Map.empty<BookId, Book>();
  stable let segments : Map.Map<SegmentId, Segment> = Map.empty<SegmentId, Segment>();

  // ---- Helpers ----
  func toLower(t : Text) : Text {
    t.map(func(c : Char) : Char {
      if (c >= 'A' and c <= 'Z') {
        Char.fromNat32(c.toNat32() + 32)
      } else c
    })
  };

  // ---- Books ----
  public func createBook(name : Text) : async BookId {
    let id = nextBookId;
    nextBookId += 1;
    books.add(id, { id; name; uploadedAt = Time.now(); totalSegments = 0 });
    id
  };

  public query func listBooks() : async [Book] {
    books.values().toArray()
  };

  public query func getBook(bookId : BookId) : async ?Book {
    books.get(bookId)
  };

  public func deleteBook(bookId : BookId) : async Bool {
    if (books.containsKey(bookId)) {
      books.remove(bookId);
      let toRemove = List.empty<SegmentId>();
      for ((sid, seg) in segments.entries()) {
        if (seg.bookId == bookId) toRemove.add(sid);
      };
      for (sid in toRemove.toArray().values()) {
        segments.remove(sid);
      };
      true
    } else false
  };

  // ---- Segments ----
  public func addSegments(bookId : BookId, newSegs : [SegmentInput]) : async Bool {
    switch (books.get(bookId)) {
      case null false;
      case (?book) {
        for (s in newSegs.values()) {
          segments.add(nextSegmentId, {
            id = nextSegmentId;
            bookId;
            chapterIndex = s.chapterIndex;
            chapterTitle = s.chapterTitle;
            pageNumber = s.pageNumber;
            content = s.content;
          });
          nextSegmentId += 1;
        };
        books.remove(bookId);
        books.add(bookId, {
          id = book.id;
          name = book.name;
          uploadedAt = book.uploadedAt;
          totalSegments = book.totalSegments + newSegs.size();
        });
        true
      };
    }
  };

  // ---- Search ----
  public query func searchBook(bookId : BookId, searchQuery : Text) : async [SearchResult] {
    let lower = toLower(searchQuery);
    let results = List.empty<SearchResult>();
    for ((_, seg) in segments.entries()) {
      if (seg.bookId == bookId) {
        if (toLower(seg.content).contains(#text lower)) {
          results.add({ segment = seg; snippet = seg.content });
        };
      };
    };
    results.toArray()
  };

  // ---- Chapters ----
  public query func getChapters(bookId : BookId) : async [ChapterInfo] {
    let chapterMap : Map.Map<Nat, { title : Text; count : Nat }> = Map.empty();
    for ((_, seg) in segments.entries()) {
      if (seg.bookId == bookId) {
        switch (chapterMap.get(seg.chapterIndex)) {
          case null {
            chapterMap.add(seg.chapterIndex, { title = seg.chapterTitle; count = 1 });
          };
          case (?existing) {
            chapterMap.remove(seg.chapterIndex);
            chapterMap.add(seg.chapterIndex, { title = existing.title; count = existing.count + 1 });
          };
        };
      };
    };
    let infos = List.empty<ChapterInfo>();
    for ((idx, info) in chapterMap.entries()) {
      infos.add({ index = idx; title = info.title; segmentCount = info.count });
    };
    infos.toArray().sort(func(a : ChapterInfo, b : ChapterInfo) : { #less; #equal; #greater } {
      Nat.compare(a.index, b.index)
    })
  };

  public query func getChapterSegments(bookId : BookId, chapterIndex : Nat) : async [Segment] {
    let results = List.empty<Segment>();
    for ((_, seg) in segments.entries()) {
      if (seg.bookId == bookId and seg.chapterIndex == chapterIndex) {
        results.add(seg);
      };
    };
    results.toArray().sort(func(a : Segment, b : Segment) : { #less; #equal; #greater } {
      Nat.compare(a.pageNumber, b.pageNumber)
    })
  };

  // ---- Summary ----
  public query func getChapterSummary(bookId : BookId, chapterIndex : Nat) : async Text {
    let segs = List.empty<Segment>();
    for ((_, seg) in segments.entries()) {
      if (seg.bookId == bookId and seg.chapterIndex == chapterIndex) segs.add(seg);
    };
    let sorted = segs.toArray().sort(func(a : Segment, b : Segment) : { #less; #equal; #greater } {
      Nat.compare(a.pageNumber, b.pageNumber)
    });
    let summaryParts = List.empty<Text>();
    var count = 0;
    for (seg in sorted.values()) {
      if (count < 10) {
        let lines = seg.content.split(#char '.').toArray();
        if (lines.size() > 0 and lines[0].size() > 20) {
          summaryParts.add(lines[0] # ".");
          count += 1;
        };
      };
    };
    summaryParts.toArray().values().join(" ")
  };

  // ---- Flashcards ----
  public query func getFlashcards(bookId : BookId, chapterIndex : Nat) : async [Flashcard] {
    let segs = List.empty<Segment>();
    for ((_, seg) in segments.entries()) {
      if (seg.bookId == bookId and seg.chapterIndex == chapterIndex) segs.add(seg);
    };
    let cards = List.empty<Flashcard>();
    for (seg in segs.toArray().values()) {
      for (sentence in seg.content.split(#char '.')) {
        let trimmed = sentence.trim(#char ' ');
        if (trimmed.size() > 30) {
          cards.add({
            question = "What does this describe? \"" # trimmed # "\"";
            answer = trimmed;
          });
        };
      };
    };
    cards.toArray()
  };
}
