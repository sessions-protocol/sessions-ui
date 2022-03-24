import { SessionAvailable } from "@/partials/Book/SessionAvailable";
import { SessionAvailablePagePropsContext } from "./SessionAvailablePage.param";

export default function SessionAvailablePage() {
  return (
    <SessionAvailablePagePropsContext.Provider data={{}}>
      <div className="SessionAvailablePage">
        <div className="flex flex-col">
          <SessionAvailable />
        </div>
      </div>
    </SessionAvailablePagePropsContext.Provider>
  )
}
