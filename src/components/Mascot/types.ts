export const MASCOT_STATES = [
  "idle",
  "happy",
  "sad",
  "thinking",
  "talking",
  "wave",
] as const;

export type MascotState = (typeof MASCOT_STATES)[number];

export interface MascotProps {
  /** Which animation/pose to play. Default: "idle". */
  state?: MascotState;
  /** Width in px (height is derived from the aspect ratio). Default: 160. */
  size?: number;
  className?: string;
  /** Accessible label. Default: "Milo the kitten". */
  title?: string;
}
