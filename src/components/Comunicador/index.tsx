import React, { useState, useContext } from "react";
import ExcelUploader from "@/components/Comunicador/ExcelUploader";
import PhonesList from "@/components/Comunicador/PhonesList";
import SendStatus from "@/components/Comunicador/SendStatus";
import ActivityLog from "@/components/Comunicador/ActivityLog";
import SentMessagesLog from "../SentMessagesLog";

import { auth, database } from "@/lib/utils/firebase";
import { useMessageSender } from "./MessageSender";
import UnifiedSender from "./UnifiedSender";

import "react-phone-number-input/style.css";
import { contactService } from "@/services/contactService";
import ModalContact from "./ModalContact";
import Chats from "./Chats";
import { UserContext } from "@/lib/context/UserContext";
import LoaderMessages from "./LoaderMessages";
import { IsSentContext } from "@/lib/context/IsSentContext";
import InstanceStatus from "./InstanceStatus";
import NavbarCrm from "./NavbarCrm";
import RangeSelector from "./RangeSelector";
import { IndexSelector } from "./IndexSelector";
import { ActionButtons } from "./ActionButtons";
import { usePhoneManagement } from "@/lib/hooks/usePhoneManagement";
import { useModalControler } from "@/lib/hooks/useModalControler";
import { useSentMessages } from "@/lib/hooks/useSentMessages";
import { useRangeSelector } from "@/lib/hooks/useRangeSelector";
import { MessagesSent } from "./MessagesSent";
import { Auth } from "firebase/auth";
import SentMessagesCounter from "@/lib/SentMessagesCounter";

interface Props {
	name: string;
	rol: string;
	signOut: () => void;
}

const Comunicador = ({ name, rol, signOut }: Props) => {
	const { showModal, openModal, closeModal } = useModalControler();
	const { phones, setPhones, selectedPhones, setSelectedPhones, log, setLog } =
		usePhoneManagement();
	const {
		range,
		startIndex,
		endIndex,
		handleRangeChange,
		handleStartIndexChange,
		handleEndIndexChange,
		handleSelectRange,
	} = useRangeSelector(phones, setSelectedPhones);
	const { setSentMessages, searchQuery, setSearchQuery, filteredSentMessages } =
		useSentMessages();

	const [statusMessages, setStatusMessages] = useState<string[]>([]);
	const [colorMap, setColorMap] = useState<{ [key: string]: string }>({});
	const [isSending, setIsSending] = useState<boolean>(false);
	const { isSent, setIsSent } = useContext(IsSentContext);

	const [loaderMessage, setLoaderMessage] = useState<string>("");
	const { instanceId } = useContext(UserContext);
	const [uid, setUid] = useState<string>(auth.currentUser?.uid || "");

	const { handleSend, messageId, totalMessages } = useMessageSender({
		selectedPhones,
		setSelectedPhones,
		setStatusMessages,
		setLog,
		setSentMessages,
		setColorMap,
		colorMap,
		setIsSending,
		setIsSent,
		setLoaderMessage,
	});

	const handlePhoneSelect = (phone: string) => {
		setSelectedPhones((prevSelected) =>
			prevSelected.includes(phone)
				? prevSelected.filter((p) => p !== phone)
				: [...prevSelected, phone]
		);
	};

	const handleDelete = () => {
		selectedPhones.forEach(async (phoneId) => {
			contactService.deleteContact(auth.currentUser!.uid, phoneId);
		});

		setPhones((prevPhones) =>
			prevPhones.filter((phone) => !selectedPhones.includes(phone.id))
		);
		setSelectedPhones([]);
	};

	const handleSearch = (query: string) => {
		setSearchQuery(query);
	};

	return (
		<div>
			{isSending && (
				<LoaderMessages
					instanceId={instanceId}
					userId={uid}
					messageId={messageId}
					totalMessages={totalMessages}
					setIsSending={setIsSending}
				/>
			)}

			<NavbarCrm name={name} rol={rol} signOut={signOut} />

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-8 bg-black min-h-screen ">
				<div className="space-y-6">
					<ExcelUploader setPhones={setPhones} setLog={setLog} />
					<PhonesList
						phones={phones.slice(0, range)}
						onPhoneSelect={handlePhoneSelect}
						selectedPhones={selectedPhones}
						colorMap={colorMap}
					/>
					<ActionButtons openModal={openModal} handleDelete={handleDelete} />

					{showModal && (
						<ModalContact setPhones={setPhones} setShowModal={closeModal} />
					)}

					<MessagesSent />
				</div>
				<div className="space-y-6 relative">
					<UnifiedSender phones={selectedPhones} handleSend={handleSend} />
					{/* <RangeSelector
						range={range}
						handleRangeChange={handleRangeChange}
						phones={phones}
					/> */}

					<IndexSelector
						phones={phones}
						startIndex={startIndex}
						handleStartIndexChange={handleStartIndexChange}
						endIndex={endIndex}
						handleEndIndexChange={handleEndIndexChange}
						handleSelectRange={handleSelectRange}
					/>

					<SentMessagesCounter />
				</div>

				<div className="flex flex-col gap-4">
					<Chats />
					<InstanceStatus />
				</div>
			</div>
		</div>
	);
};

export default Comunicador;
