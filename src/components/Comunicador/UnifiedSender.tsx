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
			className="border-5 p-2 md:p-4 bg-transparet shadow-xl rounded-2xl border-blue-700 "
		>
			<h3 className="text-xl font-extralight mb-4 text-white text-center">
				Crear mensaje
			</h3>
			{!mediaPreview && (
				<div className="w-full border-dashed border-blue-700 p-10 border-2 mb-4 flex justify-center items-center text-white font-extralight">
					Selecciona una imagen o audio:
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
