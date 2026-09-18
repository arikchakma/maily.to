import { NavLink } from 'react-router';

import { cn } from './utils/classname';

type NavRootProps = {
  children: React.ReactNode;
};

function Root(props: NavRootProps) {
  return (
    <nav className="sticky top-0 z-20 flex shrink-0 items-center border-b border-gray-200 bg-gray-50">
      {props.children}
    </nav>
  );
}

type NavTabProps = {
  to: string;
  children: React.ReactNode;
};

function Tab(props: NavTabProps) {
  const { to, children } = props;

  return (
    <NavLink
      className={({ isActive }) => {
        return cn(
          'border-r border-gray-200 px-4 py-2 font-mono text-sm font-medium transition-colors',
          isActive
            ? 'bg-white text-gray-900'
            : 'text-gray-500 hover:text-gray-700'
        );
      }}
      end
      to={to}
    >
      {children}
    </NavLink>
  );
}

type NavActionsProps = {
  children: React.ReactNode;
};

function Actions(props: NavActionsProps) {
  return <div className="flex items-center gap-1.5 px-2">{props.children}</div>;
}

type NavToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
};

function Toggle(props: NavToggleProps) {
  const { checked, onChange, children } = props;

  return (
    <label
      className={cn(
        'flex h-6 cursor-pointer items-center gap-1.5 rounded-md px-2 font-mono text-xs transition-colors select-none',
        checked
          ? 'bg-gray-900 text-white'
          : 'text-gray-500 hover:bg-gray-200 hover:text-gray-900'
      )}
    >
      <input
        checked={checked}
        className={cn('size-3', checked ? 'accent-white' : 'accent-gray-900')}
        onChange={(event) => {
          onChange(event.currentTarget.checked);
        }}
        type="checkbox"
      />
      {children}
    </label>
  );
}

type NavButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

function Button(props: NavButtonProps) {
  return (
    <button
      className="flex h-6 items-center gap-1.5 rounded-md px-2 font-mono text-xs text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900"
      onClick={props.onClick}
      type="button"
    >
      {props.children}
    </button>
  );
}

type NavStatusProps = {
  children: React.ReactNode;
};

function Status(props: NavStatusProps) {
  return (
    <span
      className="flex h-6 items-center gap-1.5 border-l border-gray-200 px-3 font-mono text-xs text-gray-500"
      role="status"
    >
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-emerald-500"
      />
      {props.children}
    </span>
  );
}

export const Nav = { Actions, Button, Root, Status, Tab, Toggle };
