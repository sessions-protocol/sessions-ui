import { createPagePropsContext } from "@/context/PagePropsContext";
import * as Yup from 'yup';

export const BookPagePropsContext = createPagePropsContext<{
  sessionId: string;
}, {}>({
  key: 'Book',
  validation: {
    sessionId: Yup.string().required(),
  },
})
