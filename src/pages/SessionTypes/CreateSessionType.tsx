import { Button } from "@chakra-ui/button";
import { Icon } from "@chakra-ui/icon";
import { useDisclosure } from "@chakra-ui/hooks";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/modal";
import { PlusIcon } from "@heroicons/react/solid";

import {
	FormControl,
	FormLabel,
	FormErrorMessage,
	FormHelperText,
	Input,
} from '@chakra-ui/react'

export default function CreateSessionType() {

	// const createMutation = trpc.useMutation("viewer.availability.schedule.create", {
	// 	onSuccess: async ({ schedule }: any) => {
	// 		await router.push("/availability/" + schedule.id);
	// 		toast.success("Schedule created successfully");
	// 	},
	// 	onError: (err: any) => {
	// 		toast.error("Schedule creation failed");
	// 	},
	// });
	const create = (values: any) => {

	}
	const creating = false
	const { isOpen, onOpen, onClose } = useDisclosure()

	return (<>
		<Button leftIcon={<Icon as={PlusIcon} />} colorScheme={"green"} onClick={onOpen}>New Schedule</Button>

		<Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add a new session type</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<div>
						<p className="text-sm text-gray-500">Create a new session type for people to book times with.</p>
						<FormControl>
							<FormLabel htmlFor='title'></FormLabel>
							<Input id='name' />
							<FormHelperText>We'll never share your email.</FormHelperText>
						</FormControl>
					</div>
				</ModalBody>

				<ModalFooter>
					<Button colorScheme='green' mr={3} onClick={onClose}>
						Create
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	</>)
}
