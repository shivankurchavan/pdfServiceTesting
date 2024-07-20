// generate-pdfs.js
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const students = ["John Doe", "Jane Smith", "Alice Johnson"];

  for (const student of students) {
    const htmlPath = path.join(__dirname, `${student.replace(/ /g, '_')}.html`);
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    await page.setContent(htmlContent);
    await page.pdf({ path: `${student.replace(/ /g, '_')}.pdf`, format: 'A4' });
  }

  await browser.close();
})();
