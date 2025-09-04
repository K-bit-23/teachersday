import React, { useState, useEffect } from 'react';
import WordCloud from './components/WordCloud';
import QRCodeGenerator from './components/QRCodeGenerator';
import WishForm from './components/WishForm';
import MenuBar from './components/MenuBar';
import TypographyPage from './components/TypographyPage';
import WordManagementPage from './components/WordManagementPage';
import { googleSheetsService } from './services/googleSheets';
import { Wish, AppSettings } from './types';
import { Plus } from 'lucide-react';

function App() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'main' | 'typography' | 'words'>('main');
  const [settings, setSettings] = useState<AppSettings>({
    wishLimit: 50,
    backgroundImages: ['/api/placeholder/1200/800'], // Your uploaded image will be added here
    isLimitReached: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishes();
  }, []);

  useEffect(() => {
    const checkLimit = () => {
      const isLimitReached = wishes.length >= settings.wishLimit;
      if (isLimitReached && !settings.isLimitReached) {
        setSettings(prev => ({ ...prev, isLimitReached: true }));
        // Auto-open typography generator when limit is reached
        setTimeout(() => {
          setCurrentPage('typography');
        }, 2000);
      }
    };

    checkLimit();
  }, [wishes.length, settings.wishLimit, settings.isLimitReached]);

  const loadWishes = async () => {
    try {
      setLoading(true);
      const fetchedWishes = await googleSheetsService.getWishes();
      setWishes(fetchedWishes);
    } catch (error) {
      console.error('Error loading wishes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWish = async (wishText: string) => {
    try {
      const newWish = await googleSheetsService.addWish(wishText);
      setWishes(prev => [...prev, newWish]);
    } catch (error) {
      console.error('Error submitting wish:', error);
      throw error;
    }
  };

  const handleUpdateWish = async (wishId: string, newText: string) => {
    try {
      const updatedWish = await googleSheetsService.updateWish(wishId, { text: newText });
      if (updatedWish) {
        setWishes(prev => prev.map(w => w.id === wishId ? updatedWish : w));
      }
    } catch (error) {
      console.error('Error updating wish:', error);
    }
  };

  const handleDeleteWish = async (wishId: string) => {
    try {
      const success = await googleSheetsService.deleteWish(wishId);
      if (success) {
        setWishes(prev => prev.filter(w => w.id !== wishId));
      }
    } catch (error) {
      console.error('Error deleting wish:', error);
    }
  };

  const handleUploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSettings(prev => ({
        ...prev,
        backgroundImages: [...prev.backgroundImages, e.target?.result as string],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = (index: number) => {
    setSettings(prev => ({
      ...prev,
      backgroundImages: prev.backgroundImages.filter((_, i) => i !== index),
    }));
  };

  const handleUploadImages = (files: FileList) => {
    Array.from(files).forEach(file => {
      handleUploadImage(file);
    });
  };

  if (currentPage === 'words') {
    return (
      <WordManagementPage
        wishes={wishes}
        onBack={() => setCurrentPage('main')}
        onUpdateWish={handleUpdateWish}
        onDeleteWish={handleDeleteWish}
      />
    );
  }

  const handleSetLimit = (limit: number) => {
    setSettings(prev => ({
      ...prev,
      wishLimit: limit,
      isLimitReached: wishes.length >= limit,
    }));
  };

  if (currentPage === 'typography') {
    return (
      <TypographyPage
        wishes={wishes}
        backgroundImages={settings.backgroundImages}
        onBack={() => setCurrentPage('main')}
        onDeleteImage={handleDeleteImage}
        onUploadImages={handleUploadImages}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Teachers Day wishes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-red-100 p-4">
      <div className="max-w-7xl mx-auto">
        <MenuBar
          onUploadImages={handleUploadImages}
          onDeleteImage={handleDeleteImage}
          onSetLimit={handleSetLimit}
          currentLimit={settings.wishLimit}
          wishCount={wishes.length}
          imageCount={settings.backgroundImages.length}
          onManageWords={() => setCurrentPage('words')}
        />
        
        {settings.isLimitReached && (
          <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 rounded-2xl mb-6 text-center">
            <p className="font-semibold">🎉 Wish limit reached! Creating your special Teachers Day typography...</p>
          </div>
        )}
        
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <WordCloud wishes={wishes} />
          </div>
          
          <div className="space-y-6">
            <QRCodeGenerator />
            
            <button
              onClick={() => setIsFormOpen(true)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add Your Wish
            </button>
            
            {wishes.length > 0 && (
              <button
                onClick={() => setCurrentPage('typography')}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-2xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
      
      <WishForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmitWish}
      />
    </div>
  );
}

export default App;
