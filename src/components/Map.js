import React from 'react'
import '../css/Map.css'
import {Map as LeafletMap , TileLayer} from 'react-leaflet'
import {showDataOnMap} from '../components/util'

function Map({countries,center,casesType,zoom}) {
    return (
        <div className="map">
          <LeafletMap center={center} zoom={zoom} >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href=http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              />

              {showDataOnMap(countries,casesType)}

          </LeafletMap>
        </div>
    )
}

export default Map
