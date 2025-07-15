'use strict';

const fs = require('fs');
const path = require('path');

const inputDir = process.argv[2];

if (!inputDir) {
  console.error('Usage: node report.js <directory_path>');
  process.exit(1);
}

const outputFile = path.join(__dirname, 'report.txt');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
}

function generateReport(files) {
  let report = `Review my code.
Focus on:

code cleanliness (readability, simplicity, no duplication);

clean architecture (proper layering, correct dependencies);

GRASP and SOLID principles;

correct use of GoF patterns.

Suggest specific improvements.
Highlight what is done well.
Don't rewrite everything — just comment and suggest.

`;
  files.forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf-8');
    report += `Content of ${filePath}\n\`\`\`\n${content}\n\`\`\`\n\n`;
  });
  return report;
}

const allFiles = getAllFiles(inputDir);
const reportContent = generateReport(allFiles);

fs.writeFileSync(outputFile, reportContent, 'utf-8');
console.log(`Report generated: ${outputFile}`);
