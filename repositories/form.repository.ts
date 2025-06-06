import {ApiSchema} from "@/interfaces/api-schema.interface";

const formRepository = {
    fetchFormSchemas: async (): Promise<ApiSchema[]> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insurance/forms`);
        if (!response.ok) {
            throw new Error('Failed to get form schemas');
        }
        return response.json();
    },
    submitApplication: async (formData: any) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insurance/forms/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (!response.ok) {
            throw new Error('Failed to submit application');
        }
        return response.json();
    },
    fetchSubmissions: async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insurance/forms/submissions`);
        if (!response.ok) {
            throw new Error('Failed to get submitted applications');
        }
        return response.json();
    },
    fetchDynamicOptions: async (config: { endpoint: string; method: string; }, params: Record<string, any>) => {
        let response;
        const url = `${process.env.NEXT_PUBLIC_API_URL}${config.endpoint}`;

        if (config.method.toUpperCase() === 'GET') {
            const queryParams = new URLSearchParams(params);
            response = await fetch(`${url}?${queryParams}`);
        } else {
            response = await fetch(url, {
                method: config.method,
                headers: { 'Content-Type': 'application/json' },
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