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
import { Text } from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/solid";
import { BigNumber } from "ethers";
import toast from "react-hot-toast";
import { sessionApi } from "../../api/SessionApi";
import { useProfileValue } from "../../context/ProfileContext";
import { useColor } from "../../hooks/useColorMode";
import SessionTypeForm from "./SessionTypeForm";

export default function CreateSessionType({
  onCreated,
  availabilities,
}: {
  onCreated: () => void;
  availabilities: { id: string; name: string }[];
}) {
  const { secondaryColor } = useColor();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { profile } = useProfileValue();
  const profileId = profile?.id;
  const onCreate = async (values: ISessionTypeCallData) => {
    if (!profileId) return;
    await sessionApi.createSessionType(profileId, values);
    toast.success("Session type created successfully");
    onClose();
    onCreated();
  };
  return (
    <>
      <Button
        leftIcon={<Icon as={PlusIcon} />}
        colorScheme={"blue"}
        rounded={2}
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
            <Text fontSize={13} color={secondaryColor}>
              Create a new session type for people to book times with.
            </Text>
          </ModalHeader>
          <ModalCloseButton borderRadius={0} />
          <ModalBody>
            <SessionTypeForm availabilities={availabilities} onSubmit={onCreate} />
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
