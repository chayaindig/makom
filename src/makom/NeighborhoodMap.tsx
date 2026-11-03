import React, { useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import MapBase, { BangPin } from './MapBase';
import { HOME_PINS, POIS, POI_LABELS, type PoiKind } from './mapData';

const KINDS = Object.keys(POI_LABELS) as PoiKind[];

// "We know every street": an illustrated map that draws itself as you scroll,
// then shows how a home lives: minutes on foot to the café, park, school and light rail.
export default function NeighborhoodMap({ onOpenHome }: { onOpenHome: (index: number) => void }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'start 15%'] });
  const spring = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const draw = reduced ? 1 : spring;
  const poiOpacity = useTransform(spring, [0.65, 0.95], [0, 1]);
  const [kind, setKind] = useState<PoiKind | 'all'>('all');
  const [homeId, setHomeId] = useState(HOME_PINS[0].id);
  const home = HOME_PINS.find(h => h.id === homeId)!;
  const homeIndex = HOME_PINS.indexOf(home);

  // Nearest place of each kind to the chosen home, for the walking lines
  const links = useMemo(
    () =>
      KINDS.map(k => {
        const near = POIS.filter(p => p.kind === k).sort(
          (a, b) => Math.hypot(a.x - home.x, a.y - home.y) - Math.hypot(b.x - home.x, b.y - home.y)
        )[0];
        return { kind: k, poi: near, min: home.walk.find(w => w.kind === k)!.min };
      }),
    [home]
  );
  const visible = (k: PoiKind) => kind === 'all' || kind === k;

  return (
    <section className="mk-map" id="neighborhood" ref={ref} aria-labelledby="mk-map-title">
      <div className="public-section-title">
        <h2 className="section-brand-heading" id="mk-map-title">
          מכירים כל רחוב.
          <br />
          עכשיו <em>גם אתם.</em>
        </h2>
        <p>בחרו בית וראו מה יש סביבו, ברגל. כי בית זה גם הקפה של הבוקר והדרך לגן.</p>
      </div>

      <div className="mk-map-grid">
        <div className="mk-map-stage">
          <MapBase draw={draw} label="מפה מאוירת של גבעתיים ורמת גן עם הבתים של מקום והמקומות שסביבם">
            {/* walking lines from the chosen home */}
            {links.map(l =>
              visible(l.kind) ? (
                <motion.line
                  key={home.id + l.kind}
                  x1={home.x}
                  y1={home.y}
                  x2={l.poi.x}
                  y2={l.poi.y}
                  className="mk-walkline"
                  initial={reduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              ) : null
            )}
            <motion.g style={{ opacity: reduced ? 1 : poiOpacity }}>
              {POIS.filter(p => visible(p.kind)).map(p => (
                <g key={p.id} transform={`translate(${p.x} ${p.y})`} className="mk-poi">
                  <circle r="15" />
                  <image href={`${import.meta.env.BASE_URL}icons/${p.kind}.svg`} x="-10" y="-10" width="20" height="20" />
                  <title>{p.name}</title>
                </g>
              ))}
            </motion.g>
            <motion.g style={{ opacity: reduced ? 1 : poiOpacity }}>
              {HOME_PINS.map((h, i) => (
                <g
                  key={h.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${h.street}, ${h.area}`}
                  aria-pressed={h.id === homeId}
                  className="mk-homepin"
                  onClick={() => setHomeId(h.id)}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setHomeId(h.id)}
                >
                  <BangPin x={h.x} y={h.y} active={h.id === homeId} />
                  <text x={h.x} y={h.y + 36} className="mk-homepin-label">
                    0{i + 1}
                  </text>
                </g>
              ))}
            </motion.g>
          </MapBase>
          <span className="mk-map-note">מפה מאוירת להמחשה. זמני ההליכה משוערים.</span>
        </div>

        <aside className="mk-map-panel" aria-live="polite">
          <div className="mk-map-filters" role="group" aria-label="סינון לפי סוג מקום">
            <button aria-pressed={kind === 'all'} onClick={() => setKind('all')}>הכל</button>
            {KINDS.map(k => (
              <button key={k} aria-pressed={kind === k} onClick={() => setKind(k)}>
                {POI_LABELS[k]}
              </button>
            ))}
          </div>

          <div className="mk-map-homes" role="group" aria-label="בחירת בית">
            {HOME_PINS.map((h, i) => (
              <button key={h.id} aria-pressed={h.id === homeId} onClick={() => setHomeId(h.id)}>
                <span>0{i + 1}</span>
                {h.street}
              </button>
            ))}
          </div>

          <div className="mk-map-card">
            <span className="public-kicker">{home.area} · ברגל מהבית</span>
            <h3>{home.street}</h3>
            <ul>
              {links.map(l => (
                <li key={l.kind} className={visible(l.kind) ? '' : 'is-dim'}>
                  <img src={`${import.meta.env.BASE_URL}icons/${l.kind}.svg`} alt="" aria-hidden="true" />
                  <span>{l.poi.name}</span>
                  <b>
                    {l.min} <small>דק׳</small>
                  </b>
                </li>
              ))}
            </ul>
            <button className="public-cta" onClick={() => onOpenHome(homeIndex)}>
              להכיר את הבית <span>←</span>
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
