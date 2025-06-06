export interface ApiField {
    id: string;
    label: string;
    type: string;
    required?: boolean;
    options?: string[];
    fields?: ApiField[];
}

export interface ApiSchema {
    formId: string;
    title: string;
    fields: ApiField[];
}