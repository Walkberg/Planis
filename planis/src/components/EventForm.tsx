import React, { useEffect, useState } from "react";
import type { CalendarEvent, EventType } from "../types";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function EventForm({
  initial,
  onCancel,
  onSave,
}: {
  initial?: Partial<CalendarEvent>;
  onCancel: () => void;
  onSave: (e: CalendarEvent) => void;
}) {
  const [title, setTitle] = useState(initial?.title || "");
  const [date, setDate] = useState(
    initial?.date || new Date().toISOString().slice(0, 10),
  );
  const [type, setType] = useState<EventType>(
    (initial?.type as EventType) || "evenement",
  );
  const [activity, setActivity] = useState(initial?.activity || "");
  const [notes, setNotes] = useState(initial?.notes || "");
  const [completed, setCompleted] = useState(!!initial?.completed);

  useEffect(() => {
    setTitle(initial?.title || "");
    setDate(initial?.date || new Date().toISOString().slice(0, 10));
    setType((initial?.type as EventType) || "evenement");
    setActivity(initial?.activity || "");
    setNotes(initial?.notes || "");
    setCompleted(!!initial?.completed);
  }, [initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ev: CalendarEvent = {
      id: (initial && initial.id) || uid(),
      title:
        title ||
        (type === "anniversaire" ? "Anniversaire" : "Nouvel évènement"),
      date,
      type,
      activity: activity || undefined,
      notes: notes || undefined,
      completed: type === "tache" ? completed : undefined,
    };
    onSave(ev);
  }

  return (
    <div className="modal">
      <form className="event-form" onSubmit={handleSubmit}>
        <h3>{initial ? "Modifier" : "Créer"} un évènement / tâche</h3>
        <label>Titre</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <label>Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as EventType)}
        >
          <option value="anniversaire">Anniversaire</option>
          <option value="evenement">Evènement</option>
          <option value="tache">Tâche</option>
        </select>
        <label>Activité / Catégorie</label>
        <input
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          placeholder="ex: Travail, Famille"
        />
        <label>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        {type === "tache" && (
          <label>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />{" "}
            Terminé
          </label>
        )}
        <div className="form-actions">
          <button type="button" onClick={onCancel}>
            Annuler
          </button>
          <button type="submit">Enregistrer</button>
        </div>
      </form>
    </div>
  );
}
