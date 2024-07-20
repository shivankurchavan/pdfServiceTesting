import handlebars from 'handlebars';
import * as fs from 'fs';
import puppeteer from 'puppeteer';
import csvParser from 'csv-parser';
import { resolve } from 'path';
import { promisify } from 'util';
import axios from 'axios';
import FormData from 'form-data';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

// Function to read CSV and return student names
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const students = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        if (row.name) {
          students.push(row.name);
        }
      })
      .on('end', () => {
        resolve(students);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Function to compile Handlebars template
function compileTemplate(data, templateName) {
  const templateHtml = fs.readFileSync(`./templates/${templateName}`, 'utf8');
  const template = handlebars.compile(templateHtml);
  return template(data);
}

// Function to create HTML file for a student
async function createHTML(data, htmlPath) {
  const html = compileTemplate(data, 'certificate.html');
  await writeFile(htmlPath, html);
}

// Function to send HTML to Gotenberg and get PDF
async function sendToGotenberg(htmlPath, pdfPath) {
  const form = new FormData();
  form.append('files', fs.createReadStream(htmlPath));

  const response = await axios.post('http://localhost:4000/forms/chromium/convert/html', form, {
    headers: form.getHeaders(),
    responseType: 'stream',
  });

  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(pdfPath);
    response.data.pipe(stream);
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

// Main function to generate certificates
async function generateCertificates() {
  const csvFilePath = './data/names.csv';
  const students = await readCSV(csvFilePath);

  // Debugging line to check the read students
  // if (!students || students.length === 0) {
  //   console.error('No students found in the CSV file.');
  //   return;
  // }
  // console.log('Students:', students); 

  if (!fs.existsSync('./htmls')) {
    await mkdir('./htmls');
  }
  if (!fs.existsSync('./certificates')) {
    await mkdir('./certificates');
  }

  const htmlPromises = students.map(student => {
    const data = { name: student, issue_date: new Date().toLocaleDateString() };
    const htmlPath = `./htmls/${student.replace(/\s+/g, '_')}.html`;
    return createHTML(data, htmlPath);
  });

  await Promise.all(htmlPromises);

  const pdfPromises = students.map(student => {
    const htmlPath = `./htmls/${student.replace(/\s+/g, '_')}.html`;
    const pdfPath = `./certificates/${student.replace(/\s+/g, '_')}.pdf`;
    return sendToGotenberg(htmlPath, pdfPath);
  });

  await Promise.all(pdfPromises);
}

// IIFE to run the main function and measure execution time
(async () => {
  console.time('Execution Time');
  await generateCertificates();
  console.timeEnd('Execution Time');
})();
