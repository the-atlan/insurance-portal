'use client';

import React, {useEffect, useState} from 'react';
import {Form, Select} from 'antd';
import styles from './page.module.css';
import FormGenerator from "@/components/form-generator/FormGenerator";
import {
    ActionDefinition,
    DynamicOptionsConfig,
    Field,
    FormSchema,
    LabelValueOptions,
    LayoutDefinition
} from "@/interfaces/field.interface";
import {useDynamicOptions, useFormSchemas} from "@/hooks/useForm";
import {Rule} from "antd/es/form";
import {ApiField, ApiSchema} from "@/interfaces/api-schema.interface";

export const transformApiToFormSchema = (apiSchema: ApiSchema): FormSchema => {
    // A recursive helper function to transform each field
    const transformField = (apiField: ApiField): Field => {
        // 1. Transform validation
        const validation: Rule[] = [];
        if (apiField.required) {
            validation.push({ required: true, message: `${apiField.label} is required.` });
        }

        // 2. Transform options
        const options: LabelValueOptions[] | undefined = apiField.options?.map(opt => ({
            label: opt,
            value: opt,
        }));

        // Base transformed field
        const transformedField: Partial<Field> = {
            ...apiField,
            validation,
            options,
        };

        // 3. Recursively transform nested fields for groups
        if (apiField.type === 'group' && apiField.fields) {
            (transformedField as any).fields = apiField.fields.map(transformField);
        }

        return transformedField as Field;
    };

    // 4. Create the layout structure (defaulting to one field per row)
    const layout: LayoutDefinition = {
        type: 'grid',
        rows: apiSchema.fields.map((apiField, index) => ({
            id: `row-${index}`,
            columns: [
                {
                    span: 24, // Full width for each field
                    field: transformField(apiField),
                },
            ],
        })),
    };

    // 5. Create a default set of action buttons
    const actions: ActionDefinition = {
        alignment: 'right',
        buttons: [
            {
                htmlType: 'reset',
                children: 'Clear',
            },
            {
                htmlType: 'submit',
                type: 'primary',
                children: 'Submit',
                style: { marginLeft: '8px' },
            },
        ],
    };

    // Assemble and return the final FormSchema
    return {
        formId: apiSchema.formId,
        title: apiSchema.title,
        layout,
        actions,
    };
};

