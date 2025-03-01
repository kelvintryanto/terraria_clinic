"use client";

import { Diagnose } from "@/app/models/diagnose";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DiagnoseTable({
  filteredDiagnoses,
  onDiagnoseUpdated,
}: {
  filteredDiagnoses: Diagnose[];
  onDiagnoseUpdated: () => void;
}) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [diagnoseToDelete, setDiagnoseToDelete] = useState<{
    id: string;
    number: string;
  } | null>(null);

  const handleDiagnoseClick = (diagnoseId: string) => {
    router.push(`/cms/diagnose/${diagnoseId}`);
  };

  const handleEdit = (diagnoseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/cms/diagnose/${diagnoseId}/edit`);
  };

  const handleDelete = async (diagnoseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const diagnose = filteredDiagnoses.find(
      (d) => d._id.toString() === diagnoseId
    );
    if (diagnose) {
      setDiagnoseToDelete({ id: diagnoseId, number: diagnose.dxNumber });
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!diagnoseToDelete) return;

    try {
      const response = await fetch(`/api/diagnoses/${diagnoseToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete diagnose");
      }

      toast({
        title: "Success",
        description: "Diagnose deleted successfully",
      });

      // Refresh the page to update the table
      onDiagnoseUpdated();
    } catch (error) {
      console.error("Error deleting diagnose:", error);
      toast({
        title: "Error",
        description: "Failed to delete diagnose",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDiagnoseToDelete(null);
    }
  };

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus diagnosa {diagnoseToDelete?.number}{" "}
              secara permanen dan tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDiagnoses.map((diagnose, index) => (
              <TableRow
                key={diagnose._id.toString()}
                className="hover:cursor-pointer"
                onClick={() => handleDiagnoseClick(diagnose._id.toString())}
              >
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>{diagnose.dxNumber}</TableCell>
                <TableCell>
                  {new Date(diagnose.dxDate).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell>{diagnose.doctorName}</TableCell>
                <TableCell>{diagnose.clientName}</TableCell>
                <TableCell>{diagnose.petName}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {diagnose.description}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleEdit(diagnose._id.toString(), e)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => handleDelete(diagnose._id.toString(), e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
