import React from 'react'

export default function Summary({ data = {}, chart }) {
    const [summary, setSummary] = React.useState(data)

    return (
        <div>
            <h4 className="text-xl text-gray-600 font-semibold">
                Summary
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                <div className='md:col-span-2 lg:h-[200px] border p-8 rounded-lg bg-white shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>



                    {
                        Object.keys(summary).map((key, index) => {
                            return (
                                <div className='h-full' key={index}>
                                    <p className="text-gray-500">
                                        {summary[key].label}
                                    </p>
                                    <p className="text-3xl font-semibold">
                                        {summary[key].value}
                                    </p>
                                </div>
                            )
                        })

                    }


                </div>

                <div className="col-span-1 flex flex-col justify-between gap-4 w-full items-start h-full rounded-lg bg-white shadow-md">
                    {/* Chart here */}
                    {chart}
                </div>
            </div>
        </div>
    )
}
