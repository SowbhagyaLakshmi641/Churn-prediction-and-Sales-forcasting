import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Mock registration (replace with actual DB logic)
  const hashedPassword = await bcrypt.hash(password, 10);
  // Save user to DB

  res.status(201).json({ message: 'User registered successfully' });
}
