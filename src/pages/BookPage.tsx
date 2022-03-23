import Book from "@/partials/Book/Book";
import { BookPagePropsContext } from "./BookPage.param";

export default function BookPage() {
  return (
    <BookPagePropsContext.Provider data={{}}>
      <div className="Book">
        <Book />
      </div>
    </BookPagePropsContext.Provider>
  )
}
