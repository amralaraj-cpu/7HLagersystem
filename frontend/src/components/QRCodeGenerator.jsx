import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer, Download } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import QRCode from 'qrcode';

export default function QRCodeGenerator({
  isOpen,
  onClose,
  data,
  title,
  subtitle
}) {
  const { t } = useLanguage();
  const canvasRef = useRef(null);
  const [size, setSize] = React.useState('medium');

  const sizes = {
    small: 150,
    medium: 200,
    large: 300
  };

  useEffect(() => {
    if (isOpen && data && canvasRef.current) {
      generateQRCode();
    }
  }, [isOpen, data, size]);

  const generateQRCode = async () => {
    const canvas = canvasRef.current;
    const qrSize = sizes[size];

    const qrData = JSON.stringify(data);

    await QRCode.toCanvas(canvas, qrData, {
      width: qrSize,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    const fileName = title?.includes('SET-') ? `${title.split(' ')[0]}_QR.png` : `${title || 'code'}_QR.png`;
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handlePrint = () => {
    const canvas = canvasRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${t('printLabel')}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              font-family: system-ui, sans-serif;
            }
            img { margin-bottom: 10px; }
            .title { font-weight: bold; font-size: 14px; }
            .subtitle { color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <img src="${canvas.toDataURL('image/png')}" />
          <div class="title">${title || ''}</div>
          <div class="subtitle">${subtitle || ''}</div>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('qrCode')}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          <canvas
            ref={canvasRef}
            className="border border-gray-200 rounded-lg"
          />

          {title && (
            <div className="text-center">
              <p className="font-semibold text-gray-900">{title}</p>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          )}

          <div className="flex items-center gap-2 w-full">
            <span className="text-sm text-gray-500">{t('labelSize')}:</span>
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">{t('small')}</SelectItem>
                <SelectItem value="medium">{t('medium')}</SelectItem>
                <SelectItem value="large">{t('large')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 w-full">
            <Button onClick={handleDownload} variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              {t('export')}
            </Button>
            <Button onClick={handlePrint} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Printer className="w-4 h-4 mr-2" />
              {t('print')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
