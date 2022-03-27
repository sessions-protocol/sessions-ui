import { SessionScheduledPagePropsContext } from "@/pages/SessionScheduledPage.param";
import { Session, SessionSlot } from "@/types/Session";
import { Box, Button, Center, Container } from "@chakra-ui/react";
import { ClockIcon, CurrencyDollarIcon, BadgeCheckIcon } from "@heroicons/react/solid";
import { add } from "date-fns";
import { useQuery } from "react-query";
import { ColorModeSwitcher } from "../../components/ColorModeSwitcher";
import { useAppColorMode } from "../../hooks/useColorMode";
import { SessionLayout } from "../../layout/SessionLayout";

export function SessionScheduled() {
  const { toggleColorMode } = useAppColorMode()
  const { params } = SessionScheduledPagePropsContext.usePageContext()

  const {
    data: session,
    isLoading: isLoadingSession,
  } = useQuery<Session>(`Session:${params.sessionId}`, async () => {
    return {
      id: "1",
      user: {
        email: "@jack",
        address: "0x28Ba69e289c15f8a751eb929D81ec35e891A80e2",
      },
      title: "Tech Mentoring",
      duration: 60 * 30,
      availableDates: [
        new Date().toISOString(),
        add(new Date(), { days: 1}).toISOString(),
      ]
    }
  })
  const {
    data: slots,
    isLoading: isLoadingSlots,
  } = useQuery<SessionSlot[]>(`SessionSlots:${params.sessionId}:${params.date}`, async () => {
    return [
      { time: "09:00", booked: false },
      { time: "09:30", booked: false },
      { time: "10:00", booked: false },
    ]
  }, {
    enabled: !!params.date,
  })

  return (
    <SessionLayout>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col justify-center mb-12">
          <div className="SessionScheduled transition-all duration-500 ease-in-out">
            <div className="flex flex-col text-center p-4 rounded-sm border-gray-200 dark:border-gray-600 bg-white dark:bg-[#3f3f3f] border min-h-[356px]">
              <div className="flex flex-col text-center text-green-500 my-4">
                <BadgeCheckIcon className="mx-auto -mt-1 inline-block h-12 w-12" />
              </div>
              <div className="flex flex-col text-center h-full px-4">
                <h2 className="font-bold text-2xl text-gray-700 dark:text-gray-200">
                  This session is scheduled
                </h2>

                <div className="my-4 grid grid-cols-3 border-t border-b py-4 text-left text-gray-700 border-gray-200 dark:border-gray-600 dark:text-gray-300">
                  <div className="font-medium">What</div>
                  <div className="col-span-2 mb-6">{session?.title} with @jack</div>
                  <div className="font-medium">When</div>
                  <div className="col-span-2">Monday, March 28, 2020<br/>9:00 AM to 9:30 AM <span className="text-gray-500">(Asia/Tokyo)</span>
                  </div>
                </div>

                <Button isFullWidth colorScheme={"green"} onClick={() => { }}>Add to calendar</Button>
              </div>
            </div>
          </div>
          <div className="text-right text-xs mt-2 opacity-50">Powered by Sessions Protocol</div>
        </div>
      </div>
    </SessionLayout>
  );
}
