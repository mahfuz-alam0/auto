import axiosExternal from "../utils/axios";

interface Filter {
  shopId?: string;
  search?: string;
  jobType?: string;
}

export const getAllPrintClient = async (filter: Filter): Promise<any[]> => {
  try {
    const { shopId, search, jobType } = filter;

    const params: { [key: string]: string } = {};
    if (search) params.search = search;
    if (shopId) params.shopId = shopId;
    if (jobType) params.jobType = jobType;

    const response = await axiosExternal.get<any>("/hardware-client/list-all-print-clients", {
      params: params,
    });


    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching print clients:", error?.response?.status);
    const errorMessage = error?.response?.data?.data?.message || "Something went wrong";

    if ([401, 403, 404, 400, 409].includes(error?.response?.status)) {
      console.log(errorMessage);
      throw { error: errorMessage, status: error?.response?.status };
    }

    console.log(errorMessage);
    throw { error: errorMessage, status: error?.response?.status };
  }
};
