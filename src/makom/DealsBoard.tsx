import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

const STAGES = ['פנייה חדשה', 'ביקורים', 'הצעה', 'משא ומתן', 'חוזה'];

type Deal = { id: string; client: string; home: string; value: number; days: number; stage: number; hot?: boolean };

const START: Deal[] = [
  { id: 'd1', client: 'עידו כהן', home: 'מחפש 5 חדרים בגבעתיים', value: 6000000, days: 1, stage: 0, hot: true },
  { id: 'd2', client: 'רוני ושחר', home: 'דירת 3 חדרים ברמת גן', value: 3400000, days: 3, stage: 0 },
  { id: 'd3', client: 'נועה ואיתי', home: 'בורוכוב 24, גבעתיים', value: 4250000, days: 9, stage: 1 },
  { id: 'd4', client: 'משפחת שפירא', home: 'המעגל 8, רמת גן', value: 3680000, days: 4, stage: 1 },
  { id: 'd5', client: 'דנה אלון', home: 'כצנלסון 56, גבעתיים', value: 5900000, days: 12, stage: 3, hot: true },
  { id: 'd6', client: 'מיכל רוזן', home: 'דירת גן, מכירה', value: 4800000, days: 21, stage: 4 }
];

const money = (n: number) => (n / 1_000_000).toLocaleString('he-IL', { maximumFractionDigits: 2 }) + ' מ׳ ₪';

// The office pipeline as a board: drag a deal between stages (or use the arrows on touch and keyboard).
export default function DealsBoard({ note }: { note: (s: string) => void }) {
  const reduced = useReducedMotion();
  const [deals, setDeals] = useState(START);
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<number | null>(null);

  const move = (id: string, stage: number) => {
    const d = deals.find(x => x.id === id);
    if (!d || stage < 0 || stage >= STAGES.length || d.stage === stage) return;
    setDeals(deals.map(x => (x.id === id ? { ...x, stage, days: 0 } : x)));
    note(`${d.client} עברו לשלב "${STAGES[stage]}"${stage === STAGES.length - 1 ? '. עוד רגע מפתח!' : ''}`);
  };

  const total = deals.reduce((s, d) => s + d.value, 0);

  return (
    <section className="mk-board" aria-labelledby="mk-board-title">
      <div className="section-head">
        <div>
          <span className="eyebrow">כל עסקה, במקום אחד</span>
          <h2 id="mk-board-title">לוח העסקאות</h2>
        </div>
        <span className="mk-board-total">
          בתהליך כרגע <b>{money(total)}</b>
        </span>
      </div>
      <p className="mk-board-hint">גוררים כרטיס לשלב הבא, או לוחצים על החצים.</p>

      <div className="mk-board-cols">
        {STAGES.map((stage, si) => {
          const list = deals.filter(d => d.stage === si);
          return (
            <div
              key={stage}
              className={'mk-col' + (over === si ? ' is-over' : '')}
              onDragOver={e => {
                e.preventDefault();
                setOver(si);
              }}
              onDragLeave={() => setOver(o => (o === si ? null : o))}
              onDrop={e => {
                e.preventDefault();
                if (dragId) move(dragId, si);
                setDragId(null);
                setOver(null);
              }}
            >
              <div className="mk-col-head">
                <span className="mk-col-no">0{si + 1}</span>
                <b>{stage}</b>
                <small>{list.length}</small>
              </div>
              <ul>
                <AnimatePresence initial={false}>
                  {list.map(d => (
                    <motion.li
                      key={d.id}
                      layout={!reduced}
                      initial={reduced ? false : { opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25 }}
                      className={'mk-deal' + (dragId === d.id ? ' is-dragging' : '')}
                    >
                      <div
                        className="mk-deal-body"
                        draggable
                        onDragStart={e => {
                          setDragId(d.id);
                          e.dataTransfer.effectAllowed = 'move';
                        }}
                        onDragEnd={() => {
                          setDragId(null);
                          setOver(null);
                        }}
                      >
                        <div className="mk-deal-top">
                          <b>{d.client}</b>
                          {d.hot && <span className="mk-deal-hot">חם</span>}
                        </div>
                        <span className="mk-deal-home">{d.home}</span>
                        <div className="mk-deal-foot">
                          <span>{money(d.value)}</span>
                          <small>{d.days === 0 ? 'עודכן עכשיו' : `${d.days} ימים בשלב`}</small>
                        </div>
                      </div>
                      <div className="mk-deal-move">
                        <button aria-label={`להחזיר את ${d.client} לשלב הקודם`} disabled={si === 0} onClick={() => move(d.id, si - 1)}>
                          →
                        </button>
                        <button aria-label={`להעביר את ${d.client} לשלב הבא`} disabled={si === STAGES.length - 1} onClick={() => move(d.id, si + 1)}>
                          ←
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
                {list.length === 0 && <li className="mk-col-empty">אפשר לגרור לכאן</li>}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
