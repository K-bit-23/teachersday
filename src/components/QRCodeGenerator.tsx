import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const QRCodeGenerator: React.FC = () => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  
  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = `https://myapp.com/wish-form`;
        const qrData = await QRCode.toDataURL(url, {
          width: 256,
          margin: 2,
          color: {
            dark: '#2D3748',
            light: '#FFFFFF',
          },
        });
        setQrDataUrl(qrData);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQR();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Share Your Wish
      </h3>
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl mb-4">
        {qrDataUrl && (
          <img 
            src={qrDataUrl} 
            alt="QR Code for wish submission" 
            className="mx-auto w-48 h-48"
          />
        )}
      </div>
      <p className="text-sm text-gray-600">
        Scan this QR code to submit your Teachers Day wish!
      </p>
    </div>
  );
};

export default QRCodeGenerator;
