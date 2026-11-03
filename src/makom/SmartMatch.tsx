import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import CountUp from './CountUp';

const HOMES = [
  { street: 'בורוכוב 24', area: 'גבעתיים', rooms: 4, price: 4250000, extra: 'מרפסת' },
  { street: 'המעגל 8', area: 'רמת גן', rooms: 3, price: 3680000, extra: 'קומה 2' },
  { street: 'כצנלסון 56', area: 'גבעתיים', rooms: 5, price: 5900000, extra: 'פנטהאוז' }
];

const CLIENTS = [
  { name: 'נועה ואיתי', area: 'גבעתיים', rooms: 4, budget: 4200000, note: 'זוג צעיר, עובדים מהבית' },
  { name: 'משפחת שפירא', area: 'רמת גן', rooms: 3, budget: 3800000, note: 'שני ילדים, קרוב לבית ספר' },
  { name: 'עידו כהן', area: 'גבעתיים', rooms: 5, budget: 6000000, note: 'משפרי דיור, מחפשים נוף' }
];

type Reason = { ok: boolean; text: string };

// Transparent scoring: area 40, rooms 30, budget 30. Every point is explained in plain words.
function score(c: (typeof CLIENTS)[number], h: (typeof HOMES)[number]) {
  const reasons: Reason[] = [];
  let s = 0;
  if (c.area === h.area) {
    s += 40;
    reasons.push({ ok: true, text: `ב${h.area}, כמו שביקשו` });
  } else reasons.push({ ok: false, text: `ב${h.area}, לא האזור שלהם` });
  const dr = Math.abs(c.rooms - h.rooms);
  s += dr === 0 ? 30 : dr === 1 ? 15 : 0;
  reasons.push(dr === 0 ? { ok: true, text: `${h.rooms} חדרים בדיוק` } : { ok: false, text: `${h.rooms} חדרים במקום ${c.rooms}` });
  const over = h.price - c.budget;
  if (over <= 0) {
    s += 30;
    reasons.push({ ok: true, text: 'בתוך התקציב' });
  } else {
    const pct = over / c.budget;
    s += Math.max(0, Math.round(30 - pct * 300));
    reasons.push({ ok: pct < 0.03, text: `${Math.round(over / 1000).toLocaleString('he-IL')} אלף ₪ מעל התקציב` });
  }
  return { s, reasons };
}

export default function SmartMatch({ note }: { note: (s: string) => void }) {
  const reduced = useReducedMotion();
  const [ci, setCi] = useState(0);
  const client = CLIENTS[ci];
  const ranked = useMemo(
    () => HOMES.map(h => ({ h, ...score(client, h) })).sort((a, b) => b.s - a.s),
    [client]
  );

  return (
    <section className="mk-match" aria-labelledby="mk-match-title">
      <div className="section-head">
        <div>
          <span className="eyebrow">המערכת חושבת איתך</span>
          <h2 id="mk-match-title">התאמה חכמה</h2>
        </div>
      </div>

      <div className="mk-match-grid">
        <div className="mk-match-clients" role="group" aria-label="בחירת לקוח">
          {CLIENTS.map((c, i) => (
            <button key={c.name} aria-pressed={i === ci} onClick={() => setCi(i)}>
              <b>{c.name}</b>
              <small>
                {c.area} · {c.rooms} חדרים · עד {(c.budget / 1_000_000).toLocaleString('he-IL')} מ׳ ₪
              </small>
              <small className="mk-match-note">{c.note}</small>
            </button>
          ))}
        </div>

        <ol className="mk-match-list" aria-live="polite">
          {ranked.map(({ h, s, reasons }, i) => (
            <motion.li
              key={client.name + h.street}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className={i === 0 ? 'is-best' : ''}
            >
              <div className="mk-score" style={{ '--p': s } as React.CSSProperties} aria-label={`התאמה של ${s} אחוז`}>
                <span>{reduced ? s : <CountUp key={client.name + h.street} to={s} duration={0.8} />}</span>
                <small>%</small>
              </div>
              <div className="mk-match-body">
                <div className="mk-match-title">
                  <b>{h.street}</b>
                  <span>
                    {h.area} · {h.rooms} חדרים · {h.extra}
                  </span>
                  {i === 0 && <em>ההתאמה הכי טובה</em>}
                </div>
                <ul className="mk-reasons">
                  {reasons.map(r => (
                    <li key={r.text} className={r.ok ? 'ok' : 'no'}>
                      {r.text}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="mk-match-send" onClick={() => note(`${h.street} נשלח לאוסף של ${client.name} (בהדגמה)`)}>
                שליחה לאוסף שלהם ←
              </button>
            </motion.li>
          ))}
        </ol>
      </div>
      <p className="mk-match-legend">איך מחושב הציון: אזור 40, מספר חדרים 30, תקציב 30. כל נקודה מוסברת במילים.</p>
    </section>
  );
}
