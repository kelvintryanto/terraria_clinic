export interface ServiceItem {
  name: string
  date: string
  time: string
  duration: string
  price: number
  staff?: string
}

export interface CartItem {
  name: string
  date: string
  price: number
  quantity: number
  total: number
  notes?: string
}

export interface InvoiceData {
  clientName: string
  contact: string
  subAccount: string
  bookingDate: string
  inpatientDate: string
  dischargeDate: string
  location: string
  total: number
  deposit: number
  balance: number
  status: string
  services: ServiceItem[]
  cartItems: CartItem[]
}

