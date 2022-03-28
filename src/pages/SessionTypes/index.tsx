
import { useEffect, useState } from "react";
import { sessionApi } from "../../api/SessionApi";
import Shell from "../../components/Shell";
import CreateSessionType from "./CreateSessionType";

export default function SessionTypesPage() {
  const profileId = "1243"
  const [sessionTypes, setSessionTypes] = useState<any[]>([])
  const fetchList = async () => {
    const { sessionTypesByProfile, sessionTypeIds } = await sessionApi.getSessionTypesByProfileId(profileId);
    setSessionTypes(sessionTypesByProfile);
  }

  useEffect(() => {
    fetchList()
  }, [])
  return (
    <Shell heading="Session Types" subtitle="Create events to share for people to book on your calendar." CTA={<CreateSessionType onCreated={fetchList} />}>
      <div>{
        sessionTypes.map(s => <div>{s.title}</div>)
      }</div>
    </Shell>
  )
}