import { Dog } from '@/app/models/dog';

// Interface for customer data
export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  dogs: Dog[];
}

// Interface for dog form data
export type DogForm = {
  name: string;
  breedId: string | null;
  customBreed: string | null;
  age: number;
  color: string;
  weight: number;
  lastVaccineDate: string | null;
  lastDewormDate: string | null;
  sex: 'male' | 'female';
};

export const initialDogForm: DogForm = {
  name: '',
  breedId: null,
  customBreed: null,
  age: 0,
  color: '',
  weight: 0,
  lastVaccineDate: null,
  lastDewormDate: null,
  sex: 'male',
};

// Interface for edit form data
export type EditForm = {
  name: string;
  email: string;
  phone: string;
  address: string;
};
