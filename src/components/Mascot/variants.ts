import type { TargetAndTransition, Variants } from "framer-motion";
import type { MascotState } from "./types";

type Pose = Record<string, number>;

interface Loop {
  values: number[];
  duration: number;
  times?: number[];
  delay?: number;
  repeatDelay?: number;
  /** Extra repeats after the first run. Default: Infinity. */
  repeat?: number;
}

type Loops = Record<string, Loop>;
type Spec = Record<MascotState, [Pose, Loops?]>;

/**
 * One variant = a static `pose` (spring) plus optional keyframe `loops` (tween).
 * With reduced motion only the static pose is applied: no loops at all.
 */
function make(pose: Pose, loops: Loops, reduced: boolean): TargetAndTransition {
  if (reduced) {
    return { ...pose, transition: { duration: 0.15 } };
  }
  const target: Record<string, number | number[]> = { ...pose };
  const transition: Record<string, unknown> = {
    default: { type: "spring", stiffness: 170, damping: 17 },
  };
  for (const [prop, loop] of Object.entries(loops)) {
    target[prop] = loop.values;
    transition[prop] = {
      duration: loop.duration,
      ease: "easeInOut",
      times: loop.times,
      delay: loop.delay,
      repeat: loop.repeat ?? Infinity,
      repeatDelay: loop.repeatDelay,
    };
  }
  return { ...target, transition } as TargetAndTransition;
}

function part(spec: Spec, reduced: boolean): Variants {
  const out: Variants = {};
  for (const state of Object.keys(spec) as MascotState[]) {
    const [pose, loops] = spec[state];
    out[state] = make(pose, loops ?? {}, reduced);
  }
  return out;
}

const BLINK: Loop = { values: [1, 1, 0.1, 1, 1], times: [0, 0.46, 0.5, 0.54, 1], duration: 4.2 };

