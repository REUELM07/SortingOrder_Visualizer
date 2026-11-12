/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  FastForward,
  ChevronRight,
  ChevronLeft,
  Settings,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Layers,
  Code2,
  ListOrdered,
  HelpCircle,
  Terminal,
} from 'lucide-react';
import { ALL_RULES, DryRunStep, KeyChar, SortingRule, TestCase } from '../types/sorting.ts';
import { TEST_CASES } from '../data/testCases.ts';
import { generateDryRunSteps } from '../utils/sortingAlgorithm.ts';
import { CSHARP_SOURCE_CODE } from '../data/sourceCode.ts';
import { CustomDataModal } from './CustomDataModal.tsx';

interface DryRunSimulatorProps {
  initialCaseId?: number;
}

export const DryRunSimulator: React.FC<DryRunSimulatorProps> = ({ initialCaseId = 2 }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<number>(initialCaseId);
  const [activeCase, setActiveCase] = useState<TestCase>(() => {
    return TEST_CASES.find((tc) => tc.id === initialCaseId) || TEST_CASES[2];
  });

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5, 1, 2, 4
  const [activeCodeLineExplanation, setActiveCodeLineExplanation] = useState<string | null>(null);

  // Generate steps whenever activeCase changes
  const { steps, finalVerdict, validRules } = React.useMemo(() => {
    return generateDryRunSteps(activeCase.names, activeCase.ages, activeCase.weights);
  }, [activeCase]);

  // Clamp step index
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [activeCase]);

  const currentStep: DryRunStep = steps[currentStepIndex] || steps[0];

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) return;

    const baseDelay = 1200;
    const intervalTime = baseDelay / playbackSpeed;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, steps.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if focus is inside an input/modal
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStepBackward();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, steps.length]);

  // Auto-scroll the code view to keep active line visible
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeLineRef.current && codeContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentStep?.csharpLine]);

  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleJumpToEnd = () => {
    setIsPlaying(false);
    setCurrentStepIndex(steps.length - 1);
  };

  const handleJumpNextRule = () => {
    const currentRule = currentStep.scopeVars.rule;
    for (let i = currentStepIndex + 1; i < steps.length; i++) {
      if (steps[i].scopeVars.rule && steps[i].scopeVars.rule !== currentRule) {
        setCurrentStepIndex(i);
        return;
      }
      if (steps[i].type.startsWith('SOLVE_')) {
        setCurrentStepIndex(i);
        return;
      }
    }
    handleJumpToEnd();
  };

  const handleSelectCase = (caseId: number) => {
    setSelectedCaseId(caseId);
    const tc = TEST_CASES.find((c) => c.id === caseId);
    if (tc) {
      setActiveCase(tc);
    }
  };

  const handleApplyCustomCase = (customCase: TestCase) => {
    setSelectedCaseId(-1);
    setActiveCase(customCase);
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Preset Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Test Instance:
              </span>
              <select
                value={selectedCaseId}
                onChange={(e) => handleSelectCase(Number(e.target.value))}
                className="text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {TEST_CASES.map((tc) => (
                  <option key={tc.id} value={tc.id}>
                    Case {tc.id}: {tc.name} (Expected: {tc.expected})
                  </option>
                ))}
                {selectedCaseId === -1 && <option value="-1">Custom Dataset</option>}
              </select>
            </div>

            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Custom Data Builder</span>
            </button>

            {/* Expected Result Tag */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span>Expected Output:</span>
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                {activeCase.expected}
              </span>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Speed control */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
              {[0.5, 1, 2, 4].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Step navigation buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Reset to Step 0"
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleStepBackward}
                disabled={currentStepIndex === 0}
                title="Step Backward (Left Arrow)"
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlaying((p) => !p)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{currentStepIndex >= steps.length - 1 ? 'Replay' : 'Play'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleStepForward}
                disabled={currentStepIndex >= steps.length - 1}
                title="Step Forward (Right Arrow)"
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleJumpNextRule}
                title="Jump to Next Rule"
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <FastForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrubber Slider */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
          <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
            Step {currentStepIndex + 1} / {steps.length}
          </span>
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={currentStepIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStepIndex(Number(e.target.value));
            }}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
          />
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 whitespace-nowrap">
            {currentStep.functionName}()
          </span>
        </div>
      </div>

      {/* Main Sandbox Grid: Split 7/5 Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Simulation Stage (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Step Narrative Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors">
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  Line {currentStep.csharpLine}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentStep.title}
                </span>
              </div>

              {currentStep.scopeVars.rule && (
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                  Testing Rule: {currentStep.scopeVars.rule}
                </span>
              )}
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentStep.explanation}
            </p>
          </div>

          {/* Visual Array of People Objects */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Observed Objects Array (Length = {activeCase.names.length})</span>
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Evaluating neighbouring pairs: (0, 1), (1, 2), ..., ({activeCase.names.length - 2},{' '}
                {activeCase.names.length - 1})
              </span>
            </div>

            {/* People Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {activeCase.names.map((name, idx) => {
                const isFirst = currentStep.activePair?.first === idx;
                const isSecond = currentStep.activePair?.second === idx;
                const isPairActive = isFirst || isSecond;

                return (
                  <div
                    key={idx}
                    className={`relative p-3 rounded-xl border transition-all ${
                      isPairActive
                        ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-md scale-[1.02]'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    {/* Index header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                        [{idx}]
                      </span>
                      {isPairActive && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-600 text-white">
                          {isFirst ? 'First (i)' : 'Second (i+1)'}
                        </span>
                      )}
                    </div>

                    {/* Attributes */}
                    <div className="space-y-1.5 text-xs">
                      {/* Name */}
                      <div
                        className={`p-1 rounded font-mono transition-colors ${
                          isPairActive && currentStep.activeKey === 'N'
                            ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 font-bold ring-1 ring-amber-400'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-[10px] text-slate-400 block font-sans">Name (A-Z)</span>
                        <span className="text-sm">{name}</span>
                      </div>

                      {/* Age */}
                      <div
                        className={`p-1 rounded font-mono transition-colors ${
                          isPairActive && currentStep.activeKey === 'A'
                            ? 'bg-sky-100 dark:bg-sky-950/70 text-sky-900 dark:text-sky-200 font-bold ring-1 ring-sky-400'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-[10px] text-slate-400 block font-sans">Age (Ascending)</span>
                        <span className="text-sm">{activeCase.ages[idx]} yrs</span>
                      </div>

                      {/* Weight */}
                      <div
                        className={`p-1 rounded font-mono transition-colors ${
                          isPairActive && currentStep.activeKey === 'W'
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 font-bold ring-1 ring-emerald-400'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-[10px] text-slate-400 block font-sans">
                          Weight (DESCENDING)
                        </span>
                        <span className="text-sm">{activeCase.weights[idx]} kg</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Comparison Spotlight Card */}
          {currentStep.comparison && currentStep.activePair ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Active Comparison Spotlight
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                    {currentStep.comparison.keyRank} Key: '{currentStep.comparison.key}'
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {currentStep.comparison.directionRule}
                </span>
              </div>

              {/* Comparison Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                {/* Left Object */}
                <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    First Object [{currentStep.activePair.first}]
                  </div>
                  <div className="text-lg font-mono font-bold text-slate-900 dark:text-white mt-1">
                    {currentStep.comparison.val1}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {activeCase.names[currentStep.activePair.first]}
                  </div>
                </div>

                {/* Operator and Math Result */}
                <div className="text-center space-y-1">
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {currentStep.comparison.comparisonExpression}
                  </div>
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      currentStep.comparison.result < 0
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                        : currentStep.comparison.result > 0
                        ? 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300'
                        : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {currentStep.comparison.result === -1 && 'Result = -1 (Correct Order)'}
                    {currentStep.comparison.result === 0 && 'Result = 0 (Tie / Equal)'}
                    {currentStep.comparison.result === 1 && 'Result = +1 (Wrong Order)'}
                  </div>
                </div>

                {/* Right Object */}
                <div className="text-center p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    Second Object [{currentStep.activePair.second}]
                  </div>
                  <div className="text-lg font-mono font-bold text-slate-900 dark:text-white mt-1">
                    {currentStep.comparison.val2}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {activeCase.names[currentStep.activePair.second]}
                  </div>
                </div>
              </div>

              {/* Consequence Box */}
              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <div className="font-semibold text-slate-900 dark:text-white">
                  Decision Rationale:
                </div>
                <div>{currentStep.comparison.meaning}</div>
                {currentStep.comparison.result < 0 && (
                  <div className="text-emerald-700 dark:text-emerald-400 font-medium">
                    → Executes <code>continue;</code> (Pair is sorted! Bypasses remaining keys).
                  </div>
                )}
                {currentStep.comparison.result > 0 && (
                  <div className="text-red-700 dark:text-red-400 font-medium">
                    → Executes <code>return false;</code> (Order is violated! Rule fails immediately).
                  </div>
                )}
                {currentStep.comparison.result === 0 && (
                  <div className="text-amber-700 dark:text-amber-400 font-medium">
                    → Values are equal (tie)! Falls through to consult next key.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center text-xs text-slate-500 dark:text-slate-400">
              No pair comparison active at this step (initiating outer rule loop or computing final verdict).
            </div>
          )}

          {/* 6 Rules Status Deck */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>The 6 Candidate Sorting Rules Evaluation</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Every 3-key permutation: N = Name (A-Z), A = Age (↑), W = Weight (↓)
                </p>
              </div>

              {/* Live Count Ticker */}
              <div className="text-right">
                <div className="text-xs text-slate-500 dark:text-slate-400">validCount</div>
                <div className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {currentStep.scopeVars.validCount} / 6
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ALL_RULES.map((rule) => {
                const status = currentStep.ruleStatus[rule];
                const failure = currentStep.ruleFailures[rule];
                const isCurrentlyTesting = currentStep.scopeVars.rule === rule && status === 'testing';

                return (
                  <div
                    key={rule}
                    className={`p-3 rounded-xl border transition-all ${
                      status === 'valid'
                        ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30'
                        : status === 'invalid'
                        ? 'border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20'
                        : isCurrentlyTesting
                        ? 'border-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/40 ring-1 ring-indigo-400'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                        {rule}
                      </span>
                      {status === 'valid' && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                      {status === 'invalid' && (
                        <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                      )}
                      {isCurrentlyTesting && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                      )}
                    </div>

                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      1st: {rule[0]} → 2nd: {rule[1]} → 3rd: {rule[2]}
                    </div>

                    <div className="mt-2 text-[11px] font-medium">
                      {status === 'valid' && (
                        <span className="text-emerald-700 dark:text-emerald-400">✓ Rule Valid</span>
                      )}
                      {status === 'invalid' && (
                        <span
                          className="text-red-600 dark:text-red-400 truncate block"
                          title={failure?.reason}
                        >
                          ✗ Failed {failure ? `Pair ${failure.pairIndex}` : ''}
                        </span>
                      )}
                      {isCurrentlyTesting && (
                        <span className="text-indigo-600 dark:text-indigo-400">Testing...</span>
                      )}
                      {status === 'pending' && (
                        <span className="text-slate-400 dark:text-slate-500">Pending</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Verdict Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  Current Algorithm Verdict
                </span>
                <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                  {currentStep.scopeVars.validCount === 0 && 'NOT (0 rules matched)'}
                  {currentStep.scopeVars.validCount === 1 &&
                    `Rule "${currentStep.scopeVars.validRule}" (Unique match)`}
                  {currentStep.scopeVars.validCount > 1 &&
                    `IND (${currentStep.scopeVars.validCount} rules matched: ${validRules.join(', ')})`}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  Final Expected
                </span>
                <span className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {activeCase.expected}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Stepper & Scope Variables (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Call Stack & Live Scope Variables */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Call Stack & Scope Variables</span>
            </h3>

            {/* Call stack breadcrumbs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              {currentStep.callStack.map((frame, i) => (
                <React.Fragment key={i}>
                  <span
                    className={`px-2 py-0.5 rounded ${
                      i === currentStep.callStack.length - 1
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {frame}
                  </span>
                  {i < currentStep.callStack.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Variables table */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">r (rule index)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {currentStep.scopeVars.r !== undefined ? currentStep.scopeVars.r : '—'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">rule</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {currentStep.scopeVars.rule ? `"${currentStep.scopeVars.rule}"` : '—'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">i (pair index)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {currentStep.scopeVars.i !== undefined ? currentStep.scopeVars.i : '—'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">key</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {currentStep.scopeVars.key ? `'${currentStep.scopeVars.key}'` : '—'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">result</span>
                <span
                  className={`font-mono font-bold ${
                    currentStep.scopeVars.result === -1
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : currentStep.scopeVars.result === 1
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {currentStep.scopeVars.result !== undefined ? currentStep.scopeVars.result : '—'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono">validCount</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {currentStep.scopeVars.validCount}
                </span>
              </div>
            </div>
          </div>

          {/* Synchronized C# Source Code Viewer */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs transition-colors space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>SortingOrder.cs (Synchronized Execution)</span>
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Click any line for breakdown
              </span>
            </div>

            {/* Scrollable code window */}
            <div
              ref={codeContainerRef}
              className="font-mono text-xs max-h-[480px] overflow-y-auto rounded-xl bg-slate-950 text-slate-300 p-3 border border-slate-800 divide-y divide-slate-900/60"
            >
              {CSHARP_SOURCE_CODE.slice(10, 92).map((item) => {
                const isCurrentExecutingLine = currentStep.csharpLine === item.lineNum;

                return (
                  <div
                    key={item.lineNum}
                    ref={isCurrentExecutingLine ? activeLineRef : null}
                    onClick={() => setActiveCodeLineExplanation(item.explanation || null)}
                    className={`flex items-start py-0.5 px-2 rounded cursor-pointer transition-colors ${
                      isCurrentExecutingLine
                        ? 'bg-indigo-900/70 text-indigo-200 ring-1 ring-indigo-500 font-bold'
                        : 'hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {/* Line indicator arrow */}
                    <span className="w-4 text-indigo-400 shrink-0 select-none">
                      {isCurrentExecutingLine ? '▶' : ''}
                    </span>

                    {/* Line Number */}
                    <span className="w-8 text-slate-600 select-none text-right pr-2 shrink-0">
                      {item.lineNum}
                    </span>

                    {/* Code line */}
                    <pre
                      className="whitespace-pre overflow-x-hidden"
                      style={{ paddingLeft: `${item.indent * 12}px` }}
                    >
                      {item.code || ' '}
                    </pre>
                  </div>
                );
              })}
            </div>

            {/* Code Line Explanation Callout */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="font-semibold text-slate-900 dark:text-white block mb-1">
                Line {currentStep.csharpLine} Explanation:
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                {activeCodeLineExplanation ||
                  CSHARP_SOURCE_CODE.find((c) => c.lineNum === currentStep.csharpLine)?.explanation ||
                  currentStep.explanation}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Data Modal */}
      <CustomDataModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onApplyCustomCase={handleApplyCustomCase}
        currentNames={activeCase.names}
        currentAges={activeCase.ages}
        currentWeights={activeCase.weights}
      />
    </div>
  );
};
