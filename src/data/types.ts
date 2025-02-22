export interface Service {
  _id?: string;
  name: string;
  basePrice: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  _id?: string;
  name: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  staff?: string;
}

export interface CartItem {
  _id?: string;
  kode: string;
  name: string;
  category?: string;
  description?: string;
  jumlah?: number;
  harga: number;
  date: string;
  quantity: number;
  total: number;
  notes?: string;
  maxStock?: number;
}

export interface InvoiceData {
  invoiceNo: string;
  clientName: string;
  contact: string;
  subAccount: string;
  bookingDate: string;
  inpatientDate: string;
  dischargeDate: string;
  location: string;
  total: number;
  deposit: number;
  balance: number;
  status: string;
  services: ServiceItem[];
  cartItems: CartItem[];
}
