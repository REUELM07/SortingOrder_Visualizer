/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  ArrowDownUp,
  GitBranch,
  ShieldAlert,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { ALL_RULES, KeyChar } from '../types/sorting.ts';
import { compareKey } from '../utils/sortingAlgorithm.ts';

export const CodeWalkthrough: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  // Interactive playground state
  const [demoP1, setDemoP1] = useState({ name: 'BOB', age: 25, weight: 180 });
  const [demoP2, setDemoP2] = useState({ name: 'BOB', age: 30, weight: 170 });
  const [demoRule, setDemoRule] = useState<string>('NAW');

  const sections = [
    {
      id: 0,
      title: '01. The 6 Permutations & Why We Do Not Sort',
      badge: 'Core Concept',
      content: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            In this problem, we are given three parallel arrays: <code>string[] name</code>,{' '}
            <code>int[] age</code>, and <code>int[] weight</code>.
          </p>
          <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-indigo-950 dark:text-indigo-200">
            <strong>Key Insight:</strong> The algorithm does <em>NOT</em> re-sort or scramble the arrays!
            Instead, it tests whether the <strong>already existing order</strong> of the array is
            consistent with one of the 6 possible sorting rules.
          </div>
          <p>
            Because there are 3 attributes (<strong>N</strong>ame, <strong>A</strong>ge,{' '}
            <strong>W</strong>eight), the number of possible priority arrangements is{' '}
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              3! = 3 × 2 × 1 = 6 rules
            </span>
            :
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">NAW</span>
              <span className="text-slate-500">1st Name → 2nd Age → 3rd Weight</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">NWA</span>
              <span className="text-slate-500">1st Name → 2nd Weight → 3rd Age</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">ANW</span>
              <span className="text-slate-500">1st Age → 2nd Name → 3rd Weight</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">AWN</span>
              <span className="text-slate-500">1st Age → 2nd Weight → 3rd Name</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">WAN</span>
              <span className="text-slate-500">1st Weight → 2nd Age → 3rd Name</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">WNA</span>
              <span className="text-slate-500">1st Weight → 2nd Name → 3rd Age</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      title: '02. Attribute Ordering Directions & The "Weight Trap"',
      badge: 'Critical Rule',
      content: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Each of the three keys has a specific sorting direction defined by the problem. Pay
            particular attention to <strong>Weight</strong>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Key N */}
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-amber-800 dark:text-amber-300">
                  Key 'N': Name
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold">
                  Ascending (A → Z)
                </span>
              </div>
              <p className="text-xs">
                Compared via <code>String.Compare(name[first], name[second])</code>.
              </p>
              <ul className="text-xs space-y-1 font-mono">
                <li><code>result &lt; 0</code>: "AL" &lt; "BOB" (Correct, return -1)</li>
                <li><code>result &gt; 0</code>: "BOB" &gt; "AL" (Wrong, return 1)</li>
                <li><code>result == 0</code>: Identical (Tie, return 0)</li>
              </ul>
            </div>

            {/* Key A */}
            <div className="p-4 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-sky-800 dark:text-sky-300">
                  Key 'A': Age
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-sky-200 dark:bg-sky-900 text-sky-900 dark:text-sky-200 font-bold">
                  Ascending (Small → Large)
                </span>
              </div>
              <p className="text-xs">
                Younger person must come before older person:
              </p>
              <ul className="text-xs space-y-1 font-mono">
                <li><code>age[first] &lt; age[second]</code>: 20 &lt; 25 (return -1)</li>
                <li><code>age[first] &gt; age[second]</code>: 25 &gt; 20 (return 1)</li>
                <li><code>age[first] == age[second]</code>: Tie (return 0)</li>
              </ul>
            </div>

            {/* Key W */}
            <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-rose-800 dark:text-rose-300">
                  Key 'W': Weight
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200 font-bold">
                  DESCENDING (Large → Small)
                </span>
              </div>
              <p className="text-xs font-semibold text-rose-900 dark:text-rose-200">
                ⚠ Common Pitfall: Weight is descending! Heavier comes first!
              </p>
              <ul className="text-xs space-y-1 font-mono">
                <li><code>weight[first] &gt; weight[second]</code>: 200 &gt; 180 (return -1)</li>
                <li><code>weight[first] &lt; weight[second]</code>: 180 &lt; 200 (return 1)</li>
                <li><code>weight[first] == weight[second]</code>: Tie (return 0)</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: '03. The Adjacent Neighbour-Pair Theorem (O(N) Complexity)',
      badge: 'Math Proof',
      content: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Why does <code>IsRuleValid</code> only check neighbouring pairs{' '}
            <code>(i, i + 1)</code> for <code>i = 0 ... N - 2</code>, instead of comparing all possible
            pairs <code>(i, j)</code>?
          </p>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white block">
              Principle of Transitivity in Total Orders:
            </span>
            <p className="text-xs">
              A lexicographical priority rule defines a mathematical <strong>total preorder</strong>.
              By transitivity:
            </p>
            <div className="font-mono text-xs bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400">
              If (A[0] ≤ A[1]) AND (A[1] ≤ A[2]) AND ... AND (A[N-2] ≤ A[N-1])
              <br />
              THEN for ANY indices j &gt; i, we are guaranteed that A[i] ≤ A[j]!
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Therefore, checking adjacent pairs is both <strong>necessary and sufficient</strong>.
              This reduces comparison time from O(N²) to O(N).
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: '04. Cascading Lexicographical Evaluation (Short-Circuit)',
      badge: 'Code Flow',
      content: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            Notice how <code>IsRuleValid</code> chains the evaluation of the 3 keys:
          </p>

          <div className="font-mono text-xs bg-slate-950 text-slate-200 p-4 rounded-xl border border-slate-800 space-y-2">
            <div>
              <span className="text-indigo-400">// 1. Check Primary Key: rule[0]</span>
              <br />
              <span className="text-slate-400">int result = CompareKey(rule[0], i, i + 1, ...);</span>
              <br />
              <span className="text-emerald-400">if (result &lt; 0) continue;</span>{' '}
              <span className="text-slate-500">// Strictly sorted! Skip secondary/final keys!</span>
              <br />
              <span className="text-red-400">if (result &gt; 0) return false;</span>{' '}
              <span className="text-slate-500">// Inverted order! Rule fails!</span>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-indigo-400">// 2. Primary was tied (result == 0). Check Secondary Key: rule[1]</span>
              <br />
              <span className="text-slate-400">result = CompareKey(rule[1], i, i + 1, ...);</span>
              <br />
              <span className="text-emerald-400">if (result &lt; 0) continue;</span>{' '}
              <span className="text-slate-500">// Tie broken! Skip final key!</span>
              <br />
              <span className="text-red-400">if (result &gt; 0) return false;</span>{' '}
              <span className="text-slate-500">// Inverted! Rule fails!</span>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-indigo-400">// 3. Both Primary & Secondary were tied! Check Final Key: rule[2]</span>
              <br />
              <span className="text-slate-400">result = CompareKey(rule[2], i, i + 1, ...);</span>
              <br />
              <span className="text-red-400">if (result &gt; 0) return false;</span>{' '}
              <span className="text-slate-500">// Final tie-breaker failed!</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: '05. The Three Return Outcomes (NOT, IND, or Unique Rule)',
      badge: 'Return Logic',
      content: (
        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            After testing all 6 candidate rules in the loop, <code>Solve</code> inspects{' '}
            <code>validCount</code>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 space-y-1">
              <div className="font-bold text-red-800 dark:text-red-300 text-sm">"NOT"</div>
              <div className="text-slate-600 dark:text-slate-400">validCount == 0</div>
              <p className="font-sans text-slate-600 dark:text-slate-400 text-xs mt-2">
                None of the 6 permutations can explain the observed order. The array contains
                contradictory orderings.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-1">
              <div className="font-bold text-amber-800 dark:text-amber-300 text-sm">"IND"</div>
              <div className="text-slate-600 dark:text-slate-400">validCount &gt; 1</div>
              <p className="font-sans text-slate-600 dark:text-slate-400 text-xs mt-2">
                "Indeterminate" — multiple rules could explain the order. For example, if all
                people have identical values, all 6 rules will pass!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-1">
              <div className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">"validRule"</div>
              <div className="text-slate-600 dark:text-slate-400">validCount == 1</div>
              <p className="font-sans text-slate-600 dark:text-slate-400 text-xs mt-2">
                Exactly one rule uniquely explains the order (e.g. "NWA", "AWN", "WAN").
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Interactive pair comparison test
  const testComparison = () => {
    const names = [demoP1.name, demoP2.name];
    const ages = [demoP1.age, demoP2.age];
    const weights = [demoP1.weight, demoP2.weight];

    // Primary
    const pKey = demoRule[0] as KeyChar;
    const pCmp = compareKey(pKey, 0, 1, names, ages, weights);

    if (pCmp.result < 0) {
      return {
        verdict: 'VALID (Decided by Primary Key)',
        color: 'emerald',
        step: `Primary Key '${pKey}' returned -1 (correct order). Secondary and Final keys bypassed via 'continue;'`,
      };
    }
    if (pCmp.result > 0) {
      return {
        verdict: 'INVALID (Violated Primary Key)',
        color: 'red',
        step: `Primary Key '${pKey}' returned +1 (wrong order). Rule immediately rejected via 'return false;'`,
      };
    }

    // Secondary
    const sKey = demoRule[1] as KeyChar;
    const sCmp = compareKey(sKey, 0, 1, names, ages, weights);
    if (sCmp.result < 0) {
      return {
        verdict: 'VALID (Decided by Secondary Key)',
        color: 'emerald',
        step: `Primary was tied! Secondary Key '${sKey}' returned -1 (correct tie-breaker). Final key bypassed.`,
      };
    }
    if (sCmp.result > 0) {
      return {
        verdict: 'INVALID (Violated Secondary Key)',
        color: 'red',
        step: `Primary was tied, but Secondary Key '${sKey}' returned +1 (wrong tie-breaker order). 'return false;'`,
      };
    }

    // Final
    const fKey = demoRule[2] as KeyChar;
    const fCmp = compareKey(fKey, 0, 1, names, ages, weights);
    if (fCmp.result > 0) {
      return {
        verdict: 'INVALID (Violated Final Key)',
        color: 'red',
        step: `Primary & Secondary were tied, but Final Key '${fKey}' returned +1. 'return false;'`,
      };
    }

    return {
      verdict: 'VALID (Identical or Final Key Satisfied)',
      color: 'emerald',
      step: `All attributes either satisfied rule or were identical. Pair passed!`,
    };
  };

  const interactiveResult = testComparison();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Intro Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Complete Code Breakdown: SortingOrder.cs</span>
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          Explore the five foundational pillars of the algorithm. Click any section below to expand
          its mathematical intuition, code mechanics, and edge cases.
        </p>
      </div>

      {/* Accordion Chapters */}
      <div className="space-y-4">
        {sections.map((sec) => {
          const isOpen = expandedSection === sec.id;

          return (
            <div
              key={sec.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-colors"
            >
              <button
                onClick={() => setExpandedSection(isOpen ? null : sec.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    {sec.badge}
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {sec.title}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {isOpen && <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800">{sec.content}</div>}
            </div>
          );
        })}
      </div>

      {/* Interactive Pair-Comparator Lab */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Interactive Mini-Lab: Test Two People on Any Rule</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Change the values and rule to see how the cascading key comparison logic decides the pair order.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Test Rule:</span>
            <select
              value={demoRule}
              onChange={(e) => setDemoRule(e.target.value)}
              className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1 text-slate-900 dark:text-white"
            >
              {ALL_RULES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Person 1 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
              Person 1 (First)
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block font-mono">Name</label>
                <input
                  type="text"
                  value={demoP1.name}
                  onChange={(e) =>
                    setDemoP1({ ...demoP1, name: e.target.value.toUpperCase().slice(0, 10) })
                  }
                  className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block font-mono">Age</label>
                <input
                  type="number"
                  value={demoP1.age}
                  onChange={(e) => setDemoP1({ ...demoP1, age: Number(e.target.value) })}
                  className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block font-mono">Weight (kg)</label>
                <input
                  type="number"
                  value={demoP1.weight}
                  onChange={(e) => setDemoP1({ ...demoP1, weight: Number(e.target.value) })}
                  className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Person 2 */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
              Person 2 (Second)
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block font-mono">Name</label>
                <input
                  type="text"
                  value={demoP2.name}
                  onChange={(e) =>
                    setDemoP2({ ...demoP2, name: e.target.value.toUpperCase().slice(0, 10) })
                  }
                  className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block font-mono">Age</label>
                <input
                  type="number"
                  value={demoP2.age}
                  onChange={(e) => setDemoP2({ ...demoP2, age: Number(e.target.value) })}
                  className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block font-mono">Weight (kg)</label>
                <input
                  type="number"
                  value={demoP2.weight}
                  onChange={(e) => setDemoP2({ ...demoP2, weight: Number(e.target.value) })}
                  className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Lab Result */}
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            interactiveResult.color === 'emerald'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
              : 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800'
          }`}
        >
          <div>
            <div
              className={`text-sm font-bold font-mono ${
                interactiveResult.color === 'emerald'
                  ? 'text-emerald-800 dark:text-emerald-300'
                  : 'text-red-800 dark:text-red-300'
              }`}
            >
              {interactiveResult.verdict}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {interactiveResult.step}
            </div>
          </div>

          <span className="text-xs font-mono px-3 py-1 rounded-full bg-white dark:bg-slate-900 font-bold shadow-xs whitespace-nowrap self-start sm:self-auto">
            Rule Tested: {demoRule}
          </span>
        </div>
      </div>
    </div>
  );
};
