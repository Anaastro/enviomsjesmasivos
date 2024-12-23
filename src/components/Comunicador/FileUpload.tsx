import { useRef, useState } from "react";
import { AttachFile } from "../Icons";

export default function FileUpload({ onChange }: { onChange: any }) {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div className="rounded-full p-4 relative">
			<input
				type="file"
				accept="image/*,audio/*"
				onChange={onChange}
				hidden
				ref={inputRef}
			/>
			<button onClick={() => inputRef.current?.click()}>
				<AttachFile />
			</button>
		</div>
	);
}
