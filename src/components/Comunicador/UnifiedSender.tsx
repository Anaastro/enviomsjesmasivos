import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "@/lib/context/UserContext";
import FileUpload from "./FileUpload";
import AutoResizeTextarea from "./AutoResizeTextArea";
import { Send } from "../Icons";
import { useChats } from "@/lib/hooks/useChats";
import { useUnifiedSender } from "@/lib/hooks/useUnifiedSender";

interface UnifiedSenderProps {
	phones: string[];
	handleSend: (message: string, mediaFile: File | null) => void;
}

const UnifiedSender: React.FC<UnifiedSenderProps> = ({
	phones,
	handleSend,
}) => {
	const {
		mediaPreview,
		handleMediaChange,
		onSendClick,
		message,
		setMessage,
		formKey,
	} = useUnifiedSender({
		phones,
		handleSend,
	});

	return (
		<div
			key={formKey}
			className="border p-2 md:p-4 bg-white shadow-xl rounded-lg"
		>
			<h3 className="text-lg font-semibold mb-4 text-purple-600">
				Enviar Mensaje/Media
			</h3>
			{!mediaPreview && (
				<div className="w-full border-dashed p-10 border-2 mb-4 flex justify-center items-center">
					Selecciona un archivo de imagen o audio:
				</div>
			)}

			{mediaPreview && (
				<div className="mb-4">
					<img
						src={mediaPreview}
						alt="Vista Previa"
						className="w-full h-auto rounded-lg shadow-sm"
					/>
				</div>
			)}

			<div className="flex justify-center items-center gap-2">
				<div className="flex w-full justify-center items-center rounded-lg">
					<AutoResizeTextarea message={message} setMessage={setMessage} />
					<FileUpload onChange={handleMediaChange} />
				</div>

				<div className="h-full">
					<button
						onClick={onSendClick}
						className={`bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800 transition-shadow shadow-md hover:shadow-lg rounded-full px-4 py-4`}
					>
						<Send />
					</button>
				</div>
			</div>
		</div>
	);
};

export default UnifiedSender;
