import { Breed } from '@/app/models/breed';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { DogForm } from './types';

interface AddDogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogForm: DogForm;
  setDogForm: (form: DogForm) => void;
  onAddDog: () => void;
  isSubmitting: boolean;
  breeds: Breed[];
}

export function AddDogDialog({
  open,
  onOpenChange,
  dogForm,
  setDogForm,
  onAddDog,
  isSubmitting,
  breeds,
}: AddDogDialogProps) {
  const [breedSearch, setBreedSearch] = useState('');
  const [isBreedOpen, setIsBreedOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] w-[calc(100%-1rem)] p-3 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Anjing Baru</DialogTitle>
          <DialogDescription>
            Masukkan detail anjing di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:gap-6 py-2 sm:py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Left column - first 4 inputs */}
            <div className="space-y-3 sm:space-y-4">
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="dog-name">Nama</Label>
                <Input
                  id="dog-name"
                  value={dogForm.name}
                  onChange={(e) =>
                    setDogForm({ ...dogForm, name: e.target.value })
                  }
                  placeholder="Nama anjing"
                  className="h-9"
                />
              </div>
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="dog-breed">Ras</Label>
                <div className="relative">
                  <Input
                    id="dog-breed"
                    value={breedSearch}
                    onChange={(e) => {
                      const value = e.target.value;
                      setBreedSearch(value);

                      // Check if input matches any breed
                      const matchingBreed = breeds.find(
                        (breed) =>
                          breed.name.toLowerCase() === value.toLowerCase()
                      );

                      if (matchingBreed) {
                        setDogForm({
                          ...dogForm,
                          breedId: matchingBreed._id.toString(),
                          customBreed: null,
                        });
                      } else {
                        setDogForm({
                          ...dogForm,
                          breedId: null,
                          customBreed: value || null,
                        });
                      }
                    }}
                    onFocus={() => setIsBreedOpen(true)}
                    onBlur={() => {
                      setTimeout(() => setIsBreedOpen(false), 200);
                    }}
                    placeholder="Ketik untuk mencari atau masukkan ras baru"
                    className="w-full h-9"
                  />
                  {isBreedOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 p-1 rounded-md border bg-popover shadow-md z-50">
                      <Command>
                        <CommandList>
                          <CommandEmpty className="py-2 text-center text-sm text-muted-foreground">
                            Tidak ada ras yang sesuai
                          </CommandEmpty>
                          <CommandGroup className="max-h-[200px] overflow-y-auto">
                            {breeds
                              .filter((breed) =>
                                breed.name
                                  .toLowerCase()
                                  .includes(breedSearch.toLowerCase())
                              )
                              .map((breed) => (
                                <CommandItem
                                  key={breed._id.toString()}
                                  value={breed.name}
                                  onSelect={() => {
                                    setDogForm({
                                      ...dogForm,
                                      breedId: breed._id.toString(),
                                      customBreed: null,
                                    });
                                    setBreedSearch(breed.name);
                                    setIsBreedOpen(false);
                                  }}
                                  className="cursor-pointer"
                                >
                                  {breed.name}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="dog-age">Umur (tahun)</Label>
                <Input
                  id="dog-age"
                  type="number"
                  value={dogForm.age || ''}
                  onChange={(e) =>
                    setDogForm({
                      ...dogForm,
                      age: e.target.value ? parseInt(e.target.value) : 0,
                    })
                  }
                  placeholder="Umur anjing"
                  className="h-9"
                />
              </div>
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="dog-color">Warna</Label>
                <Input
                  id="dog-color"
                  value={dogForm.color}
                  onChange={(e) =>
                    setDogForm({ ...dogForm, color: e.target.value })
                  }
                  placeholder="Warna anjing"
                  className="h-9"
                />
              </div>
            </div>

            {/* Right column - last 4 inputs */}
            <div className="space-y-3 sm:space-y-4">
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="dog-weight">Berat (kg)</Label>
                <Input
                  id="dog-weight"
                  type="number"
                  step="0.1"
                  value={dogForm.weight || ''}
                  onChange={(e) =>
                    setDogForm({
                      ...dogForm,
                      weight: e.target.value ? parseFloat(e.target.value) : 0,
                    })
                  }
                  placeholder="Berat anjing"
                  className="h-9"
                />
              </div>
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="dog-sex">Jenis Kelamin</Label>
                <Select
                  value={dogForm.sex}
                  onValueChange={(value: 'male' | 'female') =>
                    setDogForm({ ...dogForm, sex: value })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Jantan</SelectItem>
                    <SelectItem value="female">Betina</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="dog-vaccine">Tanggal Vaksin Terakhir</Label>
                <div className="flex gap-1 sm:gap-2">
                  <Input
                    id="dog-vaccine"
                    type="text"
                    placeholder="DD/MM/YYYY"
                    defaultValue={
                      dogForm.lastVaccineDate
                        ? format(
                            new Date(dogForm.lastVaccineDate),
                            'dd/MM/yyyy'
                          )
                        : ''
                    }
                    onChange={(e) => {
                      const input = e.target;
                      const value = input.value;
                      const prevValue =
                        input.getAttribute('data-prev-value') || '';

                      // Store current value for next comparison
                      input.setAttribute('data-prev-value', value);

                      // Check if user is deleting characters
                      const isDeletion = value.length < prevValue.length;

                      // Only allow digits and slashes
                      const cleaned = value.replace(/[^\d/]/g, '');

                      // Handle formatting
                      let formatted = cleaned;

                      if (isDeletion) {
                        // Special handling for deletion
                        if (prevValue.endsWith('/') && !value.endsWith('/')) {
                          // If deleting right after a slash, remove the slash too
                          formatted = value.substring(0, value.length - 1);
                        } else if (
                          value.length === 3 &&
                          value.charAt(2) === '/'
                        ) {
                          // If only one digit left before the first slash, remove the slash too
                          formatted = value.substring(0, 2);
                        } else if (
                          value.length === 6 &&
                          value.charAt(5) === '/'
                        ) {
                          // If only one digit left before the second slash, remove the slash too
                          formatted = value.substring(0, 5);
                        }
                      } else {
                        // Auto-add slashes when typing
                        if (cleaned.length === 2 && !cleaned.includes('/')) {
                          formatted = cleaned + '/';
                        } else if (
                          cleaned.length === 5 &&
                          cleaned.indexOf('/', 3) === -1
                        ) {
                          formatted = cleaned + '/';
                        }
                      }

                      // Update the input value if it's different
                      if (formatted !== value) {
                        input.value = formatted;
                        // Update the stored previous value after programmatic change
                        input.setAttribute('data-prev-value', formatted);
                      }

                      // Parse the date if it's in the correct format
                      const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
                      const match = formatted.match(datePattern);

                      if (match) {
                        const day = parseInt(match[1]);
                        const month = parseInt(match[2]) - 1; // JS months are 0-indexed
                        const year = parseInt(match[3]);

                        const date = new Date(year, month, day);

                        // Check if it's a valid date
                        if (!isNaN(date.getTime())) {
                          setDogForm({
                            ...dogForm,
                            lastVaccineDate: date.toISOString(),
                          });
                        }
                      } else if (formatted === '') {
                        // Clear the date if input is empty
                        setDogForm({ ...dogForm, lastVaccineDate: null });
                      }
                    }}
                    className="h-9 flex-1 min-w-0 text-sm"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 flex-shrink-0"
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={
                          dogForm.lastVaccineDate
                            ? new Date(dogForm.lastVaccineDate)
                            : undefined
                        }
                        onSelect={(date) => {
                          setDogForm({
                            ...dogForm,
                            lastVaccineDate: date ? date.toISOString() : null,
                          });

                          // Update the input field directly
                          if (date) {
                            const input = document.getElementById(
                              'dog-vaccine'
                            ) as HTMLInputElement;
                            if (input) {
                              input.value = format(date, 'dd/MM/yyyy');
                            }
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid gap-1 sm:gap-2">
                <Label htmlFor="dog-deworm" className="text-sm">
                  Tanggal Obat Cacing Terakhir
                </Label>
                <div className="flex gap-1 sm:gap-2">
                  <Input
                    id="dog-deworm"
                    type="text"
                    placeholder="DD/MM/YYYY"
                    defaultValue={
                      dogForm.lastDewormDate
                        ? format(new Date(dogForm.lastDewormDate), 'dd/MM/yyyy')
                        : ''
                    }
                    onChange={(e) => {
                      const input = e.target;
                      const value = input.value;
                      const prevValue =
                        input.getAttribute('data-prev-value') || '';

                      // Store current value for next comparison
                      input.setAttribute('data-prev-value', value);

                      // Check if user is deleting characters
                      const isDeletion = value.length < prevValue.length;

                      // Only allow digits and slashes
                      const cleaned = value.replace(/[^\d/]/g, '');

                      // Handle formatting
                      let formatted = cleaned;

                      if (isDeletion) {
                        // Special handling for deletion
                        if (prevValue.endsWith('/') && !value.endsWith('/')) {
                          // If deleting right after a slash, remove the slash too
                          formatted = value.substring(0, value.length - 1);
                        } else if (
                          value.length === 3 &&
                          value.charAt(2) === '/'
                        ) {
                          // If only one digit left before the first slash, remove the slash too
                          formatted = value.substring(0, 2);
                        } else if (
                          value.length === 6 &&
                          value.charAt(5) === '/'
                        ) {
                          // If only one digit left before the second slash, remove the slash too
                          formatted = value.substring(0, 5);
                        }
                      } else {
                        // Auto-add slashes when typing
                        if (cleaned.length === 2 && !cleaned.includes('/')) {
                          formatted = cleaned + '/';
                        } else if (
                          cleaned.length === 5 &&
                          cleaned.indexOf('/', 3) === -1
                        ) {
                          formatted = cleaned + '/';
                        }
                      }

                      // Update the input value if it's different
                      if (formatted !== value) {
                        input.value = formatted;
                        // Update the stored previous value after programmatic change
                        input.setAttribute('data-prev-value', formatted);
                      }

                      // Parse the date if it's in the correct format
                      const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
                      const match = formatted.match(datePattern);

                      if (match) {
                        const day = parseInt(match[1]);
                        const month = parseInt(match[2]) - 1; // JS months are 0-indexed
                        const year = parseInt(match[3]);

                        const date = new Date(year, month, day);

                        // Check if it's a valid date
                        if (!isNaN(date.getTime())) {
                          setDogForm({
                            ...dogForm,
                            lastDewormDate: date.toISOString(),
                          });
                        }
                      } else if (formatted === '') {
                        // Clear the date if input is empty
                        setDogForm({ ...dogForm, lastDewormDate: null });
                      }
                    }}
                    className="h-9 flex-1 min-w-0 text-sm"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 flex-shrink-0"
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={
                          dogForm.lastDewormDate
                            ? new Date(dogForm.lastDewormDate)
                            : undefined
                        }
                        onSelect={(date) => {
                          setDogForm({
                            ...dogForm,
                            lastDewormDate: date ? date.toISOString() : null,
                          });

                          // Update the input field directly
                          if (date) {
                            const input = document.getElementById(
                              'dog-deworm'
                            ) as HTMLInputElement;
                            if (input) {
                              input.value = format(date, 'dd/MM/yyyy');
                            }
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-2 sm:mt-0">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setBreedSearch('');
            }}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Batal
          </Button>
          <Button
            onClick={onAddDog}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Menambahkan...' : 'Tambah'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
