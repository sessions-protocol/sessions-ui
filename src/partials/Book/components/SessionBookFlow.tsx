import { SessionBookPagePropsContext } from "@/pages/SessionBookPage.param";
import { ConnectorList } from "@/web3/components/ConnectorList";
import { Button } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";
import { TextAbbrLabel } from "../../../components/TextAbbrLabel";
import { useFormik } from "formik";
import { ClockIcon, CurrencyDollarIcon, CalendarIcon } from "@heroicons/react/solid";
import { ethers, utils } from "ethers";
import { useLocation, useNavigate } from "react-router-dom";
import { formatInTimeZone } from 'date-fns-tz';
import toast from 'react-hot-toast';

import sessionsABI from "../../../web3/abis/sessions.json";
import erc20ABI from "../../../web3/abis/erc20.json";
import { Session } from "@/types/Session";
import { add } from "date-fns";
import { useTimezoneSettings } from "../../../hooks/useTimezoneSettings";
import { SESSIONS_CONTRACT } from "@/web3/contracts";
import { TransactionReceipt } from "@ethersproject/providers";
import { useMutation } from "react-query";

export function SessionBookFlow({ session }: { session: Session }) {
  const navigate = useNavigate();
  const timezoneSettings = useTimezoneSettings()
  const location = useLocation();
  const { chainId, account, deactivate, library } = useWeb3React()
  const { params } = SessionBookPagePropsContext.usePageContext()

  const [requireApproval, setRequireApproval] = useState<boolean>(false)

  const [profile, setProfile] = useState<{ username: string } | null>(null)

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    onSubmit: (values) => {
      setProfile({ username: values.username })
    }
  });

  const checkRequireApproval = useMemo(() => {
    return async () => {
      if (session.token.contract) {
        const signer = await library.getSigner()
  
        const erc20Contract = new ethers.Contract(
          session.token.contract,
          erc20ABI,
          signer
        );

        const allowance = await erc20Contract.allowance(signer.getAddress(), SESSIONS_CONTRACT)

        if (allowance > session.token.amount) {
          return false
        }
        return true
      }
      return false
    }
  }, [session, library])


  useEffect(() => {
    if (account) {
      checkRequireApproval().then((requireApproval) => {
        setRequireApproval(requireApproval)
      })
    }
  }, [account, checkRequireApproval])

  const tokenApproval = useMutation(async () => {
    const approval = async () => {
      const signer = await library.getSigner()

      const erc20Contract = new ethers.Contract(
        session.token.contract!,
        erc20ABI,
        signer
      );
      const calldata = [
        SESSIONS_CONTRACT,
        ethers.constants.MaxUint256,
      ];
      const tx = await erc20Contract.approve(...calldata);

      return tx;
    }

    try {
      const transactionResponse = await approval();
      const receiptPromise = transactionResponse.wait();
      toast.promise(
          receiptPromise,
          {
            loading: `Approve ${session.token.symbol}...`,
            success: (receipt: TransactionReceipt) => {
              return (
                <div className="flex flex-row items-center">
                  <div className="flex flex-col">
                    <b className="mb-1">{`Successfully Approve ${session.token.symbol}`}</b>
                    <a target="_blank" rel="noreferrer" className="text-gray-text-center text-sm leading-6 text-gray-light-10 dark:text-gray-dark-10">
                      <span className="hover:underline">{receipt.status === 1 ? "Transaction is submitted" : "Something wrong with the receipt"}</span> &#8599;
                    </a>
                  </div>
                </div>
              );
            },
            error: (error: Error) => {
              return (
                <div className="flex flex-row items-center">
                  <div className="flex flex-col">
                    <b className="mb-1">{`Approve failed`}</b>
                    <div>{error.message}</div>
                  </div>
                </div>
              );
            },
          },
          {
            loading: {
              duration: Infinity,
            },
            success: {
              duration: 5000,
            },
          }
      );
      const receipt = await receiptPromise;
      setRequireApproval(false)
      return receipt;
    } catch (error: any) {
      toast.error(
          <div className="flex flex-row items-start">
            <div className="flex flex-col items-start">
              <b className="mb-1">{`Book failed`}</b>
              <div>{error.message}</div>
            </div>
          </div>
      );
      return null;
    }
  })

  const bookSession = useMutation(async () => {
    const booking = async () => {
      const signer = await library.getSigner()

      const sessionsContract = new ethers.Contract(
        SESSIONS_CONTRACT,
        sessionsABI,
        signer
      );

      if (session?.validateFollow) {
        const isFollowed = await sessionsContract.checkFollowValidity(session.lensProfileId, signer.getAddress())
        if (!isFollowed) {
          return alert("You must follow the lens before you can book a session")
        }
      }

      const calldata = [
        new Date(params.time).getTime() / 1000,
        params.sessionId
      ];
      const tx = await sessionsContract.book(...calldata, session?.token.contract ? {} : {
        value: session?.token.amount,
      });

      return tx;
    }

    try {
      const transactionResponse = await booking();
      const receiptPromise = transactionResponse.wait();
      toast.promise(
          receiptPromise,
          {
            loading: `Booking ${session.title}@${session.user.handle}...`,
            success: (receipt: TransactionReceipt) => {
              return (
                <div className="flex flex-row items-center">
                  <div className="flex flex-col">
                    <b className="mb-1">{`Successfully Book ${session.title}@${session.user.handle}`}</b>
                    <a target="_blank" rel="noreferrer" className="text-gray-text-center text-sm leading-6 text-gray-light-10 dark:text-gray-dark-10">
                      <span className="hover:underline">{receipt.status === 1 ? "Transaction is submitted" : "Something wrong with the receipt"}</span> &#8599;
                    </a>
                  </div>
                </div>
              );
            },
            error: (error: Error) => {
              return (
                <div className="flex flex-row items-start">
                  <div className="flex flex-col items-start">
                    <b className="mb-1">{`Book failed`}</b>
                    <div>{error.message}</div>
                  </div>
                </div>
              );
            },
          },
          {
            loading: {
              duration: Infinity,
            },
            success: {
              duration: 5000,
            },
          }
      );
      const receipt = await receiptPromise;
      navigate(`/session/${params.sessionId}/scheduled${location.search}`);
      return receipt;
    } catch (error: any) {
      toast.error(
          <div className="flex flex-row items-start">
            <div className="flex flex-col items-start">
              <b className="mb-1">{`Book failed`}</b>
              <div>{error.message}</div>
            </div>
          </div>
      );
      return null;
    }
  })

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
            <div className="text-lg font-medium mb-4">Book your session with @{session?.user.handle}</div>
            <p className="mb-1 -ml-2 px-2 py-1 text-green-500">
              <CalendarIcon className="mr-1 -mt-1 inline-block h-4 w-4" />
              {formatInTimeZone(new Date(params.time), timezoneSettings.settings.timezone, "EEEE, MMMM d, yyyy")}
            </p>
            <p className="mb-1 -ml-2 px-2 py-1 text-green-500">
              <ClockIcon className="mr-1 -mt-1 inline-block h-4 w-4" />
              {formatInTimeZone(
                new Date(params.time),
                timezoneSettings.settings.timezone, 
                timezoneSettings.settings.clock24hour ? "HH:mm": "hh:mm aaa"
              )}
              {" to "}
              {formatInTimeZone(
                add(new Date(params.time), { minutes: session.sessionType.durationInSlot * 6 }),
                timezoneSettings.settings.timezone, 
                timezoneSettings.settings.clock24hour ? "HH:mm": "hh:mm aaa"
              )}
              <span className="text-gray-500">{` (${timezoneSettings.settings.timezone})`}</span>
            </p>
            {session.token.amount > 0 ? (
               <p className="mb-1 -ml-2 px-2 py-1 text-green-500">
                <CurrencyDollarIcon className="mr-1 -mt-1 inline-block h-4 w-4" />
                { session?.token.amount ? utils.formatUnits(session?.token.amount, session?.token.decimals) : "" } {session?.token.symbol || "..."}
              </p>
            ): null}
            <div className="flex-grow mb-2"></div>

            {
              requireApproval ?
              <Button
                isFullWidth
                disabled={tokenApproval.isLoading}
                colorScheme={"green"}
                onClick={async () => {
                  return await tokenApproval.mutateAsync()
                }}
              >{ tokenApproval.isLoading ? `Waiting Transaction...` : `Approve ${session.token.symbol}`}</Button>
              :
              <Button
                isFullWidth
                disabled={bookSession.isLoading}
                colorScheme={"green"}
                onClick={async () => {
                  return await bookSession.mutateAsync()
                }}
              >{ bookSession.isLoading ? `Waiting Transaction...` : `Confirm Booking`}</Button>
            }
          </div>
        )}
      </div>
    </div>

  );
}

