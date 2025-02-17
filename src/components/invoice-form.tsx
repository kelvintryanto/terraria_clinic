"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card2"
import { Input } from "@/components/ui/input2"
import { Label } from "@/components/ui/label2"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select2"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table2"
import { createPDFTemplate } from "./pdfgenarator"
import type { ServiceItem, CartItem, InvoiceData } from "../../data/types"
import { Trash2, Plus, Minus } from "lucide-react"
import { medications, services } from "../../data/dummy-data"


export default function InvoiceForm() {
  const [formData, setFormData] = useState<InvoiceData>({
    clientName: "",
    contact: "",
    subAccount: "",
    bookingDate: new Date().toISOString().split("T")[0],
    inpatientDate: new Date().toISOString().split("T")[0],
    dischargeDate: "",
    location: "Klinik Hewan Velvet Care Ciangsana",
    total: 0,
    deposit: 0,
    balance: 0,
    status: "Dirawat Inap",
    services: [],
    cartItems: [],
  })

  const [serviceInputs, setServiceInputs] = useState<Partial<ServiceItem>[]>([
    {
      name: "",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
      duration: "",
      price: undefined,
      staff: "",
    },
  ])

  const [cartInputs, setCartInputs] = useState<Partial<CartItem>[]>([
    {
      name: "",
      date: new Date().toISOString().split("T")[0],
      price: undefined,
      quantity: 1,
      total: 0,
      notes: "",
    },
  ])

  const addServiceInput = () => {
    setServiceInputs([
      ...serviceInputs,
      {
        name: "",
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
        duration: "",
        price: undefined,
        staff: "",
      },
    ])
  }

  const removeServiceInput = (index: number) => {
    setServiceInputs(serviceInputs.filter((_, i) => i !== index))
  }

  const addCartInput = () => {
    setCartInputs([
      ...cartInputs,
      {
        name: "",
        date: new Date().toISOString().split("T")[0],
        price: undefined,
        quantity: 1,
        total: 0,
        notes: "",
      },
    ])
  }

  const removeCartInput = (index: number) => {
    setCartInputs(cartInputs.filter((_, i) => i !== index))
  }

  const addServices = () => {
    const newServices = serviceInputs.filter(
      (service) =>
        service.name &&
        service.date &&
        service.time &&
        service.duration &&
        service.price !== undefined &&
        service.price > 0 &&
        service.staff,
    ) as ServiceItem[]

    if (newServices.length > 0) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, ...newServices],
      }))
      setServiceInputs([
        {
          name: "",
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
          duration: "",
          price: undefined,
          staff: "",
        },
      ])
      calculateTotal([...formData.services, ...newServices], formData.cartItems)
    } else {
      alert("Harap isi semua field service sebelum menambahkan.")
    }
  }

  const addCartItems = () => {
    const newItems = cartInputs
      .filter((item) => item.name && item.date && item.price && item.quantity)
      .map((item) => ({
        ...item,
        total: (item.price || 0) * (item.quantity || 0),
      })) as CartItem[]

    if (newItems.length > 0) {
      setFormData((prev) => ({
        ...prev,
        cartItems: [...prev.cartItems, ...newItems],
      }))
      setCartInputs([
        {
          name: "",
          date: new Date().toISOString().split("T")[0],
          price: undefined,
          quantity: 1,
          total: 0,
          notes: "",
        },
      ])
      calculateTotal(formData.services, [...formData.cartItems, ...newItems])
    } else {
      alert("Harap isi semua field item keranjang sebelum menambahkan.")
    }
  }

  const removeService = (index: number) => {
    const updatedServices = formData.services.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      services: updatedServices,
    })
    calculateTotal(updatedServices, formData.cartItems)
  }

  const removeCartItem = (index: number) => {
    const updatedCartItems = formData.cartItems.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      cartItems: updatedCartItems,
    })
    calculateTotal(formData.services, updatedCartItems)
  }

  const calculateTotal = (services: ServiceItem[], cartItems: CartItem[]) => {
    const servicesTotal = services.reduce((sum, service) => sum + (service.price || 0), 0)
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.total || 0), 0)
    const total = servicesTotal + cartTotal
    const balance = total - formData.deposit
    setFormData((prev) => ({ ...prev, total, balance }))
  }

  const generatePDF = () => {
    const pdf = createPDFTemplate(formData)
    pdf.save("invoice.pdf")
  }

  const validateServiceInput = (service: Partial<ServiceItem>) => {
    return (
      service.name &&
      service.date &&
      service.time &&
      service.duration &&
      service.price !== undefined &&
      service.price > 0 &&
      service.staff
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6 bg-yellow-100">
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="bg-pink-300 border-b-4 border-black">
          <CardTitle className="text-4xl font-bold">Formulir Kasus Rawat Inap</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6 bg-blue-200">
          {/* Client Information */}
          <div className="grid gap-4 md:grid-cols-3">
            <div key={0} className="grid gap-2">
              <Label htmlFor="nama-klien" className="text-lg font-bold">
                Nama Klien
              </Label>
              <Input
                id="nama-klien"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="border-2 border-black p-2 bg-white"
              />
            </div>
            <div key={1} className="grid gap-2">
              <Label htmlFor="kontak" className="text-lg font-bold">
                Kontak
              </Label>
              <Input
                id="kontak"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="border-2 border-black p-2 bg-white"
              />
            </div>
            <div key={2} className="grid gap-2">
              <Label htmlFor="sub-akun" className="text-lg font-bold">
                Sub Akun
              </Label>
              <Input
                id="sub-akun"
                value={formData.subAccount}
                onChange={(e) => setFormData({ ...formData, subAccount: e.target.value })}
                className="border-2 border-black p-2 bg-white"
              />
            </div>
          </div>

          {/* Booking Information */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Deposit", type: "number", value: formData.deposit },
              { label: "Total", type: "text", value: `Rp ${formData.total.toLocaleString()}`, disabled: true },
              { label: "Saldo", type: "text", value: `Rp ${formData.balance.toLocaleString()}`, disabled: true },
            ].map((item, index) => (
              <div key={index} className="grid gap-2">
                <Label htmlFor={item.label.toLowerCase()} className="text-lg font-bold">
                  {item.label}
                </Label>
                <Input
                  id={item.label.toLowerCase()}
                  type={item.type}
                  value={item.value || ""}
                  onChange={
                    item.label === "Deposit"
                      ? (e) => {
                          const deposit = e.target.value === "" ? 0 : Number.parseFloat(e.target.value)
                          setFormData((prev) => ({
                            ...prev,
                            deposit,
                            balance: prev.total - deposit,
                          }))
                        }
                      : undefined
                  }
                  disabled={item.disabled}
                  className="border-2 border-black p-2 bg-white"
                />
              </div>
            ))}
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Tambah Servis</h3>
            {serviceInputs.map((service, index) => (
              <div key={index} className="grid gap-4 md:grid-cols-7 items-end bg-green-200 p-4 border-2 border-black">
                <Select
                  value={service.name}
                  onValueChange={(value) => {
                    const selectedService = services.find((s) => s.name === value)
                    const updatedInputs = [...serviceInputs]
                    updatedInputs[index] = {
                      ...updatedInputs[index],
                      name: value,
                      price: selectedService?.basePrice,
                    }
                    setServiceInputs(updatedInputs)
                  }}
                >
                  <SelectTrigger className={`border-2 border-black bg-white ${!service.name ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Pilih servis" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s.id} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={service.date}
                  onChange={(e) => {
                    const updatedInputs = [...serviceInputs]
                    updatedInputs[index] = { ...updatedInputs[index], date: e.target.value }
                    setServiceInputs(updatedInputs)
                  }}
                  className={`border-2 border-black bg-white ${!service.date ? "border-red-500" : ""}`}
                />
                <Input
                  type="time"
                  value={service.time}
                  onChange={(e) => {
                    const updatedInputs = [...serviceInputs]
                    updatedInputs[index] = { ...updatedInputs[index], time: e.target.value }
                    setServiceInputs(updatedInputs)
                  }}
                  className={`border-2 border-black bg-white ${!service.time ? "border-red-500" : ""}`}
                />
                <Input
                  placeholder="Durasi"
                  value={service.duration}
                  onChange={(e) => {
                    const updatedInputs = [...serviceInputs]
                    updatedInputs[index] = { ...updatedInputs[index], duration: e.target.value }
                    setServiceInputs(updatedInputs)
                  }}
                  className={`border-2 border-black bg-white ${!service.duration ? "border-red-500" : ""}`}
                />
                <Input
                  type="number"
                  placeholder="Harga"
                  value={service.price || ""}
                  onChange={(e) => {
                    const updatedInputs = [...serviceInputs]
                    updatedInputs[index] = {
                      ...updatedInputs[index],
                      price: e.target.value === "" ? undefined : Number.parseFloat(e.target.value),
                    }
                    setServiceInputs(updatedInputs)
                  }}
                  className={`border-2 border-black bg-white ${service.price === undefined || service.price <= 0 ? "border-red-500" : ""}`}
                />
                <Input
                  placeholder="Staff"
                  value={service.staff}
                  onChange={(e) => {
                    const updatedInputs = [...serviceInputs]
                    updatedInputs[index] = { ...updatedInputs[index], staff: e.target.value }
                    setServiceInputs(updatedInputs)
                  }}
                  className={`border-2 border-black bg-white ${!service.staff ? "border-red-500" : ""}`}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeServiceInput(index)}
                  className="bg-red-500 hover:bg-red-600 border-2 border-black"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex justify-between">
              <Button
                onClick={addServiceInput}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Input Servis
              </Button>
              <Button
                onClick={addServices}
                className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                  serviceInputs.some((service) => !validateServiceInput(service)) ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={serviceInputs.some((service) => !validateServiceInput(service))}
              >
                Tambah Semua Servis
              </Button>
            </div>

            {formData.services.length > 0 && (
              <Table className="border-2 border-black">
                <TableHeader className="bg-yellow-300">
                  <TableRow>
                    <TableHead className="font-bold">Servis</TableHead>
                    <TableHead className="font-bold">Tanggal</TableHead>
                    <TableHead className="font-bold">Waktu</TableHead>
                    <TableHead className="font-bold">Durasi</TableHead>
                    <TableHead className="font-bold">Harga</TableHead>
                    <TableHead className="font-bold">Staff</TableHead>
                    <TableHead className="font-bold"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.services.map((service, index) => (
                    <TableRow key={index} className="even:bg-blue-100 odd:bg-white">
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{service.date}</TableCell>
                      <TableCell>{service.time}</TableCell>
                      <TableCell>{service.duration}</TableCell>
                      <TableCell>Rp {service.price.toLocaleString()}</TableCell>
                      <TableCell>{service.staff}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeService(index)}
                          className="bg-red-500 hover:bg-red-600 border-2 border-black"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Cart Items */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Tambah Item Keranjang</h3>
            {cartInputs.map((item, index) => (
              <div key={index} className="grid gap-4 md:grid-cols-6 items-end bg-orange-200 p-4 border-2 border-black">
                <Select
                  value={item.name}
                  onValueChange={(value) => {
                    const selectedMed = medications.find((m) => m.name === value)
                    const updatedInputs = [...cartInputs]
                    updatedInputs[index] = {
                      ...updatedInputs[index],
                      name: value,
                      price: selectedMed?.basePrice,
                    }
                    setCartInputs(updatedInputs)
                  }}
                >
                  <SelectTrigger className="border-2 border-black bg-white">
                    <SelectValue placeholder="Pilih item" />
                  </SelectTrigger>
                  <SelectContent>
                    {medications.map((med) => (
                      <SelectItem key={med.id} value={med.name}>
                        {med.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={item.date}
                  onChange={(e) => {
                    const updatedInputs = [...cartInputs]
                    updatedInputs[index] = { ...updatedInputs[index], date: e.target.value }
                    setCartInputs(updatedInputs)
                  }}
                  className="border-2 border-black bg-white"
                />
                <Input
                  type="number"
                  placeholder="Harga"
                  value={item.price || ""}
                  onChange={(e) => {
                    const updatedInputs = [...cartInputs]
                    updatedInputs[index] = {
                      ...updatedInputs[index],
                      price: e.target.value === "" ? undefined : Number.parseFloat(e.target.value),
                    }
                    setCartInputs(updatedInputs)
                  }}
                  className="border-2 border-black bg-white"
                />
                <Input
                  type="number"
                  placeholder="Kuantitas"
                  value={item.quantity || ""}
                  onChange={(e) => {
                    const updatedInputs = [...cartInputs]
                    updatedInputs[index] = {
                      ...updatedInputs[index],
                      quantity: e.target.value === "" ? 1 : Number.parseInt(e.target.value),
                    }
                    setCartInputs(updatedInputs)
                  }}
                  className="border-2 border-black bg-white"
                />
                <Input
                  placeholder="Catatan"
                  value={item.notes}
                  onChange={(e) => {
                    const updatedInputs = [...cartInputs]
                    updatedInputs[index] = { ...updatedInputs[index], notes: e.target.value }
                    setCartInputs(updatedInputs)
                  }}
                  className="border-2 border-black bg-white"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeCartInput(index)}
                  className="bg-red-500 hover:bg-red-600 border-2 border-black"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex justify-between">
              <Button
                onClick={addCartInput}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Input Item
              </Button>
              <Button
                onClick={addCartItems}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Tambah Semua Item
              </Button>
            </div>

            {formData.cartItems.length > 0 && (
              <Table className="border-2 border-black">
                <TableHeader className="bg-yellow-300">
                  <TableRow>
                    <TableHead className="font-bold">Nama</TableHead>
                    <TableHead className="font-bold">Tanggal</TableHead>
                    <TableHead className="font-bold">Harga</TableHead>
                    <TableHead className="font-bold">Kuantitas</TableHead>
                    <TableHead className="font-bold">Total</TableHead>
                    <TableHead className="font-bold">Catatan</TableHead>
                    <TableHead className="font-bold"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.cartItems.map((item, index) => (
                    <TableRow key={index} className="even:bg-blue-100 odd:bg-white">
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>Rp {item.price.toLocaleString()}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>Rp {item.total.toLocaleString()}</TableCell>
                      <TableCell>{item.notes}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeCartItem(index)}
                          className="bg-red-500 hover:bg-red-600 border-2 border-black"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Generate PDF Button */}
          <Button
            onClick={generatePDF}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            Generate PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

