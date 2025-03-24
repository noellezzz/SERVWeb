import React from 'react';
import { MapsComponent, Inject, LayersDirective, LayerDirective, MapsTooltip, Legend, Marker, Zoom } from '@syncfusion/ej2-react-maps';
import { getGeoJsonData } from '../utils/dataHelpers';

const HeatMap = ({
    mapRef,
    datasource,
    colormapping,
    zoomSettings,
    animationDuration,
    onMapsLoad
}) => {
    const geojsonData = getGeoJsonData();
    
    return (
        <div className='control-section row'>
            <div className='col-md-12'>
                <MapsComponent 
                    id="maps" 
                    ref={mapRef}
                    loaded={onMapsLoad} 
                    useGroupingSeparator={true} 
                    format={"n"}
                    zoomSettings={zoomSettings}
                    legendSettings={{ 
                        visible: true, 
                        mode: 'Interactive', 
                        position: 'Bottom', 
                        height: '10', 
                        width: '350', 
                        alignment: 'Center', 
                        labelDisplayMode: 'Trim',
                        showLegendPath: false
                    }}
                    titleSettings={{ 
                        text: "Senior Citizen Population by Municipality/City in the Philippines", 
                        textStyle: { size: '16px' } 
                    }}
                >
                    <Inject services={[Marker, MapsTooltip, Legend, Zoom]}/>
                    <LayersDirective>
                        <LayerDirective 
                            shapeData={geojsonData} 
                            shapePropertyPath='NAME_2' 
                            shapeDataPath='Name'
                            dataSource={datasource.seniorCitizens}
                            animationDuration={animationDuration}
                            tooltipSettings={{ 
                                visible: true, 
                                valuePath: 'population', 
                                format: 'City/Municipality: ${Name} <br> Senior Population: ${population}' 
                            }}
                            shapeSettings={{ 
                                colorValuePath: 'population', 
                                colorMapping: colormapping,
                                border: { width: 0.5, color: '#FFFFFF' }  
                            }}
                        />
                    </LayersDirective>
                </MapsComponent>
            </div>
        </div>
    );
};

export default HeatMap;
