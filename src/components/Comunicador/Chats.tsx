import { useChats } from "@/lib/hooks/useChats";
import { Chat } from "@/lib/interfaces";

const Chats = () => {
	const { chats, filter, filteredChats, handleChange } = useChats();

	return (
		<div className="border p-6 h-[50vh] bg-white shadow-xl rounded-lg">
			<h3 className="text-lg font-semibold mb-4 text-yellow-600">
				Chats de WhatsApp
			</h3>

			<select
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
						<li className="border-b-2 px-1 py-0.5" key={id}>
							<h4 className="text-lg">
								{name} - <span className="text-slate-400">{id}</span>
							</h4>
							{text && <p className="text-sm my-1">{text}</p>}
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
