import sessionsABI from "@/web3/abis/sessions.json";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Icon } from "@chakra-ui/icon";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import {
	FormControl,
	FormLabel, Input, NumberDecrementStepper,
	NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select,
	Textarea
} from '@chakra-ui/react';
import { PlusIcon } from "@heroicons/react/solid";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { Field, Form, Formik } from 'formik';
import { range } from "lodash";
import toast from "react-hot-toast";


export default function CreateSessionType({ onCreated }: { onCreated: () => void }) {

	const { isOpen, onOpen, onClose } = useDisclosure()
	const durationInSlotOptions = range(1, 20)
	const { chainId, account, library } = useWeb3React()
	const profileId = "1243"
	return (<>
		<Button leftIcon={<Icon as={PlusIcon} />} colorScheme={"green"} rounded={0} onClick={onOpen}>New Schedule</Button>

		<Modal blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} >
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					Add a new session type
					<p className="text-sm text-gray-500">Create a new session type for people to book times with.</p>
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<Formik
						initialValues={{ title: '', description: '', durationInSlot: 3, openBookingDeltaDays: 10 }}
						validate={values => { }}
						onSubmit={async (values, { setSubmitting }) => {
							const signer = await library.getSigner()
							const sessionsContract = new ethers.Contract(
								"0x54f6Fb3E799ed5A1FedeeF26E647801911BcB36d",
								sessionsABI,
								signer
							);
							if (!account) return
							const calldata: [string, ISessionTypeData] = [
								profileId,
								{
									...values,
									recipient: account,
									availabilityId: 0,
									token: "0x0000000000000000000000000000000000000000",
									amount: "1000000000000000",
									locked: false,
									validateFollow: false,
								},
							];
							const tx = await sessionsContract.createSessionType(...calldata);
							await tx.wait();
							toast.success("Schedule created successfully");
							onClose();
							onCreated();
							setSubmitting(false);
						}}>
						{({ isSubmitting }) => (
							<Form>
								<Field name='title'>
									{({ field, form }: any) => (
										<FormControl className="mb-5">
											<FormLabel htmlFor='title'>Title</FormLabel>
											<Input {...field} id='title' placeholder="Quick chat" />
										</FormControl>)}
								</Field>
								<Field name='description'>
									{({ field, form }: any) => (
										<FormControl className="mb-5">
											<FormLabel htmlFor='description'>Description</FormLabel>
											<Textarea{...field} id='description' placeholder="A quick video meeting." />
										</FormControl>)}
								</Field>
								<Field name='minute'>
									{({ field, form }: any) => (
										<FormControl className="mb-5">
											<FormLabel htmlFor='minute'>Length</FormLabel>
											<Select {...field} id='minute'>
												{durationInSlotOptions.map(d => <option key={d} value={d}>{d * 6} minutes</option>)}
											</Select>
										</FormControl>)}
								</Field>
								<Field name='openBookingDeltaDays'>
									{({ field, form }: any) => (
										<FormControl className="mb-5">
											<FormLabel htmlFor='openBookingDeltaDays'>Invitees can schedule in (Days)</FormLabel>
											<NumberInput min={1} className="flex-1 mr-2">
												<NumberInputField {...field} id='openBookingDeltaDays' />
												<NumberInputStepper>
													<NumberIncrementStepper />
													<NumberDecrementStepper />
												</NumberInputStepper>
											</NumberInput>
										</FormControl>)}
								</Field>
								<div className="my-2 text-right">
									<Button isLoading={isSubmitting} disabled={isSubmitting} type="submit" colorScheme='green' rounded={0}>
										Continue
									</Button>
								</div>
							</Form>)}
					</Formik>
				</ModalBody>

			</ModalContent>
		</Modal>
	</>)
}


export interface ISessionTypeData {
	title: string,
	description: string,
	durationInSlot: number,
	availabilityId: number,
	openBookingDeltaDays: number,
	recipient: string,
	token: string,
	amount: string,
	locked: boolean,
	validateFollow: boolean
}