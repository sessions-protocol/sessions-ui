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
import { ClockIcon } from "@heroicons/react/solid";
import { useWeb3React } from "@web3-react/core";
import { ethers, utils } from "ethers";
import { Field, Form, Formik } from "formik";
import { omit, range } from "lodash";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { sessionApi } from "../../api/SessionApi";
import Shell from "../../components/Shell";
import { useProfileState } from "../../context/ProfileContext";
import CreateAvailability from "./CreateAvailability";

export default function AvailabilitiesPage() {
  const [{ profile }] = useProfileState();
  const profileId = profile?.id;
  const [list, setList] = useState<
    ({ id: string } & { name: string, availableSlots: string[] })[]
  >([]);
  const [loading, setLoading] = useState(false);
  const fetchList = async () => {
    setLoading(true);
    const data = await sessionApi.getAvailabilitiesByProfile(
      profileId!
    );
    setList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
  }, []);
  if (!profile) return null;
  return (
    <Shell
      heading="Availability"
      subtitle="Configure times when you are available for bookings."
      CTA={<CreateAvailability onCreated={fetchList} />}
    >
      <div className="bg-white border border-gray-200">
        {loading ? (
          <Spinner />
        ) : (
          list.map((item) => (
            // <SessionTypeItem key={s.id} sessionType={s} onUpdated={fetchList} />
            <Item data={item} key={item.id}/>
          ))
        )}
      </div>
    </Shell>
  );
}

function Item ({ data }: { data: { id: string, name: string, availableSlots: string[] } }) {
  const [open, setOpen] = useState(false)
  return <div onClick={() => setOpen(open => !open)} className="border-b border-gray-200 text-gray-700 p-4 cursor-pointer"
  >
    <div>{data.name}</div>
    <div className={!open ? 'hidden': ''}>
    </div>
  </div>
}
