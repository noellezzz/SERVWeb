import React from 'react';
import { useGeneratePdfMutation } from '@/states/api/pdf.api';

export function usePdfViewer() {
    const [generatePdf, { data: pdfUrl = "", isLoading }] = useGeneratePdfMutation();

    const handleView = (params) => {
        generatePdf(params).then((response) => {
            if (response.data) {
                window.open(response.data, "_blank");
            }
        });
    };

    return {
        handleView,
        isLoading
    }
}

export default function PDFViewer({
    params = null,
    title = "View Report"
}) {
    const { handleView, isLoading } = usePdfViewer();

    const handlePdfView = (params) => {
        handleView(params);
    };

    if (isLoading) return <p>Loading PDF...</p>;

    return (
        <button
            style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
            }}
            onClick={handlePdfView}>
            {title}
        </button>
    )
}