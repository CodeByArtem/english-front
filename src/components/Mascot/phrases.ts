export const GREETINGS = [
  "Hello! Ready to learn English?",
  "Hi there! Good to see you!",
  "Welcome back! Let's practice!",
  "Hey! You're doing great!",
] as const;

export const PRAISE = [
  "Great job! Keep going!",
  "Well done! That was awesome!",
  "You did it! Proud of you!",
  "Spot on! Excellent work!",
  "Brilliant! 🌟",
] as const;

export const ENCOURAGE = [
  "Don't worry, try again!",
  "Almost there! You can do it!",
  "Take your time, read carefully!",
  "Mistakes help us learn!",
] as const;

export const INVITES = [
  "Let's learn new words today!",
  "Listen to the audio track again!",
  "Practice makes perfect!",
  "You've got this! Let's go!",
] as const;

export const STUDY_TIPS = [
  "Tip: Say the words out loud!",
  "Tip: Look at the examples in the table!",
  "Tip: Check the spelling carefully!",
] as const;

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
