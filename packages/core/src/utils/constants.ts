/**
 * HTML attributes that suppress browser and third-party password manager
 * autofill popups on text inputs that aren't credentials fields.
 */
export const AUTOCOMPLETE_PASSWORD_MANAGERS_OFF = Object.freeze({
  autoComplete: 'off',
  'data-1p-ignore': true,
  'data-form-type': 'other',
});
