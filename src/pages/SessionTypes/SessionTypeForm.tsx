import erc20ABI from "@/web3/abis/erc20.json";
import { Button } from "@chakra-ui/button";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightAddon,
  NumberInput,
  NumberInputField,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { ethers, utils } from "ethers";
import { Field, Form, Formik } from "formik";
import { omit, range } from "lodash";
import { useColor } from "../../hooks/useColorMode";
import { ISessionTypeCallData } from "./CreateSessionType";

export interface ISessionTypeForm {
  title: string;
  description: string;
  durationInSlot: number;
  // availabilityId: number;
  openBookingDeltaDays: number;
  token: string;
  price: number;
}

const formDataToSessionType = async (
  formData: ISessionTypeForm,
  account: string,
  library: any
): Promise<ISessionTypeCallData> => {
  const signer = await library.getSigner();
  const tokenPrice = {
    symbol: "MATIC",
    amount: +formData.price,
    decimals: 18,
  };
  if (formData.token != "0x0000000000000000000000000000000000000000") {
    const erc20Contract = new ethers.Contract(formData.token, erc20ABI, signer);
    tokenPrice.decimals = await erc20Contract.decimals();
    tokenPrice.symbol = await erc20Contract.symbol();
  }
  return {
    ...omit(formData, "price"),
    amount: utils
      .parseUnits(`${formData.price}`, tokenPrice.decimals)
      .toString(),
    recipient: account,
    availabilityId: 0,
    locked: false,
    validateFollow: false,
  };
};
export default function SessionTypeForm({
  onSubmit,
  value,
}: {
  onSubmit: (form: ISessionTypeCallData) => void;
  value?: ISessionTypeForm;
}) {
  const emptyInitialValues = {
    title: "",
    description: "",
    durationInSlot: 5,
    openBookingDeltaDays: 14,
    token: "0x0000000000000000000000000000000000000000",
    price: 0,
  };

  const { bd } = useColor();
  const durationInSlotOptions = range(1, 241);
  const payTokenOptions = [
    { name: "MATIC", value: "0x0000000000000000000000000000000000000000" },
    { name: "DAI", value: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F" },
    { name: "LIN", value: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB" },
  ];
  const { account, library } = useWeb3React();
	const initialValues = value ?? emptyInitialValues
  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => {}}
      onSubmit={async (formData, { setSubmitting }) => {
        if (!account) return;
        const sessionType = await formDataToSessionType(
          formData,
          account,
          library
        );
        await onSubmit(sessionType);
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
                  <InputGroup>
                    <Select {...field} borderRadius={2} id="durationInSlot">
                      {durationInSlotOptions.map((d) => (
                        <option key={d} value={d}>
                          {d * 6}
                        </option>
                      ))}
                    </Select>
                    <InputRightAddon
                      borderColor={bd}
                      bg="none"
                      fontSize={13}
                      children="Minutes"
                    />
                  </InputGroup>
                </FormControl>
              )}
            </Field>
            <Field name="openBookingDeltaDays">
              {({ field }: any) => (
                <FormControl className="mb-4">
                  <FormLabel marginBottom={1} htmlFor="openBookingDeltaDays">
                    Only booked in
                  </FormLabel>
                  <InputGroup>
                    <NumberInput defaultValue={initialValues.openBookingDeltaDays} min={1} className="w-full">
                      <NumberInputField
                        borderRadius={2}
                        {...field}
                        id="openBookingDeltaDays"
                      />
                    </NumberInput>
                    <InputRightAddon
                      bg="none"
                      fontSize={13}
                      borderColor={bd}
                      children="Days"
                    />
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
                  <NumberInput className="w-full" defaultValue={initialValues.price}>
                    <NumberInputField borderRadius={2} {...field} id="price" />
                  </NumberInput>
                  <InputRightAddon
                    p={0}
                    bg="none"
                    borderColor={bd}
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
          <div className="mb-5 mt-8 text-center">
            <Button
              isFullWidth
              isLoading={isSubmitting}
              disabled={isSubmitting}
              type="submit"
              colorScheme="blue"
              borderRadius={2}
            >
              { value ? 'Update' : 'Create' } Session Type
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
