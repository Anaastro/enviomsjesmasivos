interface Props {
  content: string;
}

export default function Loader({ content }: Props) {
  return (
    <div className="fixed z-[1000] top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center w-full h-full bg-black opacity-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-white"></div>
      <p className="text-white mt-5">{content}</p>
    </div>
  );
}
