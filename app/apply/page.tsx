'use client';

import React, {useState} from 'react';
import {Form, Select} from 'antd';
import styles from './page.module.css';
import FormGenerator from "@/components/form-generator/FormGenerator";
import {
    ActionDefinition,
    Field,
    FormSchema,
    LabelValueOptions,
    LayoutDefinition
} from "@/interfaces/field.interface";
import {useFormSchemas, useSubmitApplication} from "@/hooks/useForm";
import {Rule} from "antd/es/form";
import {ApiField, ApiSchema} from "@/interfaces/api-schema.interface";
import {useRouter} from "next/navigation";

export const transformApiToFormSchema = (apiSchema: ApiSchema): FormSchema => {
    const transformField = (apiField: ApiField): Field => {
        const validation: Rule[] = [];
        if (apiField.required) {
            validation.push({ required: true, message: `${apiField.label} is required.` });
        }

        const options: LabelValueOptions[] | undefined = apiField.options?.map(opt => ({
            label: opt,
            value: opt,
        }));

        const transformedField: Partial<Field> = {
            ...apiField,
            validation,
            options,
        };

        if (apiField.type === 'group' && apiField.fields) {
            (transformedField as any).fields = apiField.fields.map(transformField);
        }

        return transformedField as Field;
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

    return {
        formId: apiSchema.formId,
        title: apiSchema.title,
        layout,
        actions,
    };
};

const ApplyPage = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [schema, setSchema] = useState<FormSchema>();
    const initialValues: Record<string, string | number | boolean> = {}

    const {data: formSchemas, isLoading} = useFormSchemas();
    const { mutateAsync: submitApplication } = useSubmitApplication();

    const onFinish = async (values: Record<string, string | number | boolean>) => {
        try {
            const response = await submitApplication(values);

            if (response?.status === "success") {
                router.push('/submissions');
            }
        } catch (err) {
            console.error(err);
        }
    }

    const getAvailableSchemas = () => formSchemas?.map(formSchema => ({ label: formSchema?.title, value: formSchema?.formId }))

    const changeSelectedSchema = (value: string) => {
        const selectedSchema = formSchemas?.find(formSchema => formSchema.formId === value);

        setSchema(transformApiToFormSchema(selectedSchema!));
    }

    return (
        <div className={styles.container}>
            {isLoading ? <p>Loading...</p> : <Select style={{ width: '50%' }} options={getAvailableSchemas()} onChange={changeSelectedSchema} />}
            {schema && <FormGenerator schema={schema} onFinish={onFinish} form={form} initialValues={initialValues}/>}
        </div>
    );
};

export default ApplyPage;