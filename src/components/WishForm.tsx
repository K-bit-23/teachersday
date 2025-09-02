import React, { useState } from 'react';
import { X, Heart, Send } from 'lucide-react';

interface WishFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (wish: string) => void;
}

const WishForm: React.FC<WishFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [wish, setWish] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wish.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(wish);
      setWish('');
      onClose();
    } catch (error) {
      console.error('Error submitting wish:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="w-6 h-6" />
              Share Your Wish
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-orange-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="wish" className="block text-sm font-medium text-gray-700 mb-2">
              Your Teachers Day Message
            </label>
            <textarea
              id="wish"
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder="Share your heartfelt message for Teachers Day..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              maxLength={500}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {wish.length}/500 characters
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !wish.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send Wish
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WishForm;