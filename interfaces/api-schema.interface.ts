export interface ApiField {
    id: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'radio' | 'checkbox' | 'group';
    required?: boolean;
    options?: string[];
    fields?: ApiField[];
}

export interface ApiSchema {
    formId: string;
    title: string;
    fields: ApiField[];
}