import formRepository from '../repositories/form.repository';
import {ApiSchema} from "@/interfaces/api-schema.interface";
import {DynamicOptionsConfig, LabelValueOptions} from "@/interfaces/field.interface";

const formService = {
    getFormSchemas: (): Promise<ApiSchema[]> => {
        return formRepository.fetchFormSchemas();
    },

    createNewSubmission: (formData: any) => {
        return formRepository.submitApplication(formData);
    },

    getAllSubmissions: () => {
        return formRepository.fetchSubmissions();
    },

    getDynamicOptions: async (config: DynamicOptionsConfig, dependencyValue: any): Promise<LabelValueOptions[]> => {
        const params = { [config.dependsOn]: dependencyValue };

        const rawData = await formRepository.fetchDynamicOptions(config, params);

        switch (config.dependsOn) {
            case 'country':
                if (rawData && rawData.states && Array.isArray(rawData.states)) {
                    return rawData.states.map((state: string) => ({
                        label: state,
                        value: state,
                    }));
                }
                break;
            default:
                console.warn(`No data transformation logic found for endpoint: ${config.endpoint}`);
                return [];
        }
        return [];
    },
};

export default formService