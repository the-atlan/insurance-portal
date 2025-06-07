import React from 'react';
import { render, screen, waitFor } from '@/utils/test-utils'; // Use your custom render
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Form } from 'antd';
import FormField from './FormField';
import { useDynamicOptions } from '@/hooks/useForm';
import {Field} from "@/interfaces/field.interface";

jest.mock('@/hooks/useForm', () => ({
    useDynamicOptions: jest.fn(),
}));

const mockedUseDynamicOptions = useDynamicOptions as jest.Mock;

const TestHarness = ({ field }: { field: any }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form}>
            <FormField field={field} form={form} />
        </Form>
    );
};

describe('FormField Component', () => {
    beforeEach(() => {
        mockedUseDynamicOptions.mockReturnValue({
            data: [],
            isLoading: false,
        });
    });

    it('should render a simple text input correctly', () => {
        const textField = { id: 'name', label: 'Full Name', type: 'text' };
        render(<TestHarness field={textField} />);
        expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    });

    it('should render a group with nested fields recursively', () => {
        const groupField = {
            id: 'group1',
            label: 'Personal Details',
            type: 'group',
            fields: [
                { id: 'firstName', label: 'First Name', type: 'text' },
                { id: 'lastName', label: 'Last Name', type: 'text' },
            ]
        };
        render(<TestHarness field={groupField} />);

        expect(screen.getByText('Personal Details')).toBeInTheDocument();
        expect(screen.getByLabelText('First Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    });

    it('should conditionally render a field based on its visibility rule', async () => {
        const TestVisibilityHarness = () => {
            const [form] = Form.useForm();
            const smokerField: Field = { id: 'smoker', label: 'Smoker?', type: 'radio', options: [{label: 'Yes', value: true}, {label: 'No', value: false}] };
            const frequencyField: Field = {
                id: 'frequency',
                label: 'Smoking Frequency',
                type: 'text',
                visibility: { dependsOn: 'smoker', condition: 'equals', value: true }
            };
            return (
                <Form form={form}>
                    <FormField field={smokerField} form={form} />
                    <FormField field={frequencyField} form={form} />
                </Form>
            );
        };

        render(<TestVisibilityHarness />);

        expect(screen.queryByLabelText('Smoking Frequency')).not.toBeInTheDocument();

        await userEvent.click(screen.getByLabelText('Yes'));

        expect(await screen.findByLabelText('Smoking Frequency')).toBeVisible();

        await userEvent.click(screen.getByLabelText('No'));

        await waitFor(() => {
            expect(screen.queryByLabelText('Smoking Frequency')).not.toBeInTheDocument();
        });
    });
});