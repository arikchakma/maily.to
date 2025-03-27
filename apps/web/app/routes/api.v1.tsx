import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function SwaggerUiPage() {
  return (
    <SwaggerUI url={`${import.meta.env.VITE_APP_URL}/api/v1/swagger.json`} />
  );
}
