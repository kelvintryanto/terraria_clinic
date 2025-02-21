'use client';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type {
  CartItem,
  InvoiceData,
  Service,
  ServiceItem,
} from '../../data/types';
import { ProductSearch } from './cms/invoice/product-search';
import { ServiceSearch } from './cms/invoice/service-search';
import { createPDFTemplate } from './pdfgenerator';

export default function InvoiceForm() {
  const [formData, setFormData] = useState<InvoiceData>({
    clientName: '',
    contact: '',
    subAccount: '',
    bookingDate: new Date().toISOString().split('T')[0],
    inpatientDate: new Date().toISOString().split('T')[0],
    dischargeDate: '',
    location: 'Klinik Hewan Velvet Care Ciangsana',
    total: 0,
    deposit: 0,
    balance: 0,
    status: 'Dirawat Inap',
    services: [],
    cartItems: [],
  });

  const [depositText, setDepositText] = useState('');

  const [serviceInputs, setServiceInputs] = useState<Partial<ServiceItem>[]>([
    {
      _id: undefined,
      name: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      }),
      duration: '',
      price: undefined,
      staff: '',
    },
  ]);

  const [cartInputs, setCartInputs] = useState<Partial<CartItem>[]>([
    {
      _id: undefined,
      name: '',
      kode: '',
      category: '',
      description: '',
      jumlah: undefined,
      harga: 0,
      date: new Date().toISOString().split('T')[0],
      quantity: 0,
      total: 0,
      notes: '',
      maxStock: undefined,
    },
  ]);

  const formatNumber = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    // Convert to number and format with thousand separators
    return numericValue === ''
      ? ''
      : Number(numericValue).toLocaleString('id-ID');
  };

  const addServiceInput = () => {
    setServiceInputs([
      ...serviceInputs,
      {
        _id: undefined,
        name: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }),
        duration: '',
        price: undefined,
        staff: '',
      },
    ]);
  };

  const removeServiceInput = (index: number) => {
    setServiceInputs(serviceInputs.filter((_, i) => i !== index));
  };

  const addCartInput = () => {
    setCartInputs([
      ...cartInputs,
      {
        _id: undefined,
        name: '',
        kode: '',
        category: '',
        description: '',
        jumlah: undefined,
        harga: 0,
        date: new Date().toISOString().split('T')[0],
        quantity: 1,
        total: 0,
        notes: '',
        maxStock: undefined,
      },
    ]);
  };

  const removeCartInput = (index: number) => {
    setCartInputs(cartInputs.filter((_, i) => i !== index));
  };

  const addServices = () => {
    const newServices = serviceInputs.filter(
      (service) =>
        service.name &&
        service.date &&
        service.time &&
        service.duration &&
        service.price !== undefined &&
        service.price > 0 &&
        service.staff
    ) as ServiceItem[];

    if (newServices.length > 0) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, ...newServices],
      }));
      setServiceInputs([
        {
          _id: undefined,
          name: '',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
          }),
          duration: '',
          price: undefined,
          staff: '',
        },
      ]);
      calculateTotal(
        [...formData.services, ...newServices],
        formData.cartItems
      );
    } else {
      alert('Harap isi semua field service sebelum menambahkan.');
    }
  };

  const addCartItems = () => {
    const newItems = cartInputs
      .filter((item) => item.name && item.date && item.harga && item.quantity)
      .map((item) => ({
        ...item,
        total: (item.harga || 0) * (item.quantity || 0),
      })) as CartItem[];

    if (newItems.length > 0) {
      setFormData((prev) => ({
        ...prev,
        cartItems: [...prev.cartItems, ...newItems],
      }));
      setCartInputs([
        {
          _id: undefined,
          name: '',
          kode: '',
          category: '',
          description: '',
          jumlah: undefined,
          harga: 0,
          date: new Date().toISOString().split('T')[0],
          quantity: 1,
          total: 0,
          notes: '',
          maxStock: undefined,
        },
      ]);
      calculateTotal(formData.services, [...formData.cartItems, ...newItems]);
    } else {
      alert('Harap isi semua field item keranjang sebelum menambahkan.');
    }
  };

  const removeService = (index: number) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      services: updatedServices,
    });
    calculateTotal(updatedServices, formData.cartItems);
  };

  const removeCartItem = (index: number) => {
    const updatedCartItems = formData.cartItems.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      cartItems: updatedCartItems,
    });
    calculateTotal(formData.services, updatedCartItems);
  };

  const calculateTotal = (services: ServiceItem[], cartItems: CartItem[]) => {
    const servicesTotal = services.reduce(
      (sum, service) => sum + (service.price || 0),
      0
    );
    const cartTotal = cartItems.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );
    const total = servicesTotal + cartTotal;
    const balance = total - formData.deposit;
    setFormData((prev) => ({ ...prev, total, balance }));
  };

  const generatePDF = async () => {
    const pdf = await createPDFTemplate(formData);
    pdf.save('invoice.pdf');
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Client Info and Services */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Client Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Informasi Klien
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nama-klien">Nama Klien</Label>
                  <Input
                    id="nama-klien"
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    placeholder="Masukkan nama klien"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kontak">Kontak</Label>
                  <Input
                    id="kontak"
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    placeholder="Masukkan kontak"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sub-akun">Sub Akun</Label>
                  <Input
                    id="sub-akun"
                    value={formData.subAccount}
                    onChange={(e) =>
                      setFormData({ ...formData, subAccount: e.target.value })
                    }
                    placeholder="Masukkan sub akun"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Servis
                </h2>
                <Button
                  onClick={addServiceInput}
                  size="sm"
                  className="transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline-block sm:ml-2">
                    Tambah Servis
                  </span>
                </Button>
              </div>

              <div className="space-y-6">
                {serviceInputs.map((service, index) => (
                  <div
                    key={index}
                    className="bg-gray-50/50 rounded-lg border border-gray-100 p-6 space-y-6"
                  >
                    {/* Service Search and Date/Time Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Servis</Label>
                        <ServiceSearch
                          onSelect={(selectedService: Service) => {
                            const updatedInputs = [...serviceInputs];
                            updatedInputs[index] = {
                              ...updatedInputs[index],
                              _id: selectedService._id?.toString(),
                              name: selectedService.name,
                              price: selectedService.basePrice,
                            };
                            setServiceInputs(updatedInputs);
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tanggal</Label>
                          <DatePicker
                            date={
                              service.date ? new Date(service.date) : undefined
                            }
                            onSelect={(date) => {
                              const updatedInputs = [...serviceInputs];
                              updatedInputs[index] = {
                                ...updatedInputs[index],
                                date: date
                                  ? date.toISOString().split('T')[0]
                                  : '',
                              };
                              setServiceInputs(updatedInputs);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Waktu</Label>
                          <Input
                            type="time"
                            value={service.time}
                            onChange={(e) => {
                              const updatedInputs = [...serviceInputs];
                              updatedInputs[index] = {
                                ...updatedInputs[index],
                                time: e.target.value,
                              };
                              setServiceInputs(updatedInputs);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Duration, Price, and Staff Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4">
                      <div className="space-y-2 md:col-span-3">
                        <div className="flex items-center justify-between">
                          <Label>Durasi</Label>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="1"
                            placeholder="Masukkan angka"
                            value={
                              service.duration
                                ? service.duration.split(' ')[0]
                                : ''
                            }
                            onChange={(e) => {
                              const updatedInputs = [...serviceInputs];
                              const value = e.target.value;
                              const unit =
                                updatedInputs[index].duration?.split(' ')[1] ||
                                'jam';
                              updatedInputs[index] = {
                                ...updatedInputs[index],
                                duration: value ? `${value} ${unit}` : '',
                              };
                              setServiceInputs(updatedInputs);
                            }}
                          />
                          <Select
                            value={service.duration?.split(' ')[1] || 'jam'}
                            onValueChange={(value) => {
                              const updatedInputs = [...serviceInputs];
                              const number =
                                updatedInputs[index].duration?.split(' ')[0] ||
                                '';
                              updatedInputs[index] = {
                                ...updatedInputs[index],
                                duration: number ? `${number} ${value}` : '',
                              };
                              setServiceInputs(updatedInputs);
                            }}
                          >
                            <SelectTrigger className="w-[100px]">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="jam">Jam</SelectItem>
                              <SelectItem value="hari">Hari</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center justify-between">
                          <Label>Harga</Label>
                        </div>
                        <div className="relative">
                          <Input
                            type="text"
                            value={
                              service.price
                                ? `${service.price.toLocaleString('id-ID')}`
                                : ''
                            }
                            onChange={(e) => {
                              const updatedInputs = [...serviceInputs];
                              const numericValue = e.target.value.replace(
                                /[^0-9]/g,
                                ''
                              );
                              updatedInputs[index] = {
                                ...updatedInputs[index],
                                price:
                                  numericValue === ''
                                    ? undefined
                                    : Number(numericValue),
                              };
                              setServiceInputs(updatedInputs);
                            }}
                            className="pl-12"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            Rp&nbsp;&nbsp;
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-3">
                        <div className="flex items-center justify-between">
                          <Label>Staff</Label>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Staff"
                            value={service.staff}
                            onChange={(e) => {
                              const updatedInputs = [...serviceInputs];
                              updatedInputs[index] = {
                                ...updatedInputs[index],
                                staff: e.target.value,
                              };
                              setServiceInputs(updatedInputs);
                            }}
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeServiceInput(index)}
                            className="shrink-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {formData.services.length > 0 && (
                <>
                  {/* Mobile Card View */}
                  <div className="block lg:hidden space-y-4">
                    {formData.services.map((service, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg border border-gray-100 p-4 space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm text-gray-600">
                              Servis
                            </p>
                            <p className="font-medium">{service.name}</p>
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeService(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-600">
                            Tanggal
                          </p>
                          <p>{service.date}</p>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-600">
                            Waktu
                          </p>
                          <p>{service.time}</p>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-600">
                            Durasi
                          </p>
                          <p>{service.duration}</p>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-600">
                            Harga
                          </p>
                          <p>Rp {service.price.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-600">
                            Staff
                          </p>
                          <p>{service.staff}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block">
                    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                      <ScrollArea className="w-full">
                        <div className="min-w-[600px]">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50/50">
                                <TableHead className="w-[80px]">
                                  Servis
                                </TableHead>
                                <TableHead className="w-[120px]">
                                  Tanggal
                                </TableHead>
                                <TableHead className="w-[100px]">
                                  Waktu
                                </TableHead>
                                <TableHead className="w-[100px]">
                                  Durasi
                                </TableHead>
                                <TableHead className="w-[80px]">
                                  Harga
                                </TableHead>
                                <TableHead className="w-[80px]">
                                  Staff
                                </TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {formData.services.map((service, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">
                                    {service.name}
                                  </TableCell>
                                  <TableCell>{service.date}</TableCell>
                                  <TableCell>{service.time}</TableCell>
                                  <TableCell>{service.duration}</TableCell>
                                  <TableCell>
                                    Rp {service.price.toLocaleString()}
                                  </TableCell>
                                  <TableCell>{service.staff}</TableCell>
                                  <TableCell>
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      onClick={() => removeService(index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </>
              )}

              <Button
                onClick={addServices}
                className={`w-full transition-all duration-200 ${
                  !serviceInputs.some(
                    (service) =>
                      service.name &&
                      service.date &&
                      service.time &&
                      service.duration &&
                      service.price &&
                      service.price > 0 &&
                      service.staff
                  )
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                disabled={
                  !serviceInputs.some(
                    (service) =>
                      service.name &&
                      service.date &&
                      service.time &&
                      service.duration &&
                      service.price &&
                      service.price > 0 &&
                      service.staff
                  )
                }
              >
                Tambah Semua Servis
              </Button>
            </div>
          </div>

          {/* Cart Items Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Item Keranjang
                </h2>
                <Button
                  onClick={addCartInput}
                  size="sm"
                  className="transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline-block sm:ml-2">
                    Tambah Item
                  </span>
                </Button>
              </div>

              <div className="space-y-6">
                {cartInputs.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50/50 rounded-lg border border-gray-100 p-6 space-y-6"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Produk</Label>
                        <ProductSearch
                          onSelect={(product) => {
                            const updatedInputs = [...cartInputs];
                            updatedInputs[index] = {
                              ...updatedInputs[index],
                              _id: product._id?.toString(),
                              name: product.name,
                              kode: product.kode,
                              category: product.category,
                              description: product.description,
                              jumlah: product.jumlah,
                              harga: product.harga,
                              maxStock: product.jumlah,
                              notes: product.description,
                              quantity: 1,
                              total: product.harga * 1,
                            };
                            setCartInputs(updatedInputs);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tanggal</Label>
                        <DatePicker
                          date={item.date ? new Date(item.date) : undefined}
                          onSelect={(date) => {
                            const updatedInputs = [...cartInputs];
                            updatedInputs[index] = {
                              ...updatedInputs[index],
                              date: date
                                ? date.toISOString().split('T')[0]
                                : '',
                            };
                            setCartInputs(updatedInputs);
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Harga</Label>
                        <div className="relative">
                          <Input
                            type="text"
                            value={
                              item.harga
                                ? `${item.harga.toLocaleString('id-ID')}`
                                : ''
                            }
                            onChange={(e) => {
                              const updatedInputs = [...cartInputs];
                              const numericValue = e.target.value.replace(
                                /[^0-9]/g,
                                ''
                              );
                              const newHarga =
                                numericValue === '' ? 0 : Number(numericValue);
                              updatedInputs[index] = {
                                ...updatedInputs[index],
                                harga: newHarga,
                                total:
                                  newHarga *
                                  (updatedInputs[index].quantity || 1),
                              };
                              setCartInputs(updatedInputs);
                            }}
                            className="pl-12"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            Rp&nbsp;&nbsp;
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Kuantitas</Label>
                        <Input
                          type="number"
                          placeholder="Kuantitas"
                          value={item.quantity || ''}
                          min={1}
                          max={item.maxStock || 1}
                          onChange={(e) => {
                            const updatedInputs = [...cartInputs];
                            const value = e.target.value;
                            const quantity =
                              value === ''
                                ? 1
                                : Math.min(
                                    Number.parseInt(value),
                                    item.maxStock || 1
                                  );
                            updatedInputs[index] = {
                              ...updatedInputs[index],
                              quantity,
                              total:
                                (updatedInputs[index].harga || 0) * quantity,
                            };
                            setCartInputs(updatedInputs);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Total</Label>
                        <Input
                          value={`Rp ${(item.total || 0).toLocaleString()}`}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1 space-y-2">
                        <Label>Catatan</Label>
                        <Input
                          placeholder="Catatan"
                          value={item.notes}
                          onChange={(e) => {
                            const updatedInputs = [...cartInputs];
                            updatedInputs[index] = {
                              ...updatedInputs[index],
                              notes: e.target.value,
                            };
                            setCartInputs(updatedInputs);
                          }}
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="self-end"
                        onClick={() => removeCartInput(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {formData.cartItems.length > 0 && (
                <>
                  {/* Mobile Card View */}
                  <div className="block lg:hidden space-y-4">
                    {formData.cartItems.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg border border-gray-100 p-4 space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm text-gray-600">
                              Kode
                            </p>
                            <p className="font-medium">{item.kode}</p>
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeCartItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-600">
                            Nama
                          </p>
                          <p>{item.name}</p>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-600">
                            Tanggal
                          </p>
                          <p>{item.date}</p>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-600">
                            Harga
                          </p>
                          <p>Rp {item.harga.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-600">
                            Kuantitas
                          </p>
                          <p>{item.quantity}</p>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-600">
                            Total
                          </p>
                          <p>Rp {item.total.toLocaleString()}</p>
                        </div>
                        {item.notes && (
                          <div>
                            <p className="font-medium text-sm text-gray-600">
                              Catatan
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block">
                    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                      <ScrollArea className="w-full">
                        <div className="min-w-[600px]">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50/50">
                                <TableHead className="w-[80px]">Kode</TableHead>
                                <TableHead className="w-[120px]">
                                  Nama
                                </TableHead>
                                <TableHead className="w-[100px]">
                                  Tanggal
                                </TableHead>
                                <TableHead className="w-[100px]">
                                  Harga
                                </TableHead>
                                <TableHead className="w-[80px]">
                                  Kuantitas
                                </TableHead>
                                <TableHead className="w-[100px]">
                                  Total
                                </TableHead>
                                <TableHead className="min-w-[120px]">
                                  Catatan
                                </TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {formData.cartItems.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">
                                    {item.kode}
                                  </TableCell>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>{item.date}</TableCell>
                                  <TableCell>
                                    Rp {item.harga.toLocaleString()}
                                  </TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>
                                    Rp {item.total.toLocaleString()}
                                  </TableCell>
                                  <TableCell
                                    className="max-w-[120px] truncate"
                                    title={item.notes || ''}
                                  >
                                    {item.notes}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      onClick={() => removeCartItem(index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </>
              )}

              <Button
                onClick={addCartItems}
                className={`w-full transition-all duration-200 ${
                  !cartInputs.some(
                    (item) =>
                      item.name &&
                      item.date &&
                      item.harga &&
                      item.harga > 0 &&
                      item.quantity &&
                      item.quantity > 0
                  )
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                disabled={
                  !cartInputs.some(
                    (item) =>
                      item.name &&
                      item.date &&
                      item.harga &&
                      item.harga > 0 &&
                      item.quantity &&
                      item.quantity > 0
                  )
                }
              >
                Tambah Semua Item
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Financial Info and Generate PDF */}
        <div className="col-span-12 lg:col-span-4">
          <div className="sticky top-[calc(50vh-210px)]">
            {/* Financial Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                  <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Informasi Keuangan
                  </h2>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="deposit">Deposit</Label>
                    <div className="relative">
                      <Input
                        id="deposit"
                        type="text"
                        value={depositText}
                        onChange={(e) => {
                          const formattedValue = formatNumber(e.target.value);
                          setDepositText(formattedValue);
                          const numericValue = e.target.value.replace(
                            /[^0-9]/g,
                            ''
                          );
                          const deposit =
                            numericValue === '' ? 0 : Number(numericValue);
                          setFormData((prev) => ({
                            ...prev,
                            deposit,
                            balance: prev.total - deposit,
                          }));
                        }}
                        className="pl-12"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        Rp
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total">Total</Label>
                    <div className="relative">
                      <Input
                        id="total"
                        value={`${formData.total.toLocaleString()}`}
                        disabled
                        className="pl-12 bg-gray-50"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        Rp
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="saldo">Saldo</Label>
                    <div className="relative">
                      <Input
                        id="saldo"
                        value={`${formData.balance.toLocaleString()}`}
                        disabled
                        className="pl-12 bg-gray-50"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        Rp
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate PDF Button */}
            <Button
              onClick={generatePDF}
              size="lg"
              className={`w-full transition-all duration-200 ${
                !formData.clientName ||
                !formData.contact ||
                formData.total === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
              disabled={
                !formData.clientName ||
                !formData.contact ||
                formData.total === 0
              }
            >
              Generate PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
