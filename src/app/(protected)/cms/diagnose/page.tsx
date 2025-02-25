"use client";

import { Diagnose } from "@/app/models/diagnose";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
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

  const [diagnoses, setDiagnoses] = useState<Diagnose[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { toast } = useToast();

  const fetchDiagnoses = async () => {
    try {
      const response = await fetch("/api/diagnoses");
      const data = await response.json();
      setDiagnoses(data);
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

  useEffect(() => {
    fetchDiagnoses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="w-full p-5">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <Stethoscope /> Diagnosa
          </h1>
          <div className="flex gap-2">
            <Input type="text" placeholder="Cari kategori..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            <Button>Tambah Diagnosa</Button>
          </div>
        </div>
      </div>
    </>
  );
}
