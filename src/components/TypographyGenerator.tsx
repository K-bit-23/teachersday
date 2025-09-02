import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import { Wish } from '../types';

interface TypographyGeneratorProps {
  wishes: Wish[];
  backgroundImages: string[];
  onClose: () => void;
}

const TypographyGenerator: React.FC<TypographyGeneratorProps> = ({ 
  wishes, 
  backgroundImages, 
  onClose 
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getRandomWishes = (count: number = 20) => {
    const shuffled = [...wishes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const downloadImage = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = await html2canvas(canvasRef.current, {
        width: 1200,
        height: 800,
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `teachers-day-wishes-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % Math.max(backgroundImages.length, 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + Math.max(backgroundImages.length, 1)) % Math.max(backgroundImages.length, 1));
  };

  const getCurrentBackground = () => {
    if (backgroundImages.length === 0) {
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    return `url(${backgroundImages[currentImageIndex]})`;
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Teachers Day Typography</h2>
            <div className="flex gap-3">
              <button
                onClick={downloadImage}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
          
          <div 
            ref={canvasRef}
            className="relative w-full aspect-[3/2] rounded-xl overflow-hidden"
            style={{
              backgroundImage: getCurrentBackground(),
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative h-full p-8 flex flex-col justify-center">
              <h1 className="text-6xl font-bold text-white text-center mb-8 drop-shadow-lg">
                Happy Teachers Day
              </h1>
              
              <div className="grid grid-cols-3 gap-4 text-white">
                {getRandomWishes(15).map((wish, index) => (
                  <div
                    key={wish.id}
                    className="p-3 rounded-lg bg-white bg-opacity-20 backdrop-blur-sm"
                    style={{
                      fontSize: `${Math.random() * 8 + 12}px`,
                      transform: `rotate(${(Math.random() - 0.5) * 6}deg)`,
                    }}
                  >
                    <p className="text-center font-medium line-clamp-3">
                      {wish.text}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-2xl text-white font-semibold drop-shadow-lg">
                  Thank you for inspiring us every day! 🎓✨
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypographyGenerator;