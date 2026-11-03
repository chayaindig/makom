import React from 'react';
import { motion, type MotionValue } from 'motion/react';
import { AREAS, MAP_H, MAP_W, STREETS, STREET_LABELS } from './mapData';

// The illustrated city map shared by the neighbourhood map and the agent's route.
// It reads as a map because of what real maps have: built-up blocks with building footprints,
// wide white streets cutting through them, green parks, a light-rail line, district names,
// a north arrow and a scale bar. `draw` (0..1) draws the streets in: a MotionValue tied to scroll, or a number.
export default function MapBase({
  draw,
  children,
  label
}: {
  draw: MotionValue<number> | number;
  children?: React.ReactNode;
  label: string;
}) {
  const p = draw as MotionValue<number>;
  const rail = STREETS.main[3];
  return (
    <svg className="mk-mapsvg" viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Building footprints, tiled across the city */}
        <pattern id="mk-blocks" width="64" height="56" patternUnits="userSpaceOnUse" patternTransform="rotate(-3)">
          <rect width="64" height="56" fill="#e7eaf1" />
          <rect x="4" y="5" width="22" height="16" rx="1.5" fill="#d6dbe7" />
          <rect x="30" y="5" width="14" height="20" rx="1.5" fill="#d9deea" />
          <rect x="48" y="7" width="12" height="12" rx="1.5" fill="#d3d9e6" />
          <rect x="5" y="27" width="15" height="22" rx="1.5" fill="#d9deea" />
          <rect x="24" y="30" width="20" height="14" rx="1.5" fill="#d3d9e6" />
          <rect x="48" y="25" width="12" height="24" rx="1.5" fill="#d6dbe7" />
        </pattern>
        <pattern id="mk-trees" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="#dbe7d8" />
          <circle cx="4" cy="4" r="2.6" fill="#c6dac2" />
          <circle cx="11" cy="10" r="2.2" fill="#c6dac2" />
        </pattern>
      </defs>

      {/* City fabric */}
      <rect width={MAP_W} height={MAP_H} fill="url(#mk-blocks)" />

      {/* District names, very quiet, behind everything */}
      <text x="150" y="250" className="mk-district">גבעתיים</text>
      <text x="520" y="470" className="mk-district">רמת גן</text>

      {/* Parks */}
      {AREAS.map(a => (
        <path key={a.d} d={a.d} fill="url(#mk-trees)" stroke="#b9cfb4" strokeWidth="1" />
      ))}

      {/* Streets: a soft casing, then the white road on top. Both draw in with the scroll. */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {STREETS.minor.map(d => (
          <motion.path key={'mc' + d} d={d} stroke="#cdd3e1" strokeWidth="11" style={{ pathLength: p }} />
        ))}
        {STREETS.main.map(d => (
          <motion.path key={'Mc' + d} d={d} stroke="#c3cadb" strokeWidth="20" style={{ pathLength: p }} />
        ))}
        {STREETS.minor.map(d => (
          <motion.path key={'mr' + d} d={d} stroke="#fbfcfe" strokeWidth="8" style={{ pathLength: p }} />
        ))}
        {STREETS.main.map(d => (
          <motion.path key={'Mr' + d} d={d} stroke="#ffffff" strokeWidth="16" style={{ pathLength: p }} />
        ))}
        {/* Light rail along its avenue */}
        <motion.path d={rail} stroke="#19264d" strokeWidth="2.5" strokeDasharray="9 6" strokeLinecap="butt" style={{ opacity: p }} />
      </g>

      {/* Street names on the roads */}
      <motion.g style={{ opacity: p }}>
        {STREET_LABELS.map(l => (
          <text key={l.text} x={l.x} y={l.y} transform={`rotate(${l.rotate} ${l.x} ${l.y})`} className="mk-streetlabel">
            {l.text}
          </text>
        ))}
      </motion.g>

      {/* North arrow and scale bar */}
      <g transform="translate(36 40)" className="mk-compass" aria-hidden="true">
        <circle r="16" />
        <path d="M0 -11 L5 6 L0 3 L-5 6 Z" />
        <text y="-21">צ</text>
      </g>
      <g transform="translate(24 492)" className="mk-scale" aria-hidden="true">
        <rect width="40" height="5" />
        <rect x="40" width="40" height="5" className="mk-scale-alt" />
        <text x="0" y="-6">0</text>
        <text x="80" y="-6">200 מ׳</text>
      </g>

      {children}
    </svg>
  );
}

/** The brand's tilted "!" as a map pin */
export function BangPin({ x, y, active = false }: { x: number; y: number; active?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(-8)`} className={'mk-bang' + (active ? ' is-active' : '')}>
      {active && <circle r="22" className="mk-bang-ring" />}
      <circle r={active ? 15 : 12} fill={active ? '#253fc4' : '#19264d'} stroke="#fff" strokeWidth="2.5" />
      <rect x="-2" y={active ? -9 : -7} width="4" height={active ? 11 : 9} rx="1" fill="#f7f8fc" />
      <rect x="-2" y="4" width="4" height="4" rx="1" fill="#f7f8fc" />
    </g>
  );
}
