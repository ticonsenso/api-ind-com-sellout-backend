import * as XLSX from 'xlsx';

const filePath = 'c:\\Users\\Jss Montalvan\\Desktop\\CONSENSO\\back\\api-ind-com-sellout-backend\\info\\base_errores.xlsx';
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

const withoutStore = data.filter((row: any) => !row['COD. ALMACEN']);
console.log(`Rows without store match: ${withoutStore.length} / ${data.length}`);

if (withoutStore.length > 0) {
    console.log('\nSample failures:');
    withoutStore.slice(0, 5).forEach((row: any) => {
        console.log(`- Dist: ${row['DISTRIBUIDOR']} | Code: ${row['COD. ALMACEN DISTRIBUIDOR']} | Period: ${row['PERIODO'] || 'N/A'}`);
    });
}
