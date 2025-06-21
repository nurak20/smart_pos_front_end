import * as XLSX from 'xlsx';

const ExportExcel = (data, fileName) => {
    // 1. Convert data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 2. Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // 3. Write the workbook to an Excel file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
