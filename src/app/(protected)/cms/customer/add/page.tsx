"use client";

import { AddDogInput } from "@/app/models/dog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { addCustomer } from "./action";
export interface FormState {
  message: string | null;
  errors: {
    submit?: string;
  };
}

const initialState: FormState = {
  message: null,
  errors: {},
};

export default function AddCustomerPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(addCustomer, initialState);
  const [dogs, setDogs] = useState<AddDogInput[]>([]);

  const addDog = () => {
    setDogs([...dogs, { name: "", breed: "", age: 0, color: "" }]);
  };

  const updateDog = (index: number, field: keyof AddDogInput, value: string | number) => {
    const newDogs = [...dogs];
    newDogs[index] = { ...newDogs[index], [field]: value };
    setDogs(newDogs);
  };

  const removeDog = (index: number) => {
    setDogs(dogs.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full p-5">
      <h1 className="text-2xl font-bold mb-6">Add New Customer</h1>
      <form action={formAction} className="space-y-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" required placeholder="Customer name" />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="customer@example.com" />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" type="tel" required placeholder="Phone number" />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" type="text" required placeholder="Full address" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lat">Latitude</Label>
              <Input id="lat" name="lat" type="number" step="any" required placeholder="Latitude" />
            </div>
            <div>
              <Label htmlFor="lng">Longitude</Label>
              <Input id="lng" name="lng" type="number" step="any" required placeholder="Longitude" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Dogs</h2>
            <Button type="button" onClick={addDog} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Dog
            </Button>
          </div>

          {dogs.map((dog, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-medium">Dog #{index + 1}</h3>
                <Button type="button" variant="destructive" size="icon" onClick={() => removeDog(index)}>
                  <Minus className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input name={`dog-${index}-name`} value={dog.name} onChange={(e) => updateDog(index, "name", e.target.value)} required />
                </div>
                <div>
                  <Label>Breed</Label>
                  <Input name={`dog-${index}-breed`} value={dog.breed} onChange={(e) => updateDog(index, "breed", e.target.value)} required />
                </div>
                <div>
                  <Label>Age</Label>
                  <Input name={`dog-${index}-age`} type="number" value={dog.age} onChange={(e) => updateDog(index, "age", e.target.value)} required />
                </div>
                <div>
                  <Label>Color</Label>
                  <Input name={`dog-${index}-color`} value={dog.color} onChange={(e) => updateDog(index, "color", e.target.value)} required />
                </div>
              </div>
            </div>
          ))}
        </div>

        {state?.message && <div className={`p-4 rounded-md ${state.errors.submit ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{state.message}</div>}

        <div className="flex gap-4">
          <Button type="submit">Add Customer</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/cms/customer")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
