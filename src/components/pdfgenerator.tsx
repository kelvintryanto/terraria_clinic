'use client';

import { jsPDF } from 'jspdf';
import { InvoiceData } from '../../data/types';

export function createPDFTemplate(data: InvoiceData): Promise<jsPDF> {
  return new Promise((resolve) => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;
    let yPos = margin;
    let pageNumber = 1;

    // Function to add a new page if needed
    const checkAndAddPage = (height: number) => {
      if (yPos + height > pageHeight - margin) {
        pdf.addPage();
        pageNumber++;
        yPos = margin;
        // Add header line on new page
        pdf.line(margin, 15, pageWidth - margin, 15);
      }
    };

    // Function to draw a line
    const drawLine = (y: number) => {
      pdf.line(margin, y, pageWidth - margin, y);
    };

    // Load and add logo
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      // Add logo
      pdf.addImage(img, 'PNG', margin, yPos, 30, 30);
      continueWithPDF();
    };

    img.onerror = () => {
      // If image fails to load, continue without it
      console.error('Failed to load logo image');
      continueWithPDF();
    };

    img.src =
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs26IXupCAq7GYMDpW7OjXG6WlTL5Wg78kbulBtYshUhrVA_Ph69KR7NdxGTHT0wKoTRw&usqp=CAU';

    function continueWithPDF() {
      // Add clinic information
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Klinik Hewan Velvet Care --', pageWidth - margin, yPos + 5, {
        align: 'right',
      });
      pdf.text(
        'Jl. Ciangsana Raya No. 18 Ruko Proland 13',
        pageWidth - margin,
        yPos + 10,
        { align: 'right' }
      );
      pdf.text(
        'Bogor Regency, West Java 16968',
        pageWidth - margin,
        yPos + 15,
        { align: 'right' }
      );

      // Add header line
      pdf.line(margin, 45, pageWidth - margin, 45);

      // Header
      yPos += 60;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.text('KASUS RAWAT INAP', pageWidth / 2, yPos, { align: 'center' });

      // Client Information
      yPos += 20;
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
      pdf.text('Booking', margin, yPos);
      pdf.setFont('helvetica', 'normal');

      addField('Dipesan', data.bookingDate || '-');
      addField('Dirawat Inap', data.inpatientDate || '-');
      addField('Pulangkan Pasien', data.dischargeDate || '-');
      addField('Lokasi', data.location);
      addField('Total', `Rp ${data.total.toLocaleString()}`);
      addField('Deposit', `Rp ${data.deposit.toLocaleString()}`);
      addField('Saldo', `Rp ${data.balance.toLocaleString()}`);
      addField('Status', data.status);

      // Services
      yPos += 25;
      checkAndAddPage(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Servis', margin, yPos);
      pdf.setFont('helvetica', 'normal');

      // Services table
      yPos += 15;
      const serviceHeaders = [
        'Servis',
        'Tanggal',
        'Waktu',
        'Durasi',
        'Harga',
        'Staf',
      ];
      const serviceColWidths = [60, 25, 20, 20, 30, 25];
      const startX = margin;
      const maxServiceNameWidth = 55;

      // Draw header line
      drawLine(yPos - 5);

      // Print headers
      let currentX = startX;
      serviceHeaders.forEach((header, i) => {
        if (i === 0) {
          pdf.text(header, currentX, yPos);
        } else {
          pdf.text(
            header,
            currentX +
              (i === 4 ? serviceColWidths[i] : serviceColWidths[i] / 2),
            yPos,
            {
              align: i === 4 ? 'right' : 'center',
            }
          );
        }
        currentX += serviceColWidths[i];
      });

      // Draw line after headers
      drawLine(yPos + 2);

      // Print service items
      data.services.forEach((service) => {
        yPos += 15;
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
                yPos += 5; // Add less space after first line
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

        // Rest of the service information
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

        pdf.text(service.time, currentX + serviceColWidths[2] / 2, yPos, {
          align: 'center',
        });
        currentX += serviceColWidths[2];

        pdf.text(service.duration, currentX + serviceColWidths[3] / 2, yPos, {
          align: 'center',
        });
        currentX += serviceColWidths[3];

        pdf.text(
          `Rp ${service.price.toLocaleString()}`,
          currentX + serviceColWidths[4],
          yPos,
          { align: 'right' }
        );
        currentX += serviceColWidths[4];

        if (service.staff) {
          pdf.text(service.staff, currentX + serviceColWidths[5] / 2, yPos, {
            align: 'center',
          });
        }

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
      const headers = [
        '#',
        'Nama',
        'Tanggal',
        'Harga (RP)',
        'Kuantitas',
        'Total',
      ];
      const colWidths = [10, 70, 25, 25, 20, 25];
      const cartStartX = margin;

      // Draw header line
      drawLine(yPos - 5);

      // Print headers
      currentX = cartStartX;
      headers.forEach((header, i) => {
        const align = i === 1 ? 'left' : 'center';
        if (i === 0) {
          pdf.text(header, currentX, yPos);
        } else {
          pdf.text(header, currentX + (i === 1 ? 0 : colWidths[i] / 2), yPos, {
            align,
          });
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

        // Name (with possible notes)
        pdf.text(item.name, currentX, yPos);
        if (item.notes) {
          yPos += 5;
          pdf.setFontSize(9);
          pdf.text(`  • ${item.notes}`, currentX, yPos);
          pdf.setFontSize(12);
        }
        currentX += colWidths[1];

        // Date
        pdf.text(item.date, currentX, yPos);
        currentX += colWidths[2];

        // Price
        pdf.text(item.harga.toLocaleString(), currentX + colWidths[3], yPos, {
          align: 'right',
        });
        currentX += colWidths[3];

        // Quantity
        pdf.text(item.quantity.toString(), currentX + colWidths[4] / 2, yPos, {
          align: 'center',
        });
        currentX += colWidths[4];

        // Total
        pdf.text(item.total.toLocaleString(), currentX + colWidths[5], yPos, {
          align: 'right',
        });

        // Draw line after each item
        drawLine(yPos + 2);
      });

      // Add page number
      for (let i = 1; i <= pageNumber; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(String(i), pageWidth - 10, pageHeight - 10, {
          align: 'right',
        });
      }

      resolve(pdf);
    }
  });
}
