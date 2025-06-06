import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formService } from '../services';
import {DynamicOptionsConfig, LabelValueOptions} from "@/interfaces/field.interface";

export const useFormSchemas = () => {
    return useQuery({
        queryKey: ['formSchemas'],
        queryFn: formService.getFormSchemas,
    });
};

export const useSubmitApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: formService.createNewSubmission,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['submissions'] });
        },
    });
};

export const useSubmissions = () => {
    return useQuery({
        queryKey: ['submissions'],
        queryFn: formService.getAllSubmissions
    })
}

export const useDynamicOptions = (config: DynamicOptionsConfig | undefined, dependencyValue: any) => {
    return useQuery<LabelValueOptions[]>({
        queryKey: ['dynamicOptions', config?.endpoint, dependencyValue],
        queryFn: () => {
            if (!config || !dependencyValue) {
                return Promise.resolve([]);
            }
            return formService.getDynamicOptions(config, dependencyValue);
        },
        enabled: !!dependencyValue,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};