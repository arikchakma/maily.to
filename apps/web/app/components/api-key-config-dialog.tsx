import { Cog, Loader2, Loader2Icon, PlugZap, PlugZapIcon } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { httpGet, httpPost } from '~/lib/http';
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import { useEffect } from 'react';

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
      queryClient.invalidateQueries(apiKeyQueryOptions());
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
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-black duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={isLoading}
        >
          <Cog className="inline-block" size={16} />
        </button>
      </DialogTrigger>
      <DialogContent className="w-full min-w-0 max-w-sm overflow-hidden p-4">
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
              className="mt-2 flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-normal ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="flex h-10 items-center justify-center rounded-md bg-black px-2 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
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
