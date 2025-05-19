import { useEffect, useState } from "react";
import { getAllPrintClient } from "../services/printClientService";
import { useCommon } from "../contexts/CommonContext";


export const useFilter = (initialShop: any) => {
    const { devices, setDevices } = useCommon();
    const [filterData, setFilterData] = useState<any>({
        search: { str: "" },
        client: null,
        shop: initialShop || null,
    });


    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchPrintClient = async () => {
            setIsLoading(true);
            const filter = {
                jobType: filterData?.client?.value,
                shopId: filterData?.shop?.id,
                search: filterData.search.str,
            };

            try {
                const response: IDevice[] = await getAllPrintClient(filter);
                setDevices(response);
            } catch (error) {
                console.error("Error fetching print clients:", error);
                setError(error instanceof Error ? error.message : "Something went wrong");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrintClient();
    }, [filterData]);

    return { filterData, setFilterData, devices, isLoading, error };
};
