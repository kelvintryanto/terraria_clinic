import { Breed } from '@/app/models/breed';
import { Dog } from '@/app/models/dog';
import { formatDogAge } from '@/app/utils/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dog as DogIcon, Trash2 } from 'lucide-react';

interface DogCardProps {
  dog: Dog;
  breeds: Breed[];
  userRole: string;
  onDelete: (dog: { id: string; name: string }) => void;
}

export function DogCard({ dog, breeds, userRole, onDelete }: DogCardProps) {
  return (
    <Card className="mb-2 sm:mb-4 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 pt-2 sm:pt-3 px-3 sm:px-4">
        <CardTitle className="text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-1 sm:gap-2">
            <DogIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            {dog.name}
          </div>
        </CardTitle>
        {userRole === 'super_admin' && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 hover:text-red-600 hover:bg-red-100"
            onClick={() => onDelete({ id: dog._id.toString(), name: dog.name })}
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
        <div className="text-xs sm:text-sm text-muted-foreground grid grid-cols-2 gap-x-2 gap-y-1">
          <div>
            Ras:{' '}
            <span className="break-words">
              {dog.customBreed ||
                breeds.find((b) => b._id.toString() === dog.breedId?.toString())
                  ?.name ||
                'Unknown'}
            </span>
          </div>
          <div>Umur: {formatDogAge(dog.age)}</div>
          <div>Warna: {dog.color}</div>
          <div>Berat: {dog.weight} kg</div>
          <div>Jenis Kelamin: {dog.sex === 'male' ? 'Jantan' : 'Betina'}</div>
          <div className="col-span-2">
            Vaksin Terakhir:{' '}
            {dog.lastVaccineDate
              ? new Date(dog.lastVaccineDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : 'Belum ada data'}
          </div>
          <div className="col-span-2">
            Obat Cacing Terakhir:{' '}
            {dog.lastDewormDate
              ? new Date(dog.lastDewormDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : 'Belum ada data'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
