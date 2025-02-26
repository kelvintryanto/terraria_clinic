import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteDogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dogName: string | null;
  onDelete: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function DeleteDogDialog({
  open,
  onOpenChange,
  dogName,
  onDelete,
  onCancel,
  isSubmitting,
}: DeleteDogDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[calc(100%-1rem)] p-3 sm:p-6 max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base sm:text-lg">
            Apakah anda yakin?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm">
            Tindakan ini tidak dapat dibatalkan. Data anjing {dogName} akan
            dihapus secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-2 sm:mt-0">
          <AlertDialogCancel
            onClick={onCancel}
            className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
            disabled={isSubmitting}
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Menghapus...' : 'Hapus'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
