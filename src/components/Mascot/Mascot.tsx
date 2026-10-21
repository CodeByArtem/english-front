"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId, useMemo } from "react";
import type { MascotProps } from "./types";
import { buildVariants } from "./variants";

/** Drawing area (viewBox). Height is derived from the width. */
const VIEW_W = 240;
const VIEW_H = 280;

const C = {
  orange: "#FB923C",
  orangeLight: "#FDBA74",
  orangeDark: "#F97316",
  stripe: "#EA580C",
  brow: "#C2410C",
  cream: "#FEF3C7",
  pink: "#F9A8D4",
  ink: "#1F2937",
  whisker: "#4B5563",
  mouth: "#7C2D12",
  inside: "#7F1D1D",
  tongue: "#F87171",
  tear: "#7DD3FC",
  gold: "#FBBF24",
} as const;

/** transform-origin as a fraction of an element's own bounding box. */
const origin = (x: number, y: number) => ({ originX: x, originY: y });

const SPARKLES = [
  { x: 34, y: 62, dx: -22, dy: -18, color: C.gold, delay: 0 },
  { x: 206, y: 58, dx: 22, dy: -20, color: C.pink, delay: 0.12 },
  { x: 22, y: 140, dx: -20, dy: 6, color: C.pink, delay: 0.24 },
  { x: 218, y: 138, dx: 20, dy: 4, color: C.gold, delay: 0.08 },
  { x: 120, y: 14, dx: 0, dy: -20, color: C.gold, delay: 0.18 },
  { x: 70, y: 18, dx: -14, dy: -16, color: C.pink, delay: 0.3 },
  { x: 172, y: 18, dx: 14, dy: -16, color: C.pink, delay: 0.04 },
];

const STAR = "M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2Z";

const TAIL_SHAPE =
  "M162 238 C222 252 246 196 226 146 C223 138 211 141 213 151 C224 190 210 222 162 216 Z";
const TAIL_CENTER = "M160 228 C218 240 232 190 219 146";

/**
 * Milo the kitten: a pure inline-SVG mascot animated with Framer Motion.
 * Every body part is its own group, driven by shared variants named after `state`.
 */
