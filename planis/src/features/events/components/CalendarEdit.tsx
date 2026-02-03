import { useEvents } from "../providers/EventsProvider";

export const CalendarEdit = () => {
  const { selectedEvent, setSelectedEvent, updateEvent, deleteEvent } =
    useEvents();

  if (!selectedEvent) return null;

  return (
    <div className="w-80 bg-white border-l-4 border-black p-5 overflow-y-auto">
      <div className="bg-neo-purple border-4 border-black p-4 mb-5 shadow-neo-lg rounded-xl text-white">
        <h3 className="m-0 text-xl font-bold uppercase">Éditer l'événement</h3>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block font-bold mb-2 text-sm uppercase">
            Titre
          </label>
          <input
            type="text"
            value={selectedEvent.title}
            onChange={(e) => updateEvent({ title: e.target.value })}
            className="w-full p-3 border-[3px] border-black rounded-lg font-space text-sm box-border"
          />
        </div>

        <div>
          <label className="block font-bold mb-2 text-sm uppercase">
            Date de début
          </label>
          <input
            type="datetime-local"
            value={selectedEvent.start.toISOString().slice(0, 16)}
            onChange={(e) => updateEvent({ start: new Date(e.target.value) })}
            className="w-full p-3 border-[3px] border-black rounded-lg font-space text-sm box-border"
          />
        </div>

        <div>
          <label className="block font-bold mb-2 text-sm uppercase">
            Date de fin
          </label>
          <input
            type="datetime-local"
            value={selectedEvent.end.toISOString().slice(0, 16)}
            onChange={(e) => updateEvent({ end: new Date(e.target.value) })}
            className="w-full p-3 border-[3px] border-black rounded-lg font-space text-sm box-border"
          />
        </div>

        <div>
          <label className="block font-bold mb-2 text-sm uppercase">
            Couleur
          </label>
          <div className="flex gap-2 flex-wrap">
            {["#ff6b35", "#00D9FF", "#7B2FBE", "#F7931E"].map((color) => (
              <button
                key={color}
                onClick={() => updateEvent({ color })}
                className={`w-[50px] h-[50px] rounded-[10px] cursor-pointer transition-all duration-200 ${
                  selectedEvent.color === color
                    ? "border-4 border-black shadow-neo-md scale-110"
                    : "border-[3px] border-black"
                }`}
                style={{ background: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2.5 mt-5">
          <button
            onClick={() => setSelectedEvent(null)}
            className="flex-1 bg-neo-cyan border-[3px] border-black rounded-[10px] p-4 cursor-pointer font-space font-bold text-sm uppercase shadow-neo-md transition-all duration-200 hover:bg-[#00B8D9]"
          >
            Fermer
          </button>
          <button
            onClick={deleteEvent}
            className="flex-1 bg-neo-orange border-[3px] border-black rounded-[10px] p-4 cursor-pointer font-space font-bold text-sm uppercase shadow-neo-md transition-all duration-200 hover:bg-[#e55a2b]"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};
