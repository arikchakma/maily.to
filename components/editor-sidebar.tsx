'use client'

import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { MailsRowType } from "@/app/(playground)/playground/page";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { QueryError, fetcher } from "@/utils/fetcher";
import { Loader2 } from "lucide-react";

export function EditorSidebar() {
  const { data, status } = useQuery<
    PostgrestSingleResponse<MailsRowType[]>,
    QueryError
  >({
    queryKey: ['mails'],
    queryFn: () => fetcher('/api/v1/get-list-mails'),
  });
  return (
    <aside className="w-[225px] border-r shrink-0">
      <Button className="rounded-none border-none w-full" variant="outline">+ New Email</Button>

      <div className="py-2 border-t text-center">
        {status === 'loading' && (
          <Loader2 className="animate-spin h-4 w-4 mx-auto" />
        )}
        {data?.data?.length === 0 ? (
          <p className="text-sm">No Saved Emails</p>
        ) : (
          <ul>
            {data?.data?.map(mail => {
              return (
                <li key={mail.id}>
                  {mail.title}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}
