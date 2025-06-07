'use client';

import React, {useEffect, useState} from 'react';
import {Flex, Form, message, Select, Typography, Spin} from 'antd';
import styles from './page.module.css';
import FormGenerator from "@/components/form-generator/FormGenerator";
import {FormSchema} from "@/interfaces/field.interface";
import {useFormSchemas, useSubmitApplication} from "@/hooks/useForm";
import {useRouter} from "next/navigation";
import {toFormSchema} from "@/mappers";
import {useTranslation} from "react-i18next";

const { Title } = Typography

const ApplyPage = () => {
    const router = useRouter();
    const [form] = Form.useForm();
    const [schema, setSchema] = useState<FormSchema>();
    const [selectedForm, setSelectedForm] = useState<string>();
    const [initialValues, setInitialValues] = useState<Record<string, string | number | boolean>>({});

    const { t, i18n  } = useTranslation('common');
    const formValues = Form.useWatch([], form);

    const [messageApi, contextHolder] = message.useMessage();

    const {data: formSchemas, isLoading} = useFormSchemas();
    const { mutateAsync: submitApplication } = useSubmitApplication();

    useEffect(() => {
        if (!selectedForm) return;

        const savedDraft = localStorage.getItem(`formDraft_${selectedForm}`);

        if (savedDraft) {
            try {
                const draftValues = JSON.parse(savedDraft);
                setInitialValues(draftValues);
            } catch (error) {
                console.error("Failed to parse saved draft:", error);
            }
        }
    }, [selectedForm]);

    useEffect(() => {
        if (!selectedForm) return;

        const debounceSave = setTimeout(() => {
            if (formValues && Object.keys(formValues).length > 0) {
                localStorage.setItem(`formDraft_${selectedForm}`, JSON.stringify(formValues));
            }
        }, 1000);

        return () => clearTimeout(debounceSave);
    }, [formValues, selectedForm]);

    useEffect(() => {
        if (selectedForm) changeSelectedSchema(selectedForm);
    }, [i18n.language])

    const clearDraft = () => localStorage.removeItem(`formDraft_${selectedForm}`);

    const onFinish = async (values: Record<string, string | number | boolean>) => {
        try {
            const response = await submitApplication(values);

            if (response?.status === "success") {
                clearDraft();

                messageApi.success("Form submitted successfully!")

                setTimeout(() => router.push('/submissions'), 1000)
            }
        } catch (err) {
            messageApi.error("Failed to submit form!")

            console.error(err);
        }
    }

    const onReset = () => {
        clearDraft();
    }

    const getAvailableSchemas = () => formSchemas?.map(formSchema => ({ label: formSchema?.title, value: formSchema?.formId }))

    const changeSelectedSchema = (value: string) => {
        setSelectedForm(value);
        const selectedSchema = formSchemas?.find(formSchema => formSchema.formId === value);

        setSchema(toFormSchema(selectedSchema!, t));
    }

    return (
        <div dir={t('dir')} className={styles.container}>
            {contextHolder}
            {isLoading ?
                <Flex align={"center"} justify={"center"}>
                    <Spin />
                </Flex>:
                <Flex vertical align={"center"} className={styles.forms}>
                    <Title level={2}>{t('apply.choose_application')}</Title>
                    <Select style={{ width: '50%' }} options={getAvailableSchemas()} onChange={changeSelectedSchema} />
                </Flex>
            }
            {schema && selectedForm && <FormGenerator schema={schema} onFinish={onFinish} form={form} initialValues={initialValues} onReset={onReset}/>}
        </div>
    );
};

export default ApplyPage;