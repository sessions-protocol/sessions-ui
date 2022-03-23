import { Book } from "@/partials/Book/Book";
import { BookPagePropsContext } from "./BookPage.param";

export default function BookPage() {
  return (
    <BookPagePropsContext.Provider data={{}}>
      <div className="BookPage">
        <div className="flex flex-col">
          <Book  />
        </div>
      </div>
    </BookPagePropsContext.Provider>
  )
}
