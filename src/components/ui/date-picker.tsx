import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
}

export function DatePicker({ date, onSelect }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal truncate',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="shrink-0 mr-2 h-4 w-4" />
          {date ? (
            <span className="truncate">
              {format(date, 'dd MMM yyyy', { locale: id })}
            </span>
          ) : (
            <span>Pilih tanggal</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
          locale={id}
        />
      </PopoverContent>
    </Popover>
  );
}
