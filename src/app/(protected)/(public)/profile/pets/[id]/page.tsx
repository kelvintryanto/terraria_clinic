'use client';

import { Breed } from '@/app/models/breed';
import { Dog } from '@/app/models/dog';
import { formatDogAge } from '@/app/utils/format';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PetDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dog, setDog] = useState<Dog | null>(null);
  const [breeds, setBreeds] = useState<Breed[]>([]);

  // Fetch the dog data
  useEffect(() => {
    const fetchDogData = async () => {
      try {
        setLoading(true);

        // Get current user data
        const userResponse = await fetch('/api/users/me');
        const userData = await userResponse.json();

        if (!userData.user || !userData.user.id) {
          throw new Error('Pengguna tidak ditemukan');
        }

        // Get customer data that contains dogs
        const customerResponse = await fetch(
          `/api/customers/${userData.user.id}`
        );
        if (!customerResponse.ok) {
          throw new Error('Gagal mengambil data pelanggan');
        }

        const customerData = await customerResponse.json();

        // Find the specific dog by ID
        const foundDog = customerData.dogs?.find(
          (d: Dog) => d._id.toString() === id
        );
        if (!foundDog) {
          throw new Error('Anjing tidak ditemukan');
        }

        setDog(foundDog);

        // Fetch breeds for displaying breed name
        const breedsResponse = await fetch('/api/breeds');
        const breedsData = await breedsResponse.json();
        setBreeds(breedsData);
      } catch (err) {
        console.error('Error fetching dog data:', err);
        setError(
          err instanceof Error ? err.message : 'Gagal memuat data anjing'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDogData();
  }, [id]);

  // Helper to get breed name
  const getBreedName = () => {
    if (!dog) return '';
    return (
      dog.customBreed ||
      breeds.find((b) => b._id.toString() === dog.breedId?.toString())?.name ||
      'Ras Tidak Diketahui'
    );
  };

  if (loading) {
    return (
      <div className="w-full space-y-8">
        <div className="flex justify-between items-center">
          <Button variant="ghost" className="gap-2" disabled>
            <ArrowLeft size={16} />
            Kembali
          </Button>
          <Button variant="outline" className="gap-2" disabled>
            <Edit size={16} />
            Edit Anjing
          </Button>
        </div>

        <div className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-xl p-6 border border-violet-500/10 animate-pulse">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Skeleton className="w-24 sm:w-32 h-24 sm:h-32 rounded-xl" />
            <div className="flex-1 space-y-6 w-full">
              <div>
                <Skeleton className="h-8 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dog) {
    return (
      <div className="w-full space-y-8">
        <Link href="/profile/pets" className="block">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft size={16} />
            Kembali ke Daftar Anjing
          </Button>
        </Link>

        <div className="bg-red-900/20 backdrop-blur-md rounded-xl p-6 border border-red-500/10 text-center">
          <p className="text-red-200">{error || 'Anjing tidak ditemukan'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-center">
        <Link href="/profile/pets" className="text-white hover:text-orange-400">
          <Button
            type="button"
            variant="ghost"
            className="gap-2"
            aria-label="Kembali ke daftar anjing"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Kembali
          </Button>
        </Link>
        <Link href={`/profile/pets/edit/${id}`}>
          <Button type="button" variant="outline" className="gap-2">
            <Edit size={16} aria-hidden="true" />
            Edit Anjing
          </Button>
        </Link>
      </div>

      <div className="bg-gradient-to-br from-violet-900/40 via-purple-900/30 to-violet-800/20 backdrop-blur-md rounded-xl p-6 border border-violet-500/10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar className="w-24 sm:w-32 h-24 sm:h-32 rounded-xl border-2 border-white/20">
            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-xl sm:text-2xl font-bold text-white">
              {dog.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white">{dog.name}</h2>
              <p className="text-orange-300/80">
                {getBreedName()} • {formatDogAge(dog.birthYear, dog.birthMonth)}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-violet-900/30 rounded-lg p-3 border border-violet-500/10">
                <p className="text-orange-300/90 text-sm">Berat</p>
                <p className="text-white font-medium">{dog.weight} kg</p>
              </div>
              <div className="bg-violet-900/30 rounded-lg p-3 border border-violet-500/10">
                <p className="text-orange-300/90 text-sm">Tanggal Lahir</p>
                <p className="text-white font-medium">
                  {new Date(0, parseInt(dog.birthMonth) - 1).toLocaleString(
                    'id-ID',
                    { month: 'long' }
                  )}
                  /{dog.birthYear}
                </p>
              </div>
              <div className="bg-violet-900/30 rounded-lg p-3 border border-violet-500/10">
                <p className="text-orange-300/90 text-sm">Jenis Kelamin</p>
                <p className="text-white font-medium">
                  {dog.sex === 'male' ? 'Jantan' : 'Betina'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            Riwayat Medis
          </h3>
          <div className="space-y-4">
            <div className="bg-violet-900/30 rounded-lg p-4 border border-violet-500/10">
              <div className="flex justify-between">
                <p className="text-orange-300/90">Vaksin Terakhir</p>
                <p className="text-white/70">
                  {dog.lastVaccineDate
                    ? new Date(dog.lastVaccineDate).toLocaleDateString('id-ID')
                    : 'Belum ada'}
                </p>
              </div>
            </div>
            <div className="bg-violet-900/30 rounded-lg p-4 border border-violet-500/10">
              <div className="flex justify-between">
                <p className="text-orange-300/90">Obat Cacing Terakhir</p>
                <p className="text-white/70">
                  {dog.lastDewormDate
                    ? new Date(dog.lastDewormDate).toLocaleDateString('id-ID')
                    : 'Belum ada'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
