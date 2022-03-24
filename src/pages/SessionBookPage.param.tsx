import { createPagePropsContext } from "@/context/PagePropsContext";
import * as Yup from 'yup';

export const SessionBookPagePropsContext = createPagePropsContext<{
  sessionId: string;
  date: string;
  slot: string;
}, {}>({
  key: 'SessionBookPage',
  validation: {
    sessionId: Yup.string().required(),
    date: Yup.string().required(),
    slot: Yup.string().required(),
  },
})
