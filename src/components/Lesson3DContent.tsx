'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLessonContext, useExerciseAnswer, LessonContextModel } from '@/context/LessonContext';
import TeacherAnswerBadge from '@/components/TeacherAnswerBadge';
import PronounceButton from '@/components/PronounceButton';
import { LessonAnswerKey, verifyAnswer, getExerciseKey, VerificationResult } from '@/lib/answerVerification';
import styles from './lesson3d.module.scss';

export interface Lesson3DContentProps {
  lesson?: LessonContextModel | null;
  user?: Record<string, unknown> | null;
  isTeacherReview?: boolean;
  readOnly?: boolean;
  answerKey?: LessonAnswerKey | null;
  playAudio?: (track: string) => void;
  playingAudio?: string | null;
  originalAnswers?: Record<string, unknown>;
}

// Захардкоженный fallbackAnswerKey для полной автономности и мгновенной проверки
export const FALLBACK_ANSWER_KEY_3D: LessonAnswerKey = {
  exercise_2a_questions: {
    '1': ['at the train station', 'train station', 'the train station', 'station', 'at the station'],
    '2': [
      'at the restaurant',
      'at the Polish restaurant',
      'the restaurant',
      'the Polish restaurant',
      'Polish restaurant',
      'restaurant',
      'on Main Street',
      'Main Street',
    ],
  },
  exercise_2b_order: {
    A: ['4', '1', 'go straight on'],
    B: ['3', '5', 'turn left'],
    C: ['2', '3', 'turn right'],
    D: ['5', '2', 'go past the hotel'],
    E: ['6', 'the restaurant is next to a bank'],
    F: ['1', '4', 'go down Station Road'],
  },
  exercise_3_phrases_order: {
    '1': ['3', 'Is there a supermarket near here?'],
    '2': ['4', "Yes, there's one on Station Road."],
    '3': ['1'],
    '4': ['2', "It's on Park Street."],
    '5': ['9', 'Go past the bank.'],
    '6': ['6', 'Go straight on.'],
    '7': ['5', 'Go down Main Street.'],
    '8': ['7', 'Turn left at the bookshop.'],
    '9': ['8', 'Turn right after the big house.'],
    '10': ['10', "It's next to a restaurant."],
    '11': ['11', "It's on the right."],
    '12': ['12', 'The supermarket is on the right.'],
  },
  exercise_4a_conversations: {
    '1': [
      'Is there a supermarket near here?',
      'is there a supermarket near here?',
      'Is there a supermarket near here',
      'Where is the supermarket?',
      "Where's the supermarket?",
    ],
    '2': [
      'Go straight on',
      'go straight on',
      'Go down Station Road',
      'go down Station Road',
    ],
    '3': [
      "Where's the cinema, please?",
      "where's the cinema, please?",
      "Where is the cinema, please?",
      "Where's the cinema?",
      'Where is the cinema?',
      'Is there a cinema near here?',
    ],
    '4': [
      'turn left into Park Street',
      'Turn left into Park Street',
      'turn left',
      'Turn left',
    ],
    '5': [
      'turn left at the bookshop',
      'Turn left at the bookshop',
      'turn left into Market Street',
      'turn left into Bank Road',
      'turn left',
      'Turn left',
    ],
  },
  review_1a_places: {
    '1': ['train station'],
    '2': ['cinema'],
    '3': ['café', 'cafe'],
    '4': ['supermarket'],
    '5': ['park'],
    '6': ['hotel'],
    '7': ['house'],
    '8': ['flat'],
    '9': ['bank'],
    '10': ['restaurant'],
    '11': ['market'],
    '12': ['bookshop'],
  },
  review_2_is_are: {
    '2': ['is', "'s"],
    '3': ["isn't", 'is not', 'isnt'],
    '4': ['are', "'re"],
    '5': ["aren't", 'are not', 'arent'],
    '6': ['are', "'re"],
    '7': ['are', "'re"],
    '8': ["isn't", 'is not', 'isnt'],
  },
  review_3_corrections: {
    '1': [
      'There are no dogs in the park today.',
      'There are no dogs in the park today',
      "There aren't any dogs in the park today.",
      "There aren't any dogs in the park today",
    ],
    '2': [
      'There are three keys in the kitchen.',
      'There are three keys in the kitchen',
    ],
    '3': [
      "There's a box in the living room.",
      "There's a box in the living room",
      'There is a box in the living room.',
      'There is a box in the living room',
    ],
    '4': [
      "There isn't a teacher in our class today!",
      "There isn't a teacher in our class today",
      'There is not a teacher in our class today!',
      'There is not a teacher in our class today',
    ],
  },
  review_4_alternatives: {
    '1': ['kitchen'],
    '2': ['living room'],
    '3': ['bathrooms'],
    '4': ['beds'],
    '5': ['shower'],
    '6': ['TV', 'tv'],
  },
  review_5a_classroom: {
    '2': ['Are there any', 'are there any'],
    '3a': ['How many', 'how many'],
    '3b': ['are there'],
    '4': ['Is there', 'is there'],
    '5': ['Are there any', 'are there any'],
    '6a': ['How many', 'how many'],
    '6b': ['are there'],
  },
  review_6_adjectives: {
    '2': ['old'],
    '3': ['big', 'large'],
    '4': ['quiet'],
    '5': ['expensive'],
    '6': ['busy'],
    '7': ['cheap'],
  },
  review_7_rewrite: {
    '3': ['shop is cheap'],
    '4': ['are new houses', 'are new'],
    '5': ['street is quiet'],
    '6': ['is a busy station', 'is busy'],
    '7': ['computers are new'],
    '8': ['is an old man', 'is old'],
  },
  review_8a_order: {
    '2': ['Is your town busy?', 'Is your town busy'],
    '3': ['Is there a quiet park near your house?', 'Is there a quiet park near your house'],
    '4': [
      'Is your house big or small?',
      'Is your house small or big?',
      'Is your house big or small',
      'Is your house small or big',
    ],
    '5': [
      'Are hotels in your town expensive or cheap?',
      'Are hotels in your town cheap or expensive?',
      'Are hotels in your town expensive or cheap',
      'Are hotels in your town cheap or expensive',
    ],
  },
};

const MAP_PLACES = [
  { id: '1', name: 'Train station ("You are here!")' },
  { id: '2', name: 'Turkish restaurant' },
  { id: '3', name: 'Supermarket' },
  { id: '4', name: 'Hotel' },
  { id: '5', name: 'Café' },
  { id: '6', name: 'Cinema' },
  { id: '7', name: 'Park' },
  { id: '8', name: 'School' },
  { id: '9', name: 'Thai restaurant' },
  { id: '10', name: 'Bookshop' },
  { id: '11', name: 'Bank' },
  { id: '12', name: 'Polish restaurant' },
  { id: '13', name: 'Big house' },
];

const DIRECTION_DIAGRAM_ITEMS = [
  { key: 'A', text: 'Go straight on.' },
  { key: 'B', text: 'Turn left.' },
  { key: 'C', text: 'Turn right.' },
  { key: 'D', text: 'Go past the hotel.' },
  { key: 'E', text: 'The restaurant is next to a bank.' },
  { key: 'F', text: 'Go down Station Road.' },
];

const USEFUL_PHRASES_ITEMS = [
  { id: '1', text: 'Is there a (supermarket) near here?', audioPhrase: 'Is there a supermarket near here?' },
  { id: '2', text: "Yes, there's one on (Station Road).", audioPhrase: "Yes, there's one on Station Road." },
  { id: '3', text: "Excuse me. Where's the (cinema), please?", isExample: true, exampleNum: '1', audioPhrase: "Excuse me. Where's the cinema, please?" },
  { id: '4', text: "It's on (Park Street).", audioPhrase: "It's on Park Street." },
  { id: '5', text: 'Go past the (bank).', audioPhrase: 'Go past the bank.' },
  { id: '6', text: 'Go straight on.', audioPhrase: 'Go straight on.' },
  { id: '7', text: 'Go down (Main Street).', audioPhrase: 'Go down Main Street.' },
  { id: '8', text: 'Turn left (at the bookshop).', audioPhrase: 'Turn left at the bookshop.' },
  { id: '9', text: 'Turn right (after the big house).', audioPhrase: 'Turn right after the big house.' },
  { id: '10', text: "It's next to (a restaurant).", audioPhrase: "It's next to a restaurant." },
  { id: '11', text: "It's on the right.", audioPhrase: "It's on the right." },
  { id: '12', text: '(The supermarket) is on the right.', audioPhrase: 'The supermarket is on the right.' },
];

export type WordToken =
  | { type: 'fixed'; char: string }
  | { type: 'gap'; gapIndex: number; expected: string }
  | { type: 'space' };

export interface PlaceWordItem {
  id: string;
  full: string;
  totalGaps: number;
  tokens: WordToken[];
}

