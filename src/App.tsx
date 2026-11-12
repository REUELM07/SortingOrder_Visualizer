/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header.tsx';
import { DryRunSimulator } from './components/DryRunSimulator.tsx';
import { CodeWalkthrough } from './components/CodeWalkthrough.tsx';
import { AlgorithmAnatomy } from './components/AlgorithmAnatomy.tsx';
import { TestSuiteRunner } from './components/TestSuiteRunner.tsx';
import { QuizSection } from './components/QuizSection.tsx';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');
  const [activeCaseId, setActiveCaseId] = useState<number>(2); // Default to Case 2 (NWA) which demonstrates multi-key tie breaking!
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const handleLoadCaseInSimulator = (caseId: number) => {
    setActiveCaseId(caseId);
    setActiveTab('simulator');
  };

  const handleQuickRun = () => {
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      {/* 3-Zone Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onQuickRun={handleQuickRun}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'simulator' && (
          <DryRunSimulator key={activeCaseId} initialCaseId={activeCaseId} />
        )}
        {activeTab === 'explainer' && <CodeWalkthrough />}
        {activeTab === 'flowchart' && <AlgorithmAnatomy />}
        {activeTab === 'testsuite' && (
          <TestSuiteRunner onLoadCaseInSimulator={handleLoadCaseInSimulator} />
        )}
        {activeTab === 'quiz' && <QuizSection />}
      </main>

      {/* Quiet, Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              SortingOrder.cs Educational Interactive Suite
            </span>
            <span>·</span>
            <span>C# Multi-Key Total Order Verification</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('simulator')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Simulator
            </button>
            <button
              onClick={() => setActiveTab('explainer')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Code Breakdown
            </button>
            <button
              onClick={() => setActiveTab('testsuite')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              All 28 Test Cases
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
