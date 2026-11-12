/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Moon, Sun, BookOpen, Cpu, CheckCircle2, HelpCircle } from 'lucide-react';

export type ActiveTab = 'simulator' | 'explainer' | 'flowchart' | 'testsuite' | 'quiz';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDark: boolean;
  toggleTheme: () => void;
  onQuickRun: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  onQuickRun,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark in display face */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('simulator');
          }}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          SortingOrder.cs Explorer
        </a>

        {/* Zone 2: Navigation Links (Single-line, 1-2 words each) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
              activeTab === 'simulator'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Dry-Run Simulator
          </button>

          <button
            onClick={() => setActiveTab('explainer')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
              activeTab === 'explainer'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Code Explainer
          </button>

          <button
            onClick={() => setActiveTab('flowchart')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
              activeTab === 'flowchart'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Algorithm Anatomy
          </button>

          <button
            onClick={() => setActiveTab('testsuite')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
              activeTab === 'testsuite'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Test Suite
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
              activeTab === 'quiz'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Concept Quiz
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Theme Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={onQuickRun}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Dry-Run Active Case</span>
          </button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-100 dark:border-slate-800 gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`whitespace-nowrap ${activeTab === 'simulator' ? 'text-indigo-600 font-semibold' : ''}`}
        >
          Simulator
        </button>
        <button
          onClick={() => setActiveTab('explainer')}
          className={`whitespace-nowrap ${activeTab === 'explainer' ? 'text-indigo-600 font-semibold' : ''}`}
        >
          Explainer
        </button>
        <button
          onClick={() => setActiveTab('flowchart')}
          className={`whitespace-nowrap ${activeTab === 'flowchart' ? 'text-indigo-600 font-semibold' : ''}`}
        >
          Anatomy
        </button>
        <button
          onClick={() => setActiveTab('testsuite')}
          className={`whitespace-nowrap ${activeTab === 'testsuite' ? 'text-indigo-600 font-semibold' : ''}`}
        >
          28 Tests
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`whitespace-nowrap ${activeTab === 'quiz' ? 'text-indigo-600 font-semibold' : ''}`}
        >
          Quiz
        </button>
      </div>
    </header>
  );
};
