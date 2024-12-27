import React, { useState, useRef, ChangeEvent, useEffect } from "react";

interface AutoResizeTextareaProps {
	message: string;
	setMessage: React.Dispatch<React.SetStateAction<string>>;
}

function AutoResizeTextarea({ message, setMessage }: AutoResizeTextareaProps) {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value);

		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, []);

	return (
		<textarea
			ref={textareaRef}
			value={message}
			onChange={handleChange}
			rows={1}
			style={{
				width: "100%",
				overflow: "hidden",
				resize: "none",
				outline: "none",
				border: "1px solid transparent",
				borderRadius: "4px",
				padding: "12px",
			}}
			onFocus={(e) => (e.currentTarget.style.border = "1px solid lightgray")}
			onBlur={(e) => (e.currentTarget.style.border = "1px solid black")}
			placeholder="Escribe algo aquí..."
		/>
	);
}

export default AutoResizeTextarea;
