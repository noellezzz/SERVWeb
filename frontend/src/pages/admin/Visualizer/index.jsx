import React from 'react'
import SampleScatter from './samples/scatter'

export default function VisualizerPage() {
  return (
    <div className="flex-1 overflow-auto relative z-10 p-8 h-screen">
      <SampleScatter />
      
    </div>
  )
}
