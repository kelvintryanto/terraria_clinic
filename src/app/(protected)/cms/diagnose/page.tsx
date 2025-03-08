"use client";

import { Diagnose } from "@/app/models/diagnose";
import AddDiagnose from "@/components/cms/diagnose/AddDiagnose";
import DiagnoseTable from "@/components/cms/diagnose/DiagnoseTable";
import { Input } from "@/components/ui/input";

import { TableSkeleton } from "@/components/ui/skeleton-table";

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
  const [filteredDiagnoses, setFilteredDiagnoses] = useState<Diagnose[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnose[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { toast } = useToast();

  const refreshPage = () => {
    fetchDiagnoses();
  };

  const fetchDiagnoses = async () => {
    try {
      const response = await fetch("/api/diagnoses");
      const data = await response.json();
      setDiagnoses(data);
      setFilteredDiagnoses(data);
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

  // Filter diagnoses when search query changes
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setFilteredDiagnoses(diagnoses);
      return;
    }

    const searchLower = debouncedSearch.toLowerCase();
    const filtered = diagnoses.filter(
      (diagnose) =>
        diagnose.doctorName.toLowerCase().includes(searchLower) ||
        diagnose.clientSnapShot.name.toLowerCase().includes(searchLower) ||
        diagnose.dogSnapShot.name.toLowerCase().includes(searchLower) ||
        diagnose.description.toLowerCase().includes(searchLower)
    );
    setFilteredDiagnoses(filtered);
  }, [debouncedSearch, diagnoses]);

  useEffect(() => {
    fetchDiagnoses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <TableSkeleton />;

  return (
    <>
      <div className="w-full">
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

            <AddDiagnose onDiagnoseAdded={refreshPage} />
          </div>
        </div>

        {/* Table View */}
        <DiagnoseTable
          filteredDiagnoses={filteredDiagnoses}
          onDiagnoseUpdated={refreshPage}
        />
      </div>
    </>
  );
}
