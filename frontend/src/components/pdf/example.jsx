import React from "react";
import { useExamplePdfMutation } from "@/states/api/pdf";

const ExamplePDF = () => {
    const { data: pdfUrl, isLoading } = useExampleQuery();

    if (isLoading) return <p>Loading PDF...</p>;

    const handleView = () => {
        window.open(pdfUrl, "_blank");
    };

    return <button onClick={handleView}>View Example PDF</button>;
};

export default ExamplePDF;