import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, ChevronLeft, ChevronRight, Grid } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'single' | 'collage'>('single');

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
    if (viewMode === 'single') {
      return `url(${backgroundImages[currentImageIndex]})`;
    }
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  const renderCollageLayout = () => {
    const gridCols = Math.ceil(Math.sqrt(backgroundImages.length));
    const gridRows = Math.ceil(backgroundImages.length / gridCols);
    
    return (
      <div className="grid gap-2 h-full" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)`, gridTemplateRows: `repeat(${gridRows}, 1fr)` }}>
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className="relative rounded-lg overflow-hidden"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            {getRandomWishes(Math.ceil(15 / backgroundImages.length)).slice(index * Math.ceil(15 / backgroundImages.length), (index + 1) * Math.ceil(15 / backgroundImages.length)).map((wish, wishIndex) => (
              <div
                key={wish.id}
                className="absolute p-2 rounded-md bg-white bg-opacity-20 backdrop-blur-sm text-white text-xs"
                style={{
                  top: `${Math.random() * 70 + 10}%`,
                  left: `${Math.random() * 70 + 10}%`,
                  fontSize: `${Math.random() * 4 + 8}px`,
                  transform: `rotate(${(Math.random() - 0.5) * 10}deg)`,
                  maxWidth: '80px',
                }}
              >
                <p className="font-medium line-clamp-2 text-center">
                  {wish.text}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Teachers Day Typography</h2>
            <div className="flex gap-3">
              {backgroundImages.length > 1 && (
                <button
                  onClick={() => setViewMode(viewMode === 'single' ? 'collage' : 'single')}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
                >
                  <Grid className="w-4 h-4" />
                  {viewMode === 'single' ? 'Collage View' : 'Single View'}
                </button>
              )}
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
          
          {backgroundImages.length > 1 && viewMode === 'single' && (
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={prevImage}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">
                {currentImageIndex + 1} of {backgroundImages.length}
              </span>
              <button
                onClick={nextImage}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
          
          <div 
            ref={canvasRef}
            className="relative w-full aspect-[3/2] rounded-xl overflow-hidden"
            style={viewMode === 'single' ? {
              backgroundImage: getCurrentBackground(),
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            } : {}}
          >
            {viewMode === 'collage' && backgroundImages.length > 1 ? (
              <div className="h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 z-10"></div>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <h1 className="text-4xl font-bold text-white text-center drop-shadow-lg">
                    Happy Teachers Day
                  </h1>
                </div>
                {renderCollageLayout()}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                  <p className="text-xl text-white font-semibold drop-shadow-lg text-center">
                    Thank you for inspiring us every day! 🎓✨
                  </p>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TypographyGenerator;
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