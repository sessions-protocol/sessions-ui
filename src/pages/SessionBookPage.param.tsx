import { createPagePropsContext } from "@/context/PagePropsContext";
import * as Yup from 'yup';

export const SessionBookPagePropsContext = createPagePropsContext<{
  profileId: string;
  sessionId: string;
  date: string;
  slot: string;
}, {}>({
  key: 'SessionBookPage',
  validation: {
    profileId: Yup.string().required(),
    sessionId: Yup.string().required(),
    date: Yup.string().required(),
    slot: Yup.string().required(),
  },
})
