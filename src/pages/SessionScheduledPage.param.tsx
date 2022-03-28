import { createPagePropsContext } from "@/context/PagePropsContext";
import * as Yup from 'yup';

export const SessionScheduledPagePropsContext = createPagePropsContext<{
  sessionId: string;
  time: string;
}, {}>({
  key: 'SessionScheduledPage',
  validation: {
    sessionId: Yup.string().required(),
    time: Yup.string().required(),
  },
})
