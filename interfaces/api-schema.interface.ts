import type { CSSProperties } from 'react';

export interface ApiVisibilityCondition {
    dependsOn: string;
    condition: 'equals' | 'not_equals';
    value: string | number | boolean;
}

export interface ApiDynamicOptionsConfig {
    dependsOn: string;
    method: 'GET' | 'POST';
    endpoint: string;
}

export interface ApiField {
    id: string;

    label: string;

    type: 'text' | 'number' | 'date' | 'select' | 'radio' | 'checkbox' | 'group';

    placeholder?: string;

    required?: boolean;

    options?: string[];

    fields?: ApiField[];

    visibility?: ApiVisibilityCondition;

    dynamicOptions?: ApiDynamicOptionsConfig;

    style?: CSSProperties;
}

export interface ApiSchema {
    formId: string;
    title: string;
    fields: ApiField[];
}