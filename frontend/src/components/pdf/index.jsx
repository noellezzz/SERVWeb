import React from 'react'

// hook instead of component
export function usePdfViewer({
    action = () => { },
    params = null,
}) {
    const {
        data: pdfUrl = "",
        isLoading = false
    } = action(params);

    const handleView = () => {
        window.open(pdfUrl, "_blank");
    };

    return {
        handleView,
        isLoading
    }
}


export default function PDFViewer({
    action = () => { },
    params = null,
    title = "View Report"
}) {
    const {
        data: pdfUrl = "",
        isLoading = false
    } = action(params);

    const handleView = () => {
        window.open(pdfUrl, "_blank");
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
            onClick={handleView}>
            {title}
        </button>
    )
}