'use client';

import * as React from 'react';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { Check, ChevronsUpDown, Loader2, TrashIcon } from 'lucide-react';

import { Database } from '@/types/database';
import { editorAtom } from '@/lib/editor-atom';
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

import { MailDeleteButton } from './mail-delete-button';

type MailRowType = Database['public']['Tables']['mails']['Row'];

export function MailListCombobox() {
  const editor = useAtomValue(editorAtom);
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
      <PopoverTrigger asChild disabled={status === 'loading' || data?.data?.length === 0}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? data?.data?.find((mail) => mail.id === value)?.title
            : data?.data?.length === 0 ? (
              'No saved mail'
            ) : (
              'Select mail'
            )}
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
                  if (currentValue === value) {
                    editor?.getEditor()?.commands.setContent({
                      type: 'doc',
                      content: [{ type: 'paragraph' }],
                    });
                  } else {
                    editor?.getEditor()?.commands.setContent(
                      JSON.parse(mail.content as string) || {
                        type: 'doc',
                        content: [{ type: 'paragraph' }],
                      }
                    );
                  }
                  setValue(currentValue === value ? '' : currentValue);
                  setOpen(false);
                }}
                className="justify-between"
              >
                <div className="flex items-center">
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === mail.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {mail.title}
                </div>
                <MailDeleteButton
                  mailId={mail.id}
                  onDelete={() => {
                    if (value === mail.id) {
                      setValue('');
                      editor?.getEditor()?.commands.setContent({
                        type: 'doc',
                        content: [{ type: 'paragraph' }],
                      });
                    }
                  }}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
