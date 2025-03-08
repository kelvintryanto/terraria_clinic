"use client";

import { Diagnose } from "@/app/models/diagnose";
import { canDeleteDiagnose, canEditDiagnose } from "@/app/utils/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
import { Edit, FileDown, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateDiagnosePDFTemplate } from "./diagnosePdfGenerator";

export default function DiagnoseTable({
  filteredDiagnoses,
  onDiagnoseUpdated,
}: {
  filteredDiagnoses: Diagnose[];
  onDiagnoseUpdated: () => void;
}) {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/users/me");
        const data = await response.json();
        if (data.user) {
          setUserRole(data.user.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };
    fetchUserRole();
  }, []);

  const handleDiagnoseClick = (diagnoseId: string) => {
    router.push(`/cms/diagnose/${diagnoseId}`);
  };

  const handleEdit = (diagnoseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/cms/diagnose/${diagnoseId}/edit`);
  };

  const handleDelete = async (diagnoseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/diagnoses/${diagnoseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete diagnose");
      }

      toast({
        title: "Success",
        description: "Diagnose deleted successfully",
      });

      onDiagnoseUpdated();
    } catch (error) {
      console.error("Error deleting diagnose:", error);
      toast({
        title: "Error",
        description: "Failed to delete diagnose",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/diagnoses/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch diagnose data");
      }

      const diagnoseData = await response.json();
      const pdf = await CreateDiagnosePDFTemplate(diagnoseData);
      pdf.save(`${diagnoseData.dxNumber}.pdf`);

      toast({
        title: "Success",
        description: "PDF berhasil diunduh",
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast({
        title: "Error",
        description: "Gagal mengunduh PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Diagnose No</TableHead>
            <TableHead>Client Name</TableHead>
            <TableHead>Pet Name</TableHead>
            <TableHead>Doctor Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDiagnoses.map((diagnose) => {
            if (!diagnose._id) return null;
            return (
              <TableRow
                key={diagnose._id.toString()}
                onClick={() => handleDiagnoseClick(diagnose._id.toString())}
                className="cursor-pointer"
              >
                <TableCell>{diagnose.dxNumber}</TableCell>
                <TableCell>{diagnose.clientSnapShot?.name}</TableCell>
                <TableCell>{diagnose.dogSnapShot?.name}</TableCell>
                <TableCell>{diagnose.doctorName}</TableCell>
                <TableCell>
                  {new Date(diagnose.dxDate).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    {canEditDiagnose(userRole) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleEdit(diagnose._id.toString(), e)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {canDeleteDiagnose(userRole) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                          onClick={(e) => e.stopPropagation()}
                        >
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Apakah anda yakin?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini tidak dapat dibatalkan. Diagnosa akan
                              dihapus secara permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(diagnose._id.toString(), e);
                              }}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    {/* Button Download PDF */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) =>
                        handleDownload(diagnose._id.toString(), e)
                      }
                    >
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
