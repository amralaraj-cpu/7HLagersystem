import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Printer, Download } from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { format } from 'date-fns';

export default function InvoiceGenerator({ isOpen, onClose, order }) {
  const { language } = useLanguage();
  const invoiceRef = useRef(null);

  if (!order) return null;

  const invoiceDate = order.order_date || new Date().toISOString().split('T')[0];
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + 30);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Faktura ${order.invoice_number || order.order_number}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              border-bottom: 3px solid #2563eb;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
            }
            .invoice-title {
              font-size: 32px;
              font-weight: bold;
              margin: 20px 0;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 30px 0;
            }
            .info-box {
              padding: 15px;
              background: #f9fafb;
              border-radius: 8px;
            }
            .info-label {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 5px;
            }
            .info-value {
              font-weight: 600;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
            }
            th {
              background: #f3f4f6;
              padding: 12px;
              text-align: left;
              border-bottom: 2px solid #d1d5db;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #e5e7eb;
            }
            .total-section {
              margin-top: 30px;
              text-align: right;
            }
            .total-row {
              display: flex;
              justify-content: flex-end;
              padding: 8px 0;
            }
            .total-label {
              width: 200px;
              text-align: right;
              padding-right: 20px;
            }
            .total-value {
              width: 150px;
              text-align: right;
              font-weight: 600;
            }
            .grand-total {
              font-size: 20px;
              font-weight: bold;
              border-top: 2px solid #2563eb;
              padding-top: 10px;
              margin-top: 10px;
            }
            .payment-info {
              margin-top: 40px;
              padding: 20px;
              background: #eff6ff;
              border-radius: 8px;
            }
            .payment-info h3 {
              margin-top: 0;
              color: #1e40af;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${invoiceRef.current?.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {language === 'sv' ? 'Faktura' : 'Invoice'}
          </DialogTitle>
        </DialogHeader>

        <div ref={invoiceRef} className="bg-white p-8">
          {/* Header */}
          <div className="border-b-4 border-blue-600 pb-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-blue-600 mb-2">
                  Sjuhärads Biluthyrning & Transport AB
                </h1>
                <p className="text-gray-600">Org.nr: 556XXX-XXXX</p>
                <p className="text-gray-600">Adress: Industrivägen 1</p>
                <p className="text-gray-600">51630 Dalsjöfors</p>
                <p className="text-gray-600">Tel: 033-XX XX XX</p>
              </div>
              <div className="text-right">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  {language === 'sv' ? 'FAKTURA' : 'INVOICE'}
                </h2>
                <p className="text-lg font-semibold">
                  {order.invoice_number || order.order_number}
                </p>
              </div>
            </div>
          </div>

          {/* Customer and Invoice Info */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">
                {language === 'sv' ? 'FAKTURAMOTTAGARE' : 'BILL TO'}
              </h3>
              <p className="font-semibold text-lg">{order.customer_name}</p>
              {order.customer_address && <p className="text-gray-700">{order.customer_address}</p>}
              {order.customer_email && <p className="text-gray-700">{order.customer_email}</p>}
              {order.customer_phone && <p className="text-gray-700">{order.customer_phone}</p>}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{language === 'sv' ? 'Fakturadatum:' : 'Invoice Date:'}</span>
                <span className="font-semibold">{format(new Date(invoiceDate), 'yyyy-MM-dd')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{language === 'sv' ? 'Förfallodatum:' : 'Due Date:'}</span>
                <span className="font-semibold">{format(dueDate, 'yyyy-MM-dd')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{language === 'sv' ? 'Ordernummer:' : 'Order Number:'}</span>
                <span className="font-semibold">{order.order_number}</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="text-left p-3">{language === 'sv' ? 'Beskrivning' : 'Description'}</th>
                <th className="text-right p-3">{language === 'sv' ? 'Antal' : 'Qty'}</th>
                <th className="text-right p-3">{language === 'sv' ? 'À-pris' : 'Unit Price'}</th>
                <th className="text-right p-3">{language === 'sv' ? 'Belopp' : 'Amount'}</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="p-3">{item.description}</td>
                  <td className="text-right p-3">{item.quantity}</td>
                  <td className="text-right p-3">{item.unit_price?.toLocaleString('sv-SE')} SEK</td>
                  <td className="text-right p-3 font-semibold">{item.total_price?.toLocaleString('sv-SE')} SEK</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-96">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span>{language === 'sv' ? 'Delsumma:' : 'Subtotal:'}</span>
                <span className="font-semibold">{order.subtotal?.toLocaleString('sv-SE')} SEK</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span>{language === 'sv' ? 'Moms' : 'VAT'} ({order.vat_rate}%):</span>
                <span className="font-semibold">{order.vat_amount?.toLocaleString('sv-SE')} SEK</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-blue-600 mt-2">
                <span className="text-xl font-bold">{language === 'sv' ? 'TOTALT:' : 'TOTAL:'}</span>
                <span className="text-2xl font-bold text-blue-600">
                  {order.total_amount?.toLocaleString('sv-SE')} SEK
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-bold text-lg text-blue-900 mb-3">
              {language === 'sv' ? 'Betalningsinformation' : 'Payment Information'}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">{language === 'sv' ? 'Bankgiro:' : 'Bankgiro:'}</p>
                <p className="font-semibold">XXX-XXXX</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Swish:</p>
                <p className="font-semibold">123 XXX XX XX</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              {language === 'sv'
                ? 'Vänligen ange fakturanumret vid betalning.'
                : 'Please reference invoice number when paying.'}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>{language === 'sv' ? 'Tack för ert förtroende!' : 'Thank you for your business!'}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={handlePrint} variant="outline" className="flex-1">
            <Printer className="w-4 h-4 mr-2" />
            {language === 'sv' ? 'Skriv ut' : 'Print'}
          </Button>
          <Button onClick={handleDownload} className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            {language === 'sv' ? 'Ladda ner PDF' : 'Download PDF'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
