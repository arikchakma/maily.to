import type { AllowedFieldMode } from '@maily-to/shared';
import type { Editor } from '@tiptap/core';
import { useEditorState } from '@tiptap/react';
import { MaximizeIcon } from 'lucide-react';

import { useEditorRootContext } from '~/components/editor/editor-root-context';
import type { ButtonAttributes } from '~/extensions/button/button';
import { useEditorInstance } from '~/hooks/use-editor-instance';
import type { FloatingUIContainer } from '~/types/floating-ui';

import { SideIcon } from '../icons/side-icon';
import { Divider } from '../interface/divider';
import type { MultiValue, Side } from '../interface/multi-unit-field';
import { MultiUnitField, SIDE_AXES } from '../interface/multi-unit-field';
import { PopoverBack } from '../interface/popover';

export const PADDING_PRESETS = [
  { value: 0, label: 'None' },
  { value: 8, label: 'Small' },
  { value: 16, label: 'Medium' },
  { value: 32, label: 'Large' },
];

type ButtonPaddingStyleConfigProps = {
  container: FloatingUIContainer;
  editor: Editor;
  onBack: () => void;
};

export function ButtonPaddingStyleConfig(props: ButtonPaddingStyleConfigProps) {
  const { container, editor, onBack } = props;

  const editorInstance = useEditorInstance(editor);
  const { theme } = useEditorRootContext();
  const buttonTheme = theme.button;

  const state = useEditorState({
    editor: editorInstance,
    selector: (ctx) => {
      const button = ctx.editor.getAttributes('button') as ButtonAttributes;

      return {
        paddingMode: button.paddingMode,
        paddingValues: {
          top: button.paddingTop ?? buttonTheme?.paddingTop ?? 0,
          right: button.paddingRight ?? buttonTheme?.paddingRight ?? 0,
          bottom: button.paddingBottom ?? buttonTheme?.paddingBottom ?? 0,
          left: button.paddingLeft ?? buttonTheme?.paddingLeft ?? 0,
        },
      };
    },
  });

  const handlePaddingModeChange = (nextPaddingMode: AllowedFieldMode) => {
    editorInstance
      .chain()
      .updateButtonAttributes({ paddingMode: nextPaddingMode })
      .run();
  };

  const handlePaddingValuesChange = (nextPaddingValues: MultiValue<Side>) => {
    editorInstance
      .chain()
      .updateButtonAttributes({
        paddingTop: nextPaddingValues.top,
        paddingRight: nextPaddingValues.right,
        paddingBottom: nextPaddingValues.bottom,
        paddingLeft: nextPaddingValues.left,
      })
      .run();
  };

  return (
    <div className="mly:flex mly:flex-col mly:gap-1">
      <PopoverBack onClick={onBack}>Padding</PopoverBack>

      <Divider type="horizontal" className="mly:-mx-1" />

      <MultiUnitField
        container={container}
        label="Padding"
        dragAreaIcon={
          <MaximizeIcon className="mly:size-3.5 mly:text-midnight-gray" />
        }
        mode={state.paddingMode}
        onModeChange={handlePaddingModeChange}
        values={state.paddingValues}
        onValuesChange={handlePaddingValuesChange}
        presets={PADDING_PRESETS}
        min={0}
        max={100}
        suffix="px"
        axes={SIDE_AXES}
        axisIcons={{
          top: (
            <SideIcon
              side="top"
              className="mly:size-3.5 mly:text-midnight-gray"
            />
          ),
          right: (
            <SideIcon
              side="right"
              className="mly:size-3.5 mly:text-midnight-gray"
            />
          ),
          bottom: (
            <SideIcon
              side="bottom"
              className="mly:size-3.5 mly:text-midnight-gray"
            />
          ),
          left: (
            <SideIcon
              side="left"
              className="mly:size-3.5 mly:text-midnight-gray"
            />
          ),
        }}
      />
    </div>
  );
}
