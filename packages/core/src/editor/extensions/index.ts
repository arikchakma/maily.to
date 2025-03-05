import { VariableExtension } from '@/extensions';
import { AnyExtension } from '@tiptap/core';
import { HTMLCodeBlockExtension } from '../nodes/html/html';
import { InlineImageExtension } from '../nodes/inline-image/inline-image';
import { getVariableSuggestions } from '../nodes/variable/variable-suggestions';
import { MailyContextType } from '../provider';
import { ImageUploadExtension } from './image-upload';
import { MailyKit } from './maily-kit';
import { PlaceholderExtension } from './placeholder';
import { SlashCommandExtension } from './slash-command/slash-command';
import { getSlashCommandSuggestions } from './slash-command/slash-command-view';

type ExtensionsProps = Partial<MailyContextType> & {
  extensions?: AnyExtension[];
  onImageUpload?: (file: Blob) => Promise<string>;
};

export function extensions(props: ExtensionsProps) {
  const {
    variables,
    blocks,
    variableTriggerCharacter,
    extensions = [],
    onImageUpload,
  } = props;

  const defaultExtensions = [
    MailyKit,
    SlashCommandExtension.configure({
      suggestion: getSlashCommandSuggestions(blocks),
    }),
    VariableExtension.configure({
      suggestion: getVariableSuggestions(variables, variableTriggerCharacter),
    }),
    HTMLCodeBlockExtension,
    InlineImageExtension,
    PlaceholderExtension,
    ...(onImageUpload
      ? [
          ImageUploadExtension.configure({
            onImageUpload,
          }),
        ]
      : []),
  ].filter((ext) => {
    return !extensions.some((e) => e.name === ext.name);
  });

  return [...defaultExtensions, ...extensions];
}
