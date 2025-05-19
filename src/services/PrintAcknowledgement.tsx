import axiosExternal from '../utils/axios';

export const sendPrintJobAcknowledgement = async (
    data: {
        shopId: string;
        requestId: string;
        fromWebSessionId: string;
        isSuccess: string;
    },
): Promise<{ data: any }> => {
    try {
        const response = await axiosExternal.post('/hardware-client/send-print-job-acknowledgement', data);

        return { data: response.data };
    } catch (error: any) {
        console.error('Error sending print job acknowledgement:', error?.response?.status);

        const errorMessage = error?.response?.data?.data?.message || 'Something went wrong';

        if ([400, 401, 403, 404, 409].includes(error?.response?.status)) {
            throw { error: errorMessage, status: error?.response?.status };
        }

        throw { error: errorMessage, status: error?.response?.status || 500 };
    }
};
