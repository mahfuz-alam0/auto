import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { getShopsList } from "../services/shopServices";
import { useAuth } from "./AuthContext";
import { ChoseWhatToDo } from "../types/common.type";
import { showToast } from "../utils/shotToast";
import { printReceipt } from "../utils/printUtils";
import { playSound } from "../utils/playSound";

interface PrinterOptions {
  "printer-location": string;
  "printer-make-and-model": string;
  system_driverinfo: string;
}

interface Printer {
  description: string;
  displayName: string;
  isDefault: boolean;
  name: string;
  options: PrinterOptions;
  status: number;
}

export const CommonContext = createContext<any | null>(null);

interface CommonProviderProps {
  children: ReactNode;
}

export const CommonProvider: React.FC<CommonProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [shops, setShops] = useState<any[]>([]);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [devices, setDevices] = useState<IDevice[]>([]);

  const [testSelected, setTestSelected] = useState<any>(
    printers.find((printer: any) => printer.isDefault) || {
      name: "No Printer Detected",
    }
  );

  const choseWhatToDo = [
    { label: "Package Label", value: "PACKAGE_LABEL" },
    { label: "Exit Label", value: "EXIT_LABEL" },
    { label: "Receipt", value: "RECEIPT" },
    { label: "Delivery Receipt", value: "DELIVERY_RECEIPT" },
    {
      label: "Pre Order Fulfillment Pull Sheet",
      value: "PRE_ORDER_FULFILLMENT_PULL_SHEET",
    },
  ];

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const fetchShops = async () => {
        try {
          const fetchedShops: any = await getShopsList();
          setShops(fetchedShops.shops || []);
        } catch (error) {
          console.error("Error fetching shops:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchShops();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchPrinters = async (): Promise<void> => {
    try {
      if (window.electronAPI) {
        const availablePrinters = await window.electronAPI.getPrinters();
        const filteredPrinters = availablePrinters.filter(
          (printer: any) => printer.name !== "Microsoft Print to PDF"
        );
        setPrinters(filteredPrinters);
        const defaultPrinter = filteredPrinters.find(
          (printer: any) => printer.isDefault
        );
        setTestSelected(
          defaultPrinter ||
          filteredPrinters[0] || { name: "No Printer Detected" }
        );
      }
    } catch (error) {
      console.error("Error fetching printers:", error);
    }
  };

  useEffect(() => {
    fetchPrinters();
  }, []);

  const handleSocketEvent = async (event: string, data: any) => {
    switch (event) {
      case "newPrintJob": {
        console.log(data, "data");
        const selectedDevice = devices.find((device) => device._id === data.setUpId);
        const checkPrinter = printers.find((printer) => printer.name === selectedDevice?.deviceProps?.deviceName);

        if (!checkPrinter) {
          showToast.error("No Printer Found");
          playSound("error");
          return;
        }
        printReceipt({
          html: data.html,
          printerName: selectedDevice?.deviceProps?.deviceName,
          copies: data.numberOfCopies,
          maxWidth: data?.maxWidth,
          shopId:data.shopId,
          requestId: data.requestId,
          fromWebSessionId: data.sessionId,
        });
        break;
      }

      case "setUpRemoved": {
        const { setUpId } = data;
        setDevices(devices.filter((device) => device._id !== setUpId));
        showToast.info("Device removed");
        break;
      }

      default:
        console.error("Unknown event type:", event);
    }
  };

  const valueToReturn: any = {
    shops,
    choseWhatToDo,
    isLoading,
    printers,
    fetchPrinters,
    devices,
    setDevices,
    handleSocketEvent,
    testSelected,
    setTestSelected,
  };

  return (
    <CommonContext.Provider value={valueToReturn}>
      {children}
    </CommonContext.Provider>
  );
};

export const useCommon = (): any => {
  const context = useContext(CommonContext);
  if (!context) {
    throw new Error("useCommon must be used within a CommonProvider");
  }
  return context;
};

export default CommonProvider;
