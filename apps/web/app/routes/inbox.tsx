import { Link, NavLink, Outlet, useSearchParams } from 'react-router';
import type { Route } from './+types/inbox';
import {
  getInboundMessages,
  getRecipientById,
  formatEmailDate,
  getInboxCounts,
  type InboxStatus,
} from '~/lib/mock-email-messages';
import {
  MailIcon,
  InboxIcon,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '~/lib/classname';

export async function loader() {
  const messages = getInboundMessages();
  const counts = getInboxCounts();

  // Enrich with recipient info
  const enrichedMessages = messages.map((msg) => ({
    ...msg,
    recipient: getRecipientById(msg.campaign_recipient_id),
  }));

  return { messages: enrichedMessages, counts };
}

const STATUS_CONFIG: Record<
  InboxStatus,
  { label: string; icon: typeof MailIcon; color: string; bgColor: string }
> = {
  needs_reply: {
    label: 'Needs Reply',
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  in_progress: {
    label: 'In Progress',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  replied: {
    label: 'Replied',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  closed: {
    label: 'Closed',
    icon: CheckCircle2,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
  },
  spam: {
    label: 'Spam',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
};

export default function Inbox(props: Route.ComponentProps) {
  const { loaderData } = props;
  const { messages, counts } = loaderData;
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') as InboxStatus | null;

  // Filter messages by status if filter is set
  const filteredMessages = statusFilter
    ? messages.filter((m) => m.inbox_status === statusFilter)
    : messages.filter((m) => m.inbox_status !== 'closed' && m.inbox_status !== 'spam');

  return (
    <div className="flex h-screen w-screen items-stretch overflow-hidden">
      <aside className="flex w-[320px] shrink-0 flex-col border-r border-gray-200 bg-white max-lg:w-[280px]">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="flex items-center gap-2 text-lg font-semibold">
              <InboxIcon className="size-5" />
              Inbox
            </h1>
            <Link
              to="/templates"
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="size-4" />
              Templates
            </Link>
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 border-b border-gray-200 px-2 py-2">
          <NavLink
            to="/inbox"
            className={({ isActive }) =>
              cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                !statusFilter
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )
            }
          >
            Open ({counts.needs_reply + counts.in_progress})
          </NavLink>
          <NavLink
            to="/inbox?status=needs_reply"
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              statusFilter === 'needs_reply'
                ? 'bg-orange-100 text-orange-700'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            Needs Reply ({counts.needs_reply})
          </NavLink>
          <NavLink
            to="/inbox?status=closed"
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              statusFilter === 'closed'
                ? 'bg-gray-200 text-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            Closed ({counts.closed})
          </NavLink>
        </div>

        {/* Message list */}
        <div className="flex-1 overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <InboxIcon className="size-12 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No messages</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredMessages.map((msg) => {
                const status = msg.inbox_status || 'needs_reply';
                const config = STATUS_CONFIG[status];
                const StatusIcon = config.icon;

                return (
                  <li key={msg.id}>
                    <NavLink
                      to={`/inbox/reply/${msg.id}`}
                      className={({ isActive }) =>
                        cn(
                          'block p-4 transition-colors hover:bg-gray-50',
                          isActive && 'bg-blue-50 border-l-2 border-blue-500'
                        )
                      }
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar / Status indicator */}
                        <div
                          className={cn(
                            'flex size-10 shrink-0 items-center justify-center rounded-full',
                            config.bgColor
                          )}
                        >
                          <StatusIcon className={cn('size-5', config.color)} />
                        </div>

                        <div className="min-w-0 flex-1">
                          {/* Sender name and time */}
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate font-medium text-gray-900">
                              {msg.recipient?.first_name || msg.user_email.split('@')[0]}
                            </p>
                            <span className="shrink-0 text-xs text-gray-400">
                              {formatEmailDate(msg.received_at || msg.created_at).split(',')[0]}
                            </span>
                          </div>

                          {/* Email address */}
                          <p className="truncate text-xs text-gray-500">
                            {msg.user_email}
                          </p>

                          {/* Subject */}
                          <p className="mt-1 truncate text-sm text-gray-700">
                            {msg.subject}
                          </p>

                          {/* Preview */}
                          <p className="mt-1 line-clamp-2 text-xs text-gray-400">
                            {msg.body_text?.slice(0, 100)}...
                          </p>

                          {/* Tags */}
                          <div className="mt-2 flex items-center gap-2">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                                config.bgColor,
                                config.color
                              )}
                            >
                              {config.label}
                            </span>
                            {msg.metadata?.forwarded_from && (
                              <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-600">
                                via {msg.metadata.forwarded_from}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer stats */}
        <div className="border-t border-gray-200 bg-gray-50 p-3 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>{counts.all} total</span>
            <span>{counts.needs_reply} awaiting reply</span>
          </div>
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
}
