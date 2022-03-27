import { SessionScheduled } from "../partials/Book/SessionScheduled";
import { SessionScheduledPagePropsContext } from "./SessionScheduledPage.param";

export default function SessionScheduledPage() {
  return (
    <SessionScheduledPagePropsContext.Provider data={{}}>
      <div className="SessionScheduledPage">
        <div className="flex flex-col">
          <SessionScheduled />
        </div>
      </div>
    </SessionScheduledPagePropsContext.Provider>
  )
}
