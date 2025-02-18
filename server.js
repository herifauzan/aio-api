const express = require('express');
const serverless = require('serverless-http'); // Important!
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const app = express();
const port = process.env.PORT || 3000;

// Supabase configuration
const supabaseUrl = "https://hzhfgowxebxvksorcomp.supabase.co";//process.env.SUPABASE_URL;
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6aGZnb3d4ZWJ4dmtzb3Jjb21wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNzQzNDAsImV4cCI6MjA1NDg1MDM0MH0.SkOM0guCBApUgu5j_mGmORud63Id5whHhVe8Mfuc8YM";//process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


// JWT Secret (Ganti dengan secret yang kuat dan simpan di environment variable)
const jwtSecret = process.env.JWT_SECRET || 'your_secret_key'; // Default hanya untuk development

app.use(express.json());

// Middleware untuk autentikasi JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Ambil token dari header Authorization (Bearer <token>)

    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Jika token tidak valid atau kadaluarsa
      }

      req.user = user; // Tambahkan informasi user ke request
      next(); // Lanjutkan ke route selanjutnya
    });
  } else {
    res.sendStatus(401); // Jika tidak ada token di header Authorization
  }
};

// Contoh endpoint API yang memerlukan autentikasi
app.get('/api/products', authenticateJWT, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/health', async (req, res) => {
    try {
      const data = {"Hi":"I'm healthy service"}
  
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get health' });
    }
  });

// Endpoint untuk login dan generate token JWT
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log( "/login", email, " ", password );
  // Cari user di database (contoh: Supabase)
  const { data: user, error } = await supabase
    .from('users') // Ganti 'users' dengan nama tabel user Anda
    .select('*')
    .eq('email', email)
    .eq('password', password) // Ini contoh sederhana, sebaiknya gunakan hash password
    .single();
  console.log( "status login: ", error );
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Generate token JWT
  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' }); // Contoh: token berlaku 1 jam

  res.json({ token });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports.handler = serverless(app);