import { AnyExtension } from '@tiptap/core';
import { getVariableSuggestions } from '../nodes/variable/variable-suggestions';
import { MailyContextType } from '../provider';
import { MailyKit } from './maily-kit';
import { SlashCommandExtension } from './slash-command/slash-command';
import { getSlashCommandSuggestions } from './slash-command/slash-command-view';

type ExtensionsProps = Partial<MailyContextType> & {
  extensions?: AnyExtension[];
};

export function extensions(props: ExtensionsProps) {
  const { variables, blocks, variableTriggerCharacter, extensions } = props;

  return [
    ...(extensions?.length
      ? extensions
      : [
          MailyKit.configure({
            variable: {
              suggestion: getVariableSuggestions(
                variables,
                variableTriggerCharacter
              ),
            },
          }),
        ]),

    SlashCommandExtension.configure({
      suggestion: getSlashCommandSuggestions(blocks),
    }),
  ];
}
