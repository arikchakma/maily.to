'use client';

import * as React from 'react';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';

import { Database } from '@/types/database';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils/classname';
import { fetcher, QueryError } from '@/utils/fetcher';

type MailRowType = Database['public']['Tables']['mails']['Row'];

export function MailListCombobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const { data, status } = useQuery<
    PostgrestSingleResponse<MailRowType[]>,
    QueryError
  >({
    queryKey: ['mails'],
    queryFn: () => fetcher('/api/v1/get-list-mails'),
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? data?.data?.find((mail) => mail.id === value)?.title
            : 'Select saved mail...'}
          {status === 'loading' ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search mail..." />
          <CommandEmpty>No saved mail found.</CommandEmpty>
          <CommandGroup>
            {data?.data?.map((mail) => (
              <CommandItem
                key={mail.id}
                value={mail.id}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? '' : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === mail.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
                {mail.title}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
