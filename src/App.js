import React, { useState, useEffect } from 'react';
import './App.css';
import {MenuItem,FormControl,Select, Card, CardContent} from '@material-ui/core'
import Infobox from './components/Infobox';
import Map from './components/Map';
import Table from './components/Table';
import {sortData, prettyPrintStat} from './components/util'
import LineGraph from './components/LineGraph';
import 'leaflet/dist/leaflet.css';

function App() {
  const[countries,setCountries]=useState([])
  const[country,setCountry]=useState('worldwide')
  const[countryInfo,setCountryInfo]=useState({})
  const[tableData,setTableData]=useState([])
  const[mapCenter,setMapCenter]=useState({
    lat:28.3949 , lng:84.1240
  })
  const[mapZoom,setMapZoom]=useState(3)
  const[mapCountries,setMapCountries]=useState([])
  const[casesType,setCasesType]=useState('cases')

  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data=>{
      setCountryInfo(data)
    })
  },[])

  const onCountryChange = async(event)=>{
    const countryCode=event.target.value
    setCountry(countryCode)
    // console.log(countryCode)

    const url= countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response => response.json())
    .then((data)=>{
      setCountry(countryCode)
      setCountryInfo(data)

       {countryCode !== 'worldwide' && setMapCenter([data.countryInfo.lat,data.countryInfo.long])} 
      // setMapCenter([data.countryInfo.lat,data.countryInfo.long])
      setMapZoom(4)
    })
    // console.log("Country :",countryCode)
    // console.log("Country's Infomation :",countryInfo)
  }

  useEffect(()=>{
    const getCountriesData= async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries=data.map((country)=>({
          name:country.country,
          value:country.countryInfo.iso2
        }))
        const sortedData=sortData(data)
        // setTableData(data)
        setTableData(sortedData)
        setMapCountries(data)
        setCountries(countries)
      })
    }
   
    getCountriesData()
  },[])

  return (
    <div className="app">
      <div className="app__left">
          <div className="app__header">
          <h1>COVID-19 Tracker</h1>
            <FormControl className="app__formcontrol">
              <Select
              variant='outlined'
              value={country}
              onChange={onCountryChange}
              >
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {
                  countries.map(country=>(
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                    ))
                }
              </Select>
            </FormControl>
          </div>

          <div className="app__stats">
            <Infobox
            isRed
            active={casesType === "cases"}
            onClick={(e)=>setCasesType('cases')}
             title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={countryInfo.cases} />

            <Infobox 
            active={casesType === "recovered"}
            onClick={(e)=>setCasesType('recovered')}
            title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={countryInfo.recovered} />

            <Infobox 
            isRed
            active={casesType === "deaths"}
            onClick={(e)=>setCasesType('deaths')}
            title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={countryInfo.deaths} />
          </div>
          <Map 
            casesType={casesType}
            center={mapCenter}
            zoom={mapZoom}
            countries={mapCountries}
          /> 
      </div>
      <Card className="app__right">
              <CardContent>
                <h3>Live Cases by Country</h3>
                <Table countries={tableData}/>
                <h3  className="app__graphTitle">Worldwide new {casesType}</h3>
                  <LineGraph 
                    className="app__graph"
                    casesType={casesType}
                  />
              </CardContent>
      </Card>
      
    </div>
  );
}

export default App;
