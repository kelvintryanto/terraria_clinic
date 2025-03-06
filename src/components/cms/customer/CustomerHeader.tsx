import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface CustomerHeaderProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CustomerHeader({ onEdit, onDelete }: CustomerHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Link href="/cms/customer">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Pelanggan
        </Button>
      </Link>
      <div className="flex gap-2">
        {onEdit && (
          <Button onClick={onEdit} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        )}
        {onDelete && (
          <Button variant="destructive" onClick={onDelete} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Hapus
          </Button>
        )}
      </div>
    </div>
  );
}
