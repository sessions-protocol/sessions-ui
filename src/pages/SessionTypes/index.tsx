
import Shell from "../../components/Shell";
import CreateSessionType from "./CreateSessionType";

export default function SessionTypesPage() {
  return (
    <Shell heading="Session Types" subtitle="Create events to share for people to book on your calendar." CTA={<CreateSessionType />}>

    </Shell>
  )
}