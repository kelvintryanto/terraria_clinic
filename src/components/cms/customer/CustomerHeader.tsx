import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface CustomerHeaderProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CustomerHeader({ onEdit, onDelete }: CustomerHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full">
      <Link href="/cms/customer">
        <Button
          variant="ghost"
          className="gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-4"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs sm:text-sm">Kembali</span>
        </Button>
      </Link>
      <div className="flex gap-1 sm:gap-2">
        {onEdit && (
          <Button
            onClick={onEdit}
            className="gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-4 text-xs sm:text-sm"
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        )}
        {onDelete && (
          <Button
            variant="destructive"
            onClick={onDelete}
            className="gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-4 text-xs sm:text-sm"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Hapus</span>
          </Button>
        )}
      </div>
    </div>
  );
}
