import React, { useEffect, useState } from 'react';
import ReactWordcloud from 'react-wordcloud';
import { Wish } from '../types';

interface WordCloudProps {
  wishes: Wish[];
}

const WordCloud: React.FC<WordCloudProps> = ({ wishes }) => {
  const [words, setWords] = useState<Array<{ text: string; value: number }>>([]);

  useEffect(() => {
    const processWishes = () => {
      const wordFreq: { [key: string]: number } = {};
      
      wishes.forEach(wish => {
        const words = wish.text.toLowerCase().split(/\s+/);
        words.forEach(word => {
          const cleanWord = word.replace(/[^\w]/g, '');
          if (cleanWord.length > 2) {
            wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1;
          }
        });
      });

      const wordArray = Object.entries(wordFreq)
        .map(([text, value]) => ({ text, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 50);

      setWords(wordArray);
    };

    processWishes();
  }, [wishes]);

  const options = {
    colors: ['#FF6B35', '#F7931E', '#FFD23F', '#E74C3C', '#9B59B6', '#3498DB'],
    enableTooltip: true,
    deterministic: false,
    fontFamily: 'Inter, sans-serif',
    fontSizes: [20, 80],
    fontStyle: 'normal',
    fontWeight: 'bold',
    padding: 4,
    rotations: 3,
    rotationAngles: [0, 90],
    scale: 'sqrt',
    spiral: 'archimedean',
    transitionDuration: 1000,
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Teachers Day Wishes
        </h2>
        {words.length > 0 ? (
          <div style={{ height: '400px' }}>
            <ReactWordcloud words={words} options={options} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>No wishes yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordCloud;