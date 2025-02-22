"use client";

import { Category } from "@/app/models/category";
import { AlertDialog, AlertDialogHeader, AlertDialogFooter, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableSkeleton } from "@/components/ui/skeleton-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

import { Layers2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function CategoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategory, setfilteredCategory] = useState<Category[]>([]);

  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [categoryIdToUpdate, setCategoryIdToUpdate] = useState<string | null>(null);
  const [categoryToUpdate, setCategoryToUpdate] = useState<string | null>(null);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setfilteredCategory(data);
    } catch {
      toast({
        title: "Error",
        description: "Gagal mengambil data kategori",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete product");

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      fetchCategories();
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  if (loading) return <TableSkeleton />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    console.log("masuk handle Submit");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("kategori") as string;

    try {
      const response = await fetch(`/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Failed to create category");

      toast({
        title: "Berhasil",
        description: "Kategori berhasil ditambahkan",
      });

      fetchCategories();
      setCreateDialogOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Gagal menambahkan produk",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("masuk handle Update");

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("kategori") as string;

    console.log("name", name);
    try {
      const response = await fetch(`/api/categories/${categoryIdToUpdate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("Failed to update category");
      toast({
        title: "Berhasil",
        description: "Kategori berhasil diubah",
      });
      fetchCategories();
      setCreateDialogOpen(false);
      setCategoryIdToUpdate(null);
      setCategoryToUpdate(null);
    } catch {
      toast({
        title: "Error",
        description: "Gagal mengubah kategori",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* delete dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan. Produk akan dihapus secara permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => categoryToDelete && handleDelete(categoryToDelete)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* create and update dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Kategori</DialogTitle>
            <DialogDescription>Klik simpan jika telah selesai.</DialogDescription>
          </DialogHeader>
          <form onSubmit={categoryIdToUpdate ? handleUpdate : handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="kategori" className="text-right">
                  Kategori
                </Label>
                <Input id="kategori" defaultValue={categoryToUpdate ?? ""} placeholder="Nama Kategori" className="col-span-3" name="kategori" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{categoryIdToUpdate ? "Ubah" : "Simpan"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="w-full p-3 sm:p-5">
        <div className="mb-4 sm:mb-6 items-start md:w-2/3">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-3">
            <Layers2 /> Kategori
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-64">
              <Input type="text" placeholder="Cari kategori..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="w-full sm:w-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCreateDialogOpen(true);
                  }}>
                  Tambah Kategori
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        {/* Table */}
        <div className="md:w-2/3">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-auto">No</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategory.map((category, index) => (
                <TableRow key={category._id.toString()}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCategoryIdToUpdate(category._id?.toString() || "");
                          setCategoryToUpdate(category.name ?? "");
                          setCreateDialogOpen(true);
                        }}>
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCategoryToDelete(category._id?.toString() || "");
                              setDeleteDialogOpen(true);
                            }}>
                            Hapus
                          </Button>
                        </AlertDialogTrigger>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
