// UPIQRCode.jsx - Reusable QR Code Component
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const UPIQRCode = ({
  upiId = '6262330338@ybl',
  name = 'Winners11',
  amount, // optional
  size = 200,
}) => {
  const [qrCodeSvg, setQrCodeSvg] = useState('');

  useEffect(() => {
    const generateQRCode = async () => {
      let upiString = `upi://pay?pa=${upiId}`;
      
      if (amount) {
        upiString += `&am=${amount}`;
      }
      
      upiString += `&cu=INR`;

      try {
        const svg = await QRCode.toString(upiString, {
          type: 'svg',
          errorCorrectionLevel: 'H',
          margin: 1,
          width: size,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeSvg(svg);
      } catch (err) {
        console.error('QR code generation failed', err);
      }
    };

    generateQRCode();
  }, [upiId, name, amount, size]);

  return (
    <div
      className="inline-block bg-white p-2 rounded-lg shadow-sm border"
      dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
    />
  );
};

export default UPIQRCode;