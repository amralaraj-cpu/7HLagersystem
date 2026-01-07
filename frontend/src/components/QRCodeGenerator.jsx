import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Download } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function QRCodeGenerator({ isOpen, onClose, data, title, subtitle }) {
  const { language } = useLanguage();

  if (!data) return null;

  const qrValue = typeof data === 'string' ? data : JSON.stringify(data);

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `QR_${title || 'code'}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === 'sv' ? 'QR-kod' : 'QR Code'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-6">
          {title && (
            <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 mb-6 text-center">{subtitle}</p>
          )}

          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <QRCodeSVG
              id="qr-code-svg"
              value={qrValue}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {language === 'sv' ? 'Stäng' : 'Close'}
          </Button>
          <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            {language === 'sv' ? 'Ladda ner' : 'Download'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
