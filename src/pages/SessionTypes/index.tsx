import sessionsABI from "@/web3/abis/sessions.json";
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
} from "@chakra-ui/react";
import { ExternalLinkIcon, ClockIcon } from "@heroicons/react/solid";
import { useWeb3React } from "@web3-react/core";
import { ethers, utils } from "ethers";
import { Field, Form, Formik } from "formik";
import { omit, range } from "lodash";
import { useEffect, useState } from "react";
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
  const [{ profile }] = useProfileState();
  const profileId = profile?.id;
  const [sessionTypes, setSessionTypes] = useState<
    ({ id: string } & ISessionTypeReturnData)[]
  >([]);
  const [loading, setLoading] = useState(false);
  const fetchList = async () => {
    setLoading(true);
    const sessionTypesByProfile = await sessionApi.getSessionTypesByProfileId(
      profileId!
    );
    setSessionTypes(sessionTypesByProfile);
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
  }, []);

  // goto profile list page if not connected to wallet or no selected profile
  if (!chainId || !account || !profile) {
    navigate('/profile');
    return null;
  }
  return (
    <Shell
      heading="Session Types"
      subtitle="Create sessions to share for people to book on your calendar."
      CTA={<CreateSessionType onCreated={fetchList} />}
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
              <SessionTypeItem key={s.id} sessionType={s} onUpdated={fetchList} />
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
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const durationInSlotOptions = range(1, 20);
  const { account, library } = useWeb3React();
  const formData = {
    ...omit(sessionType, "amount"),
    price: +utils.formatEther(sessionType.amount.toString()),
  };
  console.log('price ', formData.price)
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
        <div className="flex justify-center items-center" onClick={(e) => {e.stopPropagation()}}>
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
              validate={(values) => {}}
              onSubmit={async (values, { setSubmitting }) => {
                const signer = await library.getSigner();
                const sessionsContract = new ethers.Contract(
                  SESSIONS_CONTRACT,
                  sessionsABI,
                  signer
                );
                if (!account) return;
                const calldata: [string, ISessionTypeCallData] = [
                  sessionType.id,
                  {
                    ...omit(values, "price"),
                    amount: utils.parseEther(`${values.price}`).toString(),
                  },
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
                  <Field name="price">
                    {({ field, form }: any) => (
                      <FormControl className="mb-5">
                        <FormLabel htmlFor="price">Price(Matic)</FormLabel>
                        <NumberInput defaultValue={formData.price} min={1} className="flex-1 mr-2">
                          <NumberInputField
                            {...field}
                            id="price"
                          />
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
