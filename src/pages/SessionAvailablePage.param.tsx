import { createPagePropsContext } from "@/context/PagePropsContext";
import * as Yup from 'yup';

export const SessionAvailablePagePropsContext = createPagePropsContext<{
  sessionId: string;
  date?: string;
  slot?: string;
}, {}>({
  key: 'SessionAvailablePage',
  validation: {
    sessionId: Yup.string().required(),
    date: Yup.string(),
    slot: Yup.string(),
  },
})
