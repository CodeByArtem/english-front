'use client';

import React, { useState, useMemo } from 'react';
import styles from './WordsearchGrid.module.scss';

export interface WordsearchTarget {
  key: string;
  label: string;
  cells: [number, number][];
}

export interface WordsearchGridProps {
  grid: string[][];
  targets: WordsearchTarget[];
  foundMap: Record<string, string>;
  onToggleWord: (key: string, nextFound: boolean) => void;
  readOnly?: boolean;
  className?: string;
  victoryMessage?: string;
  isWordFound?: (key: string, val: string | undefined) => boolean;
}

export default function WordsearchGrid({
  grid,
  targets,
  foundMap,
  onToggleWord,
  readOnly = false,
  className = '',
  victoryMessage,
  isWordFound = (_key, val) => val === 'true',
}: WordsearchGridProps) {
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [feedback, setFeedback] = useState<string>('');

  // Map of target keys to target definitions for O(1) lookup
  const targetMap = useMemo(() => {
    const map = new Map<string, WordsearchTarget>();
    for (const t of targets) {
      map.set(t.key, t);
    }
    return map;
  }, [targets]);

  // Compute set of all cells that are currently in found words
  const foundCellSet = useMemo(() => {
    const set = new Set<string>();
    for (const [key, val] of Object.entries(foundMap)) {
      if (isWordFound(key, val)) {
        const target = targetMap.get(key);
        if (target) {
          for (const [r, c] of target.cells) {
            set.add(`${r},${c}`);
          }
        }
      }
    }
    return set;
  }, [foundMap, isWordFound, targetMap]);

  // Total count of found words
  const foundCount = useMemo(() => {
    return targets.filter((t) => isWordFound(t.key, foundMap[t.key])).length;
  }, [targets, foundMap, isWordFound]);

  const isAllFound = targets.length > 0 && foundCount === targets.length;

  // Selected letters preview string
  const currentSelectionString = useMemo(() => {
    return selectedCells
      .map(([r, c]) => grid[r]?.[c] || '')
      .filter(Boolean)
      .join('');
  }, [selectedCells, grid]);

  // Handle cell click
  const handleCellClick = (r: number, c: number) => {
    if (readOnly) return;

    const existingIdx = selectedCells.findIndex(([sr, sc]) => sr === r && sc === c);
    let nextCells: [number, number][];

    if (existingIdx >= 0) {
      nextCells = selectedCells.filter((_, idx) => idx !== existingIdx);
    } else {
      nextCells = [...selectedCells, [r, c]];
    }

    setSelectedCells(nextCells);

    if (nextCells.length === 0) return;

    // Check if the selected cells match any target word's cells exactly
    for (const target of targets) {
      const alreadyFound = isWordFound(target.key, foundMap[target.key]);
      if (alreadyFound) continue;

      const setMatches =
        nextCells.length === target.cells.length &&
        target.cells.every(([tr, tc]) => nextCells.some(([sr, sc]) => sr === tr && sc === tc));

      if (setMatches) {
        onToggleWord(target.key, true);
        setSelectedCells([]);
        setFeedback(`🎉 Found: ${target.label}!`);
        setTimeout(() => setFeedback(''), 3000);
        return;
      }
    }
  };

  const clearSelection = () => {
    setSelectedCells([]);
  };

  const colsCount = grid[0]?.length || 10;

  return (
    <div className={`${styles.container} ${className}`}>
      {/* 10x8 or NxM Grid */}
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${colsCount}, 1fr)` }}
      >
        {grid.map((row, rIdx) =>
          row.map((letter, cIdx) => {
            const isSelected = selectedCells.some(([sr, sc]) => sr === rIdx && sc === cIdx);
            const isFound = foundCellSet.has(`${rIdx},${cIdx}`);

            return (
              <button
                key={`cell-${rIdx}-${cIdx}`}
                type="button"
                disabled={readOnly}
                onClick={() => handleCellClick(rIdx, cIdx)}
                className={`${styles.cell} ${
                  isSelected
                    ? styles.cellSelected
                    : isFound
                    ? styles.cellFound
                    : ''
                }`}
                aria-label={`Row ${rIdx + 1}, Column ${cIdx + 1}: ${letter}`}
              >
                {letter}
              </button>
            );
          })
        )}
      </div>

      {/* Status Bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <span>Found:</span>
          <span className={styles.badge}>
            {foundCount} / {targets.length}
          </span>
          {feedback && <span className={styles.feedbackMessage}>{feedback}</span>}
        </div>
        {!readOnly && selectedCells.length > 0 && (
          <button
            type="button"
            onClick={clearSelection}
            className={styles.clearBtn}
          >
            Clear selection ({currentSelectionString || selectedCells.length})
          </button>
        )}
      </div>

      {/* Victory Celebration Banner when all words are found */}
      {isAllFound && (
        <div className={styles.victoryBanner} role="status">
          <span className={styles.victoryIcon}>🏆</span>
          <div className={styles.victoryContent}>
            <strong className={styles.victoryTitle}>
              {victoryMessage || 'Great job! All words found!'}
            </strong>
            <span className={styles.victorySub}>
              You have successfully completed the wordsearch ({targets.length} / {targets.length}).
            </span>
          </div>
        </div>
      )}

      {/* Word Chips */}
      <div className={styles.wordsList}>
        {targets.map((t) => {
          const isFound = isWordFound(t.key, foundMap[t.key]);
          return (
            <button
              key={t.key}
              type="button"
              disabled={readOnly}
              onClick={() => {
                if (readOnly) return;
                onToggleWord(t.key, !isFound);
              }}
              className={`${styles.wordItem} ${isFound ? styles.wordItemFound : ''}`}
            >
              {isFound ? `✓ ${t.label}` : t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
