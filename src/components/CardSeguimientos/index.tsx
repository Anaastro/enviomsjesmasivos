import Image from "next/image";

interface Props {
  title: string;
  image: string;
}

export default function CardSeguimientos({ title, image }: Props) {
  return (
    <a
      href="#"
      className="block bg-black rounded-lg p-4 border-white border-2 hover:scale-110 transition-all duration-250"
    >
      <Image alt={title} src={image} width={200} height={200} />

      <h3 className="mt-4 text-lg font-bold text-white sm:text-xl text-center">
        {title}
      </h3>
    </a>
  );
}
