import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import MapBase, { BangPin } from './MapBase';
import { OFFICE, ROUTE_PATH, ROUTE_STOPS } from './mapData';

// The agent's day on the same illustrated map: office, then each visit in order, with drive times.
export default function TodayRoute() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const totalDrive = ROUTE_STOPS.reduce((s, r) => s + parseInt(r.drive), 0);

  return (
    <section className="mk-route" aria-labelledby="mk-route-title">
      <div className="section-head">
        <div>
          <span className="eyebrow">יום רביעי, 28 באוקטובר</span>
          <h2 id="mk-route-title">המסלול של היום</h2>
        </div>
        <span className="mk-board-total">
          {ROUTE_STOPS.length} ביקורים · <b>{totalDrive} דק׳</b> נסיעה
        </span>
      </div>

      <div className="mk-route-grid">
        <div className="mk-route-map">
          <MapBase draw={1} label="מפת המסלול של היום: מהמשרד לשלושה ביקורים">
            <path d={ROUTE_PATH} className="mk-route-base" />
            <motion.path
              d={ROUTE_PATH}
              className="mk-route-line"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.2, ease: 'easeInOut', delay: 0.3 }}
            />
            <g transform={`translate(${OFFICE.x} ${OFFICE.y})`} className="mk-office">
              <rect x="-13" y="-13" width="26" height="26" />
              <text y="34">{OFFICE.label}</text>
            </g>
            {ROUTE_STOPS.map((s, i) => (
              <g
                key={s.time}
                role="button"
                tabIndex={0}
                aria-label={`${s.time}, ${s.title}`}
                aria-pressed={active === i}
                className="mk-homepin"
                onClick={() => setActive(i)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setActive(i)}
              >
                <BangPin x={s.x} y={s.y} active={active === i} />
                <text x={s.x} y={s.y + 38} className="mk-homepin-label">
                  {s.time}
                </text>
              </g>
            ))}
          </MapBase>
        </div>

        <ol className="mk-route-list">
          <li className="mk-route-start">
            <span className="mk-route-no">◼</span>
            <span>
              <b>יציאה מהמשרד</b>
              <small>09:15 · המשרד ברמת גן</small>
            </span>
          </li>
          {ROUTE_STOPS.map((s, i) => (
            <li key={s.time} className={active === i ? 'is-active' : ''}>
              <span className="mk-route-drive">{s.drive} נסיעה</span>
              <button onClick={() => setActive(i)} aria-pressed={active === i}>
                <span className="mk-route-no">0{i + 1}</span>
                <span>
                  <b>
                    {s.time} · {s.title}
                  </b>
                  <small>{s.who}</small>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
