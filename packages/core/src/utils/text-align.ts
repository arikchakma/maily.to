import { allowedTextAligns } from '@maily-to/shared';

export const INVALID_ALIGNMENT_VALUE_ERROR = `Invalid alignment. The value should be one of the following values: ${allowedTextAligns.join(', ')}.

Please create an issue at https://github.com/arikchakma/maily.to/issues if you think this is a bug.
`;
