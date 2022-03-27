import { SessionBookPagePropsContext } from "@/pages/SessionBookPage.param";
import { ConnectorList } from "@/web3/components/ConnectorList";
import { Button, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useMemo, useState } from "react";
import { TextAbbrLabel } from "../../../components/TextAbbrLabel";
import { useFormik } from "formik";
import { ClockIcon, CurrencyDollarIcon, CalendarIcon, GlobeAltIcon } from "@heroicons/react/solid";
import { ethers, utils } from "ethers";
import sessionsABI from "../../../web3/abis/sessions.json";
import Router from "@/Router";

export function SessionBookFlow() {
  const { chainId, account, deactivate, library } = useWeb3React()
  const { params } = SessionBookPagePropsContext.usePageContext()

  const [profile, setProfile] = useState<{ username: string } | null>(null)
  const [waitingTransaction, setWaitingTransaction] = useState(false)

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    onSubmit: (values) => {
      setProfile({ username: values.username })
    }
  });


  const bookSession = useMemo(() => {
    return async () => {
      const signer = await library.getSigner()

      const sessionsContract = new ethers.Contract(
        "0x6dc0424c5beb6bfadd150633e2e99522ddc0802d",
        sessionsABI,
        signer
      );
      const calldata = ["1127", "1659479037", "1"];
      const tx =  await sessionsContract.book(...calldata, {
        value: utils.parseEther("0.1"),
      });

      await tx.wait();

      return Router.apply(`/session/${params.sessionId}/scheduled`)
    }
  }, [library])

  return (
    <div>
      <div className="text-left">
        {chainId && account && (
          <div className="flex flex-row justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-2 mb-2">
            <div className="text-xs dark:text-gray-300">Wallet Connected</div>
            <div className="flex flex-row items-center">
              <div className="text-sm"><TextAbbrLabel text={account} front={6} end={4} /></div>
            </div>
          </div>
        )}

        {profile && (
          <div className="flex flex-row justify-between items-center border-b border-gray-200 dark:border-gray-600 mb-2">
            <div className="text-xs dark:text-gray-300">Lens logged in</div>
            <div className="flex flex-row items-center">
              <div className="text-sm">{profile.username}</div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6">
        {(!chainId || !account) && (
          <div>
            <div className="text-lg font-medium mb-4">Connect Wallet</div>
            <ConnectorList />
          </div>
        )}
        {/* {chainId && account && !profile && (
          <div>
            <div className="text-lg font-medium mb-4">Create Lens Profile</div>
            <form onSubmit={formik.handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <FormControl>
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                  />
                </FormControl>
                <Button type="submit" colorScheme="green" isFullWidth>
                  Create
                </Button>
              </VStack>
            </form>
          </div>
        )} */}
        {chainId && account && (
          <div className="text-left flex flex-col h-full">
            <div className="text-lg font-medium mb-4">Book your session with @jack</div>
            <p className="mb-1 -ml-2 px-2 py-1 text-green-500">
              <CalendarIcon className="mr-1 -mt-1 inline-block h-4 w-4" />
              Monday, March 28, 2020
            </p>
            <p className="mb-1 -ml-2 px-2 py-1 text-green-500">
              <ClockIcon className="mr-1 -mt-1 inline-block h-4 w-4" />
              9:00 AM to 9:30 AM (Asia/Tokyo)
            </p>
            <p className="mb-1 -ml-2 px-2 py-1 text-green-500">
              <CurrencyDollarIcon className="mr-1 -mt-1 inline-block h-4 w-4" />
              1 MATIC
            </p>
            <div className="flex-grow mb-2"></div>
            <Button
              isFullWidth
              colorScheme={"green"}
              onClick={() => {
                setWaitingTransaction(true)
                return bookSession()
              }}
            >{ waitingTransaction ? `Waiting Transaction...` : `Confirm Booking`}</Button>
          </div>
        )}
      </div>
    </div>

  );
}
