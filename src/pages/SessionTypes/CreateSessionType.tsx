import sessionsABI from "@/web3/abis/sessions.json";
import { SESSIONS_CONTRACT } from "@/web3/contracts";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Icon } from "@chakra-ui/icon";
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/solid";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers, utils } from "ethers";
import { Field, Form, Formik } from "formik";
import { omit, range } from "lodash";
import toast from "react-hot-toast";
import { useProfileState } from "../../context/ProfileContext";

export default function CreateSessionType({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const durationInSlotOptions = range(1, 20);
  const { account, library } = useWeb3React();
  const [{ profile }] = useProfileState();
  const profileId = profile?.id;
  console.log(account, profileId);

  return (
    <>
      <Button
        leftIcon={<Icon as={PlusIcon} />}
        colorScheme={"green"}
        rounded={0}
        onClick={onOpen}
      >
        New session type
      </Button>

      <Modal
        blockScrollOnMount={false}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Add a new session type
            <p className="text-sm text-gray-500">
              Create a new session type for people to book times with.
            </p>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{
                title: "",
                description: "",
                durationInSlot: 3,
                openBookingDeltaDays: 10,
                price: 0,
								validateFollow: false,
              }}
              validate={(values) => {}}
              onSubmit={async (values, { setSubmitting }) => {
                const signer = await library.getSigner();
                const sessionsContract = new ethers.Contract(
                  SESSIONS_CONTRACT,
                  sessionsABI,
                  signer
                );
                if (!account || !profileId) return;
                console.log(
                  `Amount: `,
                  utils.parseEther(`${values.price}`).toString()
                );
                const calldata: [string, ISessionTypeCallData] = [
                  profileId,
                  {
                    ...omit(values, "price"),
                    amount: utils.parseEther(`${values.price}`).toString(),
                    recipient: account,
                    availabilityId: 0,
                    token: "0x0000000000000000000000000000000000000000",
                    locked: false,
                  },
                ];
                const tx = await sessionsContract.createSessionType(
                  ...calldata
                );
                await tx.wait();
                toast.success("Session type created successfully");
                onClose();
                onCreated();
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
                        <Select {...field} id="durationInSlot">
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
                        <NumberInput defaultValue={14} min={1} className="flex-1 mr-2">
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
                        <NumberInput min={1} defaultValue={0} className="flex-1 mr-2">
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
                        <Switch {...field} id="validateFollow" />
                      </FormControl>
                    )}
                  </Field>

                  <div className="my-2 text-right">
                    <Button
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                      type="submit"
                      colorScheme="green"
                      rounded={0}
                    >
                      Continue
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

export interface ISessionTypeCallData {
  title: string;
  description: string;
  durationInSlot: number;
  availabilityId: number;
  openBookingDeltaDays: number;
  recipient: string;
  token: string;
  amount: string;
  locked: boolean;
  validateFollow: boolean;
}

export interface ISessionTypeReturnData {
  title: string;
  description: string;
  durationInSlot: number;
  availabilityId: number;
  openBookingDeltaDays: number;
  recipient: string;
  token: string;
  amount: BigNumber;
  locked: boolean;
  validateFollow: boolean;
}
