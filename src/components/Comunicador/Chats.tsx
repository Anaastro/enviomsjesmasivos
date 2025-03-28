import { useChats } from "@/lib/hooks/useChats";
import { Chat } from "@/lib/interfaces";

const Chats = () => {
  const { chats, filter, filteredChats, handleChange } = useChats();

  return (
    <div className=" border-5 border-[#9CFFCB] p-6 h-[70vh]  bg-transparent shadow-xl rounded-2xl">
      <h3 className="text-xl font-extralight mb-4 text-white text-center">
        Chats de WhatsApp
      </h3>

      <select
        className=" bg-transparent border-2 border-blue-500 text-center text-white font-extralight"
        name="filterChats"
        id="filterChats"
        value={filter}
        onChange={handleChange}
      >
        <option value="all">Todos</option>
        <option value="last30">Ultimos 30 mensajes</option>
        <option value="last50">Ultimos 50 mensajes</option>
      </select>

      <ul className="h-[80%] overflow-y-auto">
        {filteredChats?.map(
          ({ id, image, name, text, lastMessageTime }: Chat) => (
            <li
              className="border-b-2 px-1 py-0.5 text-white font-extralight"
              key={id}
            >
              <h4 className="text-lg">
                {name} -{" "}
                <span className="text-white font-extralight">{id}</span>
              </h4>
              {text && (
                <p className="text-sm my-1 text-white font-extralight">
                  {text}
                </p>
              )}
              {image && (
                <img
                  className="my-1"
                  src={image}
                  alt={`Mensaje enviado por ${name}`}
                />
              )}

              <small>{lastMessageTime}</small>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Chats;
