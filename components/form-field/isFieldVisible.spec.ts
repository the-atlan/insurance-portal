import { isFieldVisible } from './FormField';
import { VisibilityCondition } from '@/interfaces/field.interface';

describe('isFieldVisible helper function', () => {
    it('should return true when an "equals" condition is met', () => {
        const condition: VisibilityCondition = { dependsOn: 'smoker', condition: 'equals', value: 'Yes' };
        const formValues = { smoker: 'Yes' };
        expect(isFieldVisible(condition, formValues)).toBe(true);
    });

    it('should return false when an "equals" condition is NOT met', () => {
        const condition: VisibilityCondition = { dependsOn: 'smoker', condition: 'equals', value: 'Yes' };
        const formValues = { smoker: 'No' };
        expect(isFieldVisible(condition, formValues)).toBe(false);
    });

    it('should return false if the dependent value is undefined', () => {
        const condition: VisibilityCondition = { dependsOn: 'smoker', condition: 'equals', value: 'Yes' };
        const formValues = { age: 30 }; // 'smoker' field is not present
        expect(isFieldVisible(condition, formValues)).toBe(false);
    });
});