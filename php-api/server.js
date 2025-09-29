const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 8001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Initialize SQLite database
const dbPath = path.join(__dirname, 'data', 'maily.db');
const dataDir = path.dirname(dbPath);

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS mails (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      preview_text TEXT,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  db.run(`CREATE INDEX IF NOT EXISTS idx_mails_user_id ON mails(user_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_mails_created_at ON mails(created_at)`);
});

// Simple auth middleware (for demo purposes)
const getCurrentUser = (req) => {
  // In a real app, you'd validate JWT tokens or session
  // For demo, return a mock user
  return {
    id: 'demo_user_123',
    email: 'demo@example.com',
    name: 'Demo User'
  };
};

// API Routes

// Create template
app.post('/api/v1/templates', (req, res) => {
  const user = getCurrentUser(req);
  const { title, previewText, content } = req.body;

  if (!title || title.trim().length < 3) {
    return res.status(400).json({
      status: 400,
      message: 'Validation failed',
      errors: ['Title must be at least 3 characters']
    });
  }

  if (!content) {
    return res.status(400).json({
      status: 400,
      message: 'Validation failed',
      errors: ['Content is required']
    });
  }

  const templateId = 'template_' + Date.now();
  
  db.run(
    'INSERT INTO mails (id, user_id, title, preview_text, content) VALUES (?, ?, ?, ?, ?)',
    [templateId, user.id, title.trim(), previewText || null, content],
    function(err) {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: 'Failed to create template',
          errors: []
        });
      }
      
      res.json({ template: { id: templateId } });
    }
  );
});

// Update template
app.post('/api/v1/templates/:templateId', (req, res) => {
  const user = getCurrentUser(req);
  const { templateId } = req.params;
  const { title, previewText, content } = req.body;

  if (!title || title.trim().length < 3) {
    return res.status(400).json({
      status: 400,
      message: 'Validation failed',
      errors: ['Title must be at least 3 characters']
    });
  }

  if (!content) {
    return res.status(400).json({
      status: 400,
      message: 'Validation failed',
      errors: ['Content is required']
    });
  }

  db.run(
    'UPDATE mails SET title = ?, preview_text = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
    [title.trim(), previewText || null, content, templateId, user.id],
    function(err) {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: 'Failed to update template',
          errors: []
        });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({
          status: 404,
          message: 'Template not found',
          errors: []
        });
      }
      
      res.json({ status: 'ok' });
    }
  );
});

// Delete template
app.delete('/api/v1/templates/:templateId', (req, res) => {
  const user = getCurrentUser(req);
  const { templateId } = req.params;

  db.run(
    'DELETE FROM mails WHERE id = ? AND user_id = ?',
    [templateId, user.id],
    function(err) {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: 'Failed to delete template',
          errors: []
        });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({
          status: 404,
          message: 'Template not found',
          errors: []
        });
      }
      
      res.json({ status: 'ok' });
    }
  );
});

// Duplicate template
app.post('/api/v1/templates/:templateId/duplicate', (req, res) => {
  const user = getCurrentUser(req);
  const { templateId } = req.params;

  db.get(
    'SELECT * FROM mails WHERE id = ? AND user_id = ?',
    [templateId, user.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: 'Failed to duplicate template',
          errors: []
        });
      }
      
      if (!row) {
        return res.status(404).json({
          status: 404,
          message: 'Template not found',
          errors: []
        });
      }

      const newTemplateId = 'template_' + Date.now();
      
      db.run(
        'INSERT INTO mails (id, user_id, title, preview_text, content) VALUES (?, ?, ?, ?, ?)',
        [newTemplateId, user.id, row.title + ' (Copy)', row.preview_text, row.content],
        function(err) {
          if (err) {
            return res.status(500).json({
              status: 500,
              message: 'Failed to duplicate template',
              errors: []
            });
          }
          
          res.json({ template: { id: newTemplateId } });
        }
      );
    }
  );
});

// Email preview
app.post('/api/v1/emails/preview', (req, res) => {
  const { content, previewText, theme } = req.body;
  
  if (!content) {
    return res.status(400).json({
      status: 400,
      message: 'Content is required',
      errors: []
    });
  }

  // Simple HTML renderer (in production, you'd use the same renderer as the React app)
  const html = renderEmailContent(content, previewText, theme);
  
  res.json({ html });
});

// Auth endpoints (simplified for demo)
app.get('/api/auth/callback', (req, res) => {
  res.redirect('/?authenticated=true');
});

app.get('/api/auth/confirm', (req, res) => {
  res.redirect('/?confirmed=true');
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Development fallback
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Maily Editor - PHP Backend</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
          .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #333; }
          .step { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 4px; }
          code { background: #e9ecef; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
          .highlight { background: #fff3cd; padding: 10px; border-radius: 4px; border-left: 4px solid #ffc107; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Maily Editor - Node.js Backend</h1>
          <p>This is the Node.js backend for the Maily email editor. To run the full application:</p>
          
          <div class="step">
            <h3>1. Build the React Frontend</h3>
            <code>cd apps/web && npm run build</code>
          </div>
          
          <div class="step">
            <h3>2. Copy built files to backend</h3>
            <code>cp -r apps/web/build/* php-api/dist/</code>
          </div>
          
          <div class="step">
            <h3>3. Install Node.js dependencies</h3>
            <code>cd php-api && npm install</code>
          </div>
          
          <div class="step">
            <h3>4. Start the server</h3>
            <code>cd php-api && node server.js</code>
          </div>
          
          <div class="highlight">
            <strong>Development Mode:</strong> For development, you can run the React dev server on port 3000 
            and this Node.js API on port 8001, then proxy API requests from the React app to this backend.
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

// Simple email content renderer
function renderEmailContent(content, previewText, theme) {
  const preview = previewText ? `<div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">${previewText}</div>` : '';
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  ${preview}
  <style>
    body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
    .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .email-content { padding: 20px; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-content">
      <p>Email content would be rendered here...</p>
      <pre>${JSON.stringify(content, null, 2)}</pre>
    </div>
  </div>
</body>
</html>`;
}

// Start server
const port = process.env.PORT || PORT;
app.listen(port, () => {
  console.log(`🚀 Maily PHP-compatible backend running on http://localhost:${port}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'dist')}`);
  console.log(`💾 Database: ${dbPath}`);
});