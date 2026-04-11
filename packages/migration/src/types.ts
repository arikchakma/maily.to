export type MigrationWarning = {
  nodeType: string;
  field: string;
  message: string;
};

export type MigrationResult = {
  json: Record<string, any>;
  warnings: MigrationWarning[];
};
