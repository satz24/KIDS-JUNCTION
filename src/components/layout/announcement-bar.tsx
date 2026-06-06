"use client";

const MARQUEE_TEXT =
  "✨ No:1 Baby Shop in Guduvanchery 🧸 Order via WhatsApp — No Online Payment 👶 Open All Days 9:30 AM – 9:30 PM ✨";

export function AnnouncementBar() {
  return (
    <div className="announcement-bar" aria-label="Store announcement">
      <div className="announcement-bar__track">
        <span className="announcement-bar__text">{MARQUEE_TEXT}</span>
        <span className="announcement-bar__text" aria-hidden>
          {MARQUEE_TEXT}
        </span>
      </div>
    </div>
  );
}
