/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Cpu,
  ArrowDown,
  ArrowRight,
  RotateCw,
  GitCommit,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  HardDrive,
} from 'lucide-react';

interface FlowNode {
  id: string;
  title: string;
  scope: 'solve' | 'isRuleValid' | 'compareKey';
  csharpCode: string;
  explanation: string;
}

const FLOW_NODES: FlowNode[] = [
  {
    id: 'solve-entry',
    title: '1. Entry & Rules Init',
    scope: 'solve',
    csharpCode: 'string[] rules = {"NAW", "NWA", "ANW", "AWN", "WAN", "WNA"};\nint validCount = 0;',
    explanation: 'Solve() receives the 3 parallel arrays and sets up the 6 candidate permutation rules.',
  },
  {
    id: 'outer-loop',
    title: '2. Outer Rule Loop (r = 0..5)',
    scope: 'solve',
    csharpCode: 'for (int r = 0; r < rules.Length; r++)\n{\n    if (IsRuleValid(name, age, weight, rules[r])) ...\n}',
    explanation: 'Iterates through each candidate rule sequentially. Does not stop on first match because multiple rules might match (IND).',
  },
  {
    id: 'pair-loop',
    title: '3. Inner Pair Loop (i = 0..N-2)',
    scope: 'isRuleValid',
    csharpCode: 'for (int i = 0; i < name.Length - 1; i++)',
    explanation: 'Tests every adjacent pair (i, i+1). Transitivity of order ensures whole array is sorted if all adjacent pairs pass.',
  },
  {
    id: 'primary-key',
    title: '4. Compare Primary Key rule[0]',
    scope: 'compareKey',
    csharpCode: 'int result = CompareKey(rule[0], i, i + 1, ...);\nif (result < 0) continue;\nif (result > 0) return false;',
    explanation: 'If primary key is strictly sorted (<0), pair passes! If inverted (>0), rule immediately rejected. If tied (==0), cascades.',
  },
  {
    id: 'secondary-key',
    title: '5. Compare Secondary Key rule[1]',
    scope: 'compareKey',
    csharpCode: 'result = CompareKey(rule[1], i, i + 1, ...);\nif (result < 0) continue;\nif (result > 0) return false;',
    explanation: 'Consulted only if primary was tied. If tie broken correctly, pair passes. If inverted, returns false.',
  },
  {
    id: 'final-key',
    title: '6. Compare Final Key rule[2]',
    scope: 'compareKey',
    csharpCode: 'result = CompareKey(rule[2], i, i + 1, ...);\nif (result > 0) return false;',
    explanation: 'Consulted only if both primary & secondary were tied. If inverted (>0), rule rejected. Otherwise pair passes.',
  },
  {
    id: 'tally-rule',
    title: '7. Tally Valid Rule',
    scope: 'solve',
    csharpCode: 'validCount = validCount + 1;\nvalidRule = rules[r];',
    explanation: 'If loop completed without returning false, the rule is valid. Increments count and saves rule name.',
  },
  {
    id: 'final-verdict',
    title: '8. Final 3-Way Verdict',
    scope: 'solve',
    csharpCode: 'if (validCount == 0) return "NOT";\nif (validCount > 1) return "IND";\nreturn validRule;',
    explanation: 'Examines total valid rules: 0 => "NOT", >1 => "IND", 1 => validRule.',
  },
];

export const AlgorithmAnatomy: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('primary-key');

  const selectedNode = FLOW_NODES.find((n) => n.id === selectedNodeId) || FLOW_NODES[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Algorithm Anatomy & Execution Flowchart</span>
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          Visualizing the control flow architecture of <code>SortingOrder.cs</code>. Click any step
          in the flowchart below to examine its internal mechanics and code snippet.
        </p>
      </div>

      {/* Interactive Visual Flowchart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Interactive Control Flowchart
          </h3>
          <span className="text-xs text-slate-500">Click a node to inspect</span>
        </div>

        {/* Flowchart Diagram */}
        <div className="space-y-3 font-mono text-xs max-w-2xl mx-auto">
          {FLOW_NODES.map((node, i) => {
            const isSelected = node.id === selectedNodeId;

            return (
              <React.Fragment key={node.id}>
                <div
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-sm scale-[1.01]'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {node.title}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        node.scope === 'solve'
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                          : node.scope === 'isRuleValid'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      Scope: {node.scope}()
                    </span>
                  </div>
                </div>

                {/* Connecting arrow */}
                {i < FLOW_NODES.length - 1 && (
                  <div className="flex justify-center py-0.5 text-slate-400 dark:text-slate-600">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Selected Node Inspector */}
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Selected Node: {selectedNode.title}
            </span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">
              In method: {selectedNode.scope}()
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">{selectedNode.explanation}</p>

          <pre className="p-3 rounded-lg bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
            {selectedNode.csharpCode}
          </pre>
        </div>
      </div>

      {/* Complexity & Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Complexity */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Time Complexity: O(N)
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            - Outer loop runs exactly <strong>6 times</strong> (fixed constant for the 6 permutations).
            <br />
            - Inner loop compares adjacent pairs <code>i = 0 ... N - 2</code>, which is <strong>(N - 1) iterations</strong>.
            <br />
            - Each comparison tests at most 3 attributes in <strong>O(1)</strong> time (or string length for Name).
            <br />
            - Total runtime: <code>6 × (N - 1) × O(1) = O(N)</code> linear time. Extremely fast, executing in microseconds even for large arrays!
          </p>
        </div>

        {/* Space Complexity */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Auxiliary Space: O(1)
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            - The algorithm does not copy, duplicate, or allocate any auxiliary arrays or lists.
            <br />
            - Only a constant number of primitive variables (<code>validCount</code>, <code>validRule</code>, <code>result</code>, loop indices <code>r</code> and <code>i</code>) are used.
            <br />
            - Memory footprint is strictly <code>O(1)</code> space.
          </p>
        </div>
      </div>
    </div>
  );
};
