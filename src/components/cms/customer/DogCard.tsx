import { Breed } from '@/app/models/breed';
import { Dog } from '@/app/models/dog';
import { formatDogAge } from '@/app/utils/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dog as DogIcon, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { EditDogDialog } from './EditDogDialog';

type EditDogForm = Omit<Partial<Dog>, 'breedId'> & {
  breedId?: string;
};

interface DogCardProps {
  dog: Dog;
  breeds: Breed[];
  userRole: string;
  onDelete: (dog: { id: string; name: string }) => void;
  onEdit: (dogId: string, updatedDog: EditDogForm) => void;
}

export function DogCard({
  dog,
  breeds,
  userRole,
  onDelete,
  onEdit,
}: DogCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = async (updatedDog: EditDogForm) => {
    setIsSubmitting(true);
    try {
      await onEdit(dog._id.toString(), updatedDog);
      setIsEditDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const breedName =
    dog.customBreed ||
    breeds.find((b) => b._id.toString() === dog.breedId?.toString())?.name ||
    'Unknown';

  const birthMonth = new Date(0, parseInt(dog.birthMonth) - 1).toLocaleString(
    'id-ID',
    { month: 'long' }
  );
  const formattedVaccineDate = dog.lastVaccineDate
    ? new Date(dog.lastVaccineDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Belum ada data';
  const formattedDewormDate = dog.lastDewormDate
    ? new Date(dog.lastDewormDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Belum ada data';

  return (
    <>
      <Card className="mb-2 sm:mb-4 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 pt-2 sm:pt-3 px-3 sm:px-4">
          <CardTitle className="text-xs sm:text-sm font-medium">
            <div className="flex items-center gap-1 sm:gap-2">
              <DogIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              {dog.name}
            </div>
          </CardTitle>
          <div className="flex items-center gap-1">
            {userRole === 'super_admin' && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-100"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 sm:h-8 sm:w-8 text-red-500 hover:text-red-600 hover:bg-red-100"
                  onClick={() =>
                    onDelete({ id: dog._id.toString(), name: dog.name })
                  }
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
            {/* Left column */}
            <div className="space-y-2">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Ras:</span>
                <span className="font-medium truncate">{breedName}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-muted-foreground">Umur:</span>
                <span className="font-medium">
                  {formatDogAge(dog.birthYear, dog.birthMonth)}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-muted-foreground">Warna:</span>
                <span className="font-medium">{dog.color}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-muted-foreground">Vaksin Terakhir:</span>
                <span className="font-medium">{formattedVaccineDate}</span>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-2">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Jenis Kelamin:</span>
                <span className="font-medium">
                  {dog.sex === 'male' ? 'Jantan' : 'Betina'}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-muted-foreground">Tanggal Lahir:</span>
                <span className="font-medium">
                  {birthMonth}, {dog.birthYear}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-muted-foreground">Berat:</span>
                <span className="font-medium">{dog.weight} kg</span>
              </div>

              <div className="flex flex-col">
                <span className="text-muted-foreground">
                  Obat Cacing Terakhir:
                </span>
                <span className="font-medium">{formattedDewormDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditDogDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        dog={dog}
        breeds={breeds}
        onSave={handleEdit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
