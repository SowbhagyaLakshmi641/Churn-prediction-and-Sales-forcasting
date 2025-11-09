import { spawn } from 'child_process';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Run Python script for sales forecast
  const pythonProcess = spawn('python3', ['ml-service/generate_sales_data.py'], {
    cwd: process.cwd(),
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let output = '';
  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ message: 'Forecast failed' });
    }
    try {
      const result = JSON.parse(output);
      res.status(200).json(result);
    } catch (e) {
      res.status(500).json({ message: 'Invalid forecast output' });
    }
  });
}
