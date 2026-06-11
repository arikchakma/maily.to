import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Cog, Loader2Icon, PlugZapIcon } from 'lucide-react';
import { useState } from 'react';
import { useCallback } from 'react';
import type { FormEvent } from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { httpGet, httpPost } from '~/lib/http';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

type ApiKeyConfig = {
  apiKey: string;
  provider: string;
};

export function apiKeyQueryOptions() {
  return queryOptions({
    queryKey: ['api-key-config'],
    queryFn: async () => {
      return httpGet<ApiKeyConfig>('/api/v1/config', {});
    },
  });
}

type ApiKeyConfigDialogProps = {
  apiKey?: string;
  provider?: string;
};

export function ApiKeyConfigDialog(props: ApiKeyConfigDialogProps) {
  const { apiKey: defaultApiKey, provider: defaultProvider } = props;

  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(defaultApiKey || '');
  const [provider, setProvider] = useState(defaultProvider || 'resend');

  const { isLoading } = useQuery(apiKeyQueryOptions());
  const { mutateAsync: saveApiKey, isPending } = useMutation({
    mutationFn: async () => {
      return httpPost('/api/v1/config', {
        apiKey,
        provider,
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries(apiKeyQueryOptions());
    },
  });

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      toast.promise(saveApiKey(), {
        loading: 'Saving Config...',
        success: 'Saved Config Successfully',
        error: (err) => err?.message || 'Failed to save Config',
      });
    },
    [saveApiKey]
  );

  useEffect(() => {
    setApiKey(defaultApiKey || '');
    setProvider(defaultProvider || 'resend');
  }, [defaultApiKey, defaultProvider]);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <button
          aria-label="Settings"
          className="flex h-7.5 w-7.5 cursor-pointer items-center justify-center border border-black bg-white text-black transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={isLoading}
        >
          <Cog className="inline-block" size={16} aria-hidden="true" />
        </button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-sm min-w-0 overflow-hidden p-4">
        <DialogHeader>
          <DialogTitle>Configuration</DialogTitle>
          <DialogDescription className="text-balance">
            Configure your Provider API Key and Endpoint(if any). These settings
            are saved in your browser.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-2.5" onSubmit={handleSubmit}>
          <Label className="font-normal">
            <span className="w-20 after:ml-0.5 after:text-red-400 after:content-['*']">
              Provider
            </span>
            <select
              className="mt-2 flex h-10 w-full border border-black bg-white px-3 py-2 text-sm font-normal ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:ring-1 focus-visible:ring-black focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              name="provider"
              required
              value={provider}
              onChange={(event) => setProvider(event.target.value)}
            >
              <option value="resend">Resend</option>
            </select>
          </Label>
          <Label className="font-normal">
            <span className="w-20 after:ml-0.5 after:text-red-400 after:content-['*']">
              API Key
            </span>
            <Input
              className="mt-2 h-10 font-normal"
              name="apiKey"
              placeholder="API Key"
              required
              spellCheck={false}
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
            />
          </Label>

          <button
            className="flex h-10 items-center justify-center border border-black bg-black px-2 py-1 text-sm text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
          >
            {isPending ? (
              <Loader2Icon className="mr-1 inline-block size-4 animate-spin" />
            ) : (
              <PlugZapIcon className="mr-1 inline-block size-4" />
            )}
            Save Changes
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
