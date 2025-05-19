import html2canvas from "html2canvas";
import { HtmlToPdfType, ImageType } from "../types/common.type";

export const convertHtmlToPng = async (
  props: HtmlToPdfType
): Promise<ImageType> => {
  const { html, maxWidth = 76.2 } = props;

  // Get operating system first
  const os = await window.electronAPI.getOS();
  console.log(os, "operating system");

  const TARGET_DPI = 300;
  const MM_TO_INCH = 25.4;
  const INCH_TO_PIXELS = TARGET_DPI;

  // Adjust width based on OS
  const osWidthMultiplier = os === "darwin" ? 0.9 : 1; // 10% reduction for macOS
  const adjustedMaxWidth = maxWidth * osWidthMultiplier;

  const widthInPixels = (adjustedMaxWidth / MM_TO_INCH) * INCH_TO_PIXELS;
  const effectingWidth = adjustedMaxWidth;

  const iframe = document.createElement("iframe");
  Object.assign(iframe.style, {
    position: "absolute",
    left: "-9999px",
    width: `${effectingWidth}mm`,
    visibility: "hidden",
  });

  iframe.srcdoc = `${html}`;
  document.body.appendChild(iframe);

  try {
    await new Promise<void>((resolve) => (iframe.onload = () => resolve()));
    const iframeBody = iframe.contentDocument?.body as HTMLElement;

    const scaleFactor = TARGET_DPI / 96;
    const canvas = await html2canvas(iframeBody, {
      scale: scaleFactor,
      useCORS: true,
      backgroundColor: null,
      logging: false,
      removeContainer: true,
    });

    const aspectRatio = canvas.height / canvas.width;
    const imgWidth = effectingWidth;
    const imgHeight = adjustedMaxWidth * aspectRatio;

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = widthInPixels;
    finalCanvas.height = widthInPixels * aspectRatio;

    const ctx = finalCanvas.getContext("2d");
    ctx!.fillStyle = "#FFFFFF";
    ctx!.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    ctx?.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);

    const imgData = finalCanvas.toDataURL("image/png");
    return { data: imgData, width: imgWidth, height: imgHeight };
  } catch (error) {
    console.error("Error generating PNG:", error);
    throw error;
  } finally {
    document.body.removeChild(iframe);
  }
};
