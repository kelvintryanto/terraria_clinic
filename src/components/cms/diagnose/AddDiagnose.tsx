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
// import { Customer } from "@/app/models/customer";
// import { Dog } from "@/app/models/dog";

export default function AddDiagnose() {
  /**
   * diperlukan state untuk menyimpan state dari input yang dipilih
   * yaitu selectedCustomer dan selectedDog
   * secara default selectedDog kosong, sementara
   * selectedCustomer difetch dari database
   */
  // const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
  //   null
  // );
  // const [selectedDog, setSelectedDog] = useState<Dog | null>(null);

  /**
   * simpan customers yang difetch dari database ke state customers
   * simpan dog yang difetch dari customers ke state dogs
   * nah di sinilah kita memisahkan customers and dogs component
   */
  // const [customers, setCustomers] = useState<Customer[]>([]);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      doctorName: formData.get("doctorName") as string,
      clientName: formData.get("clientName") as string,
      petName: formData.get("petName") as string,
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
              <Label htmlFor="clientName">Nama Client</Label>
              <Input
                id="clientName"
                name="clientName"
                placeholder="Nama Client"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="petName">Nama Pet</Label>
              <Input id="petName" name="petName" placeholder="Nama Pet" />
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
