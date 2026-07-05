import { InboxIcon } from 'lucide-react';

export default function InboxIndex() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <InboxIcon className="mx-auto size-12 text-gray-300" />
        <h2 className="mt-4 text-lg font-medium text-gray-900">
          Select a message
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose an email from the inbox to compose a reply
        </p>
      </div>
    </div>
  );
}