const ApplyPage = () => {
    const [form] = Form.useForm();
    const smokerValue = Form.useWatch(['smoker'], form)
    const [selectedSchema, setSelectedSchema] = useState<string>('');
    const [schema, setSchema] = useState<FormSchema>();
    const initialValues: Record<string, string | number | boolean> = {}

    const {data: formSchemas, isLoading} = useFormSchemas();

    const a = useDynamicOptions();

    // useEffect(() => {
    //     // setSchema({
    //     //     "formId": "advanced_health_insurance_v1",
    //     //     "title": "Advanced Health Insurance Application",
    //     //     "layout": {
    //     //         "type": "grid",
    //     //         "rows": [
    //     //             {
    //     //                 "id": "row_personal_info",
    //     //                 "columns": [
    //     //                     {
    //     //                         "span": 8,
    //     //                         "field": {
    //     //                             "id": "first_name",
    //     //                             "type": "text",
    //     //                             "label": "First Name",
    //     //                             "placeholder": "Enter your first name",
    //     //                             "validation": [{
    //     //                                 "required": true
    //     //                             }],
    //     //                             "style": {
    //     //                                 "backgroundColor": "#e6f7ff"
    //     //                             }
    //     //                         }
    //     //                     },
    //     //                     {
    //     //                         "span": 8,
    //     //                         "field": {
    //     //                             "id": "last_name",
    //     //                             "type": "text",
    //     //                             "label": "Last Name",
    //     //                             "placeholder": "Enter your last name",
    //     //                             "validation": [{
    //     //                                 "required": true
    //     //                             }]
    //     //                         }
    //     //                     },
    //     //                     {
    //     //                         "span": 8,
    //     //                         "field": {
    //     //                             "id": "dob",
    //     //                             "type": "date",
    //     //                             "label": "Date of Birth",
    //     //                             "validation": [{
    //     //                                 "required": true
    //     //                             }]
    //     //                         }
    //     //                     }
    //     //                 ]
    //     //             },
    //     //             {
    //     //                 "id": "row_location_info",
    //     //                 "columns": [
    //     //                     {
    //     //                         "span": 12,
    //     //                         "field": {
    //     //                             "id": "country",
    //     //                             "type": "select",
    //     //                             "label": "Country",
    //     //                             "validation": [{
    //     //                                 "required": true
    //     //                             }],
    //     //                             "options": [
    //     //                                 {"label": "United States", "value": "USA"},
    //     //                                 {"label": "Canada", "value": "CAN"}
    //     //                             ]
    //     //                         }
    //     //                     },
    //     //                     {
    //     //                         "span": 12,
    //     //                         "field": {
    //     //                             "id": "state",
    //     //                             "type": "select",
    //     //                             "label": "State / Province",
    //     //                             "placeholder": "Select a country first...",
    //     //                             "validation": [{
    //     //                                 "required": true
    //     //                             }],
    //     //                             options: []
    //     //                         }
    //     //                     }
    //     //                 ]
    //     //             },
    //     //             {
    //     //                 "id": "row_health_group",
    //     //                 "columns": [
    //     //                     {
    //     //                         "span": 24,
    //     //                         "field": {
    //     //                             "id": "health_info_group",
    //     //                             "type": "group",
    //     //                             "label": "Health Information",
    //     //                             "fields": [
    //     //                                 {
    //     //                                     "id": "smoker",
    //     //                                     "type": "radio",
    //     //                                     "label": "Do you use tobacco products?",
    //     //                                     "validation": [{
    //     //                                         "required": true
    //     //                                     }],
    //     //                                     "options": [
    //     //                                         {"label": "Yes", "value": true},
    //     //                                         {"label": "No", "value": false}
    //     //                                     ]
    //     //                                 },
    //     //                                 {
    //     //                                     "id": "smoking_frequency",
    //     //                                     "type": "select",
    //     //                                     "label": "How often?",
    //     //                                     "hidden": !smokerValue,
    //     //                                     "validation": [{
    //     //                                         "required": true
    //     //                                     }],
    //     //                                     "options": [
    //     //                                         {"label": "Occasionally", "value": "occasionally"},
    //     //                                         {"label": "Daily", "value": "daily"}
    //     //                                     ]
    //     //                                 }
    //     //                             ]
    //     //                         }
    //     //                     }
    //     //                 ]
    //     //             }
    //     //         ]
    //     //     },
    //     //     "actions": {
    //     //         "alignment": "right",
    //     //         "buttons": [
    //     //             {
    //     //                 "htmlType": "reset",
    //     //                 "children": "Clear Form",
    //     //                 "style": {
    //     //                     "marginRight": "8px"
    //     //                 }
    //     //             },
    //     //             {
    //     //                 "htmlType": "submit",
    //     //                 "children": "Submit Application"
    //     //             }
    //     //         ]
    //     //     }
    //     // })
    // }, [smokerValue]);

    // useEffect(() => {
    //
    // }, [data]);

    const onFinish = (values: Record<string, string | number | boolean>) => {
        console.log(values)
    }

    const getAvailableSchemas = () => formSchemas?.map(formSchema => ({ label: formSchema?.title, value: formSchema?.formId }))

    const changeSelectedSchema = (value: string) => {
        const selectedSchema = formSchemas?.find(formSchema => formSchema.formId === value);

        setSchema(transformApiToFormSchema(selectedSchema!));
    }

    // const onFetchDynamicOptions = async (dynamicOptions: DynamicOptionsConfig, data: string | number | boolean): Promise<LabelValueOptions[]> => {
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${dynamicOptions.endpoint}?${dynamicOptions.dependsOn}=${data}`)
    //     if (!response.ok) {
    //         throw new Error(`Failed to get dynamic options for ${dynamicOptions.dependsOn}`);
    //     }
    //
    //     const json = await response.json();
    //
    //     switch (dynamicOptions.dependsOn) {
    //         case 'country':
    //             return json.states.map((state: string) => ({
    //                 label: state,
    //                 value: state
    //             }));
    //         default:
    //             return []
    //     }
    // };

    return (
        <div className={styles.container}>
            {isLoading ? <p>Loading...</p> : <Select style={{ width: '50%' }} options={getAvailableSchemas()} onChange={changeSelectedSchema} />}
            {schema && <FormGenerator schema={schema} onFinish={onFinish} form={form} initialValues={initialValues}/>}
        </div>
    );
};

export default ApplyPage;