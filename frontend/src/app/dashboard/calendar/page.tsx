"use client";

import { FormEvent, useEffect, useState } from "react";
import { ApiClientError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/services";
import { useToast } from "@/contexts/toast-context";
import type { Event } from "@/types/api";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ViewToggle, type ViewMode } from "@/components/ui/view-toggle";

export default function CalendarPage() {
  const { showToast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadEvents() {
    setLoading(true);
    try {
      const data = await eventsApi.list();
      setEvents(data);
    } catch (err) {
      const msg =
        err instanceof ApiClientError ? err.message : "Impossible de charger l'agenda";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await eventsApi.create({ title, startAt, endAt });
      setTitle("");
      setStartAt("");
      setEndAt("");
      showToast("Événement ajouté", "success");
      await loadEvents();
    } catch (err) {
      const msg =
        err instanceof ApiClientError ? err.message : "Impossible de créer l'événement";
      setError(msg);
      showToast(msg, "error");
    }
  }

  return (
    <div>
      <PageHeader title="Agenda" description="Vue calendrier et liste de vos événements" />
      {error && <Alert variant="error">{error}</Alert>}

      <div className="space-y-6">
        <Card title="Nouvel événement">
          <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
            <Input label="Titre" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Input
              label="Début"
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              required
            />
            <Input
              label="Fin"
              type="datetime-local"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              required
            />
            <div className="flex items-end">
              <Button type="submit">Ajouter</Button>
            </div>
          </form>
        </Card>

        <Card title="Mon agenda">
          <div className="mb-4">
            <ViewToggle
              value={viewMode}
              onChange={setViewMode}
              modes={[
                { id: "grid", label: "Calendrier" },
                { id: "list", label: "Liste" },
              ]}
            />
          </div>

          {loading ? (
            <p className="text-sm theme-muted">Chargement...</p>
          ) : viewMode === "grid" ? (
            <CalendarGrid events={events} />
          ) : events.length === 0 ? (
            <p className="text-sm theme-muted">Aucun événement planifié.</p>
          ) : (
            <ul className="space-y-3">
              {events.map((ev) => (
                <li key={ev.id} className="theme-list-item rounded-lg border p-3">
                  <p className="font-medium theme-text">{ev.title}</p>
                  <p className="text-xs theme-muted">
                    {new Date(ev.startAt).toLocaleString("fr-FR")} →{" "}
                    {new Date(ev.endAt).toLocaleString("fr-FR")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
