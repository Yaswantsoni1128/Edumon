import XLSX from 'xlsx';

export const generateTemplate = (headers) => {
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
};

export const parseExcel = (buffer) => {
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    return XLSX.utils.sheet_to_json(ws);
};
