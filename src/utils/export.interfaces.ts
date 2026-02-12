export interface ExportField {
    key: string;
    header: string;
    transform?: (value: any, item: any) => any;
}

export interface ExportFieldAvanced {
    key: string;
    header: string;
    width?: number;
    transform?: (value: any, item: any) => any;
    type?: 'string' | 'number' | 'date' | 'boolean';
}
