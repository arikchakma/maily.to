import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Input } from './input';

export function SocialIconEditModal() {
  return (
    <Dialog>
      <DialogTrigger>
        <button>Edit</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Social Icon</DialogTitle>
          <DialogDescription>
            You can update social icon, and it's link.
          </DialogDescription>
        </DialogHeader>

        <form>
          <label className="mly-block mly-w-full mly-leading-none mly-space-y-1.5">
            <span className="mly-leading-none mly-text-xs mly-font-normal">
              Social Icon
            </span>
            <Input placeholder="Social Icon" />
          </label>
          <label className="mly-block mly-w-full mly-leading-none mly-space-y-1.5">
            <span className="mly-leading-none mly-text-xs mly-font-normal">
              Social Link
            </span>
            <Input placeholder="Social Link" />
          </label>
        </form>
      </DialogContent>
    </Dialog>
  );
}
