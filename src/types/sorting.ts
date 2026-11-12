/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Person {
  id: number;
  name: string;
  age: number;
  weight: number;
}

export type SortingRule = 'NAW' | 'NWA' | 'ANW' | 'AWN' | 'WAN' | 'WNA';

export const ALL_RULES: readonly SortingRule[] = [
  'NAW',
  'NWA',
  'ANW',
  'AWN',
  'WAN',
  'WNA',
] as const;

export type KeyChar = 'N' | 'A' | 'W';
export type KeyRank = 'Primary' | 'Secondary' | 'Final';

export interface ComparisonDetail {
  key: KeyChar;
  keyRank: KeyRank;
  keyIndexInRule: number; // 0, 1, or 2
  val1: string | number;
  val2: string | number;
  comparisonExpression: string; // e.g. "String.Compare('BOB', 'BOB')" or "22 < 35"
  directionRule: string; // e.g. "Alphabetical ascending (A-Z)", "Ascending (small to large)", "Descending (large to small)"
  result: number; // -1, 0, or 1
  meaning: string;
}

export type StepType =
  | 'SOLVE_START'
  | 'RULE_LOOP_START'
  | 'IS_RULE_VALID_START'
  | 'PAIR_LOOP_START'
  | 'COMPARE_PRIMARY'
  | 'COMPARE_SECONDARY'
  | 'COMPARE_FINAL'
  | 'PAIR_PASSED'
  | 'RULE_FAILED'
  | 'RULE_PASSED'
  | 'RULE_LOOP_END'
  | 'SOLVE_CHECK_COUNT'
  | 'SOLVE_FINAL';

export interface DryRunStep {
  stepIndex: number;
  type: StepType;
  csharpLine: number; // Exact line number in SortingOrder.cs
  functionName: string;
  callStack: string[];
  scopeVars: {
    r?: number;
    rule?: string;
    validCount: number;
    validRule: string;
    i?: number;
    firstIndex?: number;
    secondIndex?: number;
    key?: KeyChar;
    result?: number;
  };
  ruleStatus: Record<SortingRule, 'pending' | 'testing' | 'valid' | 'invalid'>;
  ruleFailures: Partial<Record<SortingRule, { pairIndex: number; key: KeyChar; reason: string }>>;
  activePair?: { first: number; second: number };
  activeKey?: KeyChar;
  activeKeyRank?: KeyRank;
  comparison?: ComparisonDetail;
  title: string;
  explanation: string;
  highlightedCodeSnippet?: string;
}

export interface TestCase {
  id: number;
  name: string;
  names: string[];
  ages: number[];
  weights: number[];
  expected: string;
  note?: string;
}
