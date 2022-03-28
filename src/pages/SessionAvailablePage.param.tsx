import { createPagePropsContext } from "@/context/PagePropsContext";
import * as Yup from 'yup';

export const SessionAvailablePagePropsContext = createPagePropsContext<{
  profileId: string;
  sessionId: string;
  date?: string;
  slot?: string;
}, {}>({
  key: 'SessionAvailablePage',
  validation: {
    profileId: Yup.string().required(),
    sessionId: Yup.string().required(),
    date: Yup.string(),
    slot: Yup.string(),
  },
})
