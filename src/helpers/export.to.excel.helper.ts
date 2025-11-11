import ExcelJS from 'exceljs';

interface ColumnDef {
    header: string;
    key: string;
    width?: number;
}

export async function exportToExcel(
    excelName: string,
    columns: ColumnDef[],
    data: any[]
): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(excelName);

    worksheet.columns = columns;

    data.forEach(item => {
        worksheet.addRow(item);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return Buffer.from(buffer);
}
