import { AnyExtension } from '@tiptap/core';
import { getVariableSuggestions } from '../nodes/variable/variable-suggestions';
import { MailyContextType } from '../provider';
import { MailyKit } from './maily-kit';
import { SlashCommandExtension } from './slash-command/slash-command';
import { getSlashCommandSuggestions } from './slash-command/slash-command-view';
import { VariableExtension } from '@/extensions';
import { HTMLCodeBlock } from '../nodes/html/html';

type ExtensionsProps = Partial<MailyContextType> & {
  extensions?: AnyExtension[];
};

export function extensions(props: ExtensionsProps) {
  const {
    variables,
    blocks,
    variableTriggerCharacter,
    extensions = [],
  } = props;

  const defaultExtensions = [
    MailyKit,
    SlashCommandExtension.configure({
      suggestion: getSlashCommandSuggestions(blocks),
    }),
    VariableExtension.configure({
      suggestion: getVariableSuggestions(variables, variableTriggerCharacter),
    }),
    HTMLCodeBlock,
  ].filter((ext) => {
    return !extensions.some((e) => e.name === ext.name);
  });

  return [...defaultExtensions, ...extensions];
}
