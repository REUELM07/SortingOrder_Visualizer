/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, Trash2, RotateCcw, Check } from 'lucide-react';
import { TestCase } from '../types/sorting.ts';

interface CustomDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCustomCase: (customCase: TestCase) => void;
  currentNames: string[];
  currentAges: number[];
  currentWeights: number[];
}

export const CustomDataModal: React.FC<CustomDataModalProps> = ({
  isOpen,
  onClose,
  onApplyCustomCase,
  currentNames,
  currentAges,
  currentWeights,
}) => {
  const [items, setItems] = useState<Array<{ name: string; age: number; weight: number }>>(() =>
    currentNames.map((name, i) => ({
      name,
      age: currentAges[i] ?? 25,
      weight: currentWeights[i] ?? 150,
    }))
  );

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (items.length >= 10) {
      setError('Maximum 10 items allowed for visual clarity.');
      return;
    }
    setError(null);
    setItems([
      ...items,
      {
        name: `USER${items.length + 1}`,
        age: 20 + items.length * 2,
        weight: 150 - items.length * 5,
      },
    ]);
  };

  const handleRemove = (index: number) => {
    if (items.length <= 2) {
      setError('At least 2 items are required to test sorting order!');
      return;
    }
    setError(null);
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: 'name' | 'age' | 'weight', value: string) => {
    setError(null);
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        if (field === 'name') {
          return { ...item, name: value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 15) };
        }
        const num = parseInt(value, 10);
        return { ...item, [field]: isNaN(num) ? 0 : Math.max(0, num) };
      })
    );
  };

  const handleApply = () => {
    if (items.some((it) => !it.name.trim())) {
      setError('All items must have a non-empty name (A-Z).');
      return;
    }
    const names = items.map((it) => it.name.trim());
    const ages = items.map((it) => it.age);
    const weights = items.map((it) => it.weight);

    onApplyCustomCase({
      id: -1,
      name: 'Custom Dataset',
      names,
      ages,
      weights,
      expected: '?',
      note: 'User-created custom test case.',
    });
    onClose();
  };

  const handleResetToBobDave = () => {
    setItems([
      { name: 'BOB', age: 22, weight: 122 },
      { name: 'BOB', age: 35, weight: 122 },
      { name: 'DAVE', age: 35, weight: 195 },
      { name: 'DAVE', age: 30, weight: 190 },
    ]);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Custom Dataset Builder</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure names, ages, and weights to see how the algorithm evaluates your custom order.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 px-2">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-4">Name (A-Z)</div>
            <div className="col-span-3">Age (Years)</div>
            <div className="col-span-3">Weight (Kg)</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-3 items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
              >
                <div className="col-span-1 text-center font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  [{idx}]
                </div>
                <div className="col-span-4">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleChange(idx, 'name', e.target.value)}
                    placeholder="BOB"
                    className="w-full px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    min="1"
                    max="150"
                    value={item.age}
                    onChange={(e) => handleChange(idx, 'age', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={item.weight}
                    onChange={(e) => handleChange(idx, 'weight', e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-mono font-medium rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="col-span-1 text-center">
                  <button
                    onClick={() => handleRemove(idx)}
                    disabled={items.length <= 2}
                    title="Remove item"
                    className="p-1 text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleAdd}
              disabled={items.length >= 10}
              className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
              <span>Add Person (Max 10)</span>
            </button>

            <button
              onClick={handleResetToBobDave}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample</span>
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Apply & Start Dry-Run</span>
          </button>
        </div>
      </div>
    </div>
  );
};