export function buildVariants(reduced: boolean) {
  const v = (spec: Spec) => part(spec, reduced);

  return {
    /** Whole character: float, jump, slump. */
    root: v({
      idle: [{ y: 0 }, { y: { values: [0, -3, 0], duration: 3.2 } }],
      happy: [{ y: 0 }, { y: { values: [0, -26, 0, -14, 0], duration: 1.1, repeatDelay: 0.25 } }],
      sad: [{ y: 5 }],
      thinking: [{ y: 0 }],
      talking: [{ y: 0 }, { y: { values: [0, -2, 0], duration: 0.5 } }],
      wave: [{ y: 0 }],
    }),

    shadow: v({
      idle: [{ scaleX: 1, opacity: 0.18 }],
      happy: [{ opacity: 0.18 }, { scaleX: { values: [1, 0.78, 1, 0.9, 1], duration: 1.1, repeatDelay: 0.25 } }],
      sad: [{ scaleX: 1.05, opacity: 0.2 }],
      thinking: [{ scaleX: 1, opacity: 0.18 }],
      talking: [{ scaleX: 1, opacity: 0.18 }],
      wave: [{ scaleX: 1, opacity: 0.18 }],
    }),

    body: v({
      idle: [{ scaleX: 1 }, { scaleY: { values: [1, 1.025, 1], duration: 3.2 } }],
      happy: [{ scaleX: 1, scaleY: 1 }],
      sad: [{ scaleX: 1.03, scaleY: 0.97 }],
      thinking: [{ scaleX: 1, scaleY: 1 }],
      talking: [{ scaleX: 1 }, { scaleY: { values: [1, 1.02, 1], duration: 1.6 } }],
      wave: [{ scaleX: 1, scaleY: 1 }],
    }),

    head: v({
      idle: [{ y: 0 }, { rotate: { values: [0, 1.5, 0, -1.5, 0], duration: 6 } }],
      happy: [{ y: -2 }, { rotate: { values: [-4, 4, -4], duration: 0.9 } }],
      sad: [{ y: 7, rotate: -7 }],
      thinking: [{ y: 0, rotate: 9 }],
      talking: [{ y: 0 }, { rotate: { values: [0, 2.5, -1, 1.5, 0], duration: 1.3 } }],
      wave: [{ y: 0, rotate: 3 }],
    }),

    earL: v({
      idle: [{ scaleY: 1 }, { rotate: { values: [0, 0, -9, 0, 0], times: [0, 0.8, 0.86, 0.93, 1], duration: 5 } }],
      happy: [{ rotate: -7, scaleY: 1.08 }],
      sad: [{ rotate: -20, scaleY: 0.92 }],
      thinking: [{ rotate: 0, scaleY: 1 }],
      talking: [{ scaleY: 1 }, { rotate: { values: [0, -3, 0], duration: 1.3 } }],
      wave: [{ rotate: 0, scaleY: 1 }],
    }),

    earR: v({
      idle: [{ scaleY: 1 }, { rotate: { values: [0, 0, 9, 0, 0], times: [0, 0.8, 0.86, 0.93, 1], duration: 5, delay: 2 } }],
      happy: [{ rotate: 7, scaleY: 1.08 }],
      sad: [{ rotate: 20, scaleY: 0.92 }],
      thinking: [{ rotate: 12, scaleY: 1.06 }],
      talking: [{ scaleY: 1 }, { rotate: { values: [0, 3, 0], duration: 1.3 } }],
      wave: [{ rotate: 0, scaleY: 1 }],
    }),

    /** Eyes: gaze offset (x/y) – used for "thinking". */
    eyesLook: v({
      idle: [{ x: 0, y: 0 }],
      happy: [{ x: 0, y: 0 }],
      sad: [{ x: 0, y: 2 }],
      thinking: [{ x: 7, y: -5 }],
      talking: [{ x: 0, y: 0 }],
      wave: [{ x: 0, y: 0 }],
    }),

    /** Eyes: blinking and the droopy "sad" squash. */
    eyesOpen: v({
      idle: [{ opacity: 1, scaleY: 1 }, { scaleY: BLINK }],
      happy: [{ opacity: 0, scaleY: 1 }],
      sad: [{ opacity: 1, scaleY: 0.82 }],
      thinking: [{ opacity: 1, scaleY: 1 }, { scaleY: { ...BLINK, delay: 1 } }],
      talking: [{ opacity: 1, scaleY: 1 }, { scaleY: { ...BLINK, delay: 0.6 } }],
      wave: [{ opacity: 1, scaleY: 1 }, { scaleY: BLINK }],
    }),

    /** "^ ^" eyes shown only while happy. */
    eyesHappy: v({
      idle: [{ opacity: 0 }],
      happy: [{ opacity: 1 }],
      sad: [{ opacity: 0 }],
      thinking: [{ opacity: 0 }],
      talking: [{ opacity: 0 }],
      wave: [{ opacity: 0 }],
    }),

    browL: v({
      idle: [{ y: 0, rotate: 0 }],
      happy: [{ y: -7, rotate: 0 }],
      sad: [{ y: 2, rotate: -17 }],
      thinking: [{ y: 2, rotate: 7 }],
      talking: [{ rotate: 0 }, { y: { values: [0, -3, 0, -2, 0], duration: 1.3 } }],
      wave: [{ y: -3, rotate: 0 }],
    }),

    browR: v({
      idle: [{ y: 0, rotate: 0 }],
      happy: [{ y: -7, rotate: 0 }],
      sad: [{ y: 2, rotate: 17 }],
      thinking: [{ y: -10, rotate: -6 }],
      talking: [{ rotate: 0 }, { y: { values: [0, -2, 0, -3, 0], duration: 1.3 } }],
      wave: [{ y: -3, rotate: 0 }],
    }),

    mouthSmile: v({
      idle: [{ opacity: 1, x: 0 }],
      happy: [{ opacity: 0, x: 0 }],
      sad: [{ opacity: 0, x: 0 }],
      thinking: [{ opacity: 1, x: 6 }],
      talking: [{ opacity: 0, x: 0 }],
      wave: [{ opacity: 1, x: 0 }],
    }),

    mouthSad: v({
      idle: [{ opacity: 0 }],
      happy: [{ opacity: 0 }],
      sad: [{ opacity: 1 }],
      thinking: [{ opacity: 0 }],
      talking: [{ opacity: 0 }],
      wave: [{ opacity: 0 }],
    }),

    /** Open mouth: a big grin when happy, a talking loop when talking. */
    mouthOpen: v({
      idle: [{ opacity: 0, scaleY: 0.2 }],
      happy: [{ opacity: 1, scaleY: 1 }],
      sad: [{ opacity: 0, scaleY: 0.2 }],
      thinking: [{ opacity: 0, scaleY: 0.2 }],
      talking: [
        { opacity: 1 },
        { scaleY: { values: [0.2, 1, 0.35, 0.9, 0.15, 0.7, 0.2], duration: 0.9 } },
      ],
      wave: [{ opacity: 0, scaleY: 0.2 }],
    }),

    tail: v({
      idle: [{ rotate: 0 }, { rotate: { values: [0, 7, 0, -5, 0], duration: 4 } }],
      happy: [{ rotate: 0 }, { rotate: { values: [-14, 16, -14], duration: 0.35 } }],
      sad: [{ rotate: 26 }],
      thinking: [{ rotate: 0 }, { rotate: { values: [-4, 9, -4], duration: 3 } }],
      talking: [{ rotate: 0 }, { rotate: { values: [0, 6, 0], duration: 2.4 } }],
      wave: [{ rotate: 0 }, { rotate: { values: [0, 12, 0, 12, 0], duration: 1.2 } }],
    }),

    /** Arms: positive rotate swings the left arm outward, negative the right arm. */
    armL: v({
      idle: [{ rotate: 0 }, { rotate: { values: [0, 2.5, 0], duration: 3.2 } }],
      happy: [{ rotate: 115 }, { rotate: { values: [105, 128, 105], duration: 0.55 } }],
      sad: [{ rotate: -4 }],
      thinking: [{ rotate: 0 }],
      talking: [{ rotate: 0 }, { rotate: { values: [0, 8, 0], duration: 1.3 } }],
      wave: [{ rotate: 0 }],
    }),

    armR: v({
      idle: [{ rotate: 0 }, { rotate: { values: [0, -2.5, 0], duration: 3.2 } }],
      happy: [{ rotate: -115 }, { rotate: { values: [-105, -128, -105], duration: 0.55 } }],
      sad: [{ rotate: 4 }],
      thinking: [{ rotate: -14 }],
      talking: [{ rotate: 0 }, { rotate: { values: [0, -8, 0], duration: 1.3 } }],
      wave: [
        { rotate: -135 },
        {
          rotate: {
            values: [0, -135, -108, -135, -108, -135, -108, -135, 0],
            duration: 2.6,
            repeat: 0,
          },
        },
      ],
    }),

    tear: v({
      idle: [{ opacity: 0, y: 0 }],
      happy: [{ opacity: 0, y: 0 }],
      sad: [
        { opacity: 1, y: 0 },
        {
          y: { values: [0, 18], duration: 1.4 },
          opacity: { values: [0, 1, 1, 0], times: [0, 0.2, 0.7, 1], duration: 1.4 },
        },
      ],
      thinking: [{ opacity: 0, y: 0 }],
      talking: [{ opacity: 0, y: 0 }],
      wave: [{ opacity: 0, y: 0 }],
    }),
  };
}

export type MascotVariants = ReturnType<typeof buildVariants>;
