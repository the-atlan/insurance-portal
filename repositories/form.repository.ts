import {ApiSchema} from "@/interfaces/api-schema.interface";
import Submissions from "@/interfaces/submissions.interface";

const formRepository = {
    fetchFormSchemas: async (): Promise<ApiSchema[]> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insurance/forms`);
        if (!response.ok) {
            throw new Error('Failed toFormSchema.ts get form schemas');
        }
        return response.json();
    },
    submitApplication: async (formData: Record<string, string | number | boolean>) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insurance/forms/submit`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            throw new Error('Failed toFormSchema.ts submit application');
        }
        return response.json();
    },
    fetchSubmissions: async (): Promise<Submissions> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insurance/forms/submissions`);
        if (!response.ok) {
            throw new Error('Failed toFormSchema.ts get submitted applications');
        }
        return response.json();
    },
    fetchDynamicOptions: async (config: { endpoint: string; method: string; }, params: Record<string, string>) => {
        let response;
        const url = `${process.env.NEXT_PUBLIC_API_URL}${config.endpoint}`;

        if (config.method.toUpperCase() === 'GET') {
            const queryParams = new URLSearchParams(params);
            response = await fetch(`${url}?${queryParams}`);
        } else {
            response = await fetch(url, {
                method: config.method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(params),
            });
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch dynamic options from ${config.endpoint}`);
        }
        return response.json();
    },
}

export default formRepository;