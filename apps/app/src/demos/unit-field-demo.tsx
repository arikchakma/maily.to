import { UnitField } from '@maily-to/ui';
import {
  BoxIcon,
  MoveHorizontalIcon,
  MoveVerticalIcon,
  PercentIcon,
  RotateCwIcon,
  RulerIcon,
} from 'lucide-react';
import { useCallback, useState } from 'react';

const FIELD =
  'relative flex h-9 w-full items-stretch rounded-xl bg-stone-50 ring-1 ring-stone-200/60 transition-shadow has-focus-within:ring-stone-400';

const DRAG_AREA =
  'pointer-events-auto flex aspect-square w-9 shrink-0 cursor-ew-resize items-center justify-center text-stone-400';

const INPUT =
  'w-full appearance-none bg-transparent pr-2.5 text-[13px] tabular-nums text-stone-700 outline-none';

function pxFormat(v: number) {
  return `${v}px`;
}

function pxParse(v: string) {
  const n = parseInt(v.replace('px', ''), 10);
  return isNaN(n) ? null : n;
}

function degFormat(v: number) {
  return `${v}°`;
}

function degParse(v: string) {
  const n = parseInt(v.replace('°', ''), 10);
  return isNaN(n) ? null : n;
}

function pctFormat(v: number) {
  return `${v}%`;
}

function pctParse(v: string) {
  const n = parseInt(v.replace('%', ''), 10);
  return isNaN(n) ? null : n;
}

type FieldRowProps = {
  label: string;
  children: React.ReactNode;
};

function FieldRow(props: FieldRowProps) {
  const { label, children } = props;

  return (
    <div className="grid grid-cols-[100px_1fr] items-center gap-3">
      <span className="text-[13px] text-stone-400">{label}</span>
      {children}
    </div>
  );
}

function BasicDemo() {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(120);
  const [radius, setRadius] = useState(8);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [border, setBorder] = useState(1);

  return (
    <section>
      <header className="mb-6">
        <p className="font-mono text-[10px] tracking-widest text-stone-300">
          01
        </p>
        <h3 className="mt-1 text-[15px] font-semibold tracking-[-0.01em] text-stone-800">
          Properties
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-stone-400">
          Drag the icons to scrub values. Arrow keys for fine control, shift for
          large steps.
        </p>
      </header>

      <div className="space-y-2.5">
        <FieldRow label="Width">
          <UnitField.Root
            className={FIELD}
            format={pxFormat}
            parse={pxParse}
            value={width}
            onValueChange={setWidth}
            min={0}
            max={1000}
          >
            <UnitField.DragArea className={DRAG_AREA}>
              <MoveHorizontalIcon className="size-3.5" />
            </UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>
        </FieldRow>

        <FieldRow label="Height">
          <UnitField.Root
            className={FIELD}
            format={pxFormat}
            parse={pxParse}
            value={height}
            onValueChange={setHeight}
            min={0}
            max={1000}
          >
            <UnitField.DragArea className={DRAG_AREA}>
              <MoveVerticalIcon className="size-3.5" />
            </UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>
        </FieldRow>

        <FieldRow label="Radius">
          <UnitField.Root
            className={FIELD}
            format={pxFormat}
            parse={pxParse}
            value={radius}
            onValueChange={setRadius}
            min={0}
            max={999}
          >
            <UnitField.DragArea className={DRAG_AREA}>
              <BoxIcon className="size-3.5" />
            </UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>
        </FieldRow>

        <FieldRow label="Rotation">
          <UnitField.Root
            className={FIELD}
            format={degFormat}
            parse={degParse}
            value={rotation}
            onValueChange={setRotation}
            min={0}
            max={360}
          >
            <UnitField.DragArea className={DRAG_AREA}>
              <RotateCwIcon className="size-3.5" />
            </UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>
        </FieldRow>

        <FieldRow label="Opacity">
          <UnitField.Root
            className={FIELD}
            format={pctFormat}
            parse={pctParse}
            value={opacity}
            onValueChange={setOpacity}
            min={0}
            max={100}
          >
            <UnitField.DragArea className={DRAG_AREA}>
              <PercentIcon className="size-3.5" />
            </UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>
        </FieldRow>

        <FieldRow label="Border">
          <UnitField.Root
            className={FIELD}
            format={pxFormat}
            parse={pxParse}
            value={border}
            onValueChange={setBorder}
            min={0}
            max={20}
          >
            <UnitField.DragArea className={DRAG_AREA}>
              <RulerIcon className="size-3.5" />
            </UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>
        </FieldRow>
      </div>

      <div className="mt-6 flex items-center justify-center rounded-xl bg-stone-100/50 p-8">
        <div
          className="bg-stone-800"
          style={{
            width,
            height,
            borderRadius: radius,
            transform: `rotate(${rotation}deg)`,
            opacity: opacity / 100,
            borderWidth: border,
            borderColor: '#a8a29e',
            borderStyle: 'solid',
            transition: 'all 150ms ease',
          }}
        />
      </div>
    </section>
  );
}

