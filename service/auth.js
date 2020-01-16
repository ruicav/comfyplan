const jwt = require('jsonwebtoken')

const SECRET = 'segredoDoFotografo'

const authService = {
  generateToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
        projects: [...user.projects].map(p => p["UserProject"])
      },
      SECRET,
      { expiresIn: '1h' }
    )
  },
  validateUser: (req, res, next) => {
    jwt.verify(
      req.headers['access-token'],
      SECRET,
      function(err, decoded) {
        if (err) {
          res.status(401).json({ message: 'Invalid credentials' });
        } else {
          req.body.userId = decoded.id;
          req.body.role = decoded.role;
          req.body.projects = decoded.projects;
          next();
        }
      }
    )
  }
}

module.exports = authService