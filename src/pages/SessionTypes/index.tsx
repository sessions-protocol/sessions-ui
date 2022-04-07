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
  Text,
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
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { ExternalLinkIcon, ClockIcon } from "@heroicons/react/solid";
import { useWeb3React } from "@web3-react/core";
import { useWeb3ClientStateValue } from "@/context/Web3ClientState";
import { ethers, utils } from "ethers";
import { Field, Form, Formik } from "formik";
import { omit, range } from "lodash";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { sessionApi } from "../../api/SessionApi";
import { Icon } from "@chakra-ui/icon";

import DashboardLayout from "../../layout/DashboardLayout";
import { useProfileState } from "../../context/ProfileContext";
import CreateSessionType, {
  ISessionTypeCallData,
  ISessionTypeReturnData,
} from "./CreateSessionType";
import { useColor } from "../../hooks/useColorMode";
import SessionTypeForm, { ISessionTypeForm } from "./SessionTypeForm";

export default function SessionTypesPage() {
  const { chainId, account } = useWeb3React();
  const web3ClientState = useWeb3ClientStateValue();
  const [{ profile }] = useProfileState();
  const profileId = profile?.id;
  const [sessionTypes, setSessionTypes] = useState<
    ({ id: string } & ISessionTypeReturnData)[]
  >([]);
  const [loading, setLoading] = useState(false);
  const fetchList = async (profileId: string) => {
    if (!profileId) return;
    setLoading(true);
    const sessionTypesByProfile = await sessionApi.getSessionTypesByProfileId(
      profileId
    );
    setSessionTypes(sessionTypesByProfile);
    setLoading(false);
  };
  const itemBg = useColorModeValue("white", "whiteAlpha.50");

  useEffect(() => {
    fetchList(profileId!);
  }, [profileId, account]);

  if (!chainId || !account || !profile) {
    // goto profile list page if not connected to wallet after EagerConnectTried or no selected profile
    if (web3ClientState.isEagerConnectTried) {
      return null;
    }
    return null;
  }
  return (
    <DashboardLayout
      heading="Session Types"
      subtitle="Create sessions to share for people to book on your calendar."
      CTA={
        <CreateSessionType
          onCreated={() => profileId && fetchList(profileId)}
        />
      }
    >
      <Box bg={itemBg} className="border border-b-0">
        {loading ? (
          <div className="flex items-center justify-center border-b  p-4 cursor-pointer">
            <Spinner />
          </div>
        ) : sessionTypes.length > 0 ? (
          sessionTypes.map((s) => (
            <SessionTypeItem
              key={s.id}
              sessionType={s}
              onUpdated={() => profileId && fetchList(profileId.toString())}
            />
          ))
        ) : (
          <div className="flex items-center justify-center border-b p-4 cursor-pointer">
            <p>No session types created yet.</p>
          </div>
        )}
      </Box>
    </DashboardLayout>
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

  const getFormData: () => Promise<ISessionTypeForm> = useMemo(() => {
    return async () => {
      const tokenPrice = {
        symbol: "MATIC",
        amount: sessionType.amount,
        decimals: 18,
      };
      if (sessionType.token != "0x0000000000000000000000000000000000000000") {
        const signer = await library.getSigner();
        const erc20Contract = new ethers.Contract(
          sessionType.token,
          erc20ABI,
          signer
        );

        tokenPrice.decimals = await erc20Contract.decimals();
        tokenPrice.symbol = await erc20Contract.symbol();
      }

      console.log(
        "utils.formatUnits(sessionType.amount.toString(), tokenPrice.decimals)",
        utils.formatUnits(sessionType.amount.toString(), tokenPrice.decimals)
      );

      return {
        ...omit(sessionType, "amount"),
        price: +utils.formatUnits(
          sessionType.amount.toString(),
          tokenPrice.decimals
        ),
        symbol: tokenPrice.symbol,
      };
    };
  }, [library, sessionType]);

  const [formData, setFormData] = useState<ISessionTypeForm>();

  useEffect(() => {
    getFormData().then((data) => {
      setFormData(data);
    });
  }, [getFormData]);
  const { strongColor, secondaryColor } = useColor();
  const onUpdate = async (values: ISessionTypeCallData) => {
    await sessionApi.updateSessionType(sessionType.id, values);
    toast.success("Session type update successfully");
    onClose();
    onUpdated();
  };

  return (
    <>
      <div
        className="flex flex-row border-b p-4 cursor-pointer"
        onClick={onOpen}
      >
        <div className="flex-grow">
          <Text color={strongColor}>{sessionType.title}</Text>
          <Box color={secondaryColor} className="text-sm">
            <div className="">{sessionType.description}</div>
            <div className="mt-2 flex items-center">
              <ClockIcon className="mr-1" width={14} />
              {sessionType.durationInSlot * 6} mins
            </div>
          </Box>
        </div>
        <div
          className="flex justify-center items-center"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Link
            to={`/session/${sessionType.id}/available`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="sm"
              colorScheme={"dark"}
              variant="outline"
              leftIcon={<Icon as={ExternalLinkIcon} />}
            >
              Open Book Page
            </Button>
          </Link>
        </div>
      </div>

      <Modal
        size="lg"
        blockScrollOnMount={false}
        closeOnOverlayClick={false}
        colorScheme={"dark"}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Session Type</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {formData && <SessionTypeForm value={formData} onSubmit={onUpdate} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