function PaddingDemo() {
  const [top, setTop] = useState(16);
  const [right, setRight] = useState(24);
  const [bottom, setBottom] = useState(16);
  const [left, setLeft] = useState(24);

  return (
    <section>
      <header className="mb-6">
        <p className="font-mono text-[10px] tracking-widest text-stone-300">
          02
        </p>
        <h3 className="mt-1 text-[15px] font-semibold tracking-[-0.01em] text-stone-800">
          Padding
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-stone-400">
          Grouped fields with linked pairs — drag any icon to adjust.
        </p>
      </header>

      <div className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <UnitField.Root
            className={FIELD}
            format={pxFormat}
            parse={pxParse}
            value={top}
            onValueChange={setTop}
            min={0}
            max={100}
          >
            <UnitField.DragArea className={DRAG_AREA}>
              <span className="text-[10px] font-medium">T</span>
            </UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>

          <UnitField.Root
            className={FIELD}
            format={pxFormat}
            parse={pxParse}
            value={right}
            onValueChange={setRight}
            min={0}
            max={100}
          >
            <UnitField.DragArea className={DRAG_AREA}>
              <span className="text-[10px] font-medium">R</span>
            </UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>

          <UnitField.Root
            className={FIELD}
            format={pxFormat}
            parse={pxParse}
            value={bottom}
            onValueChange={setBottom}
            min={0}
            max={100}
          >
            <UnitField.DragArea className={DRAG_AREA}>
              <span className="text-[10px] font-medium">B</span>
            </UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>

          <UnitField.Root
            className={FIELD}
            format={pxFormat}
            parse={pxParse}
            value={left}
            onValueChange={setLeft}
            min={0}
            max={100}
          >
            <UnitField.DragArea className={DRAG_AREA}>
              <span className="text-[10px] font-medium">L</span>
            </UnitField.DragArea>
            <UnitField.Input className={INPUT} />
          </UnitField.Root>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center rounded-xl bg-stone-100/50 p-6">
        <div className="relative inline-block border border-dashed border-stone-300">
          <div
            style={{
              paddingTop: top,
              paddingRight: right,
              paddingBottom: bottom,
              paddingLeft: left,
              transition: 'all 150ms ease',
            }}
          >
            <div className="h-16 w-32 rounded-lg bg-stone-800" />
          </div>
          <span className="absolute top-1/2 left-1 -translate-y-1/2 font-mono text-[9px] text-stone-400">
            {left}
          </span>
          <span className="absolute top-1/2 right-1 -translate-y-1/2 font-mono text-[9px] text-stone-400">
            {right}
          </span>
          <span className="absolute top-1 left-1/2 -translate-x-1/2 font-mono text-[9px] text-stone-400">
            {top}
          </span>
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[9px] text-stone-400">
            {bottom}
          </span>
        </div>
      </div>
    </section>
  );
}

function CommittedDemo() {
  const [value, setValue] = useState(50);
  const [committed, setCommitted] = useState(50);

  const handleCommitted = useCallback((v: number) => {
    setCommitted(v);
  }, []);

  return (
    <section>
      <header className="mb-6">
        <p className="font-mono text-[10px] tracking-widest text-stone-300">
          03
        </p>
        <h3 className="mt-1 text-[15px] font-semibold tracking-[-0.01em] text-stone-800">
          Committed Value
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-stone-400">
          Live value updates on drag, committed value fires on release.
        </p>
      </header>

      <UnitField.Root
        className={FIELD}
        format={pctFormat}
        parse={pctParse}
        value={value}
        onValueChange={setValue}
        onValueCommitted={handleCommitted}
        min={0}
        max={100}
      >
        <UnitField.DragArea className={DRAG_AREA}>
          <PercentIcon className="size-3.5" />
        </UnitField.DragArea>
        <UnitField.Input className={INPUT} />
      </UnitField.Root>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2">
          <span className="text-[12px] text-stone-400">Live</span>
          <span className="font-mono text-[13px] text-stone-600 tabular-nums">
            {value}%
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2">
          <span className="text-[12px] text-stone-400">Committed</span>
          <span className="font-mono text-[13px] text-stone-600 tabular-nums">
            {committed}%
          </span>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl bg-stone-100/50">
        <div
          className="h-2 rounded-full bg-stone-800 transition-all duration-75"
          style={{ width: `${value}%` }}
        />
      </div>
    </section>
  );
}

export function UnitFieldDemo() {
  return (
    <div>
      <header className="mb-16 max-w-lg">
        <h1 className="font-serif text-4xl font-light tracking-tight text-stone-800">
          unit-field
        </h1>
        <div className="mt-3 h-[1.5px] w-20 rounded-full bg-stone-300" />
        <p className="mt-4 text-sm leading-relaxed text-stone-400">
          Draggable numeric inputs with custom formatting. Compose from Root,
          DragArea, and Input — supports px, deg, %, or any unit.
        </p>
      </header>

      <div className="grid items-start gap-14 md:grid-cols-2 lg:grid-cols-3">
        <BasicDemo />
        <PaddingDemo />
        <CommittedDemo />
      </div>
    </div>
  );
}
