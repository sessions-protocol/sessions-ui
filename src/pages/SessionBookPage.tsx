import { SessionBook } from "../partials/Book/SessionBook";
import { SessionBookPagePropsContext } from "./SessionBookPage.param";

export default function SessionBookPage() {
  return (
    <SessionBookPagePropsContext.Provider data={{}}>
      <div className="SessionBookPage">
        <div className="flex flex-col">
          <SessionBook />
        </div>
      </div>
    </SessionBookPagePropsContext.Provider>
  )
}
