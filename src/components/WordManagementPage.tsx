import React, { useState, useMemo } from 'react';
import { ArrowLeft, Edit2, Trash2, Save, X, Search } from 'lucide-react';
import { Wish } from '../types';

interface WordManagementPageProps {
  wishes: Wish[];
  onBack: () => void;
  onUpdateWish: (wishId: string, newText: string) => void;
  onDeleteWish: (wishId: string) => void;
}

interface WordInfo {
  word: string;
  frequency: number;
  wishIds: string[];
}

const WordManagementPage: React.FC<WordManagementPageProps> = ({
  wishes,
  onBack,
  onUpdateWish,
  onDeleteWish,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingWish, setEditingWish] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const wordAnalysis = useMemo(() => {
    const wordMap = new Map<string, WordInfo>();
    
    wishes.forEach(wish => {
      const words = wish.text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 2);
      
      words.forEach(word => {
        if (wordMap.has(word)) {
          const existing = wordMap.get(word)!;
          existing.frequency += 1;
          existing.wishIds.push(wish.id);
        } else {
          wordMap.set(word, {
            word,
            frequency: 1,
            wishIds: [wish.id],
          });
        }
      });
    });

    return Array.from(wordMap.values())
      .sort((a, b) => b.frequency - a.frequency)
      .filter(wordInfo => 
        searchTerm === '' || 
        wordInfo.word.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [wishes, searchTerm]);

  const handleEditWish = (wish: Wish) => {
    setEditingWish(wish.id);
    setEditText(wish.text);
  };

  const handleSaveEdit = () => {
    if (editingWish && editText.trim()) {
      onUpdateWish(editingWish, editText.trim());
      setEditingWish(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingWish(null);
    setEditText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Word & Wish Management
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search words..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Word Frequency Panel */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Word Frequency</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {wordAnalysis.map((wordInfo, index) => (
                <div
                  key={wordInfo.word}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="font-bold text-orange-600"
                      style={{
                        fontSize: `${Math.max(14, Math.min(24, wordInfo.frequency * 2 + 12))}px`
                      }}
                    >
                      {wordInfo.word}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({wordInfo.frequency} times)
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wishes Management Panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">All Wishes ({wishes.length})</h2>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {wishes.map((wish) => (
                <div
                  key={wish.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {editingWish === wish.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                        maxLength={500}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {editText.length}/500 characters
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                          >
                            <Save className="w-3 h-3" />
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-800 mb-2">{wish.text}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(wish.timestamp).toLocaleDateString()} at{' '}
                          {new Date(wish.timestamp).toLocaleTimeString()}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditWish(wish)}
                            className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                            title="Edit wish"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteWish(wish.id)}
                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                            title="Delete wish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {wishes.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No wishes collected yet</p>
                  <p className="text-sm text-gray-400 mt-2">Start collecting Teachers Day wishes to see them here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordManagementPage;