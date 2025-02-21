declare module 'jspdf' {
  export class jsPDF {
    constructor(options?: {
      orientation?: 'portrait' | 'landscape';
      unit?: 'mm' | 'pt' | 'px' | 'in' | 'cm';
      format?: 'a4' | [number, number];
    });

    internal: {
      pageSize: {
        width: number;
        height: number;
      };
    };

    addPage(): void;
    line(x1: number, y1: number, x2: number, y2: number): void;
    setFontSize(size: number): void;
    setFont(fontName: string, fontStyle: string): void;
    text(
      text: string,
      x: number,
      y: number,
      options?: { align?: 'left' | 'center' | 'right' }
    ): void;
    addImage(
      imageData: string | HTMLImageElement,
      format: string,
      x: number,
      y: number,
      width: number,
      height: number
    ): void;
    save(filename: string): void;
    setPage(pageNumber: number): void;
    getTextWidth(text: string): number;
  }
}
