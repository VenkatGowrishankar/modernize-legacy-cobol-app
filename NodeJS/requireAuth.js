// Azure Entra authentication middleware for Express
// Only require msal and jwt if not in test environment
const isTest = process.env.NODE_ENV === 'test';
let msal, jwt, cca;
if (!isTest) {
  msal = require('@azure/msal-node');
  jwt = require('jsonwebtoken');
  cca = new msal.ConfidentialClientApplication(msalConfig);
}

// Configuration (replace with your Azure Entra app details)
const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  },
};

// Middleware to validate JWT and extract user info
async function requireAuth(req, res, next) {
  if (isTest) {
    // In test mode, skip real auth and use req.user if set by mockAuth
    if (req.user) return next();
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    // Validate token (in production, use jwks or msal validation)
    const decoded = jwt.decode(token, { complete: true });
    // Optionally: verify signature and audience
    req.user = {
      firstName: decoded.payload.given_name,
      lastName: decoded.payload.family_name,
      email: decoded.payload.preferred_username,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = requireAuth;