export function Mascot({
  state = "idle",
  size = 160,
  className,
  title = "Milo the kitten",
}: MascotProps) {
  const reduced = useReducedMotion() ?? false;
  const V = useMemo(() => buildVariants(reduced), [reduced]);
  const uid = useId().replace(/:/g, "");
  const id = (name: string) => `${uid}-${name}`;
  const ref = (name: string) => `url(#${id(name)})`;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width={size}
      height={Math.round((size * VIEW_H) / VIEW_W)}
      className={className}
      role="img"
      aria-label={title}
      overflow="visible"
    >
      <title>{title}</title>
      <defs>
        <radialGradient id={id("head")} cx="50%" cy="32%" r="75%">
          <stop offset="0%" stopColor={C.orangeLight} />
          <stop offset="60%" stopColor={C.orange} />
          <stop offset="100%" stopColor={C.orangeDark} />
        </radialGradient>
        <radialGradient id={id("body")} cx="50%" cy="25%" r="80%">
          <stop offset="0%" stopColor={C.orangeLight} />
          <stop offset="55%" stopColor={C.orange} />
          <stop offset="100%" stopColor={C.orangeDark} />
        </radialGradient>
        <linearGradient id={id("tail")} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor={C.orange} />
          <stop offset="100%" stopColor={C.orangeLight} />
        </linearGradient>
        <radialGradient id={id("belly")} cx="50%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor={C.cream} />
        </radialGradient>
        <clipPath id={id("tailClip")}>
          <path d={TAIL_SHAPE} />
        </clipPath>
      </defs>

      {/* soft ground shadow */}
      <motion.ellipse
        cx="120"
        cy="268"
        rx="66"
        ry="8"
        fill="#0F172A"
        variants={V.shadow}
        initial="idle"
        animate={state}
        style={origin(0.5, 0.5)}
      />

      <motion.g variants={V.root} initial="idle" animate={state} style={origin(0.5, 1)}>
        {/* ---------- tail (behind the body) ---------- */}
        <motion.g variants={V.tail} style={origin(0.02, 0.8)}>
          <path d={TAIL_SHAPE} fill={ref("tail")} />
          <g clipPath={ref("tailClip")}>
            <path
              d={TAIL_CENTER}
              pathLength={100}
              fill="none"
              stroke={C.stripe}
              strokeWidth={34}
              strokeDasharray="4 17"
              strokeDashoffset={-9}
            />
            <path
              d={TAIL_CENTER}
              pathLength={100}
              fill="none"
              stroke={C.cream}
              strokeWidth={34}
              strokeDasharray="0 89 11 100"
            />
          </g>
        </motion.g>

        {/* ---------- body ---------- */}
        <motion.g variants={V.body} style={origin(0.5, 1)}>
          <ellipse cx="120" cy="206" rx="56" ry="55" fill={ref("body")} />
          <ellipse cx="120" cy="217" rx="37" ry="40" fill={ref("belly")} />
          <g stroke={C.stripe} strokeWidth={4.5} strokeLinecap="round" fill="none">
            <path d="M67 192 l11 4" />
            <path d="M66 207 l12 1" />
            <path d="M173 192 l-11 4" />
            <path d="M174 207 l-12 1" />
          </g>
        </motion.g>

        {/* hind paws */}
        <ellipse cx="92" cy="257" rx="20" ry="11" fill={C.cream} />
        <ellipse cx="148" cy="257" rx="20" ry="11" fill={C.cream} />
        <g stroke={C.orange} strokeWidth={2} strokeLinecap="round" opacity={0.55}>
          <path d="M86 260 v5 M93 261 v5 M100 260 v5" />
          <path d="M140 260 v5 M147 261 v5 M154 260 v5" />
        </g>

        {/* ---------- arms ---------- */}
        <g transform="translate(78 186)">
          <motion.g variants={V.armL} style={origin(0.5, 0)}>
            <rect x={-10} y={0} width={20} height={54} rx={10} fill={C.orange} stroke={C.stripe} strokeOpacity={0.45} strokeWidth={1.5} />
            <circle cx={0} cy={50} r={12} fill={C.cream} />
          </motion.g>
        </g>
        <g transform="translate(162 186)">
          <motion.g variants={V.armR} style={origin(0.5, 0)}>
            <rect x={-10} y={0} width={20} height={54} rx={10} fill={C.orange} stroke={C.stripe} strokeOpacity={0.45} strokeWidth={1.5} />
            <circle cx={0} cy={50} r={12} fill={C.cream} />
          </motion.g>
        </g>

        {/* ---------- head ---------- */}
        <motion.g variants={V.head} style={origin(0.5, 0.92)}>
          {/* ears */}
          <motion.g variants={V.earL} style={origin(0.5, 1)}>
            <polygon points="50,90 50,26 106,58" fill={C.orange} stroke={C.orange} strokeWidth={9} strokeLinejoin="round" />
            <polygon points="60,78 60,44 89,61" fill={C.pink} stroke={C.pink} strokeWidth={5} strokeLinejoin="round" />
          </motion.g>
          <motion.g variants={V.earR} style={origin(0.5, 1)}>
            <polygon points="190,90 190,26 134,58" fill={C.orange} stroke={C.orange} strokeWidth={9} strokeLinejoin="round" />
            <polygon points="180,78 180,44 151,61" fill={C.pink} stroke={C.pink} strokeWidth={5} strokeLinejoin="round" />
          </motion.g>

          <ellipse cx="120" cy="108" rx="78" ry="66" fill={ref("head")} />

          {/* forehead + cheek stripes */}
          <g stroke={C.stripe} strokeWidth={5} strokeLinecap="round" fill="none">
            <path d="M120 51 v15" />
            <path d="M103 54 l3 13" />
            <path d="M137 54 l-3 13" />
            <path d="M48 96 l12 3" />
            <path d="M47 108 l13 0" />
            <path d="M192 96 l-12 3" />
            <path d="M193 108 l-13 0" />
          </g>

          {/* muzzle + blush */}
          <ellipse cx="120" cy="134" rx="38" ry="28" fill={ref("belly")} />
          <ellipse cx="65" cy="132" rx="9" ry="6" fill={C.pink} opacity={0.55} />
          <ellipse cx="175" cy="132" rx="9" ry="6" fill={C.pink} opacity={0.55} />

          {/* eyebrows (separate from the stripes so they can move) */}
          <g transform="translate(90 77)">
            <motion.g variants={V.browL} style={origin(0.5, 0.5)}>
              <path d="M-13 3 Q0 -5 13 3" fill="none" stroke={C.brow} strokeWidth={3.5} strokeLinecap="round" />
            </motion.g>
          </g>
          <g transform="translate(150 77)">
            <motion.g variants={V.browR} style={origin(0.5, 0.5)}>
              <path d="M-13 3 Q0 -5 13 3" fill="none" stroke={C.brow} strokeWidth={3.5} strokeLinecap="round" />
            </motion.g>
          </g>

          {/* eyes: open */}
          <motion.g variants={V.eyesLook}>
            <motion.g variants={V.eyesOpen} style={origin(0.5, 0.5)}>
              {[90, 150].map((cx) => (
                <g key={cx} transform={`translate(${cx} 106)`}>
                  <ellipse rx={15} ry={18} fill={C.ink} />
                  <circle cx={-4} cy={-6} r={5.5} fill="#fff" />
                  <circle cx={5} cy={7} r={2.8} fill="#fff" />
                </g>
              ))}
            </motion.g>
          </motion.g>
          {/* eyes: happy "^ ^" */}
          <motion.g variants={V.eyesHappy}>
            {[90, 150].map((cx) => (
              <path
                key={cx}
                d={`M${cx - 13} 112 Q${cx} 92 ${cx + 13} 112`}
                fill="none"
                stroke={C.ink}
                strokeWidth={5.5}
                strokeLinecap="round"
              />
            ))}
          </motion.g>

          {/* tear (sad only) */}
          <g transform="translate(78 126)">
            <motion.path
              d="M0 -6 Q6.5 2 0 7.5 Q-6.5 2 0 -6Z"
              fill={C.tear}
              variants={V.tear}
            />
          </g>

          {/* nose */}
          <path
            d="M112 122 H128 Q128 128 120 132 Q112 128 112 122Z"
            fill={C.pink}
            stroke={C.pink}
            strokeWidth={2}
            strokeLinejoin="round"
          />

          {/* mouths */}
          <motion.g variants={V.mouthSmile}>
            <path
              d="M120 132 V136 M120 136 Q113 146 105 138 M120 136 Q127 146 135 138"
              fill="none"
              stroke={C.mouth}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.g>
          <motion.g variants={V.mouthSad}>
            <path
              d="M120 132 V139 M120 139 Q113 132 106 142 M120 139 Q127 132 134 142"
              fill="none"
              stroke={C.mouth}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.g>
          <g transform="translate(120 137)">
            <motion.g variants={V.mouthOpen} style={origin(0.5, 0)}>
              <path d="M-16 0 Q0 -3 16 0 Q14 21 0 21 Q-14 21 -16 0Z" fill={C.inside} />
              <ellipse cx={0} cy={15} rx={8} ry={5} fill={C.tongue} />
            </motion.g>
          </g>

          {/* whiskers */}
          <g stroke={C.whisker} strokeWidth={2.6} strokeLinecap="round" fill="none">
            <path d="M84 132 L42 123" />
            <path d="M83 139 L38 139" />
            <path d="M84 146 L42 155" />
            <path d="M156 132 L198 123" />
            <path d="M157 139 L202 139" />
            <path d="M156 146 L198 155" />
          </g>
        </motion.g>

        {/* ---------- sparkles (happy only, skipped for reduced motion) ---------- */}
        {!reduced &&
          SPARKLES.map((s, i) => (
            <g key={i} transform={`translate(${s.x} ${s.y})`}>
              <motion.path
                d={STAR}
                fill={s.color}
                initial={{ opacity: 0, scale: 0 }}
                animate={
                  state === "happy"
                    ? {
                        opacity: [0, 1, 0],
                        scale: [0, 1.7, 0.7],
                        x: [0, s.dx],
                        y: [0, s.dy],
                      }
                    : { opacity: 0, scale: 0, x: 0, y: 0 }
                }
                transition={
                  state === "happy"
                    ? {
                        duration: 1.1,
                        delay: s.delay,
                        repeat: Infinity,
                        repeatDelay: 0.25,
                        ease: "easeOut",
                      }
                    : { duration: 0.15 }
                }
                style={origin(0.5, 0.5)}
              />
            </g>
          ))}
      </motion.g>
    </svg>
  );
}

export default Mascot;
