"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Diagnose } from "@/app/models/diagnose";

export default function DiagnoseTable({
  filteredDiagnoses,
}: {
  filteredDiagnoses: Diagnose[];
}) {
  const router = useRouter();
  const handleDiagnoseClick = (diagnoseId: string) => {
    router.push(`/cms/diagnose/${diagnoseId}`);
  };

  const handleEdit = (diagnoseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/cms/diagnose/${diagnoseId}`);
  };

  const handleDelete = async (diagnoseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const diagnose = filteredDiagnoses.find(
      (d) => d._id.toString() === diagnoseId
    );
    if (diagnose) {
      // setDiagnoseToDelete({ id: diagnoseId, name: diagnose.name });
      // setIsDeleteDialogOpen(true);
    }
  };

  return (
    <>
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
                <TableCell>{diagnose.dxDate}</TableCell>
                <TableCell>{diagnose.doctorName}</TableCell>
                <TableCell>{diagnose.clientName}</TableCell>
                <TableCell>{diagnose.petName}</TableCell>
                <TableCell>{diagnose.description}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleEdit(diagnose._id.toString(), e)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {/* {userRole !== "admin" && ( */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => handleDelete(diagnose._id.toString(), e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {/* )} */}
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
