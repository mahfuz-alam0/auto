import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { HtmlToPdfType, pdfType } from '../types/common.type';

export const convertHtmlToPdf = async (props: HtmlToPdfType): Promise<pdfType> => {

    const { html, copies = 1, maxWidth = 80 } = props;

    const iframe = document.createElement('iframe');
    Object.assign(iframe.style, { position: 'absolute', left: '-9999px' });
    iframe.srcdoc = html;
    document.body.appendChild(iframe);

    try {
        await new Promise<void>((resolve) => (iframe.onload = () => resolve()));
        const iframeBody = iframe.contentDocument?.body as HTMLElement;

        const canvas = await html2canvas(iframeBody, { scale: 4, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const aspectRatio = canvas.height / canvas.width;

        const pdfWidth = maxWidth;
        const pdfHeight = maxWidth * aspectRatio;
        const orientation = pdfWidth > pdfHeight ? 'landscape' : 'portrait';

        const doc = new jsPDF({ orientation, unit: 'mm', format: [pdfWidth, pdfHeight] });

        for (let i = 0; i < copies; i++) {
            if (i > 0) doc.addPage([pdfWidth, pdfHeight], orientation);
            doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }

        const dataUri = doc.output('datauristring');
        const base64Data = dataUri.split(',')[1];

        return {
            data: base64Data,
            width: pdfWidth,
            height: pdfHeight
        };

    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    } finally {
        document.body.removeChild(iframe);
    }
};
