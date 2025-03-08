'use client';

import OwnerProfileLoading from '@/components/loading/OwnerProfileLoading';
import { ChangePasswordDialog } from '@/components/profile/ChangePasswordDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function OwnerProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
  } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/users/me');
        const data = await response.json();
        if (!response.ok) {
          throw new Error('Gagal memuat data pengguna');
        }
        setUser(data.user);
        setUserData({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          address: data.user.address,
        });
      } catch (error) {
        console.error('Failed to fetch user:', error);
        toast({
          title: 'Error',
          description: 'Gagal memuat data pengguna',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [toast]);

  const handleDeleteAccount = async () => {
    if (!user?.id) return;

    try {
      setIsDeleting(true);

      // Delete the customer account
      const response = await fetch(`/api/customers/${user.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus akun');
      }

      // Logout the user
      await fetch('/api/users/logout', {
        method: 'POST',
      });

      toast({
        title: 'Berhasil',
        description: 'Akun Anda telah berhasil dihapus',
      });

      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus akun',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return <OwnerProfileLoading />;
  }

  return (
    <>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="w-[calc(100%-1rem)] p-3 sm:p-6 max-h-[90vh] overflow-y-auto bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md border border-violet-500/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg text-white">
              Hapus Akun
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-white/70">
              Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat
              dibatalkan. Semua data Anda, termasuk informasi hewan peliharaan,
              akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-2 sm:mt-0">
            <AlertDialogCancel className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9 bg-white/10 border-white/20 text-white hover:bg-white/20">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9 bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500 text-white border-0"
            >
              {isDeleting ? 'Menghapus...' : 'Hapus Akun'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-full"
      >
        <div className="h-full p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-white truncate">
              Profil Pemilik
            </h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
              <div className="w-full sm:w-auto">
                <ChangePasswordDialog />
              </div>
              <Link href="/owner" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="gap-2 w-full text-xs h-8 sm:h-9 whitespace-nowrap"
                >
                  <Edit size={14} className="sm:w-4 sm:h-4" />
                  Edit Profil
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-lg sm:rounded-xl p-3 sm:p-4 border border-violet-500/10">
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-orange-300/80 text-xs sm:text-sm">
                    Nama Lengkap
                  </h3>
                  <p className="text-white text-sm sm:text-base truncate">
                    {userData?.name}
                  </p>
                </div>
                <div>
                  <h3 className="text-orange-300/80 text-xs sm:text-sm">
                    Email
                  </h3>
                  <p className="text-white text-sm sm:text-base truncate">
                    {userData?.email}
                  </p>
                </div>
                <div>
                  <h3 className="text-orange-300/80 text-xs sm:text-sm">
                    Telepon
                  </h3>
                  <p className="text-white text-sm sm:text-base truncate">
                    {userData?.phone || 'Belum diisi'}
                  </p>
                </div>
                <div>
                  <h3 className="text-orange-300/80 text-xs sm:text-sm">
                    Alamat
                  </h3>
                  <p className="text-white text-sm sm:text-base break-words">
                    {userData?.address || 'Belum diisi'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-3 sm:mt-4">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-2 text-xs h-8 sm:h-9"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Hapus Akun
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
