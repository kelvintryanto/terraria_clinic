"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { useToast } from "@/hooks/use-toast";
import CustomerSearchInput from "../customer/CustomerSearch";
import { Customer } from "@/app/models/customer";
import DogSearchInput from "../customer/DogSearch";
import { Dog } from "@/app/models/dog";

export default function AddDiagnose({
  onDiagnoseAdded,
}: {
  onDiagnoseAdded: () => void;
}) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      doctorName: formData.get("doctorName") as string,
      clientId: selectedCustomer?._id,
      clientName: selectedCustomer?.name as string,
      petId: selectedDog?._id,
      petName: selectedDog?.name as string,
      symptom: formData.get("symptom") as string,
      description: formData.get("description") as string,
    };

    try {
      const response = await fetch("/api/diagnoses", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error("Failed to create diagnose");
      }
      toast({
        title: "Berhasil",
        description: "Diagnosa berhasil ditambahkan",
      });

      setCreateDialogOpen(false);
      onDiagnoseAdded();
    } catch {
      toast({
        title: "Error",
        description: "Gagal menambahkan diagnosa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDogs(customer.dogs ?? []);
    setSelectedDog(null);
  };

  const handleSelectDog = (dog: Dog) => {
    setSelectedDog(dog);
  };

  return (
    <>
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Diagnosa</DialogTitle>
            <DialogDescription>Tambah Diagnosa Baru</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="doctorName">Nama Dokter</Label>
              <Input
                id="doctorName"
                name="doctorName"
                placeholder="Nama Dokter"
              />
            </div>
            <div className="grid gap-2">
              {/* di sini coba untuk menggunakan CustomerSearch */}
              <CustomerSearchInput onSelect={handleSelectCustomer} />
            </div>
            <div className="grid gap-2">
              <DogSearchInput Dogs={dogs} onSelect={handleSelectDog} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="symptom">Keluhan</Label>
              <Textarea
                id="symptom"
                name="symptom"
                rows={3}
                placeholder="Gejala atau keluhan sebelum pemeriksaan"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Hasil Pemeriksaan</Label>
              <Textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Hasil Pemeriksaan"
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                Tambah
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Button untuk trigger dialog terbuka */}
      <Button
        onClick={() => {
          setCreateDialogOpen(true);
        }}
      >
        Tambah Diagnosa
      </Button>
    </>
  );
}
