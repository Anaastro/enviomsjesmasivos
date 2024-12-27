
import { useRef } from "react";
import { AttachFile } from "../Icons";

export default function FileUpload({ onChange }: { onChange: any }) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center justify-center p-4 relative">
      <input
        type="file"
        accept="image/*,audio/*"
        onChange={onChange}
        hidden
        ref={inputRef}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="flex items-center justify-center p-4 rounded-full border-2 border-blue-600 bg-white hover:bg-blue-600 text-white shadow-lg transition-all duration-300"
      >
        <AttachFile  />
      </button>
    </div>
  );
}
