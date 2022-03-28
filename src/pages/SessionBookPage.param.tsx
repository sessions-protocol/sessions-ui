import { createPagePropsContext } from "@/context/PagePropsContext";
import * as Yup from 'yup';

export const SessionBookPagePropsContext = createPagePropsContext<{
  sessionId: string;
  time: string;
}, {}>({
  key: 'SessionBookPage',
  validation: {
    sessionId: Yup.string().required(),
    time: Yup.string().required(),
  },
})
