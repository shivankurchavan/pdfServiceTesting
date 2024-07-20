import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const HTML_DIR = './htmls'; // Adjust this path
const OUTPUT_DIR = './pdf';
const TEMP_FILE = 'index.html';
const GOTENBURG_URL = 'http://localhost:3000/forms/chromium/convert/html';
const CONCURRENCY_LIMIT = 4; // Number of concurrent requests

// Ensure the output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Get the current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let lock = false; 

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generatePDF(htmlFile) {
    const baseName = path.basename(htmlFile, '.html');
    const tempPath = path.join(HTML_DIR, TEMP_FILE);

    try {
        // Acquire lock
        while (lock) {
            await delay(100);
        }
        lock = true;

        // Copy the original file to index.html
        fs.copyFileSync(htmlFile, tempPath);

        // Prepare form data
        const form = new FormData();
        form.append('files', fs.createReadStream(tempPath));

        // Release lock
        lock = false;

        // Send the request to Gotenburg
        const response = await axios.post(GOTENBURG_URL, form, {
            headers: {
                ...form.getHeaders()
            },
            responseType: 'arraybuffer'
        });

        // Write the PDF response to the output directory
        const pdfPath = path.join(OUTPUT_DIR, `${baseName}.pdf`);
        fs.writeFileSync(pdfPath, response.data);
        console.log(`Generated PDF for ${baseName}`);
    } catch (error) {
        console.error(`Failed to generate PDF for ${baseName}:`, error.message);
    } finally {
        // Clean up: remove the temporary index.html
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }

        // Ensure lock is released
        lock = false;
    }
}

// Concurrency control function
async function withConcurrencyLimit(htmlFiles, limit, task) {
    const results = [];
    const executing = [];

    for (const file of htmlFiles) {
        const p = task(file).then(result => {
            executing.splice(executing.indexOf(p), 1);
            return result;
        });
        results.push(p);
        executing.push(p);
        if (executing.length >= limit) {
            await Promise.race(executing);
        }
    }
    return Promise.all(results);
}

async function main() {
    try {
        const htmlFiles = fs.readdirSync(HTML_DIR).filter(file => file.endsWith('.html')).map(file => path.join(HTML_DIR, file));

        await withConcurrencyLimit(htmlFiles, CONCURRENCY_LIMIT, generatePDF);

        console.log('All PDFs have been generated.');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

(async () => {
    console.time('Execution Time');
    await main();
    console.timeEnd('Execution Time');
})();
