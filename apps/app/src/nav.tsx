import { NavLink } from 'react-router';

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
  return (
    <NavLink
      to={props.to}
      end
      className={({ isActive }) =>
        `border-r border-gray-200 px-4 py-2 font-mono text-sm font-medium transition-colors ${
          isActive
            ? 'bg-white text-gray-900'
            : 'text-gray-500 hover:text-gray-700'
        }`
      }
    >
      {props.children}
    </NavLink>
  );
}

function Navigation() {
  return (
    <Root>
      <Tab to="/">Editor</Tab>
      <Tab to="/migration">Migration</Tab>
      <Tab to="/components">Components</Tab>
    </Root>
  );
}

export const Nav = { Root, Tab, Navigation };
