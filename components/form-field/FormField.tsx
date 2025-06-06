import {Field} from "@/interfaces/field.interface";
import { Form, Input, InputNumber, DatePicker, Select, Radio, Checkbox, Card } from "antd";

interface FormFieldProps {
    field: Field;
}

const FormField = ({ field }: FormFieldProps) => {
    const renderInput = () => {
        switch (field.type) {
            case 'text':
                return <Input placeholder={field.placeholder} />;
            case 'number':
                return <InputNumber style={{ width: '100%' }} placeholder={field.placeholder} />;
            case 'date':
                return <DatePicker style={{ width: '100%' }} placeholder={field.placeholder} />;
            case 'select':
                return (
                    <Select
                        placeholder={field.placeholder}
                        options={field.options}
                    />
                );
            case 'radio':
                return field.options?.length ? <Radio.Group options={field.options} /> : <Radio />;
            case 'checkbox':
                return field.options?.length ? <Checkbox.Group options={field.options} /> : <Checkbox />;
            default:
                return null;
        }
    };

    if (field.type === 'group') {
        return (
            <Card
                title={field.label}
                style={{ marginTop: 16, backgroundColor: '#fafafa' }}
            >
                {field.fields.map((subField) => (
                    <FormField
                        key={subField.id}
                        field={subField}
                        // form={form}
                    />
                ))}
            </Card>
        );
    }

    return !field.hidden && (
        <Form.Item
            label={field.label}
            name={field.id}
            rules={"validation" in field && field.validation ? field.validation : []}
        >
            {renderInput()}
        </Form.Item>
    );
}

export default FormField;