import React, { useEffect, useRef } from 'react';
import { Wish } from '../types';

interface WordCloudProps {
  wishes: Wish[];
}

const WordCloud: React.FC<WordCloudProps> = ({ wishes }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || wishes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create word frequency map
    const wordFreq = new Map<string, number>();
    wishes.forEach(wish => {
      const words = wish.text.toLowerCase().split(/\s+/).filter(word => word.length > 2);
      words.forEach(word => {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      });
    });

    // Sort words by frequency
    const sortedWords = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50); // Limit to top 50 words

    // Colors for Teachers Day theme
    const colors = [
      '#FF6B35', '#F7931E', '#FFD23F', '#EE4B2B', '#FF8C42',
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'
    ];

    // Draw words
    sortedWords.forEach(([word, freq], index) => {
      const fontSize = Math.max(16, Math.min(48, freq * 8));
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = colors[index % colors.length];

      // Random position (with some collision avoidance)
      const x = Math.random() * (canvas.width - ctx.measureText(word).width);
      const y = Math.random() * (canvas.height - fontSize) + fontSize;

      ctx.fillText(word, x, y);
    });
  }, [wishes]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Teachers Day Wishes Cloud
      </h2>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          className="border border-gray-200 rounded-lg max-w-full h-auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>
      <p className="text-sm text-gray-500 mt-4 text-center">
        {wishes.length} wishes collected
      </p>
    </div>
  );
};

export default WordCloud;