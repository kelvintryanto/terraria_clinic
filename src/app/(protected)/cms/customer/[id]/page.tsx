'use client';

import { Customer } from '@/app/models/customer';
import { Dog } from '@/app/models/dog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

type DogForm = Omit<Dog, '_id'>;

const initialDogForm: DogForm = {
  name: '',
  breed: '',
  age: 0,
  color: '',
};

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDogDialogOpen, setIsAddDogDialogOpen] = useState(false);
  const [dogForm, setDogForm] = useState<DogForm>(initialDogForm);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    coordinates: {
      lat: 0,
      lng: 0,
    },
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/customers/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch customer');
        }
        const data = await response.json();
        setCustomer(data);
        setEditForm({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          coordinates: {
            lat: data.coordinates.lat,
            lng: data.coordinates.lng,
          },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleEdit = async () => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update customer');
      }

      // Update the customer state with new data
      setCustomer((prev) => (prev ? { ...prev, ...editForm } : null));
      setIsEditDialogOpen(false);
    } catch (err) {
      console.error('Error updating customer:', err);
      alert('Failed to update customer');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer');
      }

      router.push('/cms/customer');
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert('Failed to delete customer');
    }
  };

  const calculateJoinDuration = (joinDate: string) => {
    const join = new Date(joinDate);
    const now = new Date();
    const diffInMonths =
      (now.getFullYear() - join.getFullYear()) * 12 +
      (now.getMonth() - join.getMonth());
    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;

    if (years > 0) {
      return `${years} tahun ${months} bulan`;
    }
    return `${months} bulan`;
  };

  const handleAddDog = async () => {
    try {
      const response = await fetch(`/api/customers/${id}/dogs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: dogForm.name,
          breed: dogForm.breed,
          age: parseInt(dogForm.age.toString()),
          color: dogForm.color,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add dog');
      }

      const newDog = await response.json();

      // Update the customer state with the new dog
      setCustomer((prev) =>
        prev
          ? {
              ...prev,
              dogs: [...prev.dogs, newDog],
            }
          : null
      );

      // Reset form and close dialog
      setDogForm(initialDogForm);
      setIsAddDogDialogOpen(false);
    } catch (err) {
      console.error('Error adding dog:', err);
      alert('Failed to add dog');
    }
  };

  if (loading) {
    return (
      <div className="w-full p-5 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="w-full p-5">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error || 'Customer not found'}
        </div>
        <Button className="mt-4" onClick={() => router.push('/cms/customer')}>
          Back to Customers
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer Details</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsEditDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" /> Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/cms/customer')}
          >
            Back to Customers
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Name</h2>
            <p className="mt-1 text-lg">{customer.name}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Email</h2>
            <p className="mt-1 text-lg">{customer.email}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Phone</h2>
            <p className="mt-1 text-lg">{customer.phone}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Join Duration</h2>
            <p className="mt-1 text-lg">
              {calculateJoinDuration(customer.joinDate)}
            </p>
          </div>
          <div className="col-span-2">
            <h2 className="text-sm font-medium text-gray-500">Address</h2>
            <p className="mt-1 text-lg">{customer.address}</p>
          </div>
          <div className="col-span-2">
            <h2 className="text-sm font-medium text-gray-500">Coordinates</h2>
            <p className="mt-1 text-lg">
              Lat: {customer.coordinates.lat}, Lng: {customer.coordinates.lng}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Dogs</h2>
          <Button
            onClick={() => setIsAddDogDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Dog
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customer?.dogs.map((dog) => (
            <div
              key={dog._id.toString()}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="text-lg">{dog.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Breed</h3>
                  <p>{dog.breed}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Age</h3>
                    <p>{dog.age} years</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Color</h3>
                    <p>{dog.color}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {customer?.dogs.length === 0 && (
            <p className="text-gray-500 col-span-2 text-center py-4">
              No dogs registered for this customer
            </p>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Make changes to the customer information below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  value={editForm.coordinates.lat}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      coordinates: {
                        ...editForm.coordinates,
                        lat: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  value={editForm.coordinates.lng}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      coordinates: {
                        ...editForm.coordinates,
                        lng: parseFloat(e.target.value) || 0,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dog Dialog */}
      <Dialog open={isAddDogDialogOpen} onOpenChange={setIsAddDogDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Dog</DialogTitle>
            <DialogDescription>
              Enter the details of the new dog below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="dog-name">Name</Label>
              <Input
                id="dog-name"
                value={dogForm.name}
                onChange={(e) =>
                  setDogForm({ ...dogForm, name: e.target.value })
                }
                placeholder="Dog's name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dog-breed">Breed</Label>
              <Input
                id="dog-breed"
                value={dogForm.breed}
                onChange={(e) =>
                  setDogForm({ ...dogForm, breed: e.target.value })
                }
                placeholder="Dog's breed"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dog-age">Age (years)</Label>
              <Input
                id="dog-age"
                type="number"
                value={dogForm.age}
                onChange={(e) =>
                  setDogForm({ ...dogForm, age: parseInt(e.target.value) })
                }
                placeholder="Dog's age"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dog-color">Color</Label>
              <Input
                id="dog-color"
                value={dogForm.color}
                onChange={(e) =>
                  setDogForm({ ...dogForm, color: e.target.value })
                }
                placeholder="Dog's color"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDogForm(initialDogForm);
                setIsAddDogDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddDog}
              disabled={
                !dogForm.name ||
                !dogForm.breed ||
                !dogForm.age ||
                !dogForm.color
              }
            >
              Add Dog
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
