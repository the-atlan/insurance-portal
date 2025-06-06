import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formService } from '../services';

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