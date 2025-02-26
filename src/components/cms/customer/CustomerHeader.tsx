import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CustomerHeaderProps {
  onEdit: () => void;
  onDelete: () => void;
  userRole: string;
}

export function CustomerHeader({
  onEdit,
  onDelete,
  userRole,
}: CustomerHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
      <Button
        variant="ghost"
        className="gap-2 w-full sm:w-auto justify-start text-sm sm:text-base px-2 sm:px-3"
        onClick={() => router.push('/cms/customer')}
      >
        <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="sm:inline">Kembali ke Daftar Pelanggan</span>
      </Button>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          className="gap-1 sm:gap-2 flex-1 sm:flex-initial text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
          onClick={onEdit}
        >
          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Edit</span>
        </Button>
        {userRole !== 'admin' && (
          <Button
            variant="destructive"
            className="gap-1 sm:gap-2 flex-1 sm:flex-initial text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
            onClick={onDelete}
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Hapus</span>
          </Button>
        )}
      </div>
    </div>
  );
}
