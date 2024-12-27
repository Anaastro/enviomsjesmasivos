import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from "@nextui-org/react";

interface Props {
	content: string;
	isOpen: boolean;
	onOpenChange: () => void;
	setIsRegister: (value: boolean) => void;
	title: string;
}

export default function ModalRegister({
	content,
	isOpen,
	onOpenChange,
	setIsRegister,
	title,
}: Props) {
	return (
		<>
			<Modal
				backdrop="opaque"
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				motionProps={{
					variants: {
						enter: {
							y: 0,
							opacity: 1,
							transition: {
								duration: 0.3,
								ease: "easeOut",
							},
						},
						exit: {
							y: -20,
							opacity: 0,
							transition: {
								duration: 0.2,
								ease: "easeIn",
							},
						},
					},
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1 ">{title}</ModalHeader>
							<ModalBody>{content}</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Cerrar
								</Button>
								<Button
									color="primary"
									onPress={() => {
										onClose();
										setIsRegister(false);
									}}
								>
									Iniciar Sesión
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
