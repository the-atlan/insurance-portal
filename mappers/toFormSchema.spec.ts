import toFormSchema from './toFormSchema'; // Adjust the import path as needed
import { ApiSchema } from '@/interfaces/api-schema.interface';
import {Field, FormSchema} from '@/interfaces/field.interface';

describe('toFormSchema mapper function', () => {
    it('should correctly transform basic schema properties and create a default layout', () => {
        const mockApiSchema: ApiSchema = {
            formId: 'basic_test',
            title: 'Basic Test Form',
            fields: [{ id: 'name', label: 'Name', type: 'text' }]
        };

        const result: FormSchema = toFormSchema(mockApiSchema);

        expect(result.formId).toBe('basic_test');
        expect(result.title).toBe('Basic Test Form');
        expect(result.layout.type).toBe('grid');
        expect(result.layout.rows).toHaveLength(1);
        expect(result.layout.rows[0].columns[0].span).toBe(24);
        expect(result.layout.rows[0].columns[0].field.id).toBe('name');
        expect(result.actions).toBeDefined();
        expect(result.actions.buttons[1].children).toBe('Submit');
    });

    it('should transform the "required" property into a valid ANTD rule object', () => {
        const mockApiSchema: ApiSchema = {
            formId: 'validation_test',
            title: 'Validation Test',
            fields: [
                { id: 'required_field', label: 'Required Field', type: 'text', required: true },
                { id: 'optional_field', label: 'Optional Field', type: 'text' }
            ]
        };

        const result = toFormSchema(mockApiSchema);

        const requiredField = result.layout.rows[0].columns[0].field;
        const optionalField = result.layout.rows[1].columns[0].field;

        if ("validation" in requiredField) {
            expect(requiredField.validation).toEqual([{required: true, message: 'Required Field is required.'}]);
        }
        if ("validation" in optionalField) {
            expect(optionalField.validation).toBeUndefined();
        }
    });

    it('should transform a string array of options into a LabelValueOptions array', () => {
        const mockApiSchema: ApiSchema = {
            formId: 'options_test',
            title: 'Options Test',
            fields: [{
                id: 'status',
                label: 'Status',
                type: 'select',
                options: ['Pending', 'Approved']
            }]
        };

        const result = toFormSchema(mockApiSchema);
        const selectField = result.layout.rows[0].columns[0].field;

        if ("options" in selectField) {
            expect(selectField.options).toEqual([
                {label: 'Pending', value: 'Pending'},
                {label: 'Approved', value: 'Approved'}
            ]);
        }
    });

    it('should recursively transform fields within a group', () => {
        const mockApiSchema: ApiSchema = {
            formId: 'group_test',
            title: 'Group Test',
            fields: [{
                id: 'personal_info',
                label: 'Personal Info',
                type: 'group',
                fields: [
                    { id: 'name', label: 'Name', type: 'text', required: true },
                    { id: 'age', label: 'Age', type: 'number' }
                ]
            }]
        };

        const result = toFormSchema(mockApiSchema);
        const groupField = result.layout.rows[0].columns[0].field;

        expect(groupField.type).toBe('group');
        if (groupField.type === "group") {
            expect(groupField.fields).toHaveLength(2);

            const nestedNameField = groupField.fields[0];
            expect(nestedNameField.id).toBe('name');
            if ("validation" in nestedNameField) {
                expect(nestedNameField.validation).toEqual([{required: true, message: 'Name is required.'}]);
            }
        }
    });

    it('should throw an error if an unknown field type is provided', () => {
        const mockApiSchema = {
            formId: 'error_test',
            title: 'Error Test',
            fields: [{
                id: 'bad_field',
                label: 'Bad Field',
                type: 'this_type_does_not_exist'
            }]
        } as any;

        expect(() => toFormSchema(mockApiSchema)).toThrow('Unknown field type: this_type_does_not_exist');
    });
});