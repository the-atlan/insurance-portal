'use client';

import React, {useState} from 'react';
import {Form, Select} from 'antd';
import styles from './page.module.css';
import FormGenerator from "@/components/form-generator/FormGenerator";
import {FormSchema} from "@/interfaces/field.interface";
import {useFormSchemas, useSubmitApplication} from "@/hooks/useForm";
import {useRouter} from "next/navigation";
import {toFormSchema} from "@/mappers";

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

        setSchema(toFormSchema(selectedSchema!));
    }

    return (
        <div className={styles.container}>
            {isLoading ? <p>Loading...</p> : <Select style={{ width: '50%' }} options={getAvailableSchemas()} onChange={changeSelectedSchema} />}
            {schema && <FormGenerator schema={schema} onFinish={onFinish} form={form} initialValues={initialValues}/>}
        </div>
    );
};

export default ApplyPage;