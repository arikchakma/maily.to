import { ColorPickerDemo } from './demos/color-picker-demo';
import { UnitFieldDemo } from './demos/unit-field-demo';
import { Nav } from './nav';

export function ComponentsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Nav.Navigation />

      <div className="flex-1 px-8 py-16">
        <div className="mx-auto max-w-4xl space-y-24">
          <ColorPickerDemo />
          <UnitFieldDemo />
        </div>
      </div>
    </div>
  );
}
