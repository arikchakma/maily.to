import './styles/index.css';
import './styles/preflight.css';
import './styles/tailwind.css';

export * from './editor/index';
export { MailyKit, type MailyKitOptions } from './editor/extensions/maily-kit';
export { getVariableSuggestions } from './editor/nodes/variable/variable-suggestions';
export { VariableExtension } from './editor/nodes/variable/variable';
