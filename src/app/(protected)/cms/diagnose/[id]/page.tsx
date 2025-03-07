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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  ClipboardCheck,
  Clock,
  Edit,
  FileText,
  HeartPulse,
  MessageCircle,
  PawPrint,
  Stethoscope,
  Timer,
  Trash2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function DiagnoseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [diagnose, setDiagnose] = useState<Diagnose | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const router = useRouter();
  const { id } = use(params);

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

  useEffect(() => {
    const fetchDiagnose = async () => {
      try {
        const response = await fetch(`/api/diagnoses/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch diagnose");
        }
        const data = await response.json();
        setDiagnose(data);
      } catch (error) {
        console.error("Error fetching diagnose:", error);
        toast({
          title: "Error",
          description: "Failed to fetch diagnose details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnose();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/diagnoses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete diagnose");
      }

      toast({
        title: "Success",
        description: "Diagnose deleted successfully",
      });

      router.push("/cms/diagnose");
    } catch (error) {
      console.error("Error deleting diagnose:", error);
      toast({
        title: "Error",
        description: "Failed to delete diagnose",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!diagnose) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Diagnosa tidak ditemukan</h1>
        <Button onClick={() => router.push("/cms/diagnose")}>
          Kembali ke Daftar Diagnosa
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/cms/diagnose")}
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg sm:text-2xl font-bold">Detail Diagnosa</h1>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {canEditDiagnose(userRole) && (
            <Button
              variant="outline"
              onClick={() => router.push(`/cms/diagnose/${id}/edit`)}
              className="flex-1 sm:flex-initial text-xs sm:text-sm"
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Edit
            </Button>
          )}
          {canDeleteDiagnose(userRole) && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex-1 sm:flex-initial text-xs sm:text-sm"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Hapus
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Diagnosa akan dihapus
                    secara permanen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Hapus
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Doctor and Patient Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Informasi Dokter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {diagnose.doctorName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Dokter Penanggung Jawab
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="h-5 w-5" />
                Informasi Pasien
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {diagnose.clientSnapShot.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">Pemilik Pet</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <PawPrint className="h-8 w-8 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {diagnose.dogSnapShot.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">Nama Pet</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Diagnosis Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row ">
            {/* Keluhan */}
            <Card className="md:flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Keluhan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {diagnose.symptom ?? "Tidak ada keluhan"}
                </div>
              </CardContent>
            </Card>

            {/* Hasil Pemeriksaan */}
            <Card className="md:flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  Hasil Pemeriksaan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">{diagnose.description}</div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Timeline Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Created</h3>
                  <time className="text-sm text-muted-foreground">
                    {new Date(diagnose.createdAt).toLocaleString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Timer className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Last Updated</h3>
                  <time className="text-sm text-muted-foreground">
                    {new Date(diagnose.updatedAt).toLocaleString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
