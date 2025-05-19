import { sendPrintJobAcknowledgement } from "../services/PrintAcknowledgement";
import { convertHtmlToPng } from "./imageUtils";
import { playSound } from "./playSound";
import { showToast } from "./shotToast";

interface PrinterType {
    html: string;
    printerName: string;
    copies?: number;
    maxWidth?: number;
    shopId: string;
    requestId: string;
    fromWebSessionId: string;
}

export const printReceipt = async ({ html, printerName, copies = 1, maxWidth, shopId, requestId, fromWebSessionId }: PrinterType) => {
    try {
        playSound("notification");
        const result = await showToast.promise(
            (async () => {
                const { data, width, height } = await convertHtmlToPng({ html, maxWidth });
                return window.electronAPI.printReceipt({ imgArgs: { data, width, height, html }, printerName, copies });
            })(),
            { loading: "Printing...", success: "Print successful", error: "Print failed" }
        );

        const isSuccess = result.success ? "true" : "false";
        try {
            await sendPrintJobAcknowledgement({ shopId, requestId, fromWebSessionId, isSuccess },);
        } catch (ackError) {
            console.error("Acknowledgment failed:", ackError);
            playSound("error");
        }
        if (!result.success) {
            console.error(`Print error:`, result.message);
            playSound("error");
        }
    } catch (error) {
        console.error("Print function error:", error);
        playSound("error");
    }
};

