import Image from "next/image";
import CardSeguimientos from "../../components/CardSeguimientos";
import { Facebook, Instagram, Messenger, TikTok } from "@/components/Icons";

export default function Manager() {
  return (
    <div
      className="w-full h-screen max-w-screen-lg flex justify-center items-center flex-col mx-auto gap-20
		"
    >
      <h1 className="text-white text-2xl">Manager</h1>

      <div className="grid grid-cols-4 gap-4">
        <CardSeguimientos title="Post" image="/images/astro-logo-blanco.png" />
        <CardSeguimientos
          title="Campañas"
          image="/images/astro-logo-blanco.png"
        />
        <CardSeguimientos
          title="Rendimiento"
          image="/images/astro-logo-blanco.png"
        />
        <CardSeguimientos
          title="Agenda"
          image="/images/astro-logo-blanco.png"
        />
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Facebook />
        <Instagram />
        <TikTok />
        <Messenger />
      </div>
    </div>
  );
}
