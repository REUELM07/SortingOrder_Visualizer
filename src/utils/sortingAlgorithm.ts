/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ALL_RULES,
  ComparisonDetail,
  DryRunStep,
  KeyChar,
  KeyRank,
  SortingRule,
} from '../types/sorting.ts';

/**
 * Replicates C# String.Compare (ordinal/alphabetical)
 */
export function csharpStringCompare(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/**
 * Replicates C# CompareKey method exactly
 */
export function compareKey(
  key: KeyChar,
  first: number,
  second: number,
  name: string[],
  age: number[],
  weight: number[]
): { result: number; detail: ComparisonDetail } {
  if (key === 'N') {
    const cmp = csharpStringCompare(name[first], name[second]);
    let result = 0;
    if (cmp < 0) result = -1;
    else if (cmp > 0) result = 1;
    else result = 0;

    return {
      result,
      detail: {
        key: 'N',
        keyRank: 'Primary',
        keyIndexInRule: 0,
        val1: `"${name[first]}"`,
        val2: `"${name[second]}"`,
        comparisonExpression: `String.Compare("${name[first]}", "${name[second]}")`,
        directionRule: 'Alphabetical Ascending (A → Z)',
        result,
        meaning:
          result < 0
            ? `"${name[first]}" precedes "${name[second]}" alphabetically (correct order, returns -1)`
            : result > 0
            ? `"${name[first]}" succeeds "${name[second]}" alphabetically (inverted order, returns 1)`
            : `Names are identical "${name[first]}" == "${name[second]}" (tie, returns 0)`,
      },
    };
  }

  if (key === 'A') {
    let result = 0;
    if (age[first] < age[second]) result = -1;
    else if (age[first] > age[second]) result = 1;
    else result = 0;

    return {
      result,
      detail: {
        key: 'A',
        keyRank: 'Primary',
        keyIndexInRule: 0,
        val1: age[first],
        val2: age[second],
        comparisonExpression: `${age[first]} ${result < 0 ? '<' : result > 0 ? '>' : '=='} ${age[second]}`,
        directionRule: 'Age Ascending: Small → Large',
        result,
        meaning:
          result < 0
            ? `Age ${age[first]} < ${age[second]} (younger precedes older, correct order, returns -1)`
            : result > 0
            ? `Age ${age[first]} > ${age[second]} (older precedes younger, inverted order, returns 1)`
            : `Ages are equal (${age[first]} == ${age[second]}) (tie, returns 0)`,
      },
    };
  }

  // key === 'W'
  let result = 0;
  if (weight[first] > weight[second]) result = -1;
  else if (weight[first] < weight[second]) result = 1;
  else result = 0;

  return {
    result,
    detail: {
      key: 'W',
      keyRank: 'Primary',
      keyIndexInRule: 0,
      val1: weight[first],
      val2: weight[second],
      comparisonExpression: `${weight[first]} ${result < 0 ? '>' : result > 0 ? '<' : '=='} ${weight[second]}`,
      directionRule: 'Weight DESCENDING: Large → Small',
      result,
      meaning:
        result < 0
          ? `Weight ${weight[first]} > ${weight[second]} (heavier precedes lighter, correct descending order, returns -1)`
          : result > 0
          ? `Weight ${weight[first]} < ${weight[second]} (lighter precedes heavier, inverted descending order, returns 1)`
          : `Weights are equal (${weight[first]} == ${weight[second]}) (tie, returns 0)`,
    },
  };
}

/**
 * Fast synchronous solver matching C# Solve
 */
export function solveFast(name: string[], age: number[], weight: number[]): string {
  const rules = ['NAW', 'NWA', 'ANW', 'AWN', 'WAN', 'WNA'];
  let validCount = 0;
  let validRule = '';

  for (let r = 0; r < rules.length; r++) {
    const rule = rules[r];
    let isValid = true;

    for (let i = 0; i < name.length - 1; i++) {
      let res = compareKey(rule[0] as KeyChar, i, i + 1, name, age, weight).result;
      if (res < 0) continue;
      if (res > 0) {
        isValid = false;
        break;
      }

      res = compareKey(rule[1] as KeyChar, i, i + 1, name, age, weight).result;
      if (res < 0) continue;
      if (res > 0) {
        isValid = false;
        break;
      }

      res = compareKey(rule[2] as KeyChar, i, i + 1, name, age, weight).result;
      if (res > 0) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      validCount++;
      validRule = rule;
    }
  }

  if (validCount === 0) return 'NOT';
  if (validCount > 1) return 'IND';
  return validRule;
}

/**
 * Generates high-granularity dry-run steps for the visual simulator
 */
export function generateDryRunSteps(
  name: string[],
  age: number[],
  weight: number[]
): { steps: DryRunStep[]; finalVerdict: string; validRules: string[] } {
  const steps: DryRunStep[] = [];
  const rules = ALL_RULES;

  const ruleStatus: Record<SortingRule, 'pending' | 'testing' | 'valid' | 'invalid'> = {
    NAW: 'pending',
    NWA: 'pending',
    ANW: 'pending',
    AWN: 'pending',
    WAN: 'pending',
    WNA: 'pending',
  };

  const ruleFailures: Partial<Record<SortingRule, { pairIndex: number; key: KeyChar; reason: string }>> = {};

  let validCount = 0;
  let validRule = '';
  const passedRulesList: string[] = [];

  function addStep(step: Omit<DryRunStep, 'stepIndex' | 'ruleStatus' | 'ruleFailures'>) {
    steps.push({
      ...step,
      stepIndex: steps.length,
      ruleStatus: { ...ruleStatus },
      ruleFailures: { ...ruleFailures },
    });
  }

  // Step 1: Initialize Solve
  addStep({
    type: 'SOLVE_START',
    csharpLine: 14,
    functionName: 'Solve',
    callStack: ['Solve(name, age, weight)'],
    scopeVars: { validCount: 0, validRule: '""' },
    title: 'Initialize Candidate Rules',
    explanation:
      'The algorithm defines the 6 possible 3-key permutations: NAW, NWA, ANW, AWN, WAN, WNA. It sets validCount = 0.',
    highlightedCodeSnippet: 'string[] rules = {"NAW", "NWA", "ANW", "AWN", "WAN", "WNA"};\nint validCount = 0;\nstring validRule = "";',
  });

  // Outer loop: Test each of the 6 rules
  for (let r = 0; r < rules.length; r++) {
    const rule = rules[r];
    ruleStatus[rule] = 'testing';

    addStep({
      type: 'RULE_LOOP_START',
      csharpLine: 20,
      functionName: 'Solve',
      callStack: ['Solve(name, age, weight)'],
      scopeVars: { r, rule, validCount, validRule },
      title: `Testing Rule [${r + 1}/6]: "${rule}"`,
      explanation: `Outer loop iteration r = ${r}. We will now test rule "${rule}" against all neighbouring pairs in the array.`,
      highlightedCodeSnippet: `for (int r = 0; r < rules.Length; r++) // r = ${r}, rule = "${rule}"`,
    });

    // Enter IsRuleValid
    addStep({
      type: 'IS_RULE_VALID_START',
      csharpLine: 47,
      functionName: 'IsRuleValid',
      callStack: ['Solve(...)', `IsRuleValid(rule: "${rule}")`],
      scopeVars: { rule, validCount, validRule, i: 0 },
      title: `Verify Neighbouring Pairs for Rule "${rule}"`,
      explanation: `Entering IsRuleValid("${rule}"). Loop i will run from 0 to ${name.length - 2} to compare adjacent pairs (i, i+1).`,
      highlightedCodeSnippet: `for (int i = 0; i < name.Length - 1; i++) // Pairs to test: ${name.length - 1}`,
    });

    let ruleIsValid = true;

    // Pair loop
    for (let i = 0; i < name.length - 1; i++) {
      const p1Name = name[i];
      const p2Name = name[i + 1];
      const p1Age = age[i];
      const p2Age = age[i + 1];
      const p1Weight = weight[i];
      const p2Weight = weight[i + 1];

      // 1. Primary Key: rule[0]
      const primaryKey = rule[0] as KeyChar;
      const primaryCmp = compareKey(primaryKey, i, i + 1, name, age, weight);
      primaryCmp.detail.keyRank = 'Primary';
      primaryCmp.detail.keyIndexInRule = 0;

      const keyNameMap: Record<KeyChar, string> = {
        N: 'Name (Alphabetical A-Z)',
        A: 'Age (Ascending Small-to-Large)',
        W: 'Weight (DESCENDING Large-to-Small)',
      };

      addStep({
        type: 'COMPARE_PRIMARY',
        csharpLine: 50,
        functionName: 'IsRuleValid',
        callStack: ['Solve(...)', `IsRuleValid("${rule}")`, `CompareKey('${primaryKey}', ${i}, ${i + 1})`],
        scopeVars: {
          rule,
          i,
          firstIndex: i,
          secondIndex: i + 1,
          key: primaryKey,
          result: primaryCmp.result,
          validCount,
          validRule,
        },
        activePair: { first: i, second: i + 1 },
        activeKey: primaryKey,
        activeKeyRank: 'Primary',
        comparison: primaryCmp.detail,
        title: `Pair [${i}, ${i + 1}]: Compare Primary Key '${primaryKey}'`,
        explanation: `Comparing pair [${i}] (${p1Name}, ${p1Age}yo, ${p1Weight}kg) and [${i + 1}] (${p2Name}, ${p2Age}yo, ${p2Weight}kg) on Primary Key '${primaryKey}' (${keyNameMap[primaryKey]}). Result = ${primaryCmp.result}.`,
        highlightedCodeSnippet: `int result = CompareKey(rule[0], i, i + 1, name, age, weight); // '${primaryKey}' => ${primaryCmp.result}`,
      });

      if (primaryCmp.result < 0) {
        // Line 53-55: continue
        addStep({
          type: 'PAIR_PASSED',
          csharpLine: 55,
          functionName: 'IsRuleValid',
          callStack: ['Solve(...)', `IsRuleValid("${rule}")`],
          scopeVars: {
            rule,
            i,
            firstIndex: i,
            secondIndex: i + 1,
            result: primaryCmp.result,
            validCount,
            validRule,
          },
          activePair: { first: i, second: i + 1 },
          activeKey: primaryKey,
          activeKeyRank: 'Primary',
          comparison: primaryCmp.detail,
          title: `Pair [${i}, ${i + 1}] Order Settled by Primary Key`,
          explanation: `result < 0: The primary key '${primaryKey}' is strictly sorted in the correct direction! Because the primary key differed, secondary and final keys are completely bypassed (continue).`,
          highlightedCodeSnippet: 'if (result < 0) {\n    continue;\n}',
        });
        continue;
      }

      if (primaryCmp.result > 0) {
        // Line 59-61: return false
        ruleIsValid = false;
        ruleStatus[rule] = 'invalid';
        ruleFailures[rule] = {
          pairIndex: i,
          key: primaryKey,
          reason: `Violated Primary Key '${primaryKey}' at pair [${i}, ${i + 1}]: ${primaryCmp.detail.comparisonExpression}`,
        };

        addStep({
          type: 'RULE_FAILED',
          csharpLine: 61,
          functionName: 'IsRuleValid',
          callStack: ['Solve(...)', `IsRuleValid("${rule}")`],
          scopeVars: {
            rule,
            i,
            firstIndex: i,
            secondIndex: i + 1,
            result: primaryCmp.result,
            validCount,
            validRule,
          },
          activePair: { first: i, second: i + 1 },
          activeKey: primaryKey,
          activeKeyRank: 'Primary',
          comparison: primaryCmp.detail,
          title: `Rule "${rule}" Failed on Primary Key '${primaryKey}'!`,
          explanation: `result > 0: Primary key '${primaryKey}' is INVERTED between pair [${i}] and [${i + 1}]. This rule cannot explain the array order. Method immediately returns false.`,
          highlightedCodeSnippet: 'if (result > 0) {\n    return false;\n}',
        });
        break;
      }

      // Tie on primary key: proceed to secondary key (rule[1])
      const secondaryKey = rule[1] as KeyChar;
      const secondaryCmp = compareKey(secondaryKey, i, i + 1, name, age, weight);
      secondaryCmp.detail.keyRank = 'Secondary';
      secondaryCmp.detail.keyIndexInRule = 1;

      addStep({
        type: 'COMPARE_SECONDARY',
        csharpLine: 65,
        functionName: 'IsRuleValid',
        callStack: ['Solve(...)', `IsRuleValid("${rule}")`, `CompareKey('${secondaryKey}', ${i}, ${i + 1})`],
        scopeVars: {
          rule,
          i,
          firstIndex: i,
          secondIndex: i + 1,
          key: secondaryKey,
          result: secondaryCmp.result,
          validCount,
          validRule,
        },
        activePair: { first: i, second: i + 1 },
        activeKey: secondaryKey,
        activeKeyRank: 'Secondary',
        comparison: secondaryCmp.detail,
        title: `Tie on Primary! Check Secondary Key '${secondaryKey}'`,
        explanation: `Primary key '${primaryKey}' was tied (result == 0). Now consulting Secondary Key '${secondaryKey}' (${keyNameMap[secondaryKey]}). Result = ${secondaryCmp.result}.`,
        highlightedCodeSnippet: `result = CompareKey(rule[1], i, i + 1, name, age, weight); // '${secondaryKey}' => ${secondaryCmp.result}`,
      });

      if (secondaryCmp.result < 0) {
        addStep({
          type: 'PAIR_PASSED',
          csharpLine: 70,
          functionName: 'IsRuleValid',
          callStack: ['Solve(...)', `IsRuleValid("${rule}")`],
          scopeVars: {
            rule,
            i,
            firstIndex: i,
            secondIndex: i + 1,
            result: secondaryCmp.result,
            validCount,
            validRule,
          },
          activePair: { first: i, second: i + 1 },
          activeKey: secondaryKey,
          activeKeyRank: 'Secondary',
          comparison: secondaryCmp.detail,
          title: `Pair [${i}, ${i + 1}] Tie Resolved by Secondary Key`,
          explanation: `result < 0: Secondary key '${secondaryKey}' resolved the tie in the correct order! Bypassing final key and continuing loop.`,
          highlightedCodeSnippet: 'if (result < 0) {\n    continue;\n}',
        });
        continue;
      }

      if (secondaryCmp.result > 0) {
        ruleIsValid = false;
        ruleStatus[rule] = 'invalid';
        ruleFailures[rule] = {
          pairIndex: i,
          key: secondaryKey,
          reason: `Violated Secondary Key '${secondaryKey}' at pair [${i}, ${i + 1}]: ${secondaryCmp.detail.comparisonExpression}`,
        };

        addStep({
          type: 'RULE_FAILED',
          csharpLine: 76,
          functionName: 'IsRuleValid',
          callStack: ['Solve(...)', `IsRuleValid("${rule}")`],
          scopeVars: {
            rule,
            i,
            firstIndex: i,
            secondIndex: i + 1,
            result: secondaryCmp.result,
            validCount,
            validRule,
          },
          activePair: { first: i, second: i + 1 },
          activeKey: secondaryKey,
          activeKeyRank: 'Secondary',
          comparison: secondaryCmp.detail,
          title: `Rule "${rule}" Failed on Secondary Key '${secondaryKey}'!`,
          explanation: `result > 0: Secondary key '${secondaryKey}' is inverted! Tie was broken the wrong way. Method returns false.`,
          highlightedCodeSnippet: 'if (result > 0) {\n    return false;\n}',
        });
        break;
      }

      // Tie on both primary & secondary: check final key (rule[2])
      const finalKey = rule[2] as KeyChar;
      const finalCmp = compareKey(finalKey, i, i + 1, name, age, weight);
      finalCmp.detail.keyRank = 'Final';
      finalCmp.detail.keyIndexInRule = 2;

      addStep({
        type: 'COMPARE_FINAL',
        csharpLine: 80,
        functionName: 'IsRuleValid',
        callStack: ['Solve(...)', `IsRuleValid("${rule}")`, `CompareKey('${finalKey}', ${i}, ${i + 1})`],
        scopeVars: {
          rule,
          i,
          firstIndex: i,
          secondIndex: i + 1,
          key: finalKey,
          result: finalCmp.result,
          validCount,
          validRule,
        },
        activePair: { first: i, second: i + 1 },
        activeKey: finalKey,
        activeKeyRank: 'Final',
        comparison: finalCmp.detail,
        title: `Double Tie! Check Final Key '${finalKey}'`,
        explanation: `Both primary and secondary keys were tied! Evaluating final tie-breaker key '${finalKey}' (${keyNameMap[finalKey]}). Result = ${finalCmp.result}.`,
        highlightedCodeSnippet: `result = CompareKey(rule[2], i, i + 1, name, age, weight); // '${finalKey}' => ${finalCmp.result}`,
      });

      if (finalCmp.result > 0) {
        ruleIsValid = false;
        ruleStatus[rule] = 'invalid';
        ruleFailures[rule] = {
          pairIndex: i,
          key: finalKey,
          reason: `Violated Final Key '${finalKey}' at pair [${i}, ${i + 1}]: ${finalCmp.detail.comparisonExpression}`,
        };

        addStep({
          type: 'RULE_FAILED',
          csharpLine: 85,
          functionName: 'IsRuleValid',
          callStack: ['Solve(...)', `IsRuleValid("${rule}")`],
          scopeVars: {
            rule,
            i,
            firstIndex: i,
            secondIndex: i + 1,
            result: finalCmp.result,
            validCount,
            validRule,
          },
          activePair: { first: i, second: i + 1 },
          activeKey: finalKey,
          activeKeyRank: 'Final',
          comparison: finalCmp.detail,
          title: `Rule "${rule}" Failed on Final Key '${finalKey}'!`,
          explanation: `result > 0: Final tie-breaker failed! Array cannot be sorted under rule "${rule}". Returns false.`,
          highlightedCodeSnippet: 'if (result > 0) {\n    return false;\n}',
        });
        break;
      }

      // If finalCmp.result <= 0, pair is valid or identical
      addStep({
        type: 'PAIR_PASSED',
        csharpLine: 86,
        functionName: 'IsRuleValid',
        callStack: ['Solve(...)', `IsRuleValid("${rule}")`],
        scopeVars: {
          rule,
          i,
          firstIndex: i,
          secondIndex: i + 1,
          result: finalCmp.result,
          validCount,
          validRule,
        },
        activePair: { first: i, second: i + 1 },
        activeKey: finalKey,
        activeKeyRank: 'Final',
        comparison: finalCmp.detail,
        title: `Pair [${i}, ${i + 1}] Passed Final Key`,
        explanation: `result <= 0: The final key '${finalKey}' is valid (or values are identical). Pair satisfied all criteria.`,
        highlightedCodeSnippet: '// pair satisfies all keys',
      });
    }

    if (ruleIsValid) {
      ruleStatus[rule] = 'valid';
      validCount++;
      validRule = rule;
      passedRulesList.push(rule);

      addStep({
        type: 'RULE_PASSED',
        csharpLine: 90,
        functionName: 'IsRuleValid',
        callStack: ['Solve(...)', `IsRuleValid("${rule}")`],
        scopeVars: { rule, validCount, validRule },
        title: `IsRuleValid("${rule}") Returned TRUE!`,
        explanation: `Every single neighbouring pair in the array satisfied rule "${rule}"! IsRuleValid returns true.`,
        highlightedCodeSnippet: 'return true; // every neighbouring pair followed the rule',
      });

      addStep({
        type: 'RULE_LOOP_END',
        csharpLine: 24,
        functionName: 'Solve',
        callStack: ['Solve(name, age, weight)'],
        scopeVars: { r, rule, validCount, validRule },
        title: `Increment validCount to ${validCount}`,
        explanation: `In Solve(): validCount is incremented (now ${validCount}). validRule updated to "${validRule}".`,
        highlightedCodeSnippet: `validCount = validCount + 1; // ${validCount}\nvalidRule = rules[r]; // "${rule}"`,
      });
    }
  }

  // Evaluation of final return conditions in Solve
  let finalVerdict = '';

  if (validCount === 0) {
    finalVerdict = 'NOT';
    addStep({
      type: 'SOLVE_CHECK_COUNT',
      csharpLine: 29,
      functionName: 'Solve',
      callStack: ['Solve(...)'],
      scopeVars: { validCount: 0, validRule },
      title: 'Check validCount == 0',
      explanation: 'None of the 6 rules were consistent with the array order (validCount == 0). Returning "NOT".',
      highlightedCodeSnippet: 'if (validCount == 0)\n{\n    return "NOT";\n}',
    });
    addStep({
      type: 'SOLVE_FINAL',
      csharpLine: 31,
      functionName: 'Solve',
      callStack: ['Solve(...)'],
      scopeVars: { validCount: 0, validRule },
      title: 'Final Return: "NOT"',
      explanation: 'Result is "NOT": The given objects are not sorted according to any valid permutation of Name, Age, and Weight.',
      highlightedCodeSnippet: 'return "NOT";',
    });
  } else if (validCount > 1) {
    finalVerdict = 'IND';
    addStep({
      type: 'SOLVE_CHECK_COUNT',
      csharpLine: 35,
      functionName: 'Solve',
      callStack: ['Solve(...)'],
      scopeVars: { validCount, validRule },
      title: `Check validCount > 1 (Count = ${validCount})`,
      explanation: `${validCount} different rules can explain this order (${passedRulesList.join(', ')}). Returning "IND" (Indeterminate).`,
      highlightedCodeSnippet: 'if (validCount > 1)\n{\n    return "IND";\n}',
    });
    addStep({
      type: 'SOLVE_FINAL',
      csharpLine: 37,
      functionName: 'Solve',
      callStack: ['Solve(...)'],
      scopeVars: { validCount, validRule },
      title: 'Final Return: "IND"',
      explanation: `Result is "IND": The data order is ambiguous because ${validCount} rules (${passedRulesList.join(', ')}) all match.`,
      highlightedCodeSnippet: 'return "IND";',
    });
  } else {
    finalVerdict = validRule;
    addStep({
      type: 'SOLVE_FINAL',
      csharpLine: 41,
      functionName: 'Solve',
      callStack: ['Solve(...)'],
      scopeVars: { validCount: 1, validRule },
      title: `Final Return: "${validRule}"`,
      explanation: `Exactly one rule was consistent with the observed order! Returning "${validRule}".`,
      highlightedCodeSnippet: `return validRule; // "${validRule}"`,
    });
  }

  return { steps, finalVerdict, validRules: passedRulesList };
}
