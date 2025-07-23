const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/generate-pdf', async (req, res) => {
  const html = req.body.html;

  if (!html) {
    return res.status(400).send('Missing HTML content.');
  }

  const pdfPath = path.join(__dirname, `${uuidv4()}.pdf`);

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '20mm',
        bottom: '10mm',
        left: '20mm'
      }
    });

    await browser.close();

    res.download(pdfPath, 'report.pdf', () => {
      fs.unlinkSync(pdfPath); // Clean up after download
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to generate PDF');
  }
});

app.get('/', (req, res) => {
  res.send('PDF Generator is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
