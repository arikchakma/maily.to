import { ColorPicker } from '@maily-to/ui';
import { useState } from 'react';

const SWATCHES = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#1c1917',
  '#78716c',
];

const CHANNELS = ['hue', 'saturation', 'brightness', 'alpha'] as const;
const CHANNEL_NAMES: Record<(typeof CHANNELS)[number], string> = {
  hue: 'Hue',
  saturation: 'Saturation',
  brightness: 'Brightness',
  alpha: 'Alpha',
};

const THUMB =
  'size-4.5 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(28,25,23,0.08),0_1px_3px_rgba(28,25,23,0.12)] bg-[var(--color-picker-thumb-color)]';

const SWATCH =
  'size-6 cursor-pointer rounded-lg shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] transition-transform hover:scale-110 data-[selected]:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06),0_0_0_2px_#fff,0_0_0_3.5px_#57534e]';

const AREA_BG =
  'overflow-hidden rounded-2xl bg-[linear-gradient(to_top,#000,transparent),linear-gradient(to_right,#fff,transparent)]';

type SectionHeaderProps = {
  number: string;
  title: string;
  description: string;
  color: string;
};

function SectionHeader(props: SectionHeaderProps) {
  const { number, title, description, color } = props;

  return (
    <header className="mb-6">
      <p className="font-mono text-[10px] tracking-widest text-stone-300">
        {number}
      </p>
      <div className="mt-1 flex items-center gap-2">
        <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-stone-800">
          {title}
        </h3>
        <div
          className="size-2 rounded-full ring-1 ring-black/6"
          style={{ backgroundColor: color }}
        />
      </div>
      <p className="mt-1 text-xs leading-relaxed text-stone-400">
        {description}
      </p>
    </header>
  );
}

function CompletePicker() {
  const [color, setColor] = useState('#3b82f6');

  return (
    <section>
      <SectionHeader
        number="01"
        title="Complete"
        description="Area, sliders, input, and swatches."
        color={color}
      />

      <ColorPicker.Root color={color} onColorChange={setColor}>
        <ColorPicker.Area className="relative h-52 w-full cursor-crosshair rounded-2xl">
          <ColorPicker.AreaBackground className={AREA_BG} />
          <ColorPicker.AreaThumb className={THUMB} />
        </ColorPicker.Area>

        <div className="mt-3.5 space-y-2">
          <ColorPicker.ChannelSlider
            channel="hue"
            className="relative h-2.5 w-full"
          >
            <ColorPicker.ChannelSliderTrack className="h-full w-full rounded-full" />
            <ColorPicker.ChannelSliderThumb className={THUMB} />
          </ColorPicker.ChannelSlider>

          <ColorPicker.ChannelSlider
            channel="alpha"
            className="relative h-2.5 w-full"
          >
            <ColorPicker.ChannelSliderTrack className="h-full w-full rounded-full" />
            <ColorPicker.ChannelSliderThumb className={THUMB} />
          </ColorPicker.ChannelSlider>
        </div>

        <div className="mt-3.5 flex items-center gap-2.5 rounded-full bg-stone-100/70 px-2 py-2">
          <div
            className="size-5 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />
          <ColorPicker.Input
            channel="hex-alpha"
            className="w-full bg-transparent font-mono text-sm text-stone-500 uppercase outline-none focus:text-stone-700 data-invalid:text-red-400"
          />
        </div>

        <ColorPicker.SwatchGroup className="mt-3.5 flex flex-wrap gap-1.5">
          {SWATCHES.map((c) => (
            <ColorPicker.Swatch
              key={c}
              value={c}
              selected={color === c}
              onSelect={setColor}
              className={SWATCH}
            />
          ))}
        </ColorPicker.SwatchGroup>

        <div className="mt-3.5 flex items-center gap-3">
          {CHANNELS.map((ch) => (
            <div key={ch} className="flex items-center gap-1">
              <span className="text-xs font-medium text-stone-300 uppercase">
                {ch[0]}
              </span>
              <ColorPicker.Input
                channel={ch}
                className="w-10 bg-transparent font-mono text-xs text-stone-500 tabular-nums transition-colors outline-none focus:text-stone-700"
              />
            </div>
          ))}
        </div>
      </ColorPicker.Root>
    </section>
  );
}

function ChannelsPicker() {
  const [color, setColor] = useState('#ef4444');

  return (
    <section>
      <SectionHeader
        number="02"
        title="Channels"
        description="Individual H·S·B·A sliders with editable values."
        color={color}
      />

      <ColorPicker.Root color={color} onColorChange={setColor}>
        <div className="space-y-4">
          {CHANNELS.map((ch) => (
            <div key={ch}>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-[12px] font-medium text-stone-500">
                  {CHANNEL_NAMES[ch]}
                </span>
                <ColorPicker.Input
                  channel={ch}
                  className="w-14 bg-transparent text-right font-mono text-[11px] text-stone-400 tabular-nums transition-colors outline-none focus:text-stone-700"
                />
              </div>
              <ColorPicker.ChannelSlider
                channel={ch}
                className="relative h-3 w-full"
              >
                <ColorPicker.ChannelSliderTrack className="h-full w-full rounded-full" />
                <ColorPicker.ChannelSliderThumb className={THUMB} />
              </ColorPicker.ChannelSlider>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2.5 rounded-full bg-stone-100/70 px-2 py-2">
          <div
            className="size-5 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="font-mono text-[13px] text-stone-500">{color}</span>
        </div>
      </ColorPicker.Root>
    </section>
  );
}

function CompactPicker() {
  const [color, setColor] = useState('#8b5cf6');

  return (
    <section>
      <SectionHeader
        number="03"
        title="Compact"
        description="Just the essentials — area and hue."
        color={color}
      />

      <ColorPicker.Root color={color} onColorChange={setColor}>
        <ColorPicker.Area className="relative h-44 w-full cursor-crosshair rounded-2xl">
          <ColorPicker.AreaBackground className={AREA_BG} />
          <ColorPicker.AreaThumb className={THUMB} />
        </ColorPicker.Area>

        <div className="mt-3">
          <ColorPicker.ChannelSlider
            channel="hue"
            className="relative h-[10px] w-full"
          >
            <ColorPicker.ChannelSliderTrack className="h-full w-full rounded-full" />
            <ColorPicker.ChannelSliderThumb className={THUMB} />
          </ColorPicker.ChannelSlider>
        </div>

        <div className="mt-3.5 flex items-center gap-2.5 rounded-full bg-stone-100/70 px-2 py-2">
          <div
            className="size-5 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="font-mono text-[13px] text-stone-500">{color}</span>
        </div>
      </ColorPicker.Root>
    </section>
  );
}

export function ColorPickerDemo() {
  return (
    <div>
      <header className="mb-16 max-w-lg">
        <h1 className="font-serif text-4xl font-light tracking-tight text-stone-800">
          better-color
        </h1>
        <div
          className="mt-3 h-[1.5px] w-20 rounded-full"
          style={{
            background:
              'linear-gradient(to right, #f87171, #fb923c, #facc15, #4ade80, #22d3ee, #60a5fa, #a78bfa)',
          }}
        />
        <p className="mt-4 text-sm leading-relaxed text-stone-400">
          Headless color primitives for React. Compose any picker from the same
          building blocks — each example below uses identical components, styled
          differently.
        </p>
      </header>

      <div className="grid items-start gap-14 md:grid-cols-2 lg:grid-cols-3">
        <CompletePicker />
        <ChannelsPicker />
        <CompactPicker />
      </div>
    </div>
  );
}
