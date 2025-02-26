"use client";

import { Diagnose } from "@/app/models/diagnose";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { TableSkeleton } from "@/components/ui/skeleton-table";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { set } from "lodash";
import { Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function DiagnosePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [diagnoseIdToUpdate, setDiagnoseIdToUpdate] = useState<string | null>(
    null
  );
  const [diagnoseToUpdate, setDiagnoseToUpdate] = useState<string | null>(null);
  const [filteredDiagnoses, setFilteredDiagnoses] = useState<Diagnose[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnose[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { toast } = useToast();

  const fetchDiagnoses = async () => {
    try {
      const response = await fetch("/api/diagnoses");
      const data = await response.json();
      setDiagnoses(data);
      setFilteredDiagnoses(
        data.filter((diagnose: Diagnose) =>
          diagnose.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } catch {
      toast({
        title: "Error",
        description: "Gagal mengambil data diagnosa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const body = {
      nomorDiagnosa: formData.get("nomorDiagnosa") as string,
      tanggalDiagnosa: formData.get("tanggalDiagnosa") as string,
      namaDokter: formData.get("namaDokter") as string,
      namaClient: formData.get("namaClient") as string,
      namaPet: formData.get("namaPet") as string,
      hasilPemeriksaan: formData.get("hasilPemeriksaan") as string,
    };

    try {
      const response = await fetch("/api/diagnose", {
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

  useEffect(() => {
    fetchDiagnoses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // untuk membuat tanggal diagnosa
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // untuk membuat nomor diagnosa
  function generateDiagnosisNumber(counter = 1) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const serial = String(counter).padStart(2, "0"); // Urutan dengan 2 digit (01-99)

    return `DX/${year}/${month}/${day}/${serial}`;
  }

  if (loading) return <TableSkeleton />;

  return (
    <>
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {diagnoseIdToUpdate ? "Edit Diagnosa" : "Tambah Diagnosa"}
            </DialogTitle>
            <DialogDescription>
              {diagnoseIdToUpdate
                ? "Edit diagnosa yang sudah ada"
                : "Tambah diagnosa baru"}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={
              // diagnoseIdToUpdate ?
              // handleUpdate :
              handleSubmit
            }
            className="grid gap-4 py-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="kategori">Nomor Diagnosa</Label>
              <Input
                id="nomorDiagnosa"
                name="nomorDiagnosa"
                defaultValue={generateDiagnosisNumber()}
                placeholder="Nomor Diagnosa"
                disabled
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="kategori">Tanggal dan Waktu Diagnosa</Label>
              <Input
                id="waktuDiagnosa"
                name="waktuDiagnosa"
                type="datetime-local"
                defaultValue={getCurrentDateTime()}
                placeholder="Tanggal dan Waktu Diagnosa"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="kategori">Nama Dokter</Label>
              <Input
                id="namaDokter"
                name="namaDokter"
                placeholder="Nama Dokter"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="kategori">Nama Client</Label>
              <Input
                id="namaClient"
                name="namaClient"
                placeholder="Nama Client"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="kategori">Nama Pet</Label>
              <Input id="namaPet" name="namaPet" placeholder="Nama Pet" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="kategori">Hasil Pemeriksaan</Label>
              <Textarea
                id="hasilPemeriksaan"
                name="hasilPemeriksaan"
                rows={5}
                placeholder="Hasil Pemeriksaan"
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {diagnoseIdToUpdate ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="w-full p-5">
        <div className="mb-6 flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Stethoscope /> Diagnosa
          </h1>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-fit">
            <div className="relative w-full sm:w-64">
              <Input
                type="text"
                placeholder="Cari kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <svg
                className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <Button
              onClick={() => {
                setDiagnoseIdToUpdate(null);
                setDiagnoseToUpdate(null);
                setCreateDialogOpen(true);
              }}
            >
              Tambah Diagnosa
            </Button>
          </div>
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead>Nomor Diagnosa</TableHead>
                <TableHead>Tanggal Diagnosa</TableHead>
                <TableHead>Nama Dokter</TableHead>
                <TableHead>Nama Client</TableHead>
                <TableHead>Nama Pet</TableHead>
                <TableHead>Hasil Pemeriksaan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody></TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
