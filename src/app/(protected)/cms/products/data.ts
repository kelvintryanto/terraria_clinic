interface Product {
  no: number;
  kode: string;
  name: string;
  category: string;
  description: string;
  jumlah: number;
  harga: number;
}

export const products: Product[] = [
  // Konsultasi
  { no: 1, kode: "K001", name: "Biaya Konsultasi", category: "Layanan", description: "Pemeriksaan kesehatan umum yang dilakukan oleh dokter hewan sebelum melakukan diagnosis atau pengobatan", jumlah: 1, harga: 175000 },

  // Vaksinasi
  { no: 2, kode: "V001", name: "Vaksin Rabies", category: "Vaksin", description: "Vaksin ini membantu melindungi Anjing dari virus rabies", jumlah: 1, harga: 200000 },
  { no: 3, kode: "V002", name: "Vaksin DHPP", category: "Vaksin", description: "Distemper, hepatitis, parvovirus, parainfluenza", jumlah: 1, harga: 300000 },
  { no: 4, kode: "V003", name: "Vaksin DHPPL + R", category: "Vaksin", description: "Booster tahunan (Vaksinasi Lengkap) L+R", jumlah: 1, harga: 300000 },
  { no: 5, kode: "V004", name: "Vaksin Bordetella", category: "Vaksin", description: "Vaksin untuk mencegah batuk kennel", jumlah: 1, harga: 200000 },

  // Laboratorium
  { no: 6, kode: "L001", name: "Tes Hematologi", category: "Laboratorium", description: "Tes darah untuk mengevaluasi kesehatan secara keseluruhan dan mendeteksi penyakit.", jumlah: 1, harga: 0 },
  { no: 7, kode: "L002", name: "Tes Kimia Darah", category: "Laboratorium", description: "Panel kimia darah rinci untuk menilai fungsi organ.", jumlah: 1, harga: 0 },
  { no: 8, kode: "L003", name: "Tes Kulit", category: "Laboratorium", description: "Tes diagnostik untuk mengidentifikasi gangguan kulit dan alergi", jumlah: 1, harga: 0 },
  { no: 9, kode: "L004", name: "Tes Feces Native", category: "Laboratorium", description: "Pemeriksaan feses untuk parasit dan kelainan lainnya", jumlah: 1, harga: 0 },
  { no: 10, kode: "L005", name: "Tes Feses Mengambang", category: "Laboratorium", description: "Tes diagnostik untuk mendeteksi parasit dalam sampel feses", jumlah: 1, harga: 0 },
  { no: 11, kode: "L006", name: "Tes Impresi", category: "Laboratorium", description: "Tes impresi kulit untuk mendiagnosis infeksi dan kondisi kulit", jumlah: 1, harga: 0 },
  { no: 12, kode: "L007", name: "Tes Kotoran/Tungau", category: "Laboratorium", description: "Pemeriksaan untuk tungau telinga dan kondisi telinga lainnya", jumlah: 1, harga: 0 },
  { no: 13, kode: "L008", name: "Tes Kits", category: "Layanan", description: "Berbagai perangkat tes diagnostik untuk evaluasi kesehatan menyeluruh", jumlah: 1, harga: 0 },
  { no: 14, kode: "L009", name: "Tes Fluoresensi (mata)", category: "Laboratorium", description: "Tes mata untuk mendeteksi cedera dan kelainan kornea", jumlah: 1, harga: 0 },
  { no: 15, kode: "L010", name: "Tes Tekanan Darah", category: "Laboratorium", description: "Pengukuran tekanan darah hewan peliharaan Anda", jumlah: 1, harga: 0 },
  { no: 16, kode: "L011", name: "Tes Gula Darah", category: "Laboratorium", description: "Tes untuk memantau kadar glukosa darah", jumlah: 1, harga: 0 },

  // Sterilisasi (Jantan)
  { no: 17, kode: "SJ001", name: "S 0-5kg", category: "Sterilisasi Jantan", description: "Sterilisasi untuk anjing jantan dengan berat kurang dari 5kg", jumlah: 1, harga: 2000000 },
  { no: 18, kode: "SJ002", name: "M 6-15kg", category: "Sterilisasi Jantan", description: "Sterilisasi untuk anjing jantan dengan berat antara 6-15kg", jumlah: 1, harga: 2500000 },
  { no: 19, kode: "SJ003", name: "L 16-30kg", category: "Sterilisasi Jantan", description: "Sterilisasi untuk anjing jantan dengan berat antara 15-30kg", jumlah: 1, harga: 2750000 },
  { no: 20, kode: "SJ004", name: "XL 30-40kg", category: "Sterilisasi Jantan", description: "Sterilisasi untuk anjing jantan dengan berat lebih dari 30kg", jumlah: 1, harga: 3500000 },

  // Sterilisasi (Betina)
  { no: 21, kode: "SB001", name: "S 0-5kg", category: "Sterilisasi Betina", description: "Sterilisasi untuk anjing betina dengan berat kurang dari 5kg", jumlah: 1, harga: 2000000 },
  { no: 22, kode: "SB002", name: "M 6-15kg", category: "Sterilisasi Betina", description: "Sterilisasi untuk anjing betina dengan berat antara 6-15kg", jumlah: 1, harga: 2500000 },
  { no: 23, kode: "SB003", name: "L 16-30kg", category: "Sterilisasi Betina", description: "Sterilisasi untuk anjing betina dengan berat antara 15-30kg", jumlah: 1, harga: 2750000 },
  { no: 24, kode: "SB004", name: "XL 30-40kg", category: "Sterilisasi Betina", description: "Sterilisasi untuk anjing betina dengan berat lebih dari 30kg", jumlah: 1, harga: 3500000 },

  // Perawatan
  { no: 25, kode: "A001", name: "Terapi Laser", category: "Perawatan", description: "Perawatan laser non-invasif untuk nyeri dan peradangan", jumlah: 1, harga: 0 },
  { no: 26, kode: "A002", name: "Akupunktur", category: "Perawatan", description: "Teknik pengobatan untuk menghilangkan nyeri dan mempercepat penyembuhan", jumlah: 1, harga: 0 },
  { no: 27, kode: "A003", name: "Perawatan Telinga", category: "Perawatan", description: "Perawatan dan penanganan profesional untuk kondisi telinga", jumlah: 1, harga: 0 },
  { no: 28, kode: "A004", name: "Layanan Infus", category: "Perawatan", description: "Terapi cairan IV untuk hidrasi dan pemberian obat", jumlah: 1, harga: 0 },
  { no: 29, kode: "A005", name: "Nebulizer (Uap)", category: "Perawatan", description: "Perawatan pernapasan untuk memberikan obat langsung ke paru-paru", jumlah: 1, harga: 0 },

  // Scaling (Gigi)
  { no: 30, kode: "G001", name: "S 0-5kg", category: "Scaling", description: "Pembersihan gigi untuk anjing dengan berat kurang dari 5kg", jumlah: 1, harga: 0 },
  { no: 31, kode: "G002", name: "M 6-15kg", category: "Scaling", description: "Pembersihan gigi untuk anjing dengan berat antara 6-15kg", jumlah: 1, harga: 0 },
  { no: 32, kode: "G003", name: "L 15-30kg", category: "Scaling", description: "Pembersihan gigi untuk anjing dengan berat antara 15-30kg", jumlah: 1, harga: 0 },
  { no: 33, kode: "G004", name: "XL 30-40kg", category: "Scaling", description: "Pembersihan gigi untuk anjing dengan berat lebih dari 30kg", jumlah: 1, harga: 0 },

  // USG
  { no: 34, kode: "U001", name: "USG - Kehamilan", category: "USG", description: "Pemindaian ultrasonografi untuk memastikan apakah hewan peliharaan betina Anda hamil/tidak", jumlah: 1, harga: 0 },
  { no: 35, kode: "U002", name: "USG - Perut", category: "USG", description: "Pemindaian ultrasonografi abdomen untuk evaluasi oragn internal ", jumlah: 1, harga: 0 },
  { no: 36, kode: "U003", name: "USG - Toraks", category: "USG", description: "Pemindaian ultrasonografi toraks untuk menilai rongga dada dan organ", jumlah: 1, harga: 0 },
  { no: 37, kode: "U004", name: "USG - Urinary", category: "USG", description: "Pemindaian ultrasonografi untuk penilaian saluran kemih", jumlah: 1, harga: 0 },

  // Rawat Inap (Penitipan dan Pemberian Obat)
  { no: 38, kode: "RI001", name: "S 0-5kg", category: "Rawat Inap", description: "Rawat Inap untuk Anjing S 0-5kg dengan pemberian obat-obatan tertentu", jumlah: 1, harga: 0 },
  { no: 39, kode: "RI002", name: "M 6-15kg", category: "Rawat Inap", description: "Rawat Inap untuk Anjing M 6-15kg dengan pemberian obat-obatan tertentu", jumlah: 1, harga: 0 },
  { no: 40, kode: "RI003", name: "L 15-30kg", category: "Rawat Inap", description: "Rawat Inap untuk Anjing L 15-30kg dengan pemberian obat-obatan tertentu", jumlah: 1, harga: 0 },
  { no: 41, kode: "RI004", name: "XL 30- 40kg", category: "Rawat Inap", description: "Rawat Inap untuk Anjing XL dengan pemberian obat-obatan tertentu", jumlah: 1, harga: 0 },
];
