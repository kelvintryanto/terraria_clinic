import { Button } from '@/components/ui/button';
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
import { EditForm } from './types';

interface EditCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editForm: EditForm;
  setEditForm: (form: EditForm) => void;
  onSave: () => void;
  isSubmitting: boolean;
}

export function EditCustomerDialog({
  open,
  onOpenChange,
  editForm,
  setEditForm,
  onSave,
  isSubmitting,
}: EditCustomerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-1rem)] p-3 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pelanggan</DialogTitle>
          <DialogDescription>
            Ubah informasi pelanggan di bawah ini.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:gap-4 py-2 sm:py-4">
          <div className="grid gap-1 sm:gap-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="h-9"
            />
          </div>
          <div className="grid gap-1 sm:gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              className="h-9"
            />
          </div>
          <div className="grid gap-1 sm:gap-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input
              id="phone"
              value={editForm.phone}
              onChange={(e) =>
                setEditForm({ ...editForm, phone: e.target.value })
              }
              className="h-9"
            />
          </div>
          <div className="grid gap-1 sm:gap-2">
            <Label htmlFor="address">Alamat</Label>
            <Input
              id="address"
              value={editForm.address}
              onChange={(e) =>
                setEditForm({ ...editForm, address: e.target.value })
              }
              className="h-9"
            />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-2 sm:mt-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Batal
          </Button>
          <Button
            onClick={onSave}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
