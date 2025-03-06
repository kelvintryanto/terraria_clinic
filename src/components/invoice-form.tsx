'use client';

import { Customer } from '@/app/models/customer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { debounce } from 'lodash';
import { Check, Minus, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  CartItem,
  InvoiceData,
  Service,
  ServiceItem,
} from '../data/types';
import { ProductSearch } from './cms/invoice/product-search';
import { ServiceSearch } from './cms/invoice/service-search';
import { createPDFTemplate } from './pdfgenerator';

// Helper function to format date from YYYY-MM-DD to DD-MM-YYYY
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
};

interface InvoiceFormProps {
  type?: 'inpatient' | 'outpatient';
}

export default function InvoiceForm({ type = 'inpatient' }: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceData>({
    invoiceNo: '',
    clientName: '',
    contact: '',
    subAccount: '',
    inpatientDate: new Date().toISOString().split('T')[0],
    inpatientTime: new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    }),
    dischargeDate: '',
    dischargeTime: '',
    location: 'Klinik Hewan Velvet Care Ciangsana',
    total: 0,
    deposit: 0,
    balance: 0,
    status: type === 'inpatient' ? 'Dirawat Inap' : 'Rawat Jalan',
    services: [],
    cartItems: [],
    tax: 0,
    subtotal: 0,
    type: type,
  });

  const [depositText, setDepositText] = useState('');

  const [serviceInputs, setServiceInputs] = useState<Partial<ServiceItem>[]>([
    {
      _id: undefined,
      name: '',
      date: new Date().toISOString().split('T')[0],
      price: undefined,
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

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Add customer search state
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomers, setShowCustomers] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showDogs, setShowDogs] = useState(false);
  const dogsRef = useRef<HTMLDivElement>(null);

  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      const customersArray = Array.isArray(data) ? data : [];
      setCustomers(customersArray);
      setFilteredCustomers(customersArray);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
      setFilteredCustomers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Handle search
  const debouncedSearch = useCallback(
    (term: string) => {
      if (!term.trim()) {
        setFilteredCustomers(customers);
        return;
      }
      const filtered = customers.filter((customer) =>
        customer.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCustomers(filtered);
    },
    [customers]
  );

  const debouncedSearchHandler = debounce(debouncedSearch, 300);

  useEffect(() => {
    debouncedSearchHandler(searchTerm);
    // Cleanup
    return () => {
      debouncedSearchHandler.cancel();
    };
  }, [searchTerm, debouncedSearchHandler]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowCustomers(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSearchTerm(customer.name);
    setShowCustomers(false);
    if (customer.dogs.length === 1) {
      setFormData((prev) => ({
        ...prev,
        clientName: customer.name,
        contact: customer.phone || customer.email,
        subAccount: customer.dogs[0].name,
      }));
    } else {
      setShowDogs(true);
      setFormData((prev) => ({
        ...prev,
        clientName: customer.name,
        contact: customer.phone || customer.email,
        subAccount: '',
      }));
    }
  };

  const handleDogSelect = (dogName: string) => {
    setFormData((prev) => ({
      ...prev,
      subAccount: dogName,
    }));
    setShowDogs(false);
  };

  // Add click outside handler for dogs dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dogsRef.current && !dogsRef.current.contains(event.target as Node)) {
        setShowDogs(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        price: undefined,
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
        service.price !== undefined &&
        service.price > 0
    ) as ServiceItem[];

    if (newServices.length > 0) {
      const updatedServices = [...formData.services, ...newServices];
      setFormData((prev) => ({
        ...prev,
        services: updatedServices,
      }));
      setServiceInputs([
        {
          _id: undefined,
          name: '',
          date: new Date().toISOString().split('T')[0],
          price: undefined,
        },
      ]);
      calculateTotal(updatedServices, formData.cartItems);
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
      const updatedCartItems = [...formData.cartItems, ...newItems];
      setFormData((prev) => ({
        ...prev,
        cartItems: updatedCartItems,
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
      calculateTotal(formData.services, updatedCartItems);
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

  const calculateTotal = (
    services: ServiceItem[],
    cartItems: CartItem[],
    newTax?: number
  ) => {
    // Calculate subtotal from services and cart items
    const servicesTotal = services.reduce(
      (sum, service) => sum + (service.price || 0),
      0
    );
    const cartTotal = cartItems.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );
    const subtotal = servicesTotal + cartTotal;

    // Use new tax value if provided, otherwise use existing formData value
    const taxPercentage = newTax !== undefined ? newTax : formData.tax;

    // Apply tax (as a percentage)
    const taxAmount = (subtotal * taxPercentage) / 100;
    const total = subtotal + taxAmount;

    setFormData((prev) => ({
      ...prev,
      subtotal,
      total,
      balance: total - prev.deposit,
    }));
  };

  const handleTaxChange = (value: string) => {
    // Parse the input as a percentage (0-100)
    const numericValue = value.replace(/\D/g, '');
    const tax = numericValue === '' ? 0 : Math.min(Number(numericValue), 100);

    setFormData((prev) => {
      const newFormData = { ...prev, tax };
      // Pass the new tax value to calculateTotal
      calculateTotal(newFormData.services, newFormData.cartItems, tax);
      return newFormData;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Create invoice data
      const invoiceData: InvoiceData = {
        invoiceNo: formData.invoiceNo,
        clientName: formData.clientName,
        contact: formData.contact,
        subAccount: formData.subAccount,
        inpatientDate: formData.inpatientDate,
        inpatientTime: formData.inpatientTime,
        dischargeDate: formData.dischargeDate,
        dischargeTime: formData.dischargeTime,
        location: formData.location,
        total: formData.total,
        deposit: formData.deposit,
        balance: formData.balance,
        status: formData.status,
        services: formData.services,
        cartItems: formData.cartItems,
        tax: formData.tax,
        subtotal: formData.subtotal,
        type: type,
      };

      // Save invoice to database
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (!response.ok) {
        throw new Error('Failed to save invoice');
      }

      const result = await response.json();

      // Get the created invoice data
      const createdInvoice = await fetch(
        `/api/invoices/${result.insertedId}`
      ).then((res) => res.json());

      // Generate PDF with the correct invoice number
      const pdf = await createPDFTemplate(createdInvoice);
      // Use the original invoice number for the filename
      pdf.save(`${createdInvoice.invoiceNo}.pdf`);

      toast({
        title: 'Success',
        description: 'Invoice berhasil dibuat',
      });

      // Redirect to invoice page
      router.push('/cms/invoice');
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: 'Error',
        description: 'Gagal membuat invoice',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-2 sm:p-4 lg:p-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column - Client Info and Services */}
        <div className="col-span-1 xl:col-span-8 space-y-4 sm:space-y-6">
          {/* Client Information */}
          <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-4 lg:p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-3 sm:pb-4 border-b">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Informasi Klien
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-2" ref={searchRef}>
                  <Label htmlFor="nama-klien">Nama Klien</Label>
                  <div className="relative">
                    <Input
                      id="nama-klien"
                      placeholder="Cari pelanggan..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowCustomers(true);
                      }}
                      onFocus={() => setShowCustomers(true)}
                    />
                    {showCustomers && (
                      <div className="absolute w-full z-50 top-[calc(100%+4px)] rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
                        <div className="relative">
                          {isLoading ? (
                            <div className="p-4 text-sm text-center">
                              Memuat...
                            </div>
                          ) : filteredCustomers.length === 0 ? (
                            <div className="p-4 text-sm text-center">
                              Pelanggan tidak ditemukan.
                            </div>
                          ) : (
                            <div className="max-h-[200px] overflow-auto p-1">
                              {filteredCustomers.map((customer) => (
                                <div
                                  key={customer._id?.toString()}
                                  className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                  onClick={() => handleCustomerSelect(customer)}
                                >
                                  <Check className="h-4 w-4 opacity-0" />
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-medium">
                                      {customer.name}
                                    </span>
                                    <div className="text-xs text-muted-foreground truncate max-w-[100px]">
                                      {customer.phone ? (
                                        <span>{customer.phone}</span>
                                      ) : (
                                        <span>{customer.email}</span>
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {customer.dogs?.length > 0 ? (
                                        <span>
                                          {customer.dogs
                                            .slice(0, 3)
                                            .map((dog) => dog.name)
                                            .join(', ')}
                                          {customer.dogs.length > 3
                                            ? '...'
                                            : ''}
                                        </span>
                                      ) : (
                                        <span>Tidak ada anjing</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
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
                <div className="space-y-2" ref={dogsRef}>
                  <Label htmlFor="sub-akun">Sub Akun</Label>
                  <div className="relative">
                    <Input
                      id="sub-akun"
                      value={formData.subAccount}
                      onChange={(e) =>
                        setFormData({ ...formData, subAccount: e.target.value })
                      }
                      placeholder="Masukkan sub akun"
                      onFocus={() => {
                        if (
                          selectedCustomer &&
                          selectedCustomer?.dogs?.length > 1
                        ) {
                          setShowDogs(true);
                        }
                      }}
                    />
                    {showDogs &&
                      selectedCustomer &&
                      selectedCustomer.dogs.length > 0 && (
                        <div className="absolute w-full z-50 top-[calc(100%+4px)] rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
                          <div className="max-h-[200px] overflow-auto p-1">
                            {selectedCustomer.dogs.map((dog) => (
                              <div
                                key={dog._id?.toString()}
                                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                                onClick={() => handleDogSelect(dog.name)}
                              >
                                <Check className="h-4 w-4 opacity-0" />
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-medium">
                                    {dog.name}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Information */}
          <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-4 lg:p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-3 sm:pb-4 border-b">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Informasi Perawatan
                </h2>
              </div>
              <div className="space-y-4">
                {type === 'inpatient' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Tanggal Masuk</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          className="text-sm h-9"
                          value={formData.inpatientDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              inpatientDate: e.target.value,
                            })
                          }
                        />
                        <Input
                          type="time"
                          className="text-sm h-9"
                          value={formData.inpatientTime}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              inpatientTime: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Tanggal Keluar</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="date"
                          className="text-sm h-9"
                          value={formData.dischargeDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dischargeDate: e.target.value,
                            })
                          }
                        />
                        <Input
                          type="time"
                          className="text-sm h-9"
                          value={formData.dischargeTime}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dischargeTime: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-sm">Tanggal Masuk</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        className="text-sm h-9"
                        value={formData.inpatientDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            inpatientDate: e.target.value,
                          })
                        }
                      />
                      <Input
                        type="time"
                        className="text-sm h-9"
                        value={formData.inpatientTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            inpatientTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-4 lg:p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Servis
                </h2>
                <Button
                  onClick={addServiceInput}
                  size="sm"
                  className="h-8 px-2 sm:h-9 sm:px-3"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Tambah Servis</span>
                </Button>
              </div>

              <div className="space-y-4">
                {serviceInputs.map((service, index) => (
                  <div
                    key={index}
                    className="bg-gray-50/50 rounded-lg border p-3 sm:p-4 space-y-3 sm:space-y-4"
                  >
                    <div className="space-y-4">
                      {/* Service Search */}
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

                      {/* Date and Price */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tanggal</Label>
                          <Input
                            type="date"
                            value={service.date}
                            onChange={(e) => {
                              const updatedInputs = [...serviceInputs];
                              updatedInputs[index] = {
                                ...updatedInputs[index],
                                date: e.target.value,
                              };
                              setServiceInputs(updatedInputs);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Harga</Label>
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
                      </div>

                      {/* Remove Button */}
                      <div className="flex justify-end">
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
                ))}

                {/* Added Services List */}
                {formData.services.length > 0 && (
                  <div className="pt-2">
                    {/* Mobile View */}
                    <div className="block lg:hidden space-y-3">
                      {formData.services.map((service, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg border border-gray-100 p-3 sm:p-4 space-y-2 sm:space-y-3"
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
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-600">
                              Tanggal
                            </p>
                            <p>{formatDate(service.date)}</p>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-600">
                              Harga
                            </p>
                            <p>Rp {service.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop View */}
                    <div className="hidden lg:block border rounded-lg overflow-hidden">
                      <ScrollArea className="w-full">
                        <div className="min-w-[600px]">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50/50">
                                <TableHead className="w-[80px] text-xs sm:text-sm">
                                  Servis
                                </TableHead>
                                <TableHead className="w-[120px] text-xs sm:text-sm">
                                  Tanggal
                                </TableHead>
                                <TableHead className="w-[80px] text-xs sm:text-sm">
                                  Harga
                                </TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {formData.services.map((service, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium text-xs sm:text-sm">
                                    {service.name}
                                  </TableCell>
                                  <TableCell className="text-xs sm:text-sm">
                                    {formatDate(service.date)}
                                  </TableCell>
                                  <TableCell className="text-xs sm:text-sm">
                                    Rp {service.price.toLocaleString()}
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      onClick={() => removeService(index)}
                                    >
                                      <Trash2 className="h-3 w-3" />
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
                )}

                {/* Add Services Button */}
                <Button
                  onClick={addServices}
                  className="w-full h-9 text-sm"
                  disabled={
                    !serviceInputs.some(
                      (service) =>
                        service.name &&
                        service.date &&
                        service.price !== undefined &&
                        service.price > 0
                    )
                  }
                >
                  Tambah Semua Servis
                </Button>
              </div>
            </div>
          </div>

          {/* Cart Items Section */}
          <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-4 lg:p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Item Keranjang
                </h2>
                <Button
                  onClick={addCartInput}
                  size="sm"
                  className="h-8 px-2 sm:h-9 sm:px-3"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Tambah Item</span>
                </Button>
              </div>

              <div className="space-y-4">
                {cartInputs.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50/50 rounded-lg border p-3 sm:p-4 space-y-3 sm:space-y-4"
                  >
                    <div className="grid grid-cols-1 gap-4">
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
                        <Input
                          type="date"
                          value={item.date}
                          onChange={(e) => {
                            const updatedInputs = [...cartInputs];
                            updatedInputs[index] = {
                              ...updatedInputs[index],
                              date: e.target.value,
                            };
                            setCartInputs(updatedInputs);
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          type="text"
                          placeholder="Kuantitas"
                          value={item.quantity === 0 ? '' : item.quantity}
                          onChange={(e) => {
                            const updatedInputs = [...cartInputs];
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            const quantity =
                              value === ''
                                ? 0
                                : Math.min(
                                    Number.parseInt(value),
                                    item.maxStock || 1
                                  );
                            updatedInputs[index] = {
                              ...updatedInputs[index],
                              quantity,
                              total:
                                (updatedInputs[index].harga || 0) *
                                (quantity || 1),
                            };
                            setCartInputs(updatedInputs);
                          }}
                          onBlur={(e) => {
                            const updatedInputs = [...cartInputs];
                            if (!e.target.value || e.target.value === '0') {
                              updatedInputs[index] = {
                                ...updatedInputs[index],
                                quantity: 1,
                                total: updatedInputs[index].harga || 0,
                              };
                              setCartInputs(updatedInputs);
                            }
                          }}
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

                {/* Added Cart Items List */}
                {formData.cartItems.length > 0 && (
                  <div className="pt-2">
                    {/* Mobile View */}
                    <div className="block lg:hidden space-y-3">
                      {formData.cartItems.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg border border-gray-100 p-3 sm:p-4 space-y-2 sm:space-y-3"
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
                              <Trash2 className="h-3 w-3" />
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
                            <p>{formatDate(item.date)}</p>
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

                    {/* Desktop View */}
                    <div className="hidden lg:block border rounded-lg overflow-hidden">
                      <ScrollArea className="w-full">
                        <div className="min-w-[600px]">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50/50">
                                <TableHead className="w-[80px] text-xs sm:text-sm">
                                  Kode
                                </TableHead>
                                <TableHead className="w-[120px] text-xs sm:text-sm">
                                  Nama
                                </TableHead>
                                <TableHead className="w-[100px] text-xs sm:text-sm">
                                  Tanggal
                                </TableHead>
                                <TableHead className="w-[100px] text-xs sm:text-sm">
                                  Harga
                                </TableHead>
                                <TableHead className="w-[80px] text-xs sm:text-sm">
                                  Kuantitas
                                </TableHead>
                                <TableHead className="w-[100px] text-xs sm:text-sm">
                                  Total
                                </TableHead>
                                <TableHead className="min-w-[120px] text-xs sm:text-sm">
                                  Catatan
                                </TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {formData.cartItems.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium text-xs sm:text-sm">
                                    {item.kode}
                                  </TableCell>
                                  <TableCell className="text-xs sm:text-sm">
                                    {item.name}
                                  </TableCell>
                                  <TableCell className="text-xs sm:text-sm">
                                    {formatDate(item.date)}
                                  </TableCell>
                                  <TableCell className="text-xs sm:text-sm">
                                    Rp {item.harga.toLocaleString()}
                                  </TableCell>
                                  <TableCell className="text-xs sm:text-sm">
                                    {item.quantity}
                                  </TableCell>
                                  <TableCell className="text-xs sm:text-sm">
                                    Rp {item.total.toLocaleString()}
                                  </TableCell>
                                  <TableCell
                                    className="max-w-[120px] truncate text-xs sm:text-sm"
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
                                      <Trash2 className="h-3 w-3" />
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
                )}

                {/* Add Cart Items Button */}
                <Button
                  onClick={addCartItems}
                  className="w-full h-9 text-sm"
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
                  Tambah Semua Produk
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Financial Info */}
        <div className="col-span-1 xl:col-span-4">
          <div className="sticky top-4 space-y-4">
            {/* Financial Information */}
            <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-4 lg:p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-3 sm:pb-4 border-b">
                  <h2 className="text-base sm:text-lg lg:text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Informasi Keuangan
                  </h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subtotal">Subtotal</Label>
                    <Input
                      id="subtotal"
                      value={formData.subtotal.toLocaleString('id-ID')}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax">Pajak (%)</Label>
                    <Input
                      id="tax"
                      type="text"
                      value={formData.tax || ''}
                      onChange={(e) => handleTaxChange(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total">Total</Label>
                    <Input
                      id="total"
                      value={formData.total.toLocaleString('id-ID')}
                      disabled
                    />
                  </div>
                  {type === 'inpatient' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="deposit">Deposit</Label>
                        <Input
                          id="deposit"
                          value={depositText}
                          onChange={(e) => {
                            const formatted = formatNumber(e.target.value);
                            setDepositText(formatted);
                            const numericValue = Number(
                              e.target.value.replace(/[^0-9]/g, '')
                            );
                            setFormData((prev) => ({
                              ...prev,
                              deposit: numericValue,
                              balance: prev.total - numericValue,
                            }));
                          }}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="balance">Sisa</Label>
                        <Input
                          id="balance"
                          value={formData.balance.toLocaleString('id-ID')}
                          disabled
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Generate Invoice Button */}
            <Button
              onClick={handleSubmit}
              size="lg"
              className="w-full h-10 text-sm"
              disabled={
                loading ||
                formData.total === 0 ||
                !formData.clientName.trim() ||
                !formData.contact.trim()
              }
            >
              {loading ? 'Membuat Invoice...' : 'Buat Invoice'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
