import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Printer, QrCode as QrIcon } from 'lucide-react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  label?: string;
  businessName?: string;
  showActions?: boolean;
  className?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  value,
  size = 180,
  label = 'Table 7',
  businessName = 'Café El Medina',
  showActions = true,
  className = '',
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 1.5,
      color: {
        dark: '#171717',
        light: '#ffffff',
      },
    })
      .then((url) => {
        setDataUrl(url);
        setError(false);
      })
      .catch((err) => {
        console.error('QR code generation failed', err);
        setError(true);
      });
  }, [value, size]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `QR_${businessName.replace(/\s+/g, '_')}_${label.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Chevalet de table - ${businessName} - ${label}</title>
          <style>
            @page { size: auto; margin: 10mm; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 90vh;
              margin: 0;
              background-color: #f5f5f5;
            }
            .stand {
              width: 320px;
              background: #ffffff;
              border: 2px solid #1a1a1a;
              border-radius: 16px;
              padding: 24px;
              text-align: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .brand {
              font-size: 22px;
              font-weight: 800;
              color: #1a1a1a;
              margin-bottom: 4px;
            }
            .scan-callout {
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 2px;
              font-weight: 700;
              color: #d97706;
              margin-top: 8px;
              margin-bottom: 14px;
            }
            .qr-img {
              width: 200px;
              height: 200px;
              border-radius: 8px;
              border: 1px solid #e5e5e5;
              padding: 6px;
              background: #fff;
            }
            .table-badge {
              display: inline-block;
              margin-top: 14px;
              background: #171717;
              color: #ffffff;
              font-size: 18px;
              font-weight: 700;
              padding: 6px 20px;
              border-radius: 9999px;
            }
            .subtext {
              margin-top: 12px;
              font-size: 11px;
              color: #737373;
            }
          </style>
        </head>
        <body>
          <div class="stand">
            <div class="brand">${businessName}</div>
            <div class="scan-callout">📱 SCANNEZ & COMMANDEZ</div>
            <img class="qr-img" src="${dataUrl}" alt="QR Code" />
            <div><span class="table-badge">${label}</span></div>
            <p class="subtext">Scannez avec l'appareil photo de votre smartphone.<br/>Menu digital instantané & commande sans attente.</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className={`flex flex-col items-center text-center ${className}`} ref={printRef}>
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-neutral-200">
        {dataUrl ? (
          <img
            src={dataUrl}
            alt={`QR code pour ${label}`}
            style={{ width: `${size}px`, height: `${size}px` }}
            className="block rounded-lg"
          />
        ) : error ? (
          <div
            style={{ width: `${size}px`, height: `${size}px` }}
            className="flex items-center justify-center bg-neutral-100 text-neutral-400 rounded-lg text-xs"
          >
            <QrIcon className="w-8 h-8 opacity-40 mb-1" />
            Erreur QR
          </div>
        ) : (
          <div
            style={{ width: `${size}px`, height: `${size}px` }}
            className="animate-pulse bg-neutral-100 rounded-lg"
          />
        )}
      </div>

      <div className="mt-3">
        <span className="text-sm font-bold text-neutral-900 bg-neutral-100 px-3 py-1 rounded-md">
          {label}
        </span>
      </div>

      {showActions && (
        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 active:scale-95 transition-all shadow-xs"
            title="Télécharger l'image PNG"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            Télécharger
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 active:scale-95 transition-all shadow-xs"
            title="Imprimer le chevalet de table"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            Imprimer
          </button>
        </div>
      )}
    </div>
  );
};
