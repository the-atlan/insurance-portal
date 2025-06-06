import type { CSSProperties } from 'react';
import type { Rule } from 'antd/es/form';
import type { ButtonProps } from 'antd';

export interface LabelValueOptions {
    label: string;
    value: string | number | boolean;
}

export interface VisibilityCondition {
    dependsOn: string;
    condition: 'equals' | 'not_equals';
    value: any;
}
// export interface ConditionGroup {
//     logic: 'AND' | 'OR';
//     conditions: (SingleCondition | ConditionGroup)[];
// }
// export type VisibilityCondition = SingleCondition | ConditionGroup;

export interface DynamicOptionsConfig {
    dependsOn: string;
    method: string;
    endpoint: string;
}

export interface ColumnDefinition { span: number; field: Field; }
export interface RowDefinition { id: string; columns: ColumnDefinition[]; }
export interface LayoutDefinition { type: 'grid'; rows: RowDefinition[]; }
export interface ActionDefinition { alignment: 'left' | 'center' | 'right'; buttons: ButtonProps[]; }

interface BaseField {
    id: string;
    label: string;
    style?: CSSProperties;
    visibility?: VisibilityCondition;
}

interface TextField extends BaseField {
    type: 'text';
    placeholder?: string;
    validation?: Rule[];
}

interface NumberField extends BaseField {
    type: 'number';
    placeholder?: string;
    validation?: Rule[];
}

interface DateField extends BaseField {
    type: 'date';
    placeholder?: string;
    validation?: Rule[];
}

interface SelectField extends BaseField {
    type: 'select';
    placeholder?: string;
    options: LabelValueOptions[];
    dynamicOptions?: DynamicOptionsConfig;
    validation?: Rule[];
}

interface RadioField extends BaseField {
    type: 'radio';
    options?: LabelValueOptions[];
    validation?: Rule[];
}

interface CheckboxField extends BaseField {
    type: 'checkbox';
    options?: LabelValueOptions[];
    validation?: Rule[];
}

interface GroupField extends BaseField {
    type: 'group';
    fields: Field[];
}

export type Field =
    | TextField
    | NumberField
    | DateField
    | SelectField
    | RadioField
    | CheckboxField
    | GroupField;

export interface FormSchema {
    formId: string;
    title: string;
    layout: LayoutDefinition;
    actions: ActionDefinition;
}