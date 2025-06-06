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
    onFinish: (values: Record<string, string | number | boolean>) => void;
    initialValues: Record<string, string | number | boolean>;
}

const FormGenerator = ({ schema, onFinish, initialValues, form } : FormGeneratorProps) => {
    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [initialValues, form]);

    return (
        <Form form={form} className={styles.form} onFinish={onFinish} initialValues={initialValues}>
            <Title level={2}>{schema.title}</Title>
            {schema.layout.rows.map((row) => (
                <Row key={row.id} gutter={16}>
                    {row.columns.map((column) => (
                        <Col key={column.field.id} span={column.span}>
                            <FormField field={column.field}/>
                        </Col>
                    ))}
                </Row>
            ))}
            <Flex gap="small" justify={schema.actions.alignment} >
                {schema.actions.buttons.map((button, index) => (
                    <Button key={`form-action-button-${index}`} {...button}/>
                ))}
            </Flex>
        </Form>
    )
}

export default FormGenerator
