import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'your-secret-key';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Mock user check (replace with actual DB logic)
  const user = { email: 'test@example.com', password: await bcrypt.hash('password', 10) };

  if (email !== user.email || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: 1 }, JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
}
