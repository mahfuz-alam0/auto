import axiosExternal from "../utils/axios";

export const CreatePrintClient = async (payload: any): Promise<any> => {
    try {
        const response: any = await axiosExternal.post("/hardware-client/create-print-client", payload);
        return { data: response.data };
    } catch (error: any) {
        console.error("Error creating print client:", error?.response?.status);

        const errorMessage: any = error?.response?.data?.data?.message || "Something went wrong";

        if ([401, 403, 404, 400, 409].includes(error?.response?.status)) {
            console.log(errorMessage);
            throw { error: errorMessage, status: error?.response?.status } as any;
        }

        console.log(errorMessage);
        throw { error: errorMessage, status: error?.response?.status } as any;
    }
};

export const ResetPrintClient = async (payload: any): Promise<any> => {
    try {
        const response: any = await axiosExternal.post("/hardware-client/reset-print-client", payload);
        return { data: response.data };
    } catch (error: any) {
        console.error("Error resetting print client:", error?.response?.status);

        const errorMessage: any = error?.response?.data?.data?.message || "Something went wrong";

        if ([401, 403, 404, 400, 409].includes(error?.response?.status)) {
            console.log(errorMessage);
            throw { error: errorMessage, status: error?.response?.status } as any;
        }

        console.log(errorMessage);
        throw { error: errorMessage, status: error?.response?.status } as any;
    }
};

