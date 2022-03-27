import { createPagePropsContext } from "@/context/PagePropsContext";
import * as Yup from 'yup';

export const SessionScheduledPagePropsContext = createPagePropsContext<{
  sessionId: string;
  date: string;
  slot: string;
}, {}>({
  key: 'SessionScheduledPage',
  validation: {
    sessionId: Yup.string().required(),
    date: Yup.string().required(),
    slot: Yup.string().required(),
  },
})
