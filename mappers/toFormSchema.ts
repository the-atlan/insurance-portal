import {ApiField, ApiSchema} from "@/interfaces/api-schema.interface";
import {ActionDefinition, Field, FormSchema, LabelValueOptions, LayoutDefinition} from "@/interfaces/field.interface";
import {Rule} from "antd/es/form";
import {TFunction} from "i18next";

const toFormSchema = (apiSchema: ApiSchema, t: TFunction<"common", undefined>): FormSchema => {
    const transformField = (apiField: ApiField): Field => {
        const validation: Rule[] = [];
        if (apiField.required) {
            validation.push({ required: true, message: `${apiField.label} is required.` });
        }

        const options: LabelValueOptions[] | undefined = apiField.options?.map(opt => ({
            label: opt,
            value: opt,
        }));

        const baseProps = {
            id: apiField.id,
            label: apiField.label,
            style: apiField.style,
            visibility: apiField.visibility,
            validation: validation.length > 0 ? validation : undefined,
        };

        switch (apiField.type) {
            case 'text':
                return {
                    ...baseProps,
                    type: 'text',
                    placeholder: apiField.placeholder,
                };
            case 'number':
                return {
                    ...baseProps,
                    type: 'number',
                    placeholder: apiField.placeholder,
                };
            case 'date':
                return {
                    ...baseProps,
                    type: 'date',
                    placeholder: apiField.placeholder,
                };
            case 'select':
                return {
                    ...baseProps,
                    type: 'select',
                    placeholder: apiField.placeholder,
                    options: options || [],
                    dynamicOptions: apiField.dynamicOptions,
                };
            case 'radio':
                return {
                    ...baseProps,
                    type: 'radio',
                    options: options,
                };
            case 'checkbox':
                return {
                    ...baseProps,
                    type: 'checkbox',
                    options: options,
                };
            case 'group':
                return {
                    ...baseProps,
                    type: 'group',
                    fields: apiField.fields ? apiField.fields.map(transformField) : [],
                };
            default:
                const exhaustiveCheck: never = apiField.type;
                throw new Error(`Unknown field type: ${exhaustiveCheck}`);
        }
    };

    const layout: LayoutDefinition = {
        type: 'grid',
        rows: apiSchema.fields.map((apiField, index) => ({
            id: `row-${index}`,
            columns: [
                {
                    span: 24,
                    field: transformField(apiField),
                },
            ],
        })),
    };

    const actions: ActionDefinition = {
        alignment: 'right',
        buttons: [
            {
                htmlType: 'reset',
                children: t('apply.clear'),
            },
            {
                htmlType: 'submit',
                type: 'primary',
                children: t('apply.submit'),
                style: { marginLeft: '8px' },
            },
        ],
    };

    return {
        formId: apiSchema.formId,
        title: apiSchema.title,
        layout,
        actions,
    };
};

export default toFormSchema;
