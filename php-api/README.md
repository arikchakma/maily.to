# Maily Editor - PHP Backend

This is the PHP backend for the Maily email editor. It provides API endpoints that work with the existing React frontend.

## Features

- ✅ Full compatibility with existing Maily React frontend
- ✅ PHP API endpoints for templates, emails, and authentication
- ✅ SQLite database for data storage
- ✅ Email rendering and preview functionality
- ✅ Easy deployment with PHP

## Quick Start

### 1. Build the Application

```bash
# Run the build script
./build.sh
```

This will:
- Install PHP dependencies
- Build the React frontend
- Copy built files to the PHP backend
- Set up the database

### 2. Start the Server

```bash
# Start PHP development server
composer run serve
```

The Maily editor will be available at: http://localhost:8001

## Development Mode

For development, you can run both the React dev server and PHP API:

### Terminal 1 - React Dev Server
```bash
cd apps/web
npm run dev
```

### Terminal 2 - PHP API Server
```bash
cd php-api
composer run serve
```

Then configure the React app to proxy API requests to the PHP backend.

## API Endpoints

The PHP backend provides the same API endpoints as the original React Router version:

- `POST /api/v1/templates` - Create new template
- `POST /api/v1/templates/{id}` - Update template
- `DELETE /api/v1/templates/{id}` - Delete template
- `POST /api/v1/templates/{id}/duplicate` - Duplicate template
- `POST /api/v1/emails/preview` - Preview email
- `GET /api/auth/callback` - OAuth callback
- `GET /api/auth/confirm` - Email confirmation
- `POST /api/auth/logout` - Logout

## Database

The application uses SQLite for data storage. The database file is created at `data/maily.db`.

### Tables

- `users` - User accounts
- `mails` - Email templates

## File Structure

```
php-api/
├── public/
│   └── index.php          # Main entry point
├── src/
│   ├── Api/               # API controllers
│   │   ├── TemplatesController.php
│   │   ├── EmailsController.php
│   │   └── AuthController.php
│   └── Core/              # Core classes
│       ├── Router.php
│       ├── Database.php
│       ├── Auth.php
│       └── EmailRenderer.php
├── dist/                  # Built React app (created by build script)
├── data/                  # Database and data files
├── composer.json
└── build.sh
```

## Configuration

### Environment Variables

Create a `.env` file in the `php-api` directory:

```env
# Database
DB_PATH=data/maily.db

# OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# App
APP_URL=http://localhost:8001
```

## Deployment

### Using Apache/Nginx

1. Build the application: `./build.sh`
2. Copy the `php-api` directory to your web server
3. Configure your web server to serve the `public` directory
4. Ensure PHP 8.1+ is installed
5. Run `composer install --no-dev` in production

### Using Docker

```dockerfile
FROM php:8.1-apache

# Install dependencies
RUN apt-get update && apt-get install -y \
    sqlite3 \
    libsqlite3-dev

# Copy application
COPY . /var/www/html

# Install PHP dependencies
RUN composer install --no-dev

# Set permissions
RUN chown -R www-data:www-data /var/www/html

EXPOSE 80
```

## Troubleshooting

### Common Issues

1. **Database not found**: Ensure the `data` directory exists and is writable
2. **API endpoints not working**: Check that the `.htaccess` file is properly configured
3. **React app not loading**: Verify that the build process completed successfully

### Logs

Check PHP error logs for debugging:
- Apache: `/var/log/apache2/error.log`
- Nginx: `/var/log/nginx/error.log`
- PHP-FPM: `/var/log/php-fpm.log`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with both React dev server and PHP backend
5. Submit a pull request

## License

MIT License - see the main Maily repository for details.