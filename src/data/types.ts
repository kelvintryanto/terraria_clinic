import { ObjectId } from 'mongodb';

export interface Service {
  _id?: string;
  kode: string;
  name: string;
  category: string;
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
}

export interface CartItem {
  _id?: string;
  name: string;
  kode: string;
  category: string;
  description: string;
  jumlah: number;
  harga: number;
  date: string;
  quantity: number;
  total: number;
  notes: string;
  maxStock?: number;
}

export interface InvoiceData {
  _id?: string;
  invoiceNo: string;
  clientName: string;
  contact: string;
  subAccount: string;
  inpatientDate: string;
  inpatientTime: string;
  dischargeDate?: string;
  dischargeTime?: string;
  location: string;
  total: number;
  deposit: number;
  balance: number;
  status: 'Dirawat Inap' | 'Rawat Jalan';
  services: ServiceItem[];
  cartItems: CartItem[];
  tax: number;
  subtotal: number;
  type: 'inpatient' | 'outpatient';
}

export interface ClientSnapShotData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface DogSnapShotData {
  name: string;
  breedId: ObjectId;
  customBreed?: string;
  birthYear: string;
  birthMonth: string;
  color: string;
  weight: number;
  sex: 'male' | 'female';
  lastVaccineDate?: string;
  lastDewormDate?: string;
}
