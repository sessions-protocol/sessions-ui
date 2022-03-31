import sessionsABI from "@/web3/abis/sessions.json";
import erc20ABI from "@/web3/abis/erc20.json";
import { SESSIONS_CONTRACT } from "@/web3/contracts";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import {
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Textarea,
  Spinner,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import { ExternalLinkIcon, ClockIcon } from "@heroicons/react/solid";
import { useWeb3React } from "@web3-react/core";
import { useWeb3ClientStateValue } from '@/context/Web3ClientState';
import { ethers, utils } from "ethers";
import { Field, Form, Formik } from "formik";
import { omit, range } from "lodash";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from 'react-router-dom';
import { sessionApi } from "../../api/SessionApi";
import { Icon } from "@chakra-ui/icon";

import Shell from "../../components/Shell";
import { useProfileState } from "../../context/ProfileContext";
import CreateSessionType, { ISessionTypeCallData, ISessionTypeReturnData } from "./CreateSessionType";

export default function SessionTypesPage() {
  const navigate = useNavigate();
  const { chainId, account } = useWeb3React();
  const web3ClientState = useWeb3ClientStateValue();
  const [{ profile }] = useProfileState();
  const profileId = profile?.id;
  const [sessionTypes, setSessionTypes] = useState<
    ({ id: string } & ISessionTypeReturnData)[]
  >([]);
  const [loading, setLoading] = useState(false);
  const fetchList = async (profileId: string) => {
    if (!profileId) return
    setLoading(true);
    const sessionTypesByProfile = await sessionApi.getSessionTypesByProfileId(profileId);
    setSessionTypes(sessionTypesByProfile);
    setLoading(false);
  };

  useEffect(() => {
    if (!profileId) return
    fetchList(profileId.toString());
  }, [profileId]);

  if (!chainId || !account || !profile) {
    // goto profile list page if not connected to wallet after EagerConnectTried or no selected profile
    if (web3ClientState.isEagerConnectTried) {
      navigate('/profile');
    }
    return null;
  }
  return (
    <Shell
      heading="Session Types"
      subtitle="Create sessions to share for people to book on your calendar."
      CTA={<CreateSessionType onCreated={() => profileId && fetchList(profileId.toString())} />}
    >
      <div className="bg-white border border-gray-200 border-b-0">
        {loading ? (
          <div
            className="flex items-center justify-center border-b border-gray-200 text-gray-700 p-4 cursor-pointer"
          >
            <Spinner />
          </div>
        ) : (
          sessionTypes.length > 0 ? (
            sessionTypes.map((s) => (
              <SessionTypeItem key={s.id} sessionType={s} onUpdated={() => profileId && fetchList(profileId.toString())} />
            ))
          ) : (
            <div className="flex items-center justify-center border-b border-gray-200 text-gray-700 p-4 cursor-pointer">
              <p>No session types created yet.</p>
            </div>
          )
        )}
      </div>
    </Shell>
  );
}

function SessionTypeItem({
  onUpdated,
  sessionType,
}: {
  sessionType: { id: string } & ISessionTypeReturnData;
  onUpdated: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const durationInSlotOptions = range(1, 20);
  const { account, library } = useWeb3React();

  const getFormData = useMemo(() => {
    return async () => {
      const tokenPrice = {
        symbol: "MATIC",
        amount: sessionType.amount,
        decimals: 18
      }
      if (sessionType.token != "0x0000000000000000000000000000000000000000") {
        const signer = await library.getSigner()
        const erc20Contract = new ethers.Contract(
          sessionType.token,
          erc20ABI,
          signer,
        );

        tokenPrice.decimals = await erc20Contract.decimals();
        tokenPrice.symbol = await erc20Contract.symbol();
      }

      console.log("utils.formatUnits(sessionType.amount.toString(), tokenPrice.decimals)", utils.formatUnits(sessionType.amount.toString(), tokenPrice.decimals))

      return {
        ...omit(sessionType, "amount"),
        price: +utils.formatUnits(sessionType.amount.toString(), tokenPrice.decimals),
        symbol: tokenPrice.symbol
      };
    }
  }, [library, sessionType])

  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    getFormData().then((data) => {
      setFormData(data)
    })
  }, [getFormData])

  return (
    <>
      <div className="flex flex-row border-b border-gray-200 text-gray-700 p-4 cursor-pointer" onClick={onOpen}>
        <div className="flex-grow">
          <div className="">{sessionType.title}</div>
          <div className="text-gray-600 text-sm">
            <div className="text-gray-400 ">{sessionType.description}</div>
            <div className="mt-2 flex items-center">
              <ClockIcon className="mr-1" width={14} color="#888" />
              {sessionType.durationInSlot * 6} mins
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center" onClick={(e) => { e.stopPropagation() }}>
          <Link to={`/session/${sessionType.id}/available`} target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              colorScheme={"dark"}
              variant="outline"
              leftIcon={<Icon as={ExternalLinkIcon} />}
            >Open Book Page</Button>
          </Link>
        </div>
      </div>

      <Modal
        blockScrollOnMount={false}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Session Type</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={formData}
              validate={(values) => { }}
              onSubmit={async (values, { setSubmitting }) => {
                const signer = await library.getSigner();
                const sessionsContract = new ethers.Contract(
                  SESSIONS_CONTRACT,
                  sessionsABI,
                  signer
                );
                const tokenPrice = {
                  symbol: "MATIC",
                  amount: values.price,
                  decimals: 18
                }
                if (values.token && values.token != "0x0000000000000000000000000000000000000000") {
                  const erc20Contract = new ethers.Contract(
                    values.token,
                    erc20ABI,
                    signer,
                  );

                  tokenPrice.decimals = await erc20Contract.decimals();
                  tokenPrice.symbol = await erc20Contract.symbol();
                }
                if (!account) return;
                const calldata: [string, ISessionTypeCallData] = [
                  sessionType.id,
                  {
                    ...omit(values, "price"),
                    amount: utils.parseUnits(`${values.price}`, tokenPrice.decimals).toString(),
                  } as any,
                ];
                const tx = await sessionsContract.updateSessionType(
                  ...calldata
                );
                await tx.wait();
                toast.success("update successfully");
                onClose();
                onUpdated();
                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Field name="title">
                    {({ field, form }: any) => (
                      <FormControl className="mb-5">
                        <FormLabel htmlFor="title">Title</FormLabel>
                        <Input {...field} id="title" placeholder="Quick chat" />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="description">
                    {({ field, form }: any) => (
                      <FormControl className="mb-5">
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <Textarea
                          {...field}
                          id="description"
                          placeholder="A quick video meeting."
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="durationInSlot">
                    {({ field, form }: any) => (
                      <FormControl className="mb-5">
                        <FormLabel htmlFor="durationInSlot">Length</FormLabel>
                        <Select
                          {...field}
                          defaultValue={formData.durationInSlot}
                          id="durationInSlot"
                        >
                          {durationInSlotOptions.map((d) => (
                            <option key={d} value={d}>
                              {d * 6} minutes
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="openBookingDeltaDays">
                    {({ field, form }: any) => (
                      <FormControl className="mb-5">
                        <FormLabel htmlFor="openBookingDeltaDays">
                          Sessions can be booked in (Days)
                        </FormLabel>
                        <NumberInput defaultValue={formData.openBookingDeltaDays} min={1} className="flex-1 mr-2">
                          <NumberInputField
                            {...field}
                            id="openBookingDeltaDays"
                          />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="token">
                    {({ field, form }: any) => (
                      <FormControl className="mb-5">
                        <FormLabel htmlFor="token">Token</FormLabel>
                        <RadioGroup {...field} id="token" defaultValue='0x0000000000000000000000000000000000000000' >
                          <Stack spacing={5} direction='row'>
                            <Radio {...field} colorScheme='blue' value='0x0000000000000000000000000000000000000000'>
                              MATIC
                            </Radio>
                            <Radio {...field} colorScheme='yellow' value='0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F' title="0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F">
                              DAI
                            </Radio>
                            <Radio {...field} colorScheme='green' value='0x326C977E6efc84E512bB9C30f76E30c160eD06FB' title="0x326C977E6efc84E512bB9C30f76E30c160eD06FB">
                              LINK
                            </Radio>
                          </Stack>
                        </RadioGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="price">
                    {({ field, form }: any) => (
                      <FormControl className="mb-5">
                        <FormLabel htmlFor="price">Price</FormLabel>
                        <NumberInput {...field} defaultValue={0} className="flex-1 mr-2">
                          <NumberInputField {...field} id="price" />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="validateFollow">
                    {({ field, form }: any) => (
                      <FormControl className="flex items-center">
                        <FormLabel htmlFor="validateFollow" mb="0">
                          Require follow
                        </FormLabel>
                        <Switch
                          {...field}
                          defaultChecked={formData.validateFollow}
                          id="validateFollow"
                        />
                      </FormControl>
                    )}
                  </Field>

                  <div className="my-6 text-left">
                    <Button
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                      type="submit"
                      colorScheme="green"
                    >
                      Update Session Type
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
