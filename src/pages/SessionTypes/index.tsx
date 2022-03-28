
import { ClockIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sessionApi } from "../../api/SessionApi";
import Loader from "../../components/Loader";
import Shell from "../../components/Shell";
import CreateSessionType, { ISessionTypeData } from "./CreateSessionType";

export default function SessionTypesPage() {
  const profileId = "1243"
  const [sessionTypes, setSessionTypes] = useState<({ id: number } & ISessionTypeData)[]>([])
  const [loading, setLoading] = useState(false)
  const fetchList = async () => {
    setLoading(true)
    const sessionTypesByProfile = await sessionApi.getSessionTypesByProfileId(profileId);
    setSessionTypes([...sessionTypesByProfile]);
    setLoading(false)
  }

  useEffect(() => {
    fetchList()
  }, [])
  return (
    <Shell heading="Session Types" subtitle="Create events to share for people to book on your calendar." CTA={<CreateSessionType onCreated={fetchList} />}>
      <div className="bg-white border border-gray-200">{
        loading ?
          <Loader />
          :
          sessionTypes.map(s => <Link key={s.id} to={`${s.id}`}>
            <div className="border-b border-gray-200 text-gray-700 p-4">
              <div className="">{s.title}</div>
              <div className="text-gray-600 text-sm">
                <div className="text-gray-400 ">{s.description}</div>
                <div className="mt-2 flex items-center"><ClockIcon className="mr-1" width={14} color="#888" />{s.durationInSlot * 6} mins</div>
              </div>
            </div>
          </Link>)
      }
      </div>
    </Shell>
  )
}