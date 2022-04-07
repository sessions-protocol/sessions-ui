import sessionsABI from "@/web3/abis/sessions.json";
import { Button } from "@chakra-ui/button";
import { Box, Spinner } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { add, startOfToday } from "date-fns";
import { BigNumber, ethers } from "ethers";
import { padStart, range } from "lodash";
import {
  forwardRef,
  ReactElement,
  Ref,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import toast from "react-hot-toast";
import { sessionApi } from "../../api/SessionApi";
import DashboardLayout from "../../layout/DashboardLayout";
import { useProfileState } from "../../context/ProfileContext";
import { SESSIONS_CONTRACT } from "../../web3/contracts";
import CreateAvailability from "./CreateAvailability";
import Schedule, { DEFAULT_SCHEDULE } from "./Schedule";
import { useColor } from "../../hooks/useColorMode";
import classNames from "classnames";

export default function AvailabilitiesPage() {
  const [{ profile }] = useProfileState();
  const profileId = profile?.id;
  const [list, setList] = useState<
    {
      id: string;
      name: string;
      availableSlots: BigNumber[];
      archived: boolean;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const fetchList = async () => {
    if (!profileId) return;
    setLoading(true);
    const data = await sessionApi.getAvailabilitiesByProfile(profileId);
    setList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchList();
  }, []);
  const { strongBg } = useColor();
  if (!profile) return null;
  return (
    <DashboardLayout
      heading="Availability"
      subtitle="Configure times when you are available for bookings."
      CTA={<CreateAvailability onCreated={fetchList} />}
    >
      <Box bg={strongBg} className="border">
        {loading ? (
          <div className="flex items-center justify-center p-4 cursor-pointer">
            <Spinner />
          </div>
        ) : list.length > 0 ? (
          list.map((item, i) => (
            <div
              key={item.id}
              className={classNames(
                "py-4 px-5 cursor-pointer",
                i < list.length - 1 && "border-b"
              )}
            >
              <Item data={item} onUpdated={fetchList} />
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center border-b p-4 cursor-pointer">
            <p>No availability created yet.</p>
          </div>
        )}
      </Box>
    </DashboardLayout>
  );
}

function Item({
  onUpdated,
  data,
}: {
  onUpdated: () => void;
  data: {
    id: string;
    name: string;
    availableSlots: BigNumber[];
    archived: boolean;
  };
}) {
  const [expand, setExpand] = useState(false);
  const schedule: Schedule = useMemo(() => {
    const utc0Slots = data.availableSlots.map((slotBigNum) =>
      padStart(slotBigNum.toBigInt().toString(2), 240, "0")
    );
    return moveSlots(utc0Slots, (-1 * new Date().getTimezoneOffset()) / 10).map(
      (slot) =>
        [...slot.matchAll(/1+/g)].map((s) => {
          const start = s.index!;
          const len = s[0].length;
          return {
            start: add(startOfToday(), { minutes: start * 6 }),
            end: add(startOfToday(), { minutes: (start + len - 1) * 6 }),
          };
        })
    );
  }, [data]);

  return (
    <>
      {!expand ? (
        <div onClick={() => setExpand(true)}>{data.name}</div>
      ) : (
        <AvailabilityForm
          onUpdated={onUpdated}
          onClose={() => setExpand(false)}
          data={data}
          schedule={schedule}
        />
      )}
    </>
  );
}

function AvailabilityForm(props: {
  onClose: () => void;
  onUpdated: () => void;
  data: {
    id: string;
    name: string;
    availableSlots: BigNumber[];
    archived: boolean;
  };
  schedule: Schedule;
}) {
  const v = {
    name: props.data.name,
    schedule: props.schedule || DEFAULT_SCHEDULE,
  };
  const form = useForm({
    defaultValues: v,
  });
  // hack
  useEffect(() => {
    form.reset(v);
  }, []);
  const { library } = useWeb3React();
  return (
    <Form
      form={form}
      handleSubmit={async ({ name, schedule }) => {
        let slots = schedule.map((s) =>
          s
            .map(({ start, end }) =>
              range(dateToSlotIndex(start), dateToSlotIndex(end) + 1)
            )
            .flat()
            .reduce((r, i) => {
              r[i] = "1";
              return r;
            }, "0".repeat(240).split(""))
            .join("")
        );
        slots = moveSlots(slots, new Date().getTimezoneOffset() / 10);
        const signer = await library.getSigner();
        const sessionsContract = new ethers.Contract(
          SESSIONS_CONTRACT,
          sessionsABI,
          signer
        );

        try {
          const calldata: [string, string, BigInt[], boolean] = [
            props.data.id,
            name,
            slots.map((slot) => bin2dec(slot)),
            props.data.archived,
          ];
          const tx = await sessionsContract.updateAvailability(...calldata);
          await tx.wait();
          toast.success("Update successfully");
          props.onUpdated();
        } catch (e) {
          console.log(e);
        }
      }}
      className="grid grid-cols-3 gap-2"
    >
      <div className="col-span-3 space-y-2 lg:col-span-2">
        <div className="divide-y">
          <input
            className="w-full bg-transparent py-2 px-2 border-b border-dashed"
            {...form.register("name")}
          />
        </div>
        <div className="divide-y">
          <Schedule name="schedule" />
        </div>
        <div className="space-x-2 text-right">
          <Button
            variant="outline"
            colorScheme="blue"
            onClick={props.onClose}
            rounded={2}
            size="sm"
            width={100}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            colorScheme="blue"
            rounded={2}
            size="sm"
            width={100}
            isLoading={form.formState.isSubmitting}
            disabled={form.formState.isSubmitting}
          >
            Save
          </Button>
        </div>
      </div>
    </Form>
  );
}

type FormProps<T> = {
  form: UseFormReturn<T>;
  handleSubmit: SubmitHandler<T>;
} & Omit<JSX.IntrinsicElements["form"], "onSubmit">;

const PlainForm = <T extends FieldValues>(
  props: FormProps<T>,
  ref: Ref<HTMLFormElement>
) => {
  const { form, handleSubmit, ...passThrough } = props;

  return (
    <FormProvider {...form}>
      <form
        ref={ref}
        onSubmit={(event) => {
          form
            .handleSubmit(handleSubmit)(event)
            .catch((err) => {});
        }}
        {...passThrough}
      >
        {props.children}
      </form>
    </FormProvider>
  );
};

const Form = forwardRef(PlainForm) as <T extends FieldValues>(
  p: FormProps<T> & { ref?: Ref<HTMLFormElement> }
) => ReactElement;
const dateToSlotIndex = (d: Date) =>
  d.getHours() * 10 + Math.floor(d.getMinutes() / 6);

const moveSlots = (slots: string[], offset: number) => {
  const chain = slots.join("");
  offset = offset > 0 ? offset : chain.length + offset;
  return chain
    .repeat(2)
    .slice(offset, offset + chain.length)
    .match(/.{1,240}/g)!;
};
function bin2dec(binStr: string) {
  const lastIndex = binStr.length - 1;

  return Array.from(binStr).reduceRight(
    (total, currValue, index) =>
      currValue === "1"
        ? total + BigInt(2) ** BigInt(lastIndex - index)
        : total,
    BigInt(0)
  );
}
