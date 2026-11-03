import React, { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

const STAGES = [
  { title: 'מחפשים', note: 'הגדרנו יחד: גבעתיים, 4 חדרים, עד 4.2 מיליון ₪.' },
  { title: 'ביקורים', note: '2 מתוך 3 ביקורים מאחוריכם. הבא: יום חמישי 17:00, בורוכוב 24.' },
  { title: 'הצעה ומשא ומתן', note: 'כשתמצאו את הבית, נבנה יחד הצעה ונדבר עם המוכרים.' },
  { title: 'חוזה ועורכי דין', note: 'נלווה אתכם מול עורך הדין, הבנק והמסמכים.' },
  { title: 'המפתח שלכם', note: 'היום שבו הכל מתחבר. נגיע עם פרחים.' }
];
const CURRENT = 1;

const DOCS = [
  { label: 'אישור עקרוני למשכנתא', state: 'done' },
  { label: 'צילומי תעודות זהות', state: 'done' },
  { label: 'נסח טאבו לבורוכוב 24', state: 'agent', who: 'יעל בודקת' },
  { label: 'בדיקה הנדסית לנכס', state: 'later', who: 'אחרי ההצעה' }
];

// The client's journey from first search to the keys: where they are, what's done, what's next.
export default function ClientJourney() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(CURRENT);
  const fill = (CURRENT + 0.5) / STAGES.length;

  return (
    <section className="mk-journey" aria-labelledby="mk-journey-title">
      <div className="mk-journey-head">
        <h2 id="mk-journey-title">הדרך שלכם הביתה</h2>
        <span className="public-kicker">שלב {CURRENT + 1} מתוך {STAGES.length}</span>
      </div>

      <div className="mk-journey-track" ref={ref}>
        <span className="mk-journey-line" aria-hidden="true" />
        <motion.span
          className="mk-journey-fill"
          aria-hidden="true"
          style={{ '--fill': fill } as React.CSSProperties}
          initial={reduced ? false : { scaleX: 0, scaleY: 0 }}
          animate={inView ? { scaleX: 1, scaleY: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <ol>
          {STAGES.map((s, i) => {
            const state = i < CURRENT ? 'done' : i === CURRENT ? 'current' : 'next';
            return (
              <li key={s.title} className={'is-' + state}>
                <button aria-expanded={open === i} onClick={() => setOpen(i)}>
                  <span className="mk-journey-dot" aria-hidden="true">
                    {state === 'done' ? '✓' : String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="mk-journey-title">{s.title}</span>
                  <span className="sr-only">{state === 'done' ? ' (הושלם)' : state === 'current' ? ' (אתם כאן)' : ''}</span>
                </button>
                {open === i && <p className="mk-journey-note">{s.note}</p>}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mk-journey-docs">
        <h3>מה כבר מוכן, ומה עוד חסר</h3>
        <ul>
          {DOCS.map(d => (
            <li key={d.label} className={'is-' + d.state}>
              <span className="mk-doc-mark" aria-hidden="true" />
              <span>{d.label}</span>
              <small>{d.state === 'done' ? 'התקבל' : d.who}</small>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
