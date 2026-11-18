import { FormEvent, useEffect, useState } from 'react';
import { Check, MapPin, Ticket, X } from 'lucide-react';
import { TourDate } from '../data/artistData';

interface TicketModalProps {
  tourDate: TourDate | null;
  onClose: () => void;
}

export function TicketModal({ tourDate, onClose }: TicketModalProps) {
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState('2');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSubmitted(false);
    setEmail('');
  }, [tourDate]);

  useEffect(() => {
    if (!tourDate) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [tourDate, onClose]);

  if (!tourDate) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#040812]/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-blue-200/15 bg-[#0B1324] p-6 sm:p-7 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close session details"
          className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-200/15 bg-[#121D38] text-slate-300 hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 text-xs text-blue-300 font-mono tabular-nums">
          <span>{tourDate.dateDisplay}</span>
          <span aria-hidden="true">·</span>
          <span>
            {tourDate.city} ({tourDate.country})
          </span>
        </div>

        <h2
          id="ticket-modal-title"
          className="mt-2 font-display text-2xl font-semibold tracking-tight text-white"
        >
          {tourDate.venue}
        </h2>

        <div className="mt-4 space-y-2 border-y border-white/12 py-4 text-sm text-slate-200">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <span>{tourDate.venueAddress}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-400 pt-1">
            <span>Format: {tourDate.format}</span>
            <span className="font-mono tabular-nums">
              Doors {tourDate.doorsTime} · Set {tourDate.setTime}
            </span>
          </div>
          <p className="text-xs text-slate-400">Program: {tourDate.support}</p>
        </div>

        {submitted ? (
          <div className="mt-5 rounded-xl border border-blue-500/25 bg-[#0B1733] p-4">
            <div className="flex items-center gap-2.5 text-sm font-medium text-white">
              <Check className="w-4 h-4 text-blue-400" />
              <span>RSVP &amp; updates confirmed</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
              Event updates and seating details for {quantity} guest(s) will be sent to{' '}
              <span className="text-white font-medium">{email}</span>.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 rounded-lg border border-white/20 px-4 py-2 text-xs font-medium text-white hover:bg-white/10 cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="ticket-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                Email for RSVP &amp; Venue Updates
              </label>
              <input
                id="ticket-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full rounded-lg border border-blue-200/15 bg-[#070D1B] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#3B82F6] focus:outline-none"
              />
            </div>

            {tourDate.status !== 'Archive' && (
              <div>
                <label htmlFor="ticket-qty" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Guest Count
                </label>
                <select
                  id="ticket-qty"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full rounded-lg border border-blue-200/15 bg-[#070D1B] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="4">4 Guests (Group / Fellowship)</option>
                </select>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-white/15 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer"
              >
                <Ticket className="w-3.5 h-3.5" />
                {tourDate.status === 'Archive' ? 'Get Future Alerts' : 'Register Interest'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
