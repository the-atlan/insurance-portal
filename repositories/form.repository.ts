const formRepository = {
    getFormSchemas: async () => {
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
    getSubmittedApplications: async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/insurance/forms/submissions`);
        if (!response.ok) {
            throw new Error('Failed to get submitted applications');
        }
        return response.json();
    },
}

export default formRepository;