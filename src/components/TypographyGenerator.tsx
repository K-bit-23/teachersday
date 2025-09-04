import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Download, ChevronLeft, ChevronRight, Grid, Image as ImageIcon } from "lucide-react";
import { Wish } from "../types";

interface TypographyGeneratorProps {
  wishes: Wish[];
  backgroundImages: string[];
}

const TypographyGenerator: React.FC<TypographyGeneratorProps> = ({
  wishes,
  backgroundImages,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCollageView, setIsCollageView] = useState(false);

  const downloadImage = async () => {
    if (canvasRef.current) {
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `teachers-day-wishes-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? backgroundImages.length - 1 : prev - 1
    );
  };

  const getCollageLayout = () => {
    const count = backgroundImages.length;
    if (count <= 1) return { cols: 1, rows: 1 };
    if (count <= 4) return { cols: 2, rows: 2 };
    if (count <= 6) return { cols: 3, rows: 2 };
    if (count <= 9) return { cols: 3, rows: 3 };
    return { cols: 4, rows: Math.ceil(count / 4) };
  };

  const renderSingleView = () => {
    if (backgroundImages.length === 0) {
      return (
        <div className="w-full h-96 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
          <div className="text-center text-white">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Upload background images to get started</p>
          </div>
        </div>
      );
    }

    return (
      <div
        className="relative w-full h-96 rounded-lg overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center p-8">
          {wishes.map((wish, index) => (
            <div
              key={index}
              className="text-white font-bold text-lg md:text-xl lg:text-2xl text-center mb-2 drop-shadow-lg"
              style={{
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                transform: `rotate(${(index - wishes.length / 2) * 5}deg)`,
              }}
            >
              {wish.text}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCollageView = () => {
    if (backgroundImages.length === 0) {
      return renderSingleView();
    }

    const { cols, rows } = getCollageLayout();
    const wishesPerImage = Math.ceil(wishes.length / backgroundImages.length);

    return (
      <div 
        className="grid gap-2 w-full rounded-lg overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 200px)`,
        }}
      >
        {backgroundImages.map((image, imageIndex) => {
          const startWishIndex = imageIndex * wishesPerImage;
          const imageWishes = wishes.slice(startWishIndex, startWishIndex + wishesPerImage);
          
          return (
            <div
              key={imageIndex}
              className="relative bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-30" />
              <div className="relative z-10 h-full flex flex-col justify-center items-center p-4">
                {imageWishes.map((wish, wishIndex) => (
                  <div
                    key={wishIndex}
                    className="text-white font-bold text-sm md:text-base text-center mb-1 drop-shadow-lg"
                    style={{
                      textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                      transform: `rotate(${(wishIndex - imageWishes.length / 2) * 3}deg)`,
                    }}
                  >
                    {wish.text}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Typography Art</h2>
        <div className="flex items-center gap-2">
          {backgroundImages.length > 1 && (
            <>
              <button
                onClick={() => setIsCollageView(!isCollageView)}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  isCollageView
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Grid className="w-4 h-4" />
                Collage View
              </button>
              {!isCollageView && (
                <>
                  <button
                    onClick={prevImage}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">
                    {currentImageIndex + 1} / {backgroundImages.length}
                  </span>
                  <button
                    onClick={nextImage}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </>
          )}
          <button
            onClick={downloadImage}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      <div ref={canvasRef} className="mb-4">
        {isCollageView ? renderCollageView() : renderSingleView()}
      </div>

      {backgroundImages.length > 0 && (
        <p className="text-sm text-gray-600 text-center">
          {isCollageView 
            ? `Collage view with ${backgroundImages.length} images`
            : `Image ${currentImageIndex + 1} of ${backgroundImages.length}`
          }
        </p>
      )}
    </div>
  );
};

export default TypographyGenerator;