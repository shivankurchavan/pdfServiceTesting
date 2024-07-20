"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handlebars_1 = __importDefault(require("handlebars"));
const fs = __importStar(require("fs"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const path_1 = require("path");
const util_1 = require("util");
const mkdir = (0, util_1.promisify)(fs.mkdir);
const writeFile = (0, util_1.promisify)(fs.writeFile);
// Function to read CSV and return student names
function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        const students = [];
        fs.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
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
    const template = handlebars_1.default.compile(templateHtml);
    return template(data);
}
// Function to create PDF for a student
function createPDF(browser, data, pdfPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const html = compileTemplate(data, 'certificate-unicode.html');
        const htmlFilePath = `./htmls/${pdfPath.split('/')[2]}.html`;
        yield writeFile(htmlFilePath, html);
        const options = {
            format: 'A4',
            printBackground: true,
            path: pdfPath,
        };
        const page = yield browser.newPage();
        const absolutePath = (0, path_1.resolve)(htmlFilePath);
        yield page.goto(`file://${absolutePath}`, { waitUntil: 'networkidle0' });
        yield page.pdf(options);
        yield page.close();
    });
}
// Main function to generate certificates
function generateCertificates() {
    return __awaiter(this, void 0, void 0, function* () {
        const csvFilePath = './data/names-unicode.csv';
        const students = yield readCSV(csvFilePath);
        if (!students || students.length === 0) {
            console.error('No students found in the CSV file.');
            return;
        }
        console.log('Students:', students); // Debugging line to check the read students
        if (!fs.existsSync('./htmls')) {
            yield mkdir('./htmls');
        }
        if (!fs.existsSync('./certificates')) {
            yield mkdir('./certificates');
        }
        const browser = yield puppeteer_1.default.launch({
            args: ['--no-sandbox'],
            headless: true,
        });
        const pdfPromises = students.map(student => {
            const data = { name: student, issue_date: new Date().toLocaleDateString() };
            const pdfPath = `./certificates/${student.replace(/\s+/g, '_')}.pdf`;
            return createPDF(browser, data, pdfPath);
        });
        yield Promise.all(pdfPromises);
        yield browser.close();
    });
}
// IIFE to run the main function and measure execution time
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.time('Execution Time');
    yield generateCertificates();
    console.timeEnd('Execution Time');
}))();
