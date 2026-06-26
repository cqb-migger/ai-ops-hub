import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), 'base/data/steps.json');

  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return res.status(200).json(JSON.parse(data));
    } catch (error) {
      return res.status(500).json({ error: 'Failed to read steps data' });
    }
  }

  if (req.method === 'POST') {
    try {
      const steps = req.body;
      if (!Array.isArray(steps)) {
        return res.status(400).json({ error: 'Invalid data format. Expected an array of steps.' });
      }
      fs.writeFileSync(filePath, JSON.stringify(steps, null, 2), 'utf8');
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save steps data' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
