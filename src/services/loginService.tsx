import axiosExternal from "../utils/axios";
interface LoginParams {
  orgUsername: string;
  email: string;
  password: string;
}

export const CheckOrganization = async (organizationId: string): Promise<{ data: any }> => {
  try {
    const response = await axiosExternal.get(
      `/organization-accounts/check-if-organization-functional?orgUsername=${organizationId}`
    );
    return { data: response.data };
  } catch (error: any) {
    console.error("Error fetching data:", error?.response?.status);

    const errorMessage = error?.response?.data?.data?.message || "Something went wrong";

    if ([401, 403, 404, 400, 409].includes(error?.response?.status)) {
      console.log(errorMessage);
      throw { error: errorMessage, status: errorMessage };
    }

    console.log(errorMessage);
    throw { error: errorMessage, status: errorMessage };
  }
};


export const loginToHardwareClient = async ({ orgUsername, email, password }: LoginParams): Promise<{ data: any }> => {
  try {
    const response = await axiosExternal.post("/hardware-client/login", {
      orgUsername,
      email,
      password,
    });
    return { data: response.data };
  } catch (error: any) {
    console.error("Login Error:", error?.response?.status);

    const errorMessage = error?.response?.data?.data?.message || "Something went wrong";

    if ([401, 403, 404, 400, 409].includes(error?.response?.status)) {
      console.log(errorMessage);
      throw { error: errorMessage, status: error?.response?.status };
    }

    console.log(errorMessage);
    throw { error: errorMessage, status: error?.response?.status };
  }
};
