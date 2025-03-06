'use client';

import type { jsPDF } from 'jspdf';
import { InvoiceData } from '../data/types';

export async function createPDFTemplate(data: InvoiceData): Promise<jsPDF> {
  // Ensure we're in the browser
  if (typeof window === 'undefined') {
    throw new Error('PDF generation is only available in the browser');
  }

  return new Promise<jsPDF>(async (resolve, reject) => {
    try {
      // Dynamically import jsPDF
      const jsPDFModule = await import('jspdf').catch((err) => {
        console.error('Error importing jsPDF:', err);
        throw new Error('Failed to load PDF generator');
      });

      // Get the constructor (works with both ESM and CommonJS)
      const JsPDF =
        jsPDFModule.default?.jsPDF || jsPDFModule.default || jsPDFModule.jsPDF;

      if (!JsPDF) {
        throw new Error('Failed to load PDF generator constructor');
      }

      let pdf: jsPDF;
      try {
        pdf = new JsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });
      } catch (error) {
        console.error('Error creating PDF instance:', error);
        throw new Error('Failed to initialize PDF generator');
      }

      if (!pdf) {
        throw new Error('Failed to create PDF instance');
      }

      // Ensure invoice number format is correct for display
      const ensureCorrectFormat = (invoiceNo: string) => {
        return invoiceNo.replace(/_/g, '/');
      };

      // Add error handling for PDF operations
      const safePdfOperation = (operation: () => void) => {
        try {
          operation();
        } catch (error) {
          console.error('Error in PDF operation:', error);
        }
      };

      // Wrap text operations with error handling
      const safeText = (
        text: string,
        x: number,
        y: number,
        options?: { align?: 'left' | 'center' | 'right' }
      ) => {
        safePdfOperation(() => {
          pdf.text(text, x, y, options);
        });
      };

      // Wrap line operations with error handling
      const safeLine = (x1: number, y1: number, x2: number, y2: number) => {
        safePdfOperation(() => {
          pdf.line(x1, y1, x2, y2);
        });
      };

      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 20;
      let yPos = margin;
      let pageNumber = 1;

      // Function to add a new page if needed
      const checkAndAddPage = (height: number) => {
        if (yPos + height > pageHeight - margin) {
          safePdfOperation(() => {
            pdf.addPage();
          });
          pageNumber++;
          yPos = margin;
          // Add header line on new page
          safeLine(margin, 15, pageWidth - margin, 15);
        }
      };

      // Function to draw a line
      const drawLine = (y: number) => {
        safeLine(margin, y, pageWidth - margin, y);
      };

      // Load and add logo
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          // Add logo with error handling
          pdf.addImage(img, 'PNG', margin, yPos, 20, 20);
        } catch (error) {
          console.error('Error adding logo to PDF:', error);
        }
        continueWithPDF();
      };

      img.onerror = () => {
        console.warn('Logo image failed to load, continuing without logo');
        continueWithPDF();
      };

      // Try to load logo with full URL in production
      const logoUrl = process.env.NEXT_PUBLIC_BASE_URL
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`
        : '/logo.png';

      img.src = logoUrl;

      function continueWithPDF() {
        // Add clinic information
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text('TerrariaVet', pageWidth - margin, yPos + 5, {
          align: 'right',
        });
        pdf.text(
          'Jl.Platina 2 No.18 Desa Curug, Kec.Gunung Sindur, Parung',
          pageWidth - margin,
          yPos + 10,
          { align: 'right' }
        );
        pdf.text(
          'Kabupaten Bogor - Jawa Barat 16340',
          pageWidth - margin,
          yPos + 15,
          { align: 'right' }
        );

        // Add header line
        pdf.line(margin, 45, pageWidth - margin, 45);

        // Header
        yPos += 40;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);
        pdf.text('INVOICE PERAWATAN', pageWidth / 2, yPos, { align: 'center' });

        // Add invoice number with correct format
        yPos += 5;
        pdf.setFontSize(12);
        pdf.text(ensureCorrectFormat(data.invoiceNo), pageWidth / 2, yPos, {
          align: 'center',
        });

        // Client Information
        yPos += 10;
        pdf.setFontSize(12);
        pdf.text('Klien', margin, yPos);
        pdf.setFont('helvetica', 'normal');

        const addField = (label: string, value: string) => {
          yPos += 10;
          checkAndAddPage(15);
          // Add label with proper spacing
          pdf.text(`${label}:`, margin, yPos);
          // Add value with proper offset from label
          pdf.text(value || '-', margin + 30, yPos);
          drawLine(yPos + 5);
        };

        addField('Nama', data.clientName || '-');
        addField('Kontak', data.contact || '-');
        addField('Sub Akun', data.subAccount || '-');

        // Booking Information
        yPos += 15;
        checkAndAddPage(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Informasi Perawatan', margin, yPos);
        pdf.setFont('helvetica', 'normal');

        addField(
          'Tanggal Masuk',
          `${data.inpatientDate} ${data.inpatientTime}` || '-'
        );
        if (data.type === 'inpatient') {
          addField(
            'Tanggal Keluar',
            `${data.dischargeDate} ${data.dischargeTime}` || '-'
          );
        }
        addField('Lokasi', data.location);
        addField('Total', `Rp ${data.total.toLocaleString()}`);
        if (data.type === 'inpatient') {
          addField('Deposit', `Rp ${data.deposit.toLocaleString()}`);
          addField('Sisa', `Rp ${data.balance.toLocaleString()}`);
        }
        addField('Status', data.status);

        // Services
        yPos += 25;
        checkAndAddPage(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Servis', margin, yPos);
        pdf.setFont('helvetica', 'normal');

        // Services table
        yPos += 10;
        const serviceHeaders = ['Servis', 'Tanggal', 'Harga'];
        const serviceColWidths = [100, 30, 45];
        const startX = margin;
        const maxServiceNameWidth = 95;

        // Draw header line
        drawLine(yPos - 5);

        // Print headers
        let currentX = startX;
        serviceHeaders.forEach((header, i) => {
          if (i === 0) {
            pdf.text(header, currentX, yPos);
          } else {
            pdf.text(header, currentX + serviceColWidths[i] / 2, yPos, {
              align: 'center',
            });
          }
          currentX += serviceColWidths[i];
        });

        // Draw line after headers
        drawLine(yPos + 2);

        // Print service items
        data.services.forEach((service) => {
          yPos += 10;
          checkAndAddPage(20);
          currentX = startX;

          // Service name - Split into multiple lines if too long
          const serviceNameWidth = pdf.getTextWidth(service.name);
          if (serviceNameWidth > maxServiceNameWidth) {
            const words = service.name.split(' ');
            let line = '';
            let firstLine = true;

            words.forEach((word) => {
              const testLine = line + (line ? ' ' : '') + word;
              const testWidth = pdf.getTextWidth(testLine);

              if (testWidth > maxServiceNameWidth) {
                pdf.text(line, currentX, yPos);
                line = word;
                if (firstLine) {
                  yPos += 5;
                  firstLine = false;
                }
              } else {
                line = testLine;
              }
            });

            if (line) {
              pdf.text(line, currentX, yPos);
            }
          } else {
            pdf.text(service.name, currentX, yPos);
          }
          currentX += serviceColWidths[0];

          // Date
          const formattedDate = new Date(service.date).toLocaleDateString(
            'id-ID',
            {
              day: '2-digit',
              month: 'short',
            }
          );
          pdf.text(formattedDate, currentX + serviceColWidths[1] / 2, yPos, {
            align: 'center',
          });
          currentX += serviceColWidths[1];

          // Price
          pdf.text(
            `Rp ${service.price.toLocaleString()}`,
            currentX + serviceColWidths[2],
            yPos,
            { align: 'right' }
          );

          // Draw line after each item
          drawLine(yPos + 4);
          yPos += 2;
        });

        // Cart Items
        yPos += 15;
        checkAndAddPage(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Keranjang Pasien', margin, yPos);
        pdf.setFont('helvetica', 'normal');

        // Cart table headers
        yPos += 10;
        const headers = ['#', 'Nama', 'Tanggal', 'Harga', 'Kuantitas', 'Total'];
        const colWidths = [10, 70, 25, 25, 20, 25];
        const cartStartX = margin;
        const maxNameWidth = 65;

        // Draw header line
        drawLine(yPos - 5);

        // Print headers
        currentX = cartStartX;
        headers.forEach((header, i) => {
          const align = i === 1 ? 'left' : 'center';
          if (i === 0) {
            pdf.text(header, currentX, yPos);
          } else {
            pdf.text(
              header,
              currentX + (i === 1 ? 0 : colWidths[i] / 2),
              yPos,
              {
                align,
              }
            );
          }
          currentX += colWidths[i];
        });

        // Draw line after headers
        drawLine(yPos + 2);

        // Print cart items
        data.cartItems.forEach((item, index) => {
          yPos += 12;
          checkAndAddPage(15);

          currentX = cartStartX;
          // Item number
          pdf.text((index + 1).toString() + '.', currentX, yPos);
          currentX += colWidths[0];

          // Name (with possible description)
          const nameWidth = pdf.getTextWidth(item.name);
          if (nameWidth > maxNameWidth) {
            const words = item.name.split(' ');
            let line = '';
            let firstLine = true;

            words.forEach((word) => {
              const testLine = line + (line ? ' ' : '') + word;
              const testWidth = pdf.getTextWidth(testLine);

              if (testWidth > maxNameWidth) {
                pdf.text(line, currentX, yPos);
                line = word;
                if (firstLine) {
                  yPos += 5;
                  firstLine = false;
                }
              } else {
                line = testLine;
              }
            });

            if (line) {
              pdf.text(line, currentX, yPos);
            }
          } else {
            pdf.text(item.name, currentX, yPos);
          }

          currentX += colWidths[1];

          // Date
          const formattedDate = new Date(item.date).toLocaleDateString(
            'id-ID',
            {
              day: '2-digit',
              month: 'short',
            }
          );
          pdf.text(formattedDate, currentX + colWidths[2] / 2, yPos, {
            align: 'center',
          });
          currentX += colWidths[2];

          // Price
          pdf.text(item.harga.toLocaleString(), currentX + colWidths[3], yPos, {
            align: 'right',
          });
          currentX += colWidths[3];

          // Quantity
          pdf.text(
            item.quantity.toString(),
            currentX + colWidths[4] / 2,
            yPos,
            {
              align: 'center',
            }
          );
          currentX += colWidths[4];

          // Total
          pdf.text(item.total.toLocaleString(), currentX + colWidths[5], yPos, {
            align: 'right',
          });

          // Draw line after each item
          drawLine(yPos + 4);
          yPos += 2;
        });

        // Financial Breakdown
        const remainingSpace = pageHeight - (yPos + 60);
        if (remainingSpace < 60) {
          pdf.addPage();
          yPos = margin;
        } else {
          yPos += 20;
        }

        pdf.setFont('helvetica', 'bold');
        pdf.text('Rincian Biaya', pageWidth - margin - 80, yPos);
        pdf.setFont('helvetica', 'normal');

        const lineHeight = 8;
        const breakdownLeft = pageWidth - margin - 80;
        yPos += 8;

        // Function to add breakdown line
        const addBreakdownLine = (
          label: string,
          value: number,
          isTotal: boolean = false
        ) => {
          if (isTotal) {
            yPos += lineHeight;
            pdf.setFont('helvetica', 'bold');
            pdf.line(breakdownLeft, yPos - 3, pageWidth - margin, yPos - 3);
          }
          yPos += lineHeight;
          pdf.text(label, breakdownLeft, yPos);
          pdf.text(`Rp ${value.toLocaleString()}`, pageWidth - margin, yPos, {
            align: 'right',
          });
          if (isTotal) {
            pdf.setFont('helvetica', 'normal');
            yPos += lineHeight / 2;
          }
        };

        // Add breakdown items
        addBreakdownLine('Subtotal', data.subtotal);
        const taxAmount = (data.subtotal * (data.tax || 0)) / 100;
        addBreakdownLine(`Pajak (${data.tax || 0}%)`, taxAmount);
        addBreakdownLine('Total', data.total, true);
        if (data.type === 'inpatient') {
          addBreakdownLine('Deposit', data.deposit);
          addBreakdownLine('Sisa', data.balance, true);
        }

        // Add page number
        for (let i = 1; i <= pageNumber; i++) {
          safePdfOperation(() => {
            pdf.setPage(i);
            pdf.setFontSize(10);
            safeText(String(i), pageWidth - 10, pageHeight - 10, {
              align: 'right',
            });
          });
        }

        // When saving in production, use blob approach
        const originalSave = pdf.save;
        pdf.save = function (filename: string) {
          try {
            const blob = this.output('blob');
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          } catch (error) {
            console.error('Error in PDF save:', error);
            originalSave.call(this, filename);
          }
        };

        resolve(pdf);
      }
    } catch (error) {
      console.error('Error in PDF generation:', error);
      reject(error);
    }
  });
}