const PLACES_WORD_GAPS: PlaceWordItem[] = [
  {
    id: '1',
    full: 'train station',
    totalGaps: 8,
    tokens: [
      { type: 'fixed', char: 't' },
      { type: 'gap', gapIndex: 0, expected: 'r' },
      { type: 'gap', gapIndex: 1, expected: 'a' },
      { type: 'fixed', char: 'i' },
      { type: 'gap', gapIndex: 2, expected: 'n' },
      { type: 'space' },
      { type: 'fixed', char: 's' },
      { type: 'fixed', char: 't' },
      { type: 'gap', gapIndex: 3, expected: 'a' },
      { type: 'gap', gapIndex: 4, expected: 't' },
      { type: 'fixed', char: 'i' },
      { type: 'gap', gapIndex: 5, expected: 'o' },
      { type: 'gap', gapIndex: 6, expected: 'n' },
    ],
  },
  {
    id: '2',
    full: 'cinema',
    totalGaps: 4,
    tokens: [
      { type: 'fixed', char: 'c' },
      { type: 'gap', gapIndex: 0, expected: 'i' },
      { type: 'fixed', char: 'n' },
      { type: 'gap', gapIndex: 1, expected: 'e' },
      { type: 'gap', gapIndex: 2, expected: 'm' },
      { type: 'gap', gapIndex: 3, expected: 'a' },
    ],
  },
  {
    id: '3',
    full: 'café',
    totalGaps: 2,
    tokens: [
      { type: 'fixed', char: 'c' },
      { type: 'gap', gapIndex: 0, expected: 'a' },
      { type: 'fixed', char: 'f' },
      { type: 'gap', gapIndex: 1, expected: 'e' },
    ],
  },
  {
    id: '4',
    full: 'supermarket',
    totalGaps: 6,
    tokens: [
      { type: 'fixed', char: 's' },
      { type: 'gap', gapIndex: 0, expected: 'u' },
      { type: 'fixed', char: 'p' },
      { type: 'gap', gapIndex: 1, expected: 'e' },
      { type: 'gap', gapIndex: 2, expected: 'r' },
      { type: 'fixed', char: 'm' },
      { type: 'gap', gapIndex: 3, expected: 'a' },
      { type: 'gap', gapIndex: 4, expected: 'r' },
      { type: 'fixed', char: 'k' },
      { type: 'gap', gapIndex: 5, expected: 'e' },
      { type: 'fixed', char: 't' },
    ],
  },
  {
    id: '5',
    full: 'park',
    totalGaps: 2,
    tokens: [
      { type: 'fixed', char: 'p' },
      { type: 'gap', gapIndex: 0, expected: 'a' },
      { type: 'gap', gapIndex: 1, expected: 'r' },
      { type: 'fixed', char: 'k' },
    ],
  },
  {
    id: '6',
    full: 'hotel',
    totalGaps: 3,
    tokens: [
      { type: 'fixed', char: 'h' },
      { type: 'gap', gapIndex: 0, expected: 'o' },
      { type: 'fixed', char: 't' },
      { type: 'gap', gapIndex: 1, expected: 'e' },
      { type: 'gap', gapIndex: 2, expected: 'l' },
    ],
  },
  {
    id: '7',
    full: 'house',
    totalGaps: 3,
    tokens: [
      { type: 'fixed', char: 'h' },
      { type: 'gap', gapIndex: 0, expected: 'o' },
      { type: 'gap', gapIndex: 1, expected: 'u' },
      { type: 'fixed', char: 's' },
      { type: 'gap', gapIndex: 2, expected: 'e' },
    ],
  },
  {
    id: '8',
    full: 'flat',
    totalGaps: 2,
    tokens: [
      { type: 'fixed', char: 'f' },
      { type: 'fixed', char: 'l' },
      { type: 'gap', gapIndex: 0, expected: 'a' },
      { type: 'gap', gapIndex: 1, expected: 't' },
    ],
  },
  {
    id: '9',
    full: 'bank',
    totalGaps: 2,
    tokens: [
      { type: 'fixed', char: 'b' },
      { type: 'gap', gapIndex: 0, expected: 'a' },
      { type: 'gap', gapIndex: 1, expected: 'n' },
      { type: 'fixed', char: 'k' },
    ],
  },
  {
    id: '10',
    full: 'restaurant',
    totalGaps: 6,
    tokens: [
      { type: 'fixed', char: 'r' },
      { type: 'gap', gapIndex: 0, expected: 'e' },
      { type: 'gap', gapIndex: 1, expected: 's' },
      { type: 'gap', gapIndex: 2, expected: 't' },
      { type: 'fixed', char: 'a' },
      { type: 'gap', gapIndex: 3, expected: 'u' },
      { type: 'gap', gapIndex: 4, expected: 'r' },
      { type: 'fixed', char: 'a' },
      { type: 'gap', gapIndex: 5, expected: 'n' },
      { type: 'fixed', char: 't' },
    ],
  },
  {
    id: '11',
    full: 'market',
    totalGaps: 4,
    tokens: [
      { type: 'fixed', char: 'm' },
      { type: 'gap', gapIndex: 0, expected: 'a' },
      { type: 'gap', gapIndex: 1, expected: 'r' },
      { type: 'fixed', char: 'k' },
      { type: 'gap', gapIndex: 2, expected: 'e' },
      { type: 'gap', gapIndex: 3, expected: 't' },
    ],
  },
  {
    id: '12',
    full: 'bookshop',
    totalGaps: 5,
    tokens: [
      { type: 'fixed', char: 'b' },
      { type: 'gap', gapIndex: 0, expected: 'o' },
      { type: 'gap', gapIndex: 1, expected: 'o' },
      { type: 'fixed', char: 'k' },
      { type: 'gap', gapIndex: 2, expected: 's' },
      { type: 'gap', gapIndex: 3, expected: 'h' },
      { type: 'gap', gapIndex: 4, expected: 'o' },
      { type: 'fixed', char: 'p' },
    ],
  },
];

interface PlaceWordLetterRowProps {
  item: PlaceWordItem;
  value: string;
  onChange: (val: string) => void;
  isReview?: boolean;
  verifyResult?: VerificationResult | null;
  disabled?: boolean;
  isDiff?: boolean;
}

