import {Field, VisibilityCondition} from "@/interfaces/field.interface";
import {Form, Input, InputNumber, DatePicker, Select, Radio, Checkbox, Card} from "antd";
import {FormInstance} from "antd/es/form";
import {useDynamicOptions} from "@/hooks/useForm";
import {useEffect, useRef} from "react";

interface FormFieldProps {
    form: FormInstance;
    field: Field;
}

export function isFieldVisible(condition: VisibilityCondition, formValues: Record<string, string | number | boolean>): boolean {
    const dependentValue = formValues?.[condition.dependsOn];
    if (dependentValue === undefined) {
        return false;
    }

    if (condition.condition === 'equals') {
        return dependentValue === condition.value;
    }
    if (condition.condition === 'not_equals') {
        return dependentValue !== condition.value;
    }

    return true;
}

const FormField = ({form, field}: FormFieldProps) => {
    const isMounted = useRef(false);

    const allValues = Form.useWatch([], form);

    const dependencyValue = Form.useWatch(field.type === 'select' ? field.dynamicOptions?.dependsOn : null, form);

    const isVisible = field.visibility ? isFieldVisible(field.visibility, allValues) : true;

    const { data: dynamicOptions, isLoading: isLoadingOptions } = useDynamicOptions(
        field.type === 'select' ? field.dynamicOptions : undefined,
        dependencyValue
    );

    useEffect(() => {
        if (isMounted.current) {
            if (field.type === 'select' && field.dynamicOptions) {
                form.setFieldsValue({ [field.id]: undefined });
            }
        }
    }, [dependencyValue]);

    useEffect(() => {
        if (isMounted.current) {
            if (field.visibility && !isVisible) {
                form.setFieldsValue({ [field.id]: undefined });
            }
        }
    }, [isVisible, field.id, field.visibility, form]);

    useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);


    if (!isVisible) {
        return null;
    }

    if (field.type === 'group') {
        return (
            <Card
                title={field.label}
                style={{marginTop: 16, backgroundColor: '#fafafa'}}
            >
                {field.fields.map((subField) => (
                    <FormField
                        key={subField.id}
                        field={subField}
                        form={form}
                    />
                ))}
            </Card>
        );
    }

    const renderInput = () => {
        switch (field.type) {
            case 'text':
                return <Input placeholder={field.placeholder}/>;
            case 'number':
                return <InputNumber style={{width: '100%'}} placeholder={field.placeholder}/>;
            case 'date':
                return <DatePicker style={{width: '100%'}} placeholder={field.placeholder}/>;
            case 'select':
                return (
                    <Select
                        placeholder={field.placeholder}
                        options={field.options?.length ? field.options : dynamicOptions}
                        loading={isLoadingOptions}
                    />
                );
            case 'radio':
                return field.options?.length ? <Radio.Group options={field.options}/> : <Radio/>;
            case 'checkbox':
                return field.options?.length ? <Checkbox.Group options={field.options}/> : <Checkbox/>;
            default:
                return null;
        }
    };

    return <Form.Item
        label={field.label}
        name={field.id}
        rules={"validation" in field && field.validation ? field.validation : []}
    >
        {renderInput()}
    </Form.Item>
}

export default FormField;