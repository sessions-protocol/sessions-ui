import { Button } from "@chakra-ui/button";
import {
  Spinner
} from "@chakra-ui/react";
import { forwardRef, ReactElement, Ref, useEffect, useState } from "react";
import { FieldValues, FormProvider, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { sessionApi } from "../../api/SessionApi";
import Shell from "../../components/Shell";
import { useProfileState } from "../../context/ProfileContext";
import CreateAvailability from "./CreateAvailability";
import Schedule, { DEFAULT_SCHEDULE } from "./Schedule";

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
      <div className="bg-white border border-gray-200 border-b-0">
        {loading ? (
           <div
           className="flex items-center justify-center border-b border-gray-200 text-gray-700 p-4 cursor-pointer"
           >
             <Spinner />
           </div>
        ) : (
          list.length > 0 ? (
            list.map((item) => (
              <Item data={item} key={item.id}/>
            ))
          ) : (
            <div className="flex items-center justify-center border-b border-gray-200 text-gray-700 p-4 cursor-pointer">
              <p>No availability created yet.</p>
            </div>
          )
        )}
      </div>
    </Shell>
  );
}

function Item({ data }: { data: { id: string, name: string, availableSlots: string[] } }) {
  return <div className="border-b border-gray-200 text-gray-700 p-4 cursor-pointer"
  >
    <div>{data.name}</div>
    <AvailabilityForm />
  </div>
}

type FormProps<T> = { form: UseFormReturn<T>; handleSubmit: SubmitHandler<T> } & Omit<
  JSX.IntrinsicElements["form"],
  "onSubmit"
>;

const PlainForm = <T extends FieldValues>(props: FormProps<T>, ref: Ref<HTMLFormElement>) => {
  const { form, handleSubmit, ...passThrough } = props;

  return (
    <FormProvider {...form}>
      <form
        ref={ref}
        onSubmit={(event) => {
          form
            .handleSubmit(handleSubmit)(event)
            .catch((err) => {
            });
        }}
        {...passThrough}>
        {props.children}
      </form>
    </FormProvider>
  );
};

const Form = forwardRef(PlainForm) as <T extends FieldValues>(
  p: FormProps<T> & { ref?: Ref<HTMLFormElement> }
) => ReactElement

function AvailabilityForm(props: any) {
  const form = useForm({
    defaultValues: {
      schedule: props.availability || DEFAULT_SCHEDULE,
    },
  });
  return <Form
    form={form}
    handleSubmit={async (values) => {
      console.log(values)
    }}
    className="grid grid-cols-3 gap-2">
    <div className="col-span-3 space-y-2 lg:col-span-2">
      <div className="divide-y px-4 py-5 sm:p-6">
        <Schedule name="schedule" />
      </div>
      <div className="space-x-2 text-right">
        <Button type="submit">Save</Button>
      </div>
    </div>
  </Form>
}