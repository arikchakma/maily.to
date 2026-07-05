import { redirect } from 'react-router';
import type { Route } from './+types/inbox.reply.$messageId';
import {
  getEmailMessageById,
  getEmailThread,
  getRecipientById,
  getReplyThreadingHeaders,
  formatEmailDate,
} from '~/lib/mock-email-messages';
import { ReplyComposer } from '~/components/reply-composer';

export async function loader(args: Route.LoaderArgs) {
  const { params } = args;
  const messageId = parseInt(params.messageId, 10);

  if (isNaN(messageId)) {
    throw redirect('/inbox');
  }

  const message = getEmailMessageById(messageId);
  if (!message) {
    throw redirect('/inbox');
  }

  const thread = getEmailThread(messageId);
  const recipient = getRecipientById(message.campaign_recipient_id);
  const replyContext = getReplyThreadingHeaders(message);

  return {
    message,
    thread,
    recipient,
    replyContext: {
      ...replyContext,
      fromEmail: 'kanika@email.gostudio.ai',
      fromName: 'Kanika from GoStudio.AI',
    },
  };
}

export default function ReplyPage(props: Route.ComponentProps) {
  const { loaderData } = props;
  const { message, thread, recipient, replyContext } = loaderData;

  return (
    <ReplyComposer
      messageId={message.id}
      replyContext={replyContext}
      thread={thread}
      recipient={recipient}
      currentStatus={message.inbox_status}
    />
  );
}
