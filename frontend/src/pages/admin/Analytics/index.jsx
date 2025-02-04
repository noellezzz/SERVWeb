import React from "react";
import OverviewCard from "@/layouts/admin/Analytics/OverviewCard";
import ServicePerf from "@/layouts/admin/Analytics/ServicePerf";
import ServiceMetrics from "@/layouts/admin/Analytics/ServiceMetrics";
import SentiTrend from "@/layouts/admin/Analytics/SentiTrend";
import SeniorInsights from "@/layouts/admin/Analytics/SeniorInsights";

const Analytics = () => {
    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>

                <OverviewCard />
                <ServicePerf />



                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
                    <ServiceMetrics />
                    <SentiTrend />
                </div>

                <SeniorInsights />
            </main>
        </div>
    );
};

export default Analytics;