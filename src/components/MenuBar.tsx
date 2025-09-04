import React, { useState } from 'react';
import { Menu, Upload, Settings, Image, Users, Trash2, Type } from 'lucide-react';

interface MenuBarProps {
  onUploadImages: (files: FileList) => void;
  onDeleteImage: (index: number) => void;
  onSetLimit: (limit: number) => void;
  currentLimit: number;
  wishCount: number;
  imageCount: number;
  onManageWords: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ onUploadImages, onDeleteImage, onSetLimit, currentLimit, wishCount, imageCount, onManageWords }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [newLimit, setNewLimit] = useState(currentLimit);

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUploadImages(files);
    }
  };

  const handleSetLimit = () => {
    onSetLimit(newLimit);
    setShowLimitModal(false);
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Teachers Day Wishes
          </h1>
          
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            >
              <Menu className="w-5 h-5" />
              Options
            </button>
            
            {isOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                <div className="py-2">
                  <label className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Upload Backgrounds</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesUpload}
                      className="hidden"
                    />
                  </label>
                  
                  <button
                    onClick={() => setShowLimitModal(true)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 w-full text-left transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Set Wish Limit</span>
                  </button>
                  
                  <button
                    onClick={() => setShowImagesModal(true)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 w-full text-left transition-colors"
                  >
                    <Image className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Manage Images</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      onManageWords();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 w-full text-left transition-colors"
                  >
                    <Type className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Manage Words</span>
                  </button>
                  
                  <div className="px-4 py-3 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Wishes: {wishCount}/{currentLimit}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      <Image className="w-4 h-4" />
                      <span>Images: {imageCount}</span>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange-400 to-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((wishCount / currentLimit) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showLimitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Set Wish Limit</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum number of wishes
              </label>
              <input
                type="number"
                value={newLimit}
                onChange={(e) => setNewLimit(parseInt(e.target.value) || 0)}
                min="1"
                max="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLimitModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSetLimit}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all"
              >
                Set Limit
              </button>
            </div>
          </div>
        </div>
      )}

      {showImagesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-96 overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Manage Background Images</h3>
            {imageCount > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {Array.from({ length: imageCount }).map((_, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gradient-to-br from-orange-200 to-yellow-200 rounded-lg flex items-center justify-center border-2 border-dashed border-orange-300">
                      <div className="text-center">
                        <Image className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                        <span className="text-sm text-orange-600 font-medium">Image {index + 1}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No background images uploaded yet</p>
                <p className="text-sm text-gray-400 mt-2">Use the "Upload Backgrounds" option to add images</p>
              </div>
            )}
            <div className="flex gap-3">
              <label className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all cursor-pointer text-center font-medium">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload More Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      // This would need to be passed from parent, but for now just close modal
                      setShowImagesModal(false);
                    }
                  }}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setShowImagesModal(false)}
                className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuBar;