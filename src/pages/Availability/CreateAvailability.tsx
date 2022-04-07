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
  ModalOverlay
} from "@chakra-ui/modal";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/solid";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { Field, Form, Formik } from "formik";
import toast from "react-hot-toast";
import { useProfileState } from "../../context/ProfileContext";

export default function CreateAvailability({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { account, library } = useWeb3React();
  const [{ profile }] = useProfileState();
  const profileId = profile?.id;
  return (
    <>
      <Button
        leftIcon={<Icon as={PlusIcon} />}
        colorScheme={"blue"}
        rounded={0}
        onClick={onOpen}
      >
        New schedule
      </Button>

      <Modal
        blockScrollOnMount={false}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a new schedule</ModalHeader>
          <ModalCloseButton borderRadius={0} />
          <ModalBody>
            <Formik
              initialValues={{
                title: "",
                schedules: ["0", "0", "0", "0", "0", "0", "0"],
              }}
              onSubmit={async (values, { setSubmitting }) => {
                const signer = await library.getSigner();
                const sessionsContract = new ethers.Contract(
                  SESSIONS_CONTRACT,
                  sessionsABI,
                  signer
                );
                if (!account || !profileId) return;
                const calldata: [string, string, string[]] = [
                  profileId,
                  values.title,
                  values.schedules,
                ];
                const tx = await sessionsContract.createAvailability(
                  ...calldata
                );
                await tx.wait();
                toast.success("Schedules created successfully");
                onClose();
                onCreated();
                setSubmitting(false);
              }}
            >
              {({ isSubmitting, values }) => (
                <Form>
                  <Field name="title">
                    {({ field, form }: any) => (
                      <FormControl className="mb-4">
                        <FormLabel marginBottom={1} htmlFor="title">
                          Title
                        </FormLabel>
                        <Input
                          {...field}
                          borderRadius={2}
                          id="title"
                          placeholder="Working Hour"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <div className="mb-5 mt-8">
                    <Button
                      isFullWidth
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                      type="submit"
                      colorScheme="blue"
                      rounded={2}
                    >
                      Create Schedule
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
