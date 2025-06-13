import express from 'express';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '5mb' }));

app.post('/sticker', async (req, res) => {
  const { imageBase64 } = req.body;

  if (!imageBase64 || typeof imageBase64 !== 'string') {
    return res.status(400).json({ error: 'Field imageBase64 is required.' });
  }

  try {
    const base64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    const sticker = new Sticker(buffer, {
      pack: '@Shinai/formatter',
      author: 'Shinai Developer',
      type: StickerTypes.FULL,
      quality: 80,
    });

    const webp = await sticker.toBuffer();

    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Content-Disposition', 'attachment; filename=sticker.webp');
    res.send(webp);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sticker generation failed', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
