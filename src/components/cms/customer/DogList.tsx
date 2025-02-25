import { Breed } from '@/app/models/breed';
import { Dog } from '@/app/models/dog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dog as DogIcon, Plus } from 'lucide-react';
import { DogCard } from './DogCard';

interface DogListProps {
  dogs: Dog[];
  breeds: Breed[];
  userRole: string;
  onAddDog: () => void;
  onDeleteDog: (dog: { id: string; name: string }) => void;
}

export function DogList({
  dogs,
  breeds,
  userRole,
  onAddDog,
  onDeleteDog,
}: DogListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 px-3 sm:px-6 sm:pt-4">
        <CardTitle className="text-sm sm:text-base md:text-lg font-semibold flex items-center gap-1 sm:gap-2">
          <DogIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          Daftar Anjing
        </CardTitle>
        <Button
          onClick={onAddDog}
          className="gap-1 sm:gap-2 text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
          size="sm"
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          Tambah Anjing
        </Button>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
          {dogs.map((dog) => (
            <DogCard
              key={dog._id.toString()}
              dog={dog}
              breeds={breeds}
              userRole={userRole}
              onDelete={onDeleteDog}
            />
          ))}
          {dogs.length === 0 && (
            <p className="text-muted-foreground col-span-2 text-center py-3 sm:py-4 text-xs sm:text-sm md:text-base">
              Belum ada anjing terdaftar
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
