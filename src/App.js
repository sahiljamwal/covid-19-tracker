import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import "./App.css";
import InfoBox from "./component/InfoBox";
import LineGraph from "./component/LineGraph";
import Map from "./component/Map";
import Table from "./component/Table";
import { prettyPrintStat, sortData } from "./util";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  const getCountriesData = async () => {
    const URL = "https://disease.sh/v3/covid-19/countries";
    await fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));
        data = sortData(data);
        setTableData(data);
        setMapCountries(data);
        setCountries(countries);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getCountriesData();
  }, []);

  useEffect(() => {
    loadWorldData();
  }, []);

  const loadWorldData = () => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  };

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const URL =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(URL)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setCountryInfo(data);
        setMapZoom(4);
      });
  };

  // console.log(mapCenter);

  return (
    <div className="app">
      <div className="app__left">
        {/* Header4*/}
        <div className="app__header">
          <h1>COVID 19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
            onClick={(e) => setCasesType("cases")}
            active={casesType === "cases"}
            isRed
          />
          <InfoBox
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
            onClick={(e) => setCasesType("recovered")}
            active={casesType === "recovered"}
          />
          <InfoBox
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
            onClick={(e) => setCasesType("deaths")}
            active={casesType === "deaths"}
            isRed
          />
        </div>

        {/* Map */}
        <Map
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          {/* Table */}
          <h3>Live Cases By Country</h3>
          <Table countries={tableData} />
          {/* Graph */}
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className={"app__graph"} casesType={casesType}></LineGraph>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