function PlaceWordLetterRow({
  item,
  value,
  onChange,
  isReview,
  verifyResult,
  disabled,
  isDiff,
}: PlaceWordLetterRowProps) {
  const gapValues = React.useMemo(() => {
    const res: string[] = new Array(item.totalGaps).fill('');
    if (!value) return res;

    let valIdx = 0;
    let gIdx = 0;
    for (const token of item.tokens) {
      if (token.type === 'fixed') {
        if (valIdx < value.length && value[valIdx].toLowerCase() === token.char.toLowerCase()) {
          valIdx++;
        } else if (valIdx < value.length) {
          valIdx++;
        }
      } else if (token.type === 'space') {
        if (valIdx < value.length && value[valIdx] === ' ') {
          valIdx++;
        }
      } else if (token.type === 'gap') {
        if (valIdx < value.length) {
          const char = value[valIdx];
          res[gIdx] = char === ' ' ? '' : char;
          valIdx++;
        }
        gIdx++;
      }
    }
    return res;
  }, [item.tokens, item.totalGaps, value]);

  const assembleWord = (newGaps: string[]): string => {
    let result = '';
    let gIdx = 0;
    for (const token of item.tokens) {
      if (token.type === 'fixed') {
        result += token.char;
      } else if (token.type === 'space') {
        result += ' ';
      } else if (token.type === 'gap') {
        result += newGaps[gIdx] || ' ';
        gIdx++;
      }
    }
    return result.trimEnd();
  };

  const handleCharInput = (gIdx: number, rawInput: string) => {
    const char = rawInput.slice(-1);
    const newGaps = [...gapValues];
    newGaps[gIdx] = char;
    onChange(assembleWord(newGaps));

    if (char && gIdx < item.totalGaps - 1) {
      const nextInput = document.getElementById(`place-gap-${item.id}-${gIdx + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
        (nextInput as HTMLInputElement).select();
      }
    }
  };

  const handleKeyDown = (gIdx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!gapValues[gIdx] && gIdx > 0) {
        e.preventDefault();
        const prevInput = document.getElementById(`place-gap-${item.id}-${gIdx - 1}`);
        if (prevInput) {
          (prevInput as HTMLInputElement).focus();
          (prevInput as HTMLInputElement).select();
        }
      }
    } else if (e.key === 'ArrowLeft' && gIdx > 0) {
      e.preventDefault();
      const prevInput = document.getElementById(`place-gap-${item.id}-${gIdx - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
        (prevInput as HTMLInputElement).select();
      }
    } else if (e.key === 'ArrowRight' && gIdx < item.totalGaps - 1) {
      e.preventDefault();
      const nextInput = document.getElementById(`place-gap-${item.id}-${gIdx + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
        (nextInput as HTMLInputElement).select();
      }
    }
  };

  const getGapClass = () => {
    if (!isReview || !verifyResult || !verifyResult.hasKey) return '';
    return verifyResult.isCorrect ? styles.gapInputValid : styles.gapInputInvalid;
  };

  const wordChunks = React.useMemo(() => {
    const chunks: WordToken[][] = [];
    let curChunk: WordToken[] = [];
    for (const token of item.tokens) {
      if (token.type === 'space') {
        if (curChunk.length > 0) chunks.push(curChunk);
        curChunk = [];
      } else {
        curChunk.push(token);
      }
    }
    if (curChunk.length > 0) chunks.push(curChunk);
    return chunks;
  }, [item.tokens]);

  return (
    <div className={styles.wordGapCard}>
      <div className={styles.wordGapLeft}>
        <span className={styles.gappedItemNum}>{item.id}.</span>
        <div className={`${styles.letterTokensContainer} ${isDiff ? styles.diffHighlight : ''}`}>
          {wordChunks.map((chunk, cIdx) => (
            <div key={`chunk-${cIdx}`} className={styles.wordChunk}>
              {chunk.map((token, tIdx) => {
                if (token.type === 'fixed') {
                  return (
                    <span key={`f-${cIdx}-${tIdx}`} className={styles.fixedChar}>
                      {token.char}
                    </span>
                  );
                }
                if (token.type !== 'gap') return null;
                const gIdx = token.gapIndex;
                return (
                  <input
                    key={`g-${gIdx}`}
                    id={`place-gap-${item.id}-${gIdx}`}
                    type="text"
                    maxLength={2}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    value={gapValues[gIdx] || ''}
                    className={`${styles.gapInput} ${getGapClass()}`}
                    onChange={(e) => handleCharInput(gIdx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(gIdx, e)}
                    disabled={disabled}
                    aria-label={`Letter ${gIdx + 1} of word ${item.id}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
        {isReview && verifyResult?.hasKey && verifyResult.isCorrect && (
          <span className={styles.correctBadge} title="Correct">✓</span>
        )}
      </div>
      {isReview && verifyResult && !verifyResult.isCorrect && (
        <div className={styles.feedbackRow}>
          <TeacherAnswerBadge result={verifyResult} />
        </div>
      )}
    </div>
  );
}

const IS_ARE_ITEMS = [
  { id: '1', prefix: 'There', suffix: 'six good cafés in this town.', isExample: true, exampleVal: 'are' },
  { id: '2', prefix: 'There', suffix: 'a hotel in Baker Street.' },
  { id: '3', prefix: 'Sorry, no, there', suffix: 'a bank near here.' },
  { id: '4', prefix: 'There', suffix: 'two football teams in our town.' },
  { id: '5', prefix: 'No, there', suffix: 'any shops near here.' },
  { id: '6', prefix: 'No, there', suffix: 'no expensive restaurants.' },
  { id: '7', prefix: 'There', suffix: 'three or four supermarkets in the centre.' },
  { id: '8', prefix: 'Oh no, there', suffix: 'a lift in our hotel!' },
];

const CORRECTION_ITEMS = [
  { id: '1', incorrect: "There aren't no dogs in the park today.", hint: 'Correction with "no" or "any"' },
  { id: '2', incorrect: "There's three keys in the kitchen.", hint: "Subject-verb agreement (plural)" },
  { id: '3', incorrect: "There's box in the living room.", hint: 'Missing indefinite article' },
  { id: '4', incorrect: "There aren't a teacher in our class today!", hint: 'Singular negative form' },
];

const ALTERNATIVE_ITEMS = [
  { id: '1', prefix: 'The oven is in the', opt1: 'kitchen', opt2: 'bedroom', suffix: '.' },
  { id: '2', prefix: "There's a table in the", opt1: 'living room', opt2: 'bathroom', suffix: '.' },
  { id: '3', prefix: 'There are three', opt1: 'kitchens', opt2: 'bathrooms', suffix: 'in our house.' },
  { id: '4', prefix: 'There are two', opt1: 'beds', opt2: 'ovens', suffix: 'in my bedroom.' },
  { id: '5', prefix: "There's a", opt1: 'shower', opt2: 'lift', suffix: 'in the bathroom.' },
  { id: '6', prefix: "There's a big", opt1: 'wifi', opt2: 'TV', suffix: 'in the bathroom!' },
];

const CLASSROOM_QUESTIONS = [
  { id: '1', isExample: true, text: 'Is there a TV in our classroom?' },
  { id: '2', promptAfter: 'books?', field: '2', placeholder: 'Are there any' },
  {
    id: '3',
    promptMid: 'desks',
    promptAfter: '?',
    fieldA: '3a',
    fieldB: '3b',
    placeholderA: 'How many',
    placeholderB: 'are there',
  },
  { id: '4', promptAfter: 'a computer?', field: '4', placeholder: 'Is there' },
  { id: '5', promptAfter: 'photos?', field: '5', placeholder: 'Are there any' },
  {
    id: '6',
    promptMid: 'chairs',
    promptAfter: '?',
    fieldA: '6a',
    fieldB: '6b',
    placeholderA: 'How many',
    placeholderB: 'are there',
  },
];

const ADJECTIVE_SENTENCES = [
  { id: '1', isExample: true, text: "It's a small town. There are no hotels or restaurants." },
  { id: '2', before: "My flat isn't new. It's", prompt: 'o _ _', suffix: '.' },
  { id: '3', before: 'There are five bedrooms. It\'s a', prompt: 'b _ _', suffix: 'house.' },
  { id: '4', before: "There aren't any people in the café. It's", prompt: 'q _ _ _ _', suffix: '.' },
  { id: '5', before: 'The flat in Berlin is £500 per night. It\'s', prompt: 'e _ _ _ _ _ _ _ _', suffix: '.' },
  { id: '6', before: 'This is a', prompt: 'b _ _ _', suffix: 'town. There are big shops, a market and a train station.' },
  { id: '7', before: "This clock isn't expensive. It's", prompt: 'c _ _ _ _', suffix: '.' },
];

const REWRITE_SENTENCES = [
  { id: '1', isExample: true, original: 'This is a busy café.', rewritten: 'This café is busy.' },
  { id: '2', isExample: true, original: 'This is an expensive car.', rewritten: 'This car is expensive.' },
  { id: '3', original: 'This is a cheap shop.', before: 'This', suffix: '.' },
  { id: '4', original: 'The houses are new.', before: 'They', suffix: '.' },
  { id: '5', original: 'This is a quiet street.', before: 'This', suffix: '.' },
  { id: '6', original: 'The station is busy.', before: 'It', suffix: '.' },
  { id: '7', original: 'They are new computers.', before: 'The', suffix: '.' },
  { id: '8', original: 'The man is old.', before: 'He', suffix: '.' },
];

const WORD_ORDER_REVIEW = [
  { id: '1', isExample: true, prompt: 'your / computer / Is / new ?', example: 'Is your computer new?' },
  { id: '2', prompt: 'busy / town / Is / your ?' },
  { id: '3', prompt: 'park / Is / a / there / near / house / quiet / your ?' },
  { id: '4', prompt: 'your / big / Is / small / house / or ?' },
  { id: '5', prompt: 'in / expensive / hotels / Are / town / or / your / cheap ?' },
];

const REFLECT_STATEMENTS = [
  { id: '1', text: "I can say what's in a town." },
  { id: '2', text: 'I can talk about a flat.' },
  { id: '3', text: 'I can describe a town or a city.' },
  { id: '4', text: 'I can ask for and give directions.' },
];

export default function Lesson3DContent({
  isTeacherReview,
  readOnly: propReadOnly,
  answerKey: propAnswerKey,
  playAudio: propPlayAudio,
  playingAudio: propPlayingAudio,
  originalAnswers,
}: Lesson3DContentProps) {
  const context = useLessonContext();
  const playAudio = propPlayAudio || context.playAudio;
  const playingAudio = propPlayingAudio ?? context.playingAudio;
  const isTeacher = isTeacherReview ?? context.isTeacher;
  const isReadOnly = propReadOnly ?? context.isReadOnly;
  const effectiveAnswerKey = propAnswerKey ?? context.answerKey ?? FALLBACK_ANSWER_KEY_3D;
  const isReview = Boolean(isTeacher || (effectiveAnswerKey && isReadOnly));
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);

  const orig = originalAnswers ?? (context.answers as Record<string, unknown> | undefined);
  const isDiff = (origVal: unknown, currentVal: unknown) =>
    orig !== undefined && origVal !== undefined && origVal !== currentVal;

  // Состояния упражнений через хук useExerciseAnswer
  // Page 28
  const ex2a = useExerciseAnswer<Record<string, string>>('exercise_2a_questions', {});
  const ex2b = useExerciseAnswer<Record<string, string>>('exercise_2b_order', {});
  const ex2c = useExerciseAnswer<string>('exercise_2c_route', '');
  const ex3 = useExerciseAnswer<Record<string, string>>('exercise_3_phrases_order', { '3': '1' });
  const ex4a = useExerciseAnswer<Record<string, string>>('exercise_4a_conversations', {});
  const ex4b = useExerciseAnswer<string>('exercise_4b_speaking', '');
  const ex5a = useExerciseAnswer<string>('exercise_5a_directions', '');
  const ex5b = useExerciseAnswer<string>('exercise_5b_guessing', '');

  // Page 29 (Review: Check and reflect)
  const rev1a = useExerciseAnswer<Record<string, string>>('review_1a_places', {});
  const rev1b = useExerciseAnswer<string>('review_1b_speaking', '');
  const rev2 = useExerciseAnswer<Record<string, string>>('review_2_is_are', {});
  const rev3 = useExerciseAnswer<Record<string, string>>('review_3_corrections', {});
  const rev4 = useExerciseAnswer<Record<string, string>>('review_4_alternatives', {});
  const rev5a = useExerciseAnswer<Record<string, string>>('review_5a_classroom', {});
  const rev5b = useExerciseAnswer<string>('review_5b_speaking', '');
  const rev6 = useExerciseAnswer<Record<string, string>>('review_6_adjectives', {});
  const rev7 = useExerciseAnswer<Record<string, string>>('review_7_rewrite', {});
  const rev8a = useExerciseAnswer<Record<string, string>>('review_8a_order', {});
  const rev8b = useExerciseAnswer<string>('review_8b_speaking', '');
  const revReflect = useExerciseAnswer<Record<string, number>>('review_reflect_ratings', {});

  const getFieldVerify = (exerciseKey: string, fieldKey: string): VerificationResult | null => {
    const fromCtx = context.getVerification(exerciseKey, fieldKey);
    if (fromCtx) return fromCtx;

    const exKey = getExerciseKey(effectiveAnswerKey, exerciseKey);
    if (!exKey) return null;

    const studentEx = context.getAnswer(exerciseKey);
    const studentVal =
      studentEx && typeof studentEx === 'object'
        ? (studentEx as Record<string, unknown>)[fieldKey]
        : undefined;
    const expected = exKey[fieldKey];
    return verifyAnswer(studentVal, expected);
  };

  const getInputClass = (ver?: VerificationResult | null) => {
    if (!isReview || !ver || !ver.hasKey) return '';
    return ver.isCorrect ? styles.inputValid : styles.inputInvalid;
  };

  // Оригинальные значения для диффа
  const origEx2a = (orig?.exercise_2a_questions as Record<string, string> | undefined) || {};
  const origEx2b = (orig?.exercise_2b_order as Record<string, string> | undefined) || {};
  const origEx2c = typeof orig?.exercise_2c_route === 'string' ? orig.exercise_2c_route : undefined;
  const origEx3 = (orig?.exercise_3_phrases_order as Record<string, string> | undefined) || {};
  const origEx4a = (orig?.exercise_4a_conversations as Record<string, string> | undefined) || {};
  const origEx4b = typeof orig?.exercise_4b_speaking === 'string' ? orig.exercise_4b_speaking : undefined;
  const origEx5a = typeof orig?.exercise_5a_directions === 'string' ? orig.exercise_5a_directions : undefined;
  const origEx5b = typeof orig?.exercise_5b_guessing === 'string' ? orig.exercise_5b_guessing : undefined;

  const origRev1a = (orig?.review_1a_places as Record<string, string> | undefined) || {};
  const origRev1b = typeof orig?.review_1b_speaking === 'string' ? orig.review_1b_speaking : undefined;
  const origRev2 = (orig?.review_2_is_are as Record<string, string> | undefined) || {};
  const origRev3 = (orig?.review_3_corrections as Record<string, string> | undefined) || {};
  const origRev4 = (orig?.review_4_alternatives as Record<string, string> | undefined) || {};
  const origRev5a = (orig?.review_5a_classroom as Record<string, string> | undefined) || {};
  const origRev5b = typeof orig?.review_5b_speaking === 'string' ? orig.review_5b_speaking : undefined;
  const origRev6 = (orig?.review_6_adjectives as Record<string, string> | undefined) || {};
  const origRev7 = (orig?.review_7_rewrite as Record<string, string> | undefined) || {};
  const origRev8a = (orig?.review_8a_order as Record<string, string> | undefined) || {};
  const origRev8b = typeof orig?.review_8b_speaking === 'string' ? orig.review_8b_speaking : undefined;

  return (
    <div className={styles.pageContainer}>
      <motion.article
        className={styles.textbookPage}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header Banner 3D */}
        <header className={styles.headerBanner}>
          <div className={styles.headerTop}>
            <div className={styles.badge3D} aria-label="Unit 3, Lesson D">
              <span>3</span>
              <span className={styles.letterD}>D</span>
            </div>
            <div className={styles.titleArea}>
              <span className={styles.unitTag}>Roadmap A1 • Unit 3</span>
              <h1 className={styles.titleHeading}>English in action</h1>
            </div>
          </div>

          <div className={styles.goalsCard}>
            <p>
              <strong>Goal:</strong> ask for and give directions
            </p>
            <p>
              <strong>Review:</strong> Check &amp; reflect (places in town, there is / are, adjectives)
            </p>
          </div>
        </header>

        {/* ================= MAIN CONTENT CONTAINER ================= */}
        <div className={styles.contentBody}>
          {/* ================= PART 1: PAGE 28 (ASK FOR & GIVE DIRECTIONS) ================= */}
          <div className={styles.twoColLayout}>
            {/* ================= LEFT COLUMN: MAP & DIRECTIONS ================= */}
            <div className={styles.col}>
              <h2 className={styles.sectionTitle}>Town Map &amp; Listening</h2>

              {/* Ex 1: Town Map */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>1</span>
                  <span className={styles.instruction}>
                    Look at the map. What buildings can you see? Click the map to enlarge.
                  </span>
                </div>

                <div
                  className={styles.mapCardWrap}
                  onClick={() => setIsMapModalOpen(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setIsMapModalOpen(true)}
                  aria-label="Enlarge Town Map"
                >
                  <div className={styles.cardTopLabel}>
                    <span>Town Centre Map</span>
                    <span style={{ fontSize: '0.7rem' }}>🔍 Zoom</span>
                  </div>
                  <Image
                    src="/images/lesson3d/town_map.png"
                    alt="Map of town showing Station Road, Bank Road, Park Street, Market Street, Main Street and various buildings"
                    width={477}
                    height={541}
                    unoptimized
                  />
                  <div className={styles.zoomOverlay}>🔍 Click to zoom</div>
                </div>

                <div className={styles.directionMatchGrid}>
                  {MAP_PLACES.map((p) => (
                    <div key={p.id} className={styles.directionMatchRow}>
                      <span className={styles.exNumber} style={{ minWidth: '1.4rem', height: '1.4rem', fontSize: '0.75rem' }}>{p.id}</span>
                      <span style={{ fontSize: '0.8rem', color: '#334155' }}>{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ex 2a: Audio 3.14 Listen and answer questions */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>2</span>
                  <span className={styles.exLetter}>a</span>
                  <span className={styles.instruction}>
                    Listen and answer the questions.
                  </span>
                </div>

                <div className={styles.audioActionRow}>
                  <button
                    type="button"
                    onClick={() => playAudio?.('3.14')}
                    className={`${styles.audioBtn} ${playingAudio === '3.14' ? styles.audioBtnActive : ''}`}
                    aria-label="Play Audio 3.14"
                  >
                    {playingAudio === '3.14' ? (
                      <>
                        <div className={styles.equalizer}>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                        </div>
                        <span>Playing 3.14</span>
                      </>
                    ) : (
                      <>
                        <span>▶</span>
                        <span>Audio 3.14</span>
                      </>
                    )}
                  </button>
                  <div className={styles.audioHint}>
                    Track 3.14 (Directions dialogue)
                  </div>
                </div>

                <div className={styles.gappedList}>
                  {[
                    { id: '1', q: 'Where is the woman?', ph: 'e.g. at the train station' },
                    { id: '2', q: 'Where is her friend, David?', ph: 'e.g. at the Polish restaurant / on Main Street' },
                  ].map((item) => {
                    const verify = getFieldVerify('exercise_2a_questions', item.id);
                    const currentVal = ex2a.value[item.id] || '';
                    const isItemDiff = isDiff(origEx2a[item.id], currentVal);
                    return (
                      <div key={item.id} className={styles.gappedItem}>
                        <span className={styles.gappedItemNum}>{item.id}.</span>
                        <span>{item.q}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%' }}>
                          <input
                            type="text"
                            className={`${styles.inputField} ${styles.inputFieldWide} ${getInputClass(verify)} ${
                              isItemDiff ? styles.diffHighlight : ''
                            }`}
                            placeholder={item.ph}
                            value={currentVal}
                            onChange={(e) => ex2a.setValue({ ...ex2a.value, [item.id]: e.target.value })}
                            disabled={isReadOnly}
                          />
                          {isReview && verify?.hasKey && verify.isCorrect && (
                            <span className={styles.correctBadge} title="Correct">✓</span>
                          )}
                        </div>
                        {isReview && verify && !verify.isCorrect && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={verify} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ex 2b: Listen again and number pictures A-F */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>2</span>
                  <span className={styles.exLetter}>b</span>
                  <span className={styles.instruction}>
                    Listen again and number the pictures in the order that you hear them.
                  </span>
                </div>

                <div className={styles.imageWrap}>
                  <Image
                    src="/images/lesson3d/directions_diagrams.png"
                    alt="Diagrams A to F showing straight on, turn left, turn right, go past, next to, go down"
                    width={481}
                    height={489}
                    unoptimized
                  />
                </div>

                <div className={styles.directionMatchGrid}>
                  {DIRECTION_DIAGRAM_ITEMS.map((item) => {
                    const verify = getFieldVerify('exercise_2b_order', item.key);
                    const currentVal = ex2b.value[item.key] || '';
                    const isItemDiff = isDiff(origEx2b[item.key], currentVal);
                    return (
                      <div key={item.key} className={styles.directionMatchRow}>
                        <span className={styles.exNumber} style={{ minWidth: '1.4rem', height: '1.4rem', fontSize: '0.75rem' }}>{item.key}</span>
                        <span className={styles.dirText}>{item.text}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <input
                            type="text"
                            maxLength={2}
                            className={`${styles.inputField} ${getInputClass(verify)} ${
                              isItemDiff ? styles.diffHighlight : ''
                            }`}
                            style={{ width: '48px', textAlign: 'center' }}
                            placeholder="1-6"
                            value={currentVal}
                            onChange={(e) =>
                              ex2b.setValue({ ...ex2b.value, [item.key]: e.target.value })
                            }
                            disabled={isReadOnly}
                          />
                          {isReview && verify?.hasKey && verify.isCorrect && (
                            <span className={styles.correctBadge} title="Correct">✓</span>
                          )}
                        </div>
                        {isReview && verify && !verify.isCorrect && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={verify} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ex 2c: Route drawing / pairwork */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>2</span>
                  <span className={styles.exLetter}>c</span>
                  <span className={styles.instruction}>
                    Work in pairs. Draw the woman&apos;s route on the map in Exercise 1.
                  </span>
                </div>
                <div className={styles.routeBox}>
                  <strong>Follow the route:</strong>
                  <span>Start at <em>Train station</em> on Station Road &rarr; Go down Station Road &rarr; Turn right into Park Street &rarr; Turn left into Main Street &rarr; Go straight on past the hotel &rarr; Polish restaurant next to the bank on the left.</span>
                  <input
                    type="text"
                    className={`${styles.inputField} ${styles.inputFieldFull} ${
                      isDiff(origEx2c, ex2c.value) ? styles.diffHighlight : ''
                    }`}
                    placeholder="Write route notes or partner observations here..."
                    value={ex2c.value || ''}
                    onChange={(e) => ex2c.setValue(e.target.value)}
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </div>

            {/* ================= RIGHT COLUMN: USEFUL PHRASES & CONVERSATIONS ================= */}
            <div className={styles.col}>
              <h2 className={styles.sectionTitle}>Useful phrases &amp; Practice</h2>

              {/* Ex 3: Useful Phrases Box + Audio 3.15 + Numbering */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>3</span>
                  <span className={styles.instruction}>
                    Listen and number the sentences in the order that you hear them. Listen again and repeat.
                  </span>
                </div>

                <div className={styles.audioActionRow}>
                  <button
                    type="button"
                    onClick={() => playAudio?.('3.15')}
                    className={`${styles.audioBtn} ${playingAudio === '3.15' ? styles.audioBtnActive : ''}`}
                    aria-label="Play Audio 3.15"
                  >
                    {playingAudio === '3.15' ? (
                      <>
                        <div className={styles.equalizer}>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                        </div>
                        <span>Playing 3.15</span>
                      </>
                    ) : (
                      <>
                        <span>▶</span>
                        <span>Audio 3.15</span>
                      </>
                    )}
                  </button>
                  <div className={styles.audioHint}>
                    Track 3.15 (Useful phrases)
                  </div>
                </div>

                <div className={styles.usefulPhrasesCard}>
                  <div className={styles.phrasesOrderingList}>
                    {USEFUL_PHRASES_ITEMS.map((item) => {
                      const verify = getFieldVerify('exercise_3_phrases_order', item.id);
                      const currentVal = ex3.value[item.id] || '';
                      const isItemDiff = isDiff(origEx3[item.id], currentVal);
                      return (
                        <div key={item.id} className={styles.phraseOrderItem}>
                          {item.isExample ? (
                            <span className={styles.exampleBadge}>1</span>
                          ) : (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              <input
                                type="text"
                                maxLength={2}
                                className={`${styles.inputField} ${getInputClass(verify)} ${
                                  isItemDiff ? styles.diffHighlight : ''
                                }`}
                                style={{ width: '42px', textAlign: 'center' }}
                                placeholder="2-12"
                                value={currentVal}
                                onChange={(e) =>
                                  ex3.setValue({ ...ex3.value, [item.id]: e.target.value })
                                }
                                disabled={isReadOnly}
                              />
                              {isReview && verify?.hasKey && verify.isCorrect && (
                                <span className={styles.correctBadge} title="Correct">✓</span>
                              )}
                            </div>
                          )}
                          <span className={styles.phraseText}>{item.text}</span>
                          <PronounceButton word={item.audioPhrase} />
                          {isReview && !item.isExample && verify && !verify.isCorrect && (
                            <div className={styles.feedbackRow}>
                              <TeacherAnswerBadge result={verify} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Ex 4a: Complete the conversations with map */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>4</span>
                  <span className={styles.exLetter}>a</span>
                  <span className={styles.instruction}>
                    Look at the map in Exercise 1. Complete the conversations. Use the Useful phrases box to help you.
                  </span>
                </div>

                <div className={styles.audioActionRow}>
                  <button
                    type="button"
                    onClick={() => playAudio?.('3.16')}
                    className={`${styles.audioBtn} ${playingAudio === '3.16' ? styles.audioBtnActive : ''}`}
                    aria-label="Play Audio 3.16"
                  >
                    {playingAudio === '3.16' ? (
                      <>
                        <div className={styles.equalizer}>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                          <div className={styles.bar}></div>
                        </div>
                        <span>Playing 3.16</span>
                      </>
                    ) : (
                      <>
                        <span>▶</span>
                        <span>Audio 3.16</span>
                      </>
                    )}
                  </button>
                  <div className={styles.audioHint}>
                    Track 3.16 (Three conversations)
                  </div>
                </div>

                {/* Conversation 1 */}
                <div className={styles.conversationBlock}>
                  <h4 className={styles.convoTitle}>Conversation 1</h4>
                  <div className={styles.convoLine}>
                    <span className={styles.speaker}>A:</span>
                    <span>Excuse me.</span>
                    <input
                      type="text"
                      className={`${styles.inputField} ${styles.inputFieldWide} ${getInputClass(
                        getFieldVerify('exercise_4a_conversations', '1')
                      )} ${isDiff(origEx4a['1'], ex4a.value['1']) ? styles.diffHighlight : ''}`}
                      placeholder="e.g. Is there a supermarket near here?"
                      value={ex4a.value['1'] || ''}
                      onChange={(e) => ex4a.setValue({ ...ex4a.value, '1': e.target.value })}
                      disabled={isReadOnly}
                    />
                    {isReview && getFieldVerify('exercise_4a_conversations', '1')?.isCorrect && (
                      <span className={styles.correctBadge} title="Correct">✓</span>
                    )}
                  </div>
                  {isReview && (() => {
                    const ver = getFieldVerify('exercise_4a_conversations', '1');
                    return ver && !ver.isCorrect ? (
                      <div className={styles.feedbackRow}><TeacherAnswerBadge result={ver} /></div>
                    ) : null;
                  })()}

                  <div className={styles.convoLine}>
                    <span className={styles.speaker}>B:</span>
                    <span>Yes, there&apos;s one on Station Road.</span>
                    <input
                      type="text"
                      className={`${styles.inputField} ${styles.inputFieldWide} ${getInputClass(
                        getFieldVerify('exercise_4a_conversations', '2')
                      )} ${isDiff(origEx4a['2'], ex4a.value['2']) ? styles.diffHighlight : ''}`}
                      placeholder="e.g. Go straight on"
                      value={ex4a.value['2'] || ''}
                      onChange={(e) => ex4a.setValue({ ...ex4a.value, '2': e.target.value })}
                      disabled={isReadOnly}
                    />
                    <span>, go past the Turkish restaurant and the supermarket is on the left.</span>
                    {isReview && getFieldVerify('exercise_4a_conversations', '2')?.isCorrect && (
                      <span className={styles.correctBadge} title="Correct">✓</span>
                    )}
                  </div>
                  {isReview && (() => {
                    const ver = getFieldVerify('exercise_4a_conversations', '2');
                    return ver && !ver.isCorrect ? (
                      <div className={styles.feedbackRow}><TeacherAnswerBadge result={ver} /></div>
                    ) : null;
                  })()}

                  <div className={styles.convoLine}>
                    <span className={styles.speaker}>A:</span>
                    <span>Thank you.</span>
                  </div>
                  <div className={styles.convoLine}>
                    <span className={styles.speaker}>B:</span>
                    <span>You&apos;re welcome.</span>
                  </div>
                </div>

                {/* Conversation 2 */}
                <div className={styles.conversationBlock}>
                  <h4 className={styles.convoTitle}>Conversation 2</h4>
                  <div className={styles.convoLine}>
                    <span className={styles.speaker}>A:</span>
                    <span>Excuse me.</span>
                    <input
                      type="text"
                      className={`${styles.inputField} ${styles.inputFieldWide} ${getInputClass(
                        getFieldVerify('exercise_4a_conversations', '3')
                      )} ${isDiff(origEx4a['3'], ex4a.value['3']) ? styles.diffHighlight : ''}`}
                      placeholder="e.g. Where's the cinema, please?"
                      value={ex4a.value['3'] || ''}
                      onChange={(e) => ex4a.setValue({ ...ex4a.value, '3': e.target.value })}
                      disabled={isReadOnly}
                    />
                    {isReview && getFieldVerify('exercise_4a_conversations', '3')?.isCorrect && (
                      <span className={styles.correctBadge} title="Correct">✓</span>
                    )}
                  </div>
                  {isReview && (() => {
                    const ver = getFieldVerify('exercise_4a_conversations', '3');
                    return ver && !ver.isCorrect ? (
                      <div className={styles.feedbackRow}><TeacherAnswerBadge result={ver} /></div>
                    ) : null;
                  })()}

                  <div className={styles.convoLine}>
                    <span className={styles.speaker}>B:</span>
                    <span>It&apos;s on Park Street. Go down Station Road,</span>
                    <input
                      type="text"
                      className={`${styles.inputField} ${styles.inputFieldWide} ${getInputClass(
                        getFieldVerify('exercise_4a_conversations', '4')
                      )} ${isDiff(origEx4a['4'], ex4a.value['4']) ? styles.diffHighlight : ''}`}
                      placeholder="e.g. turn left into Park Street"
                      value={ex4a.value['4'] || ''}
                      onChange={(e) => ex4a.setValue({ ...ex4a.value, '4': e.target.value })}
                      disabled={isReadOnly}
                    />
                    <span>, go past the school and the cinema is on the left.</span>
                    {isReview && getFieldVerify('exercise_4a_conversations', '4')?.isCorrect && (
                      <span className={styles.correctBadge} title="Correct">✓</span>
                    )}
                  </div>
                  {isReview && (() => {
                    const ver = getFieldVerify('exercise_4a_conversations', '4');
                    return ver && !ver.isCorrect ? (
                      <div className={styles.feedbackRow}><TeacherAnswerBadge result={ver} /></div>
                    ) : null;
                  })()}

                  <div className={styles.convoLine}>
                    <span className={styles.speaker}>A:</span>
                    <span>Thanks.</span>
                  </div>
                  <div className={styles.convoLine}>
                    <span className={styles.speaker}>B:</span>
                    <span>No problem.</span>
                  </div>
                </div>

                {/* Conversation 3 */}
                <div className={styles.conversationBlock}>
                  <h4 className={styles.convoTitle}>Conversation 3</h4>
                  <div className={styles.convoLine}>
                    <span className={styles.speaker}>A:</span>
                    <span>Excuse me. Is there a bookshop near here?</span>
                  </div>
                  <div className={styles.convoLine}>
                    <span className={styles.speaker}>B:</span>
                    <span>Yes, there&apos;s one on Market Street. Go straight on,</span>
                    <input
                      type="text"
                      className={`${styles.inputField} ${styles.inputFieldWide} ${getInputClass(
                        getFieldVerify('exercise_4a_conversations', '5')
                      )} ${isDiff(origEx4a['5'], ex4a.value['5']) ? styles.diffHighlight : ''}`}
                      placeholder="e.g. turn left at the bookshop / into Market Street"
                      value={ex4a.value['5'] || ''}
                      onChange={(e) => ex4a.setValue({ ...ex4a.value, '5': e.target.value })}
                      disabled={isReadOnly}
                    />
                    <span>and turn right onto Market Street.</span>
                    {isReview && getFieldVerify('exercise_4a_conversations', '5')?.isCorrect && (
                      <span className={styles.correctBadge} title="Correct">✓</span>
                    )}
                  </div>
                  {isReview && (() => {
                    const ver = getFieldVerify('exercise_4a_conversations', '5');
                    return ver && !ver.isCorrect ? (
                      <div className={styles.feedbackRow}><TeacherAnswerBadge result={ver} /></div>
                    ) : null;
                  })()}

                  <div className={styles.convoLine}>
                    <span className={styles.speaker}>A:</span>
                    <span>Thank you.</span>
                  </div>
                  <div className={styles.convoLine}>
                    <span className={styles.speaker}>B:</span>
                    <span>No problem.</span>
                  </div>
                </div>
              </div>

              {/* Ex 4b & Ex 5: Speaking Practice */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>4</span>
                  <span className={styles.exLetter}>b</span>
                  <span className={styles.instruction}>
                    Work in pairs. Practise the conversations in Exercise 4a.
                  </span>
                </div>
                <textarea
                  className={`${styles.inputField} ${isDiff(origEx4b, ex4b.value) ? styles.diffHighlight : ''}`}
                  rows={2}
                  style={{ width: '100%', resize: 'vertical' }}
                  placeholder="Practise saying the dialogues aloud with your partner or write practice notes..."
                  value={ex4b.value || ''}
                  onChange={(e) => ex4b.setValue(e.target.value)}
                  disabled={isReadOnly}
                />
              </div>

              {/* Ex 5a & 5b: Directions Game */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>5</span>
                  <span className={styles.exLetter}>a/b</span>
                  <span className={styles.instruction}>
                    Choose a place on the map. Give directions from the station. Can your partner guess where you are?
                  </span>
                </div>
                <div className={styles.routeBox}>
                  <strong>Example:</strong>
                  <span>A: <em>Go down Station Road and turn right at the hotel.</em></span>
                  <span>B: <em>Turn right at the hotel? Are you at the café?</em></span>
                </div>
                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                    5a Your directions from the station:
                  </label>
                  <input
                    type="text"
                    className={`${styles.inputField} ${styles.inputFieldFull} ${
                      isDiff(origEx5a, ex5a.value) ? styles.diffHighlight : ''
                    }`}
                    placeholder="e.g. Go down Station Road, turn right into Park Street, then..."
                    value={ex5a.value || ''}
                    onChange={(e) => ex5a.setValue(e.target.value)}
                    disabled={isReadOnly}
                  />
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginTop: '0.2rem' }}>
                    5b Partner guess &amp; dialogue:
                  </label>
                  <input
                    type="text"
                    className={`${styles.inputField} ${styles.inputFieldFull} ${
                      isDiff(origEx5b, ex5b.value) ? styles.diffHighlight : ''
                    }`}
                    placeholder="e.g. Partner guess: Are you at the cinema? — Yes, that's right!"
                    value={ex5b.value || ''}
                    onChange={(e) => ex5b.setValue(e.target.value)}
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================= PART DIVIDER ================= */}
          <div className={styles.partDivider}>
            <div className={styles.partDividerLine}></div>
            <div className={styles.partDividerBadge}>
              Page 29 • Check &amp; reflect • Unit 3 Review
            </div>
            <div className={styles.partDividerLine}></div>
          </div>

          {/* ================= PART 2: CHECK & REFLECT (PAGE 29) ================= */}
          <div className={styles.twoColLayout}>
            {/* ================= LEFT COLUMN: VOCABULARY & GRAMMAR ================= */}
            <div className={styles.col}>
              <h2 className={styles.sectionTitle}>Review: Vocabulary &amp; Grammar</h2>

              {/* Review 1a: Places in a town */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>1</span>
                  <span className={styles.exLetter}>a</span>
                  <span className={styles.instruction}>
                    Complete the places in town.
                  </span>
                </div>

                <div className={styles.wordGapsGrid}>
                  {PLACES_WORD_GAPS.map((item) => {
                    const verify = getFieldVerify('review_1a_places', item.id);
                    const currentVal = rev1a.value[item.id] || '';
                    return (
                      <PlaceWordLetterRow
                        key={item.id}
                        item={item}
                        value={currentVal}
                        onChange={(val) => rev1a.setValue({ ...rev1a.value, [item.id]: val })}
                        isReview={isReview}
                        verifyResult={verify}
                        disabled={isReadOnly}
                        isDiff={isDiff(origRev1a[item.id], currentVal)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Review 1b: Pairwork Ask and answer */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>1</span>
                  <span className={styles.exLetter}>b</span>
                  <span className={styles.instruction}>
                    Work in pairs. Ask and answer about the places in your town.
                  </span>
                </div>
                <div className={styles.routeBox}>
                  <strong>Example:</strong>
                  <span>A: <em>Is there a bank?</em> &nbsp;&bull;&nbsp; B: <em>Yes, there is.</em></span>
                </div>
                <input
                  type="text"
                  style={{ marginTop: '0.5rem' }}
                  className={`${styles.inputField} ${styles.inputFieldFull} ${
                    isDiff(origRev1b, rev1b.value) ? styles.diffHighlight : ''
                  }`}
                  placeholder="e.g. A: Is there a cinema? B: No, there isn't."
                  value={rev1b.value || ''}
                  onChange={(e) => rev1b.setValue(e.target.value)}
                  disabled={isReadOnly}
                />
              </div>

              {/* Review 2: is, isn't, are or aren't */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>2</span>
                  <span className={styles.instruction}>
                    Complete the sentences with <em>is</em>, <em>isn&apos;t</em>, <em>are</em> or <em>aren&apos;t</em>. Use short forms.
                  </span>
                </div>

                <div className={styles.gappedList}>
                  {IS_ARE_ITEMS.map((item) => {
                    if (item.isExample) {
                      return (
                        <div key={item.id} className={styles.gappedItem}>
                          <span className={styles.gappedItemNum}>{item.id}.</span>
                          <span>{item.prefix}</span>
                          <span className={styles.exampleBadge}>{item.exampleVal}</span>
                          <span>{item.suffix}</span>
                        </div>
                      );
                    }
                    const verify = getFieldVerify('review_2_is_are', item.id);
                    const currentVal = rev2.value[item.id] || '';
                    const isItemDiff = isDiff(origRev2[item.id], currentVal);
                    return (
                      <div key={item.id} className={styles.gappedItem}>
                        <span className={styles.gappedItemNum}>{item.id}.</span>
                        <span>{item.prefix}</span>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <input
                            type="text"
                            className={`${styles.inputField} ${getInputClass(verify)} ${
                              isItemDiff ? styles.diffHighlight : ''
                            }`}
                            style={{ width: '80px', textAlign: 'center' }}
                            placeholder="is / are..."
                            value={currentVal}
                            onChange={(e) =>
                              rev2.setValue({ ...rev2.value, [item.id]: e.target.value })
                            }
                            disabled={isReadOnly}
                          />
                          {isReview && verify?.hasKey && verify.isCorrect && (
                            <span className={styles.correctBadge} title="Correct">✓</span>
                          )}
                        </div>
                        <span>{item.suffix}</span>
                        {isReview && verify && !verify.isCorrect && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={verify} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review 3: Correct mistakes in 4 sentences */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>3</span>
                  <span className={styles.instruction}>
                    Correct the mistakes in the sentences.
                  </span>
                </div>

                <div className={styles.gappedList}>
                  {CORRECTION_ITEMS.map((item) => {
                    const verify = getFieldVerify('review_3_corrections', item.id);
                    const currentVal = rev3.value[item.id] || '';
                    const isItemDiff = isDiff(origRev3[item.id], currentVal);
                    return (
                      <div key={item.id} className={styles.gappedItem} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className={styles.gappedItemNum}>{item.id}.</span>
                          <span style={{ textDecoration: 'line-through', color: '#64748b' }}>
                            {item.incorrect}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                          <input
                            type="text"
                            className={`${styles.inputField} ${styles.inputFieldFull} ${getInputClass(verify)} ${
                              isItemDiff ? styles.diffHighlight : ''
                            }`}
                            placeholder="Write correct sentence..."
                            value={currentVal}
                            onChange={(e) =>
                              rev3.setValue({ ...rev3.value, [item.id]: e.target.value })
                            }
                            disabled={isReadOnly}
                          />
                          {isReview && verify?.hasKey && verify.isCorrect && (
                            <span className={styles.correctBadge} title="Correct">✓</span>
                          )}
                        </div>
                        {isReview && verify && !verify.isCorrect && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={verify} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review 4: Choose alternatives */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>4</span>
                  <span className={styles.instruction}>
                    Choose the correct alternatives.
                  </span>
                </div>

                <div className={styles.gappedList}>
                  {ALTERNATIVE_ITEMS.map((item) => {
                    const currentVal = rev4.value[item.id];
                    const verify = getFieldVerify('review_4_alternatives', item.id);
                    const isItemDiff = isDiff(origRev4[item.id], currentVal);
                    return (
                      <div key={item.id} className={styles.gappedItem}>
                        <span className={styles.gappedItemNum}>{item.id}.</span>
                        <span>{item.prefix}</span>
                        <div className={`${styles.choicePills} ${isItemDiff ? styles.diffHighlight : ''}`}>
                          <button
                            type="button"
                            className={`${styles.choicePillBtn} ${
                              currentVal === item.opt1 ? styles.choiceSelected : ''
                            }`}
                            onClick={() => !isReadOnly && rev4.setValue({ ...rev4.value, [item.id]: item.opt1 })}
                          >
                            {item.opt1}
                          </button>
                          <span style={{ color: '#94a3b8' }}>/</span>
                          <button
                            type="button"
                            className={`${styles.choicePillBtn} ${
                              currentVal === item.opt2 ? styles.choiceSelected : ''
                            }`}
                            onClick={() => !isReadOnly && rev4.setValue({ ...rev4.value, [item.id]: item.opt2 })}
                          >
                            {item.opt2}
                          </button>
                        </div>
                        <span>{item.suffix}</span>
                        {isReview && verify?.hasKey && verify.isCorrect && (
                          <span className={styles.correctBadge} title="Correct">✓</span>
                        )}
                        {isReview && verify && !verify.isCorrect && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={verify} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ================= RIGHT COLUMN: QUESTIONS & ADJECTIVES & REFLECT ================= */}
            <div className={styles.col}>
              <h2 className={styles.sectionTitle}>Questions, Adjectives &amp; Reflect</h2>

              {/* Review 5a: Classroom questions */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>5</span>
                  <span className={styles.exLetter}>a</span>
                  <span className={styles.instruction}>
                    Complete the questions about your classroom with the words in the box.
                  </span>
                </div>

                <div className={styles.routeBox} style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#0f172a' }}>
                  <strong>Word box:</strong>
                  <span>any &bull; Are &bull; are &bull; How &bull; Is &bull; many &bull; there</span>
                </div>

                <div className={styles.gappedList} style={{ marginTop: '0.5rem' }}>
                  {CLASSROOM_QUESTIONS.map((item) => {
                    if (item.isExample) {
                      return (
                        <div key={item.id} className={styles.gappedItem}>
                          <span className={styles.gappedItemNum}>{item.id}.</span>
                          <span style={{ fontStyle: 'italic', color: '#2563eb' }}>{item.text}</span>
                        </div>
                      );
                    }

                    if (item.fieldA && item.fieldB) {
                      const verifyA = getFieldVerify('review_5a_classroom', item.fieldA);
                      const verifyB = getFieldVerify('review_5a_classroom', item.fieldB);
                      const valA = rev5a.value[item.fieldA] || '';
                      const valB = rev5a.value[item.fieldB] || '';
                      const isDiffA = isDiff(origRev5a[item.fieldA], valA);
                      const isDiffB = isDiff(origRev5a[item.fieldB], valB);
                      return (
                        <div key={item.id} className={styles.gappedItem}>
                          <span className={styles.gappedItemNum}>{item.id}.</span>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <input
                              type="text"
                              className={`${styles.inputField} ${getInputClass(verifyA)} ${isDiffA ? styles.diffHighlight : ''}`}
                              style={{ width: '100px' }}
                              placeholder={item.placeholderA}
                              value={valA}
                              onChange={(e) =>
                                rev5a.setValue({ ...rev5a.value, [item.fieldA as string]: e.target.value })
                              }
                              disabled={isReadOnly}
                            />
                            {isReview && verifyA?.hasKey && verifyA.isCorrect && (
                              <span className={styles.correctBadge} title="Correct">✓</span>
                            )}
                          </div>
                          <span>{item.promptMid}</span>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <input
                              type="text"
                              className={`${styles.inputField} ${getInputClass(verifyB)} ${isDiffB ? styles.diffHighlight : ''}`}
                              style={{ width: '90px' }}
                              placeholder={item.placeholderB}
                              value={valB}
                              onChange={(e) =>
                                rev5a.setValue({ ...rev5a.value, [item.fieldB as string]: e.target.value })
                              }
                              disabled={isReadOnly}
                            />
                            {isReview && verifyB?.hasKey && verifyB.isCorrect && (
                              <span className={styles.correctBadge} title="Correct">✓</span>
                            )}
                          </div>
                          <span>{item.promptAfter}</span>
                          {isReview && ((verifyA && !verifyA.isCorrect) || (verifyB && !verifyB.isCorrect)) && (
                            <div className={styles.feedbackRow}>
                              {verifyA && !verifyA.isCorrect && <TeacherAnswerBadge result={verifyA} />}
                              {verifyB && !verifyB.isCorrect && <TeacherAnswerBadge result={verifyB} />}
                            </div>
                          )}
                        </div>
                      );
                    }

                    const verify = getFieldVerify('review_5a_classroom', item.field || '');
                    const currentVal = rev5a.value[item.field || ''] || '';
                    const isItemDiff = isDiff(origRev5a[item.field || ''], currentVal);
                    return (
                      <div key={item.id} className={styles.gappedItem}>
                        <span className={styles.gappedItemNum}>{item.id}.</span>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <input
                            type="text"
                            className={`${styles.inputField} ${getInputClass(verify)} ${isItemDiff ? styles.diffHighlight : ''}`}
                            style={{ width: '125px' }}
                            placeholder={item.placeholder}
                            value={currentVal}
                            onChange={(e) =>
                              rev5a.setValue({ ...rev5a.value, [item.field as string]: e.target.value })
                            }
                            disabled={isReadOnly}
                          />
                          {isReview && verify?.hasKey && verify.isCorrect && (
                            <span className={styles.correctBadge} title="Correct">✓</span>
                          )}
                        </div>
                        <span>{item.promptAfter}</span>
                        {isReview && verify && !verify.isCorrect && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={verify} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review 5b: Pairwork classroom questions */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>5</span>
                  <span className={styles.exLetter}>b</span>
                  <span className={styles.instruction}>
                    Work in pairs. Ask and answer the questions in Exercise 5a.
                  </span>
                </div>
                <div className={styles.routeBox}>
                  <strong>Example:</strong>
                  <span>A: <em>Is there a TV in our classroom?</em> &nbsp;&bull;&nbsp; B: <em>No, there isn&apos;t.</em></span>
                </div>
                <input
                  type="text"
                  style={{ marginTop: '0.5rem' }}
                  className={`${styles.inputField} ${styles.inputFieldFull} ${
                    isDiff(origRev5b, rev5b.value) ? styles.diffHighlight : ''
                  }`}
                  placeholder="Practise asking and answering questions..."
                  value={rev5b.value || ''}
                  onChange={(e) => rev5b.setValue(e.target.value)}
                  disabled={isReadOnly}
                />
              </div>

              {/* Review 6: Complete sentences with an adjective */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>6</span>
                  <span className={styles.instruction}>
                    Complete the sentences with an adjective.
                  </span>
                </div>

                <div className={styles.gappedList}>
                  {ADJECTIVE_SENTENCES.map((item) => {
                    if (item.isExample) {
                      return (
                        <div key={item.id} className={styles.gappedItem}>
                          <span className={styles.gappedItemNum}>{item.id}.</span>
                          <span>{item.text}</span>
                        </div>
                      );
                    }
                    const verify = getFieldVerify('review_6_adjectives', item.id);
                    const currentVal = rev6.value[item.id] || '';
                    const isItemDiff = isDiff(origRev6[item.id], currentVal);
                    return (
                      <div key={item.id} className={styles.gappedItem}>
                        <span className={styles.gappedItemNum}>{item.id}.</span>
                        <span>{item.before}</span>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                          <input
                            type="text"
                            className={`${styles.inputField} ${getInputClass(verify)} ${
                              isItemDiff ? styles.diffHighlight : ''
                            }`}
                            style={{ width: '90px', textAlign: 'center' }}
                            placeholder={item.prompt}
                            value={currentVal}
                            onChange={(e) =>
                              rev6.setValue({ ...rev6.value, [item.id]: e.target.value })
                            }
                            disabled={isReadOnly}
                          />
                          {isReview && verify?.hasKey && verify.isCorrect && (
                            <span className={styles.correctBadge} title="Correct">✓</span>
                          )}
                        </div>
                        <span>{item.suffix}</span>
                        {isReview && verify && !verify.isCorrect && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={verify} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review 7: Rewrite sentences */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>7</span>
                  <span className={styles.instruction}>
                    Rewrite the sentences.
                  </span>
                </div>

                <div className={styles.gappedList}>
                  {REWRITE_SENTENCES.map((item) => {
                    if (item.isExample) {
                      return (
                        <div key={item.id} className={styles.gappedItem} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{item.id}. {item.original}</span>
                          <span style={{ fontWeight: 600, color: '#2563eb' }}>{item.rewritten}</span>
                        </div>
                      );
                    }
                    const verify = getFieldVerify('review_7_rewrite', item.id);
                    const currentVal = rev7.value[item.id] || '';
                    const isItemDiff = isDiff(origRev7[item.id], currentVal);
                    return (
                      <div key={item.id} className={styles.gappedItem} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{item.id}. {item.original}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%' }}>
                          <span>{item.before}</span>
                          <input
                            type="text"
                            className={`${styles.inputField} ${styles.inputFieldFull} ${getInputClass(verify)} ${
                              isItemDiff ? styles.diffHighlight : ''
                            }`}
                            placeholder="complete sentence..."
                            value={currentVal}
                            onChange={(e) =>
                              rev7.setValue({ ...rev7.value, [item.id]: e.target.value })
                            }
                            disabled={isReadOnly}
                          />
                          <span>{item.suffix}</span>
                          {isReview && verify?.hasKey && verify.isCorrect && (
                            <span className={styles.correctBadge} title="Correct">✓</span>
                          )}
                        </div>
                        {isReview && verify && !verify.isCorrect && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={verify} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review 8a: Word order questions */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>8</span>
                  <span className={styles.exLetter}>a</span>
                  <span className={styles.instruction}>
                    Put the words in the correct order to make questions.
                  </span>
                </div>

                <div className={styles.gappedList}>
                  {WORD_ORDER_REVIEW.map((item) => {
                    if (item.isExample) {
                      return (
                        <div key={item.id} className={styles.gappedItem} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                          <span style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '0.8rem' }}>
                            {item.id}. {item.prompt}
                          </span>
                          <span style={{ fontStyle: 'italic', color: '#2563eb', fontWeight: 600 }}>
                            {item.example}
                          </span>
                        </div>
                      );
                    }
                    const verify = getFieldVerify('review_8a_order', item.id);
                    const currentVal = rev8a.value[item.id] || '';
                    const isItemDiff = isDiff(origRev8a[item.id], currentVal);
                    return (
                      <div key={item.id} className={styles.gappedItem} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                        <span style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '0.8rem' }}>
                          {item.id}. {item.prompt}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%' }}>
                          <input
                            type="text"
                            className={`${styles.inputField} ${styles.inputFieldFull} ${getInputClass(verify)} ${
                              isItemDiff ? styles.diffHighlight : ''
                            }`}
                            placeholder="Write ordered question..."
                            value={currentVal}
                            onChange={(e) =>
                              rev8a.setValue({ ...rev8a.value, [item.id]: e.target.value })
                            }
                            disabled={isReadOnly}
                          />
                          {isReview && verify?.hasKey && verify.isCorrect && (
                            <span className={styles.correctBadge} title="Correct">✓</span>
                          )}
                        </div>
                        {isReview && verify && !verify.isCorrect && (
                          <div className={styles.feedbackRow}>
                            <TeacherAnswerBadge result={verify} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review 8b: Speaking questions */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>8</span>
                  <span className={styles.exLetter}>b</span>
                  <span className={styles.instruction}>
                    Work in pairs. Ask and answer the questions in Exercise 8a.
                  </span>
                </div>
                <div className={styles.routeBox}>
                  <strong>Example:</strong>
                  <span>A: <em>Is your computer new?</em> &nbsp;&bull;&nbsp; B: <em>No, it isn&apos;t. It&apos;s old.</em></span>
                </div>
                <input
                  type="text"
                  style={{ marginTop: '0.5rem' }}
                  className={`${styles.inputField} ${styles.inputFieldFull} ${
                    isDiff(origRev8b, rev8b.value) ? styles.diffHighlight : ''
                  }`}
                  placeholder="Record your pair dialogue..."
                  value={rev8b.value || ''}
                  onChange={(e) => rev8b.setValue(e.target.value)}
                  disabled={isReadOnly}
                />
              </div>

              {/* Reflect Self Assessment */}
              <div className={styles.exerciseBlock}>
                <div className={styles.exerciseHeader}>
                  <span className={styles.exNumber}>✓</span>
                  <span className={styles.instruction}>
                    <strong>Reflect:</strong> How confident do you feel about the statements below? Write 1–5 (1 = not very confident, 5 = very confident).
                  </span>
                </div>

                <div className={styles.reflectChecklist}>
                  {REFLECT_STATEMENTS.map((st) => {
                    const rating = revReflect.value[st.id] || 0;
                    return (
                      <div key={st.id} className={styles.reflectItem}>
                        <span className={styles.reflectText}>{st.text}</span>
                        <div className={styles.starRating}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className={`${styles.starBtn} ${rating >= star ? styles.starActive : ''}`}
                              onClick={() =>
                                !isReadOnly &&
                                revReflect.setValue({ ...revReflect.value, [st.id]: star })
                              }
                              aria-label={`Rate ${star} stars`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.article>

      {/* Модальное окно полноэкранного просмотра карты */}
      {isMapModalOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setIsMapModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalCloseBtn}
              onClick={() => setIsMapModalOpen(false)}
              aria-label="Close enlarged map"
            >
              ✕
            </button>
            <Image
              src="/images/lesson3d/town_map.png"
              alt="Enlarged Town Map"
              width={800}
              height={907}
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}
