import { useId } from 'react';

import { FieldInput, FieldLabel, FieldRoot } from '../interface/field';

export type ImageMetadataFieldProps = {
  content: string;
  label: string;
  onContentChange: (content: string) => void;
  placeholder: string;
};

export function ImageMetadataField(props: ImageMetadataFieldProps) {
  const { content, label, onContentChange, placeholder } = props;
  const fieldId = useId();

  return (
    <FieldRoot data-mly-metadata-field="">
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <FieldInput
        defaultValue={content}
        id={fieldId}
        onChange={(event) => onContentChange(event.target.value)}
        placeholder={placeholder}
      />
    </FieldRoot>
  );
}
