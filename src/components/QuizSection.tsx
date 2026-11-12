/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "In CompareKey, why does `weight[first] > weight[second]` return -1?",
    options: [
      "Because larger weights should come later in the array",
      "Because Weight is sorted in DESCENDING order (heavier comes before lighter)",
      "It is a typo in the C# code",
      "Because -1 indicates an error code"
    ],
    correctIndex: 1,
    explanation: "Key 'W' represents descending order! Therefore, if the first person is heavier than the second person (weight[first] > weight[second]), they are correctly ordered, returning -1."
  },
  {
    id: 2,
    question: "Why does IsRuleValid only compare adjacent neighbours (i, i+1) instead of all O(N²) pairs?",
    options: [
      "To save lines of code",
      "Because C# arrays only support adjacent index operations",
      "By mathematical transitivity of total order, if every adjacent pair satisfies A[i] ≤ A[i+1], the entire array is globally sorted",
      "It is only an approximation and might give wrong answers"
    ],
    correctIndex: 2,
    explanation: "Transitivity! In a total ordering, if A ≤ B and B ≤ C, then A ≤ C is guaranteed. Checking all N-1 adjacent pairs is necessary and sufficient, reducing runtime to O(N)."
  },
  {
    id: 3,
    question: "If an array contains 4 people who have identical Names ('BOB'), Ages (25), and Weights (150), what will Solve() return?",
    options: [
      "'NOT'",
      "'NAW'",
      "'IND'",
      "An exception (IndexOutOfRangeException)"
    ],
    correctIndex: 2,
    explanation: "Since all values are identical, every comparison returns 0 (tie) on all three keys for all pairs. Thus, all 6 rules evaluate to valid (validCount = 6). Because validCount > 1, it returns 'IND' (Indeterminate)!"
  },
  {
    id: 4,
    question: "When evaluating a pair, if the Primary Key produces result < 0, what does the algorithm do?",
    options: [
      "Checks the Secondary Key to confirm",
      "Immediately returns false",
      "Executes 'continue;' to skip Secondary and Final keys, moving to the next adjacent pair",
      "Re-sorts the array"
    ],
    correctIndex: 2,
    explanation: "In lexicographical sorting, secondary keys are tie-breakers. If the primary key is already strictly ordered (result < 0), the secondary and final keys are completely irrelevant for this pair! The code executes continue."
  },
  {
    id: 5,
    question: "What does the return value 'NOT' signify in Solve()?",
    options: [
      "The input arrays were null or empty",
      "None of the 6 permutations can explain the observed ordering of the objects",
      "The array is sorted in reverse",
      "Only 1 rule was valid"
    ],
    correctIndex: 1,
    explanation: "'NOT' is returned when validCount == 0, meaning that not a single one of the 6 candidate sorting rules is satisfied by the given array order."
  }
];

export const QuizSection: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = QUESTIONS.reduce((acc, q) => {
    return acc + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);

  const allAnswered = QUESTIONS.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Concept Mastery Quiz</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Test your understanding of tie-breakers, transitivity, and descending weight semantics.
            </p>
          </div>

          {submitted && (
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>
          )}
        </div>

        {submitted && (
          <div className="mt-6 p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">
                  Your Score: {score} / {QUESTIONS.length} (
                  {Math.round((score / QUESTIONS.length) * 100)}%)
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-300">
                  {score === 5
                    ? 'Perfect score! You have completely mastered the SortingOrder algorithm!'
                    : 'Great effort! Review the explanations below to solidify the concepts.'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {QUESTIONS.map((q, qIndex) => {
          const userChoice = selectedAnswers[q.id];
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div
              key={q.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 shrink-0">
                  Q{qIndex + 1}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {q.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userChoice === optIdx;
                  let optStyle = 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60';

                  if (submitted) {
                    if (optIdx === q.correctIndex) {
                      optStyle = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optStyle = 'border-red-400 bg-red-50/70 dark:bg-red-950/40 text-red-900 dark:text-red-200';
                    } else {
                      optStyle = 'opacity-50 border-slate-200 dark:border-slate-800';
                    }
                  } else if (isSelected) {
                    optStyle = 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500 font-medium';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(q.id, optIdx)}
                      disabled={submitted}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {submitted && optIdx === q.correctIndex && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      {submitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon submission */}
              {submitted && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                    Concept Rationale:
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit bar */}
      {!submitted && (
        <div className="flex justify-end pt-2">
          <button
            onClick={() => setSubmitted(true)}
            disabled={!allAnswered}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Submit Answers
          </button>
        </div>
      )}
    </div>
  );
};
