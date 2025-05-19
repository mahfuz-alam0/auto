import axiosExternal from "../utils/axios";


type JobType = "PACKAGE_LABEL" | "EXIT_LABEL" | "RECEIPT" | "DELIVERY_RECEIPT" | "PRE_ORDER_FULFILLMENT_PULL_SHEET";

export const getShopsList = async (): Promise<any[]> => {
  try {
    const response = await axiosExternal.get<any>("/hardware-client/list-shops-under-privilege", {});
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching shops under privilege:", error?.response?.status);

    const errorMessage = error?.response?.data?.data?.message || "Something went wrong";

    if ([401, 403, 404, 400, 409].includes(error?.response?.status)) {
      console.log(errorMessage);
      throw { error: errorMessage, status: error?.response?.status };
    }

    console.log(errorMessage);
    throw { error: errorMessage, status: error?.response?.status };
  }
};
