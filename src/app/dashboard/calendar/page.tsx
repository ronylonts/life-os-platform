"use client";

import { FormEvent, useEffect, useState } from "react";
import { ApiClientError } from "@/lib/api/client";
import { eventsApi } from "@/lib/api/services";
import type { Event } from "@/types/api";
import { PageHeader } from "@/components/layout/page-header";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadEvents() {
    setLoading(true);
    try {
      const data = await eventsApi.list();
      setEvents(data);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Impossible de charger l'agenda");
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
      await loadEvents();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Impossible de créer l'événement");
    }
  }

  return (
    <div>
      <PageHeader title="Agenda" description="Planifiez vos événements et créneaux" />
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

        <Card title="Événements à venir">
          {loading ? (
            <p className="text-sm text-slate-400">Chargement...</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-slate-400">Aucun événement planifié.</p>
          ) : (
            <ul className="space-y-3">
              {events.map((ev) => (
                <li key={ev.id} className="rounded-lg border border-slate-800 p-3">
                  <p className="font-medium text-white">{ev.title}</p>
                  <p className="text-xs text-slate-500">
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
