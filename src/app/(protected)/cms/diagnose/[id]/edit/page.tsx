'use client';

import { Customer } from '@/app/models/customer';
import { Diagnose } from '@/app/models/diagnose';
import { Dog } from '@/app/models/dog';
import CustomerSearchInput from '@/components/cms/customer/CustomerSearch';
import DogSearchInput from '@/components/cms/customer/DogSearch';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

export default function EditDiagnosePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [diagnose, setDiagnose] = useState<Diagnose | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [formData, setFormData] = useState({
    doctorName: '',
    symptom: '',
    description: '',
  });
  const [initialCustomerName, setInitialCustomerName] = useState('');
  const [initialDogName, setInitialDogName] = useState('');

  useEffect(() => {
    const fetchDiagnose = async () => {
      try {
        const response = await fetch(`/api/diagnoses/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch diagnose');
        }
        const data = await response.json();
        setDiagnose(data);
        setFormData({
          doctorName: data.doctorName,
          symptom: data.symptom,
          description: data.description,
        });
        setInitialCustomerName(data.clientSnapShot.name);
        setInitialDogName(data.dogSnapShot.name);
      } catch (error) {
        console.error('Error fetching diagnose:', error);
        toast({
          title: 'Error',
          description: 'Gagal mengambil data diagnosa',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnose();
  }, [id]);

  // Fetch the customer data to get the dogs
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (diagnose && diagnose.clientId) {
        try {
          const response = await fetch(`/api/customers/${diagnose.clientId}`, {
            headers: { 'Cache-Control': 'no-cache' },
          });
          if (response.ok) {
            const data = await response.json();
            const customerData = data.customer;
            setDogs(customerData?.dogs || []);
          }
        } catch (error) {
          console.error('Error fetching customer data:', error);
        }
      }
    };

    if (diagnose) {
      fetchCustomerData();
    }
  }, [diagnose]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setInitialCustomerName(customer.name);
    setDogs(customer.dogs ?? []);
    setSelectedDog(null);
    setInitialDogName('');
  };

  const handleSelectDog = (dog: Dog) => {
    setSelectedDog(dog);
    setInitialDogName(dog.name);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const updateData = {
        doctorName: formData.doctorName,
        clientId: selectedCustomer?._id || diagnose?.clientId,
        clientSnapShot: selectedCustomer || diagnose?.clientSnapShot,
        dogId: selectedDog?._id || diagnose?.dogId,
        dogSnapShot: selectedDog || diagnose?.dogSnapShot,
        symptom: formData.symptom,
        description: formData.description,
      };

      const response = await fetch(`/api/diagnoses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update diagnose');
      }

      toast({
        title: 'Berhasil',
        description: 'Diagnosa berhasil diperbarui',
      });

      router.push(`/cms/diagnose`);
    } catch (error) {
      console.error('Error updating diagnose:', error);
      toast({
        title: 'Error',
        description: 'Gagal memperbarui diagnosa',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
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
        <Button onClick={() => router.push('/cms/diagnose')}>
          Kembali ke Daftar Diagnosa
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/cms/diagnose/${id}`)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Edit Diagnosa {diagnose.dxNumber}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date(diagnose.dxDate).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="doctorName">Nama Dokter</Label>
                <Input
                  id="doctorName"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleInputChange}
                  placeholder="Nama Dokter"
                  required
                />
              </div>

              <div>
                <CustomerSearchInput
                  onSelect={handleSelectCustomer}
                  initialValue={initialCustomerName}
                />
              </div>

              <div>
                <DogSearchInput
                  Dogs={dogs}
                  onSelect={handleSelectDog}
                  initialValue={initialDogName}
                />
              </div>

              <div>
                <Label htmlFor="symptom">Keluhan</Label>
                <Textarea
                  id="symptom"
                  name="symptom"
                  value={formData.symptom}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Keluhan sebelum hasil pemeriksaan"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Hasil Pemeriksaan</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Hasil Pemeriksaan"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/cms/diagnose/${id}`)}
                disabled={submitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
