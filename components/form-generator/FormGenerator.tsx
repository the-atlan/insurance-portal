import {Button, Col, Flex, Form, Row, Typography} from "antd";
import styles from "./FormGenerator.module.css"
import {FormSchema} from "@/interfaces/field.interface";
import FormField from "@/components/form-field/FormField";
import {FormInstance} from "antd/es/form";
import {useEffect} from "react";

const { Title } = Typography

interface FormGeneratorProps {
    schema: FormSchema;
    form: FormInstance;
    initialValues: Record<string, string | number | boolean>;
    onFinish: (values: Record<string, string | number | boolean>) => void;
    onReset?: () => void;
}

const FormGenerator = ({ schema, onFinish, initialValues, form, onReset } : FormGeneratorProps) => {
    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [initialValues, form]);

    return (
        <Form form={form} className={styles.form} onFinish={onFinish} initialValues={initialValues} onReset={onReset}>
            <Title level={2}>{schema.title}</Title>
            {schema.layout.rows.map((row) => (
                <Row key={row.id} gutter={16}>
                    {row.columns.map((column) => (
                        <Col key={column.field.id} span={column.span}>
                            <FormField form={form} field={column.field}/>
                        </Col>
                    ))}
                </Row>
            ))}
            <Flex gap="small" justify={schema.actions.alignment} className={styles.actions}>
                {schema.actions.buttons.map((button, index) => (
                    <Button
                        key={`form-action-button-${index}`}
                        {...button}
                        onClick={button.htmlType === 'reset' ? () => form.resetFields() : undefined}
                    />
                ))}
            </Flex>
        </Form>
    )
}

export default FormGenerator
