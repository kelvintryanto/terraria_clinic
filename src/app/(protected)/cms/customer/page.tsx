"use client";

import { Customer } from "@/app/models/customer";
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
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/skeleton-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { BookUser, Edit, Mail, MapPin, Phone, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

const CustomerPage = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [customerToDelete, setCustomerToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { toast } = useToast();

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
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers", {
          credentials: "include",
        });
        const data = await response.json();
        setCustomers(data);
        setFilteredCustomers(data);
      } catch {
        toast({
          title: "Error",
          description: "Gagal mengambil data pelanggan",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [toast]);

  // Filter customers when search query changes
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    const searchLower = debouncedSearch.toLowerCase();
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchLower) ||
        customer.email.toLowerCase().includes(searchLower) ||
        customer.phone.includes(searchLower) ||
        customer.address.toLowerCase().includes(searchLower)
    );
    setFilteredCustomers(filtered);
  }, [debouncedSearch, customers]);

  useEffect(() => {
    // Check for success message in URL
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    if (success === "created") {
      toast({
        title: "Berhasil!",
        description: "Pelanggan berhasil ditambahkan.",
        duration: 2000,
      });
      // Clean up the URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [toast]);

  const handleCustomerClick = (customerId: string) => {
    router.push(`/cms/customer/${customerId}`);
  };

  const handleEdit = (customerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/cms/customer/${customerId}`);
  };

  const handleDelete = async (customerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const customer = customers.find((c) => c._id.toString() === customerId);
    if (customer) {
      setCustomerToDelete({ id: customerId, name: customer.name });
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;

    try {
      const response = await fetch(`/api/customers/${customerToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      toast({
        title: "Berhasil",
        description: "Pelanggan berhasil dihapus",
      });

      // Remove the deleted customer from the state
      setCustomers(
        customers.filter((c) => c._id.toString() !== customerToDelete.id)
      );
      setFilteredCustomers(
        filteredCustomers.filter(
          (c) => c._id.toString() !== customerToDelete.id
        )
      );
    } catch {
      toast({
        title: "Error",
        description: "Gagal menghapus pelanggan",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  if (loading) return <TableSkeleton />;

  return (
    <div className="container mx-auto py-10">
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data pelanggan{" "}
              {customerToDelete?.name} akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel onClick={() => setCustomerToDelete(null)}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="w-full p-4 sm:p-5">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-3">
            <BookUser /> Pelanggan
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-64">
              <Input
                type="text"
                placeholder="Cari pelanggan..."
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
            <Button asChild className="w-full sm:w-auto">
              <Link href="/cms/customer/add">Tambah Pelanggan</Link>
            </Button>
          </div>
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead>Nama Pelanggan</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Nomor Telepon</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer, index) => (
                <TableRow
                  key={customer._id.toString()}
                  className="hover:cursor-pointer"
                  onClick={() => handleCustomerClick(customer._id.toString())}
                >
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleEdit(customer._id.toString(), e)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {userRole !== "admin" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={(e) =>
                            handleDelete(customer._id.toString(), e)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View - Cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredCustomers.map((customer) => (
            <Card
              key={customer._id.toString()}
              className="hover:bg-accent cursor-pointer transition-colors"
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate">{customer.name}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(customer._id.toString(), e);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {userRole !== "admin" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(customer._id.toString(), e);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{customer.address}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
