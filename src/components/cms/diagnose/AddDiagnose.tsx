'use client';

import { Breed } from '@/app/models/breed';
import { Customer } from '@/app/models/customer';
import { Dog } from '@/app/models/dog';
import { formatDogAge } from '@/app/utils/format';
import { ClientSnapShotData, DogSnapShotData } from '@/data/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import CustomerSearchInput from '../customer/CustomerSearch';
import DogSearchInput from '../customer/DogSearch';

export default function AddDiagnose({
  onDiagnoseAdded,
}: {
  onDiagnoseAdded: () => void;
}) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [breeds, setBreeds] = useState<Breed[]>([]);

  const fetchBreeds = async () => {
    try {
      const response = await fetch('/api/breeds');
      if (!response.ok) throw new Error('Failed to fetch breeds');

      const data = await response.json();
      setBreeds(data);
    } catch (error) {
      console.error('Error fetching breeds:', error);
      toast({
        title: 'Error',
        description: 'Gagal mengambil data ras anjing',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchBreeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const clientData = {
      name: selectedCustomer?.name,
      email: selectedCustomer?.email,
      phone: selectedCustomer?.phone,
      address: selectedCustomer?.address,
    };

    const dogData = {
      name: selectedDog?.name,
      customBreed: selectedDog?.customBreed,
      birthYear: selectedDog?.birthYear,
      birthMonth: selectedDog?.birthMonth,
      color: selectedDog?.color,
      weight: selectedDog?.weight,
      sex: selectedDog?.sex,
      lastVaccineDate: selectedDog?.lastVaccineDate,
      lastDewormDate: selectedDog?.lastDewormDate,
    };

    const formData = new FormData(e.currentTarget);
    const body = {
      doctorName: formData.get('doctorName') as string,
      clientId: selectedCustomer?._id.toString() as string,
      clientSnapShot: clientData as ClientSnapShotData,
      dogId: selectedDog?._id.toString() as string,
      dogSnapShot: dogData as DogSnapShotData,
      symptom: formData.get('symptom') as string,
      description: formData.get('description') as string,
    };

    try {
      const response = await fetch('/api/diagnoses', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error('Failed to create diagnose');
      }
      toast({
        title: 'Berhasil',
        description: 'Diagnosa berhasil ditambahkan',
      });

      setCreateDialogOpen(false);
      onDiagnoseAdded();
    } catch (error) {
      console.log('error', error);
      toast({
        title: 'Error',
        description: 'Gagal menambahkan diagnosa',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDogs(customer.dogs ?? []);
    setSelectedDog(null);
  };

  const handleSelectDog = (dog: Dog) => {
    setSelectedDog(dog);
  };

  return (
    <>
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Diagnosa</DialogTitle>
            <DialogDescription>Tambah Diagnosa Baru</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="doctorName">Nama Dokter</Label>
              <Input
                id="doctorName"
                name="doctorName"
                placeholder="Nama Dokter"
              />
            </div>
            <div className="grid gap-2">
              {/* di sini coba untuk menggunakan CustomerSearch */}
              <CustomerSearchInput onSelect={handleSelectCustomer} />
            </div>
            <div className="grid gap-2">
              <DogSearchInput Dogs={dogs} onSelect={handleSelectDog} />
            </div>

            {/* Dog Details */}
            {selectedDog && (
              <>
                <div className="grid gap-2">
                  <div className="border rounded-md p-4">
                    <div className="text-xs sm:text-sm text-muted-foreground grid grid-cols-2 gap-x-2 gap-y-1">
                      <div>
                        Ras:{' '}
                        <span className="break-words">
                          {selectedDog.customBreed ||
                            breeds.find(
                              (b) =>
                                b._id.toString() ===
                                selectedDog.breedId?.toString()
                            )?.name ||
                            'Unknown'}
                        </span>
                      </div>
                      <div>
                        Umur:{' '}
                        {formatDogAge(
                          selectedDog.birthYear,
                          selectedDog.birthMonth
                        )}
                      </div>
                      <div>Warna: {selectedDog.color}</div>
                      <div>Berat: {selectedDog.weight} kg</div>
                      <div>
                        Jenis Kelamin:{' '}
                        {selectedDog.sex === 'male' ? 'Jantan' : 'Betina'}
                      </div>
                      <div className="col-span-2">
                        Vaksin Terakhir:{' '}
                        {selectedDog.lastVaccineDate
                          ? new Date(
                              selectedDog.lastVaccineDate
                            ).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'Belum ada data'}
                      </div>
                      <div className="col-span-2">
                        Obat Cacing Terakhir:{' '}
                        {selectedDog.lastDewormDate
                          ? new Date(
                              selectedDog.lastDewormDate
                            ).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'Belum ada data'}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="grid gap-2">
              <Label htmlFor="symptom">Keluhan</Label>
              <Textarea
                id="symptom"
                name="symptom"
                rows={3}
                placeholder="Gejala atau keluhan sebelum pemeriksaan"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Hasil Pemeriksaan</Label>
              <Textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Hasil Pemeriksaan"
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                Tambah
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Button untuk trigger dialog terbuka */}
      <Button
        onClick={() => {
          setCreateDialogOpen(true);
        }}
      >
        Tambah Diagnosa
      </Button>
    </>
  );
}
