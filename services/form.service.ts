import formRepository from '../repositories/form.repository';

const formService = {
    getFormSchemas: () => {
        return formRepository.fetchFormSchemas();
    },

    createNewSubmission: (formData: any) => {
        return formRepository.submitApplication(formData);
    },

    getAllSubmissions: () => {
        return formRepository.fetchSubmissions();
    },
};

export default formService