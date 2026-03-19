import * as XLSX from 'xlsx';
import * as fs from 'fs';

const filePath = 'c:\\Users\\Jss Montalvan\\Desktop\\CONSENSO\\back\\api-ind-com-sellout-backend\\info\\base_errores.xlsx';
const outputFile = 'c:\\Users\\Jss Montalvan\\Desktop\\CONSENSO\\back\\api-ind-com-sellout-backend\\info\\debug_results.md';

const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

let report = `# Excel Debug Report: ${sheetName}\n\n`;
report += `Total rows: ${data.length}\n\n`;

report += `## First 10 rows\n\n`;
report += '```json\n' + JSON.stringify(data.slice(0, 10), null, 2) + '\n```\n\n';

const samples = [
    'TELEVISOR',
    'INDURAMA',
    'MOTOROLA',
    'AUTOM', 
    'GUASMO',
    'GYE',
    'MAYOREO'
];

report += `## Search findings\n\n`;
samples.forEach(sample => {
    const findings = data.filter((row: any) => 
        Object.values(row).some(val => 
            String(val).toUpperCase().includes(sample)
        )
    ).slice(0, 5);
    if (findings.length > 0) {
        report += `### Findings for "${sample}"\n\n`;
        report += '```json\n' + JSON.stringify(findings, null, 2) + '\n```\n\n';
    }
});

fs.writeFileSync(outputFile, report);
process.exit(0);
