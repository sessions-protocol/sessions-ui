import erc20ABI from "@/web3/abis/erc20.json";
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
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/solid";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers, utils } from "ethers";
import { Field, Form, Formik } from "formik";
import { omit, range } from "lodash";
import toast from "react-hot-toast";
import { useProfileValue } from "../../context/ProfileContext";
{
  /* <RadioGroup

>
<Stack spacing={5} direction="row">
  <Radio
    {...field}
    colorScheme="blue"
    value="0x0000000000000000000000000000000000000000"
  >
    MATIC
  </Radio>
  <Radio
    {...field}
    colorScheme="yellow"
    value="0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F"
    title=""
  >
    DAI
  </Radio>
  <Radio
    {...field}
    colorScheme="green"
    value=""
    title="0x326C977E6efc84E512bB9C30f76E30c160eD06FB"
  >
    LINK
  </Radio>
</Stack>
</RadioGroup> */
}
export default function CreateSessionType({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const durationInSlotOptions = range(1, 20);
  const { account, library } = useWeb3React();
  const { profile } = useProfileValue();
  const profileId = profile?.id;
  const payTokenOptions = [
    { name: "MATIC", value: "0x0000000000000000000000000000000000000000" },
    { name: "DAI", value: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F" },
    { name: "LIN", value: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB" },
  ];
  return (
    <>
      <Button
        leftIcon={<Icon as={PlusIcon} />}
        colorScheme={"blue"}
        onClick={onOpen}
      >
        New session type
      </Button>

      <Modal
        size="xl"
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
                durationInSlot: 5,
                openBookingDeltaDays: 14,
                token: "0x0000000000000000000000000000000000000000",
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

                const tokenPrice = {
                  symbol: "MATIC",
                  amount: values.price,
                  decimals: 18,
                };
                if (
                  values.token != "0x0000000000000000000000000000000000000000"
                ) {
                  const erc20Contract = new ethers.Contract(
                    values.token,
                    erc20ABI,
                    signer
                  );

                  tokenPrice.decimals = await erc20Contract.decimals();
                  tokenPrice.symbol = await erc20Contract.symbol();
                }
                if (!account || !profileId) return;
                console.log(
                  `Amount: `,
                  utils.parseEther(`${values.price}`).toString()
                );

                const calldata: [string, ISessionTypeCallData] = [
                  profileId,
                  {
                    ...omit(values, "price"),
                    amount: utils
                      .parseUnits(`${values.price}`, tokenPrice.decimals)
                      .toString(),
                    recipient: account,
                    availabilityId: 0,
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
                    {({ field }: any) => (
                      <FormControl className="mb-4">
                        <FormLabel marginBottom={1} htmlFor="title">
                          Title
                        </FormLabel>
                        <Input
                          {...field}
                          id="title"
                          borderRadius={2}
                          placeholder="Quick chat"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="description">
                    {({ field }: any) => (
                      <FormControl className="mb-4">
                        <FormLabel marginBottom={1} htmlFor="description">
                          Description
                        </FormLabel>
                        <Textarea
                          {...field}
                          id="description"
                          borderRadius={2}
                          placeholder="A quick video meeting."
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Flex gap={5}>

                  <Field name="durationInSlot">
                    {({ field }: any) => (
                      <FormControl className="mb-4">
                        <FormLabel marginBottom={1} htmlFor="durationInSlot">
                          Length
                        </FormLabel>
                        <Select {...field} borderRadius={2} id="durationInSlot">
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
                    {({ field }: any) => (
                      <FormControl className="mb-4">
                        <FormLabel
                          marginBottom={1}
                          htmlFor="openBookingDeltaDays"
                        >
                          Only booked in
                        </FormLabel>
                        <InputGroup>
                          <NumberInput
                            defaultValue={14}
                            min={1}
                            className="w-full"
                          >
                            <NumberInputField
                              borderRadius={2}
                              {...field}
                              id="openBookingDeltaDays"
                            />
                          </NumberInput>
                          <InputRightAddon bg="transparent" children="days" />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  </Flex>

                  <Field name="price">
                    {({ field }: any) => (
                      <FormControl className="mb-4">
                        <FormLabel marginBottom={1} htmlFor="price">
                          Price
                        </FormLabel>
                        <InputGroup className="w-full">
                          <NumberInput className="w-full" defaultValue={0}>
                            <NumberInputField
                              borderRadius={2}
                              {...field}
                              id="price"
                            />
                          </NumberInput>
                          <InputRightAddon
                          p={0}
                            bg="transparent"
                            children={
                              <Field name="token">
                                {({ field }: any) => (
                                  <Select
                                    {...field}
                                    border="none"
                                    id="token"
                                    defaultValue="0x0000000000000000000000000000000000000000"
                                    borderRadius={2}
                                  >
                                    {payTokenOptions.map((d) => (
                                      <option key={d.value} value={d.value}>
                                        {d.name}
                                      </option>
                                    ))}
                                  </Select>
                                )}
                              </Field>
                            }
                          />
                        </InputGroup>
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
                      Create Session Type
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
