import { useContext, useEffect } from 'react'
import SearchBox from '../components/SearchBox/SearchBox'
import "./Main.css"
import JobCard from '../components/JobCard/JobCard'
import Pagination from '../components/Pagination/Pagination'
import { Context } from '../context'
import { useState } from 'react'
import { json } from 'react-router-dom'
import {distance} from '../ultils'
import { nanoid } from 'nanoid'


const Main = () => {
    
    const {jobData} = useContext(Context)
    const [sortedData, setSortedData] = useState([])
    const [citiesFromData, setCitiesFromData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [jobsToShow, setJobsToShow] = useState([])
    const [selectedCityFilter, setSelectedCityFilter] = useState(null);
    const [fullTimeFilter, setFullTimeFilter] = useState(false)
    const [locationSearchFilter, setLocationSearchFilter] = useState("")
    const [userLocation, setUserLocation] = useState(null)
    


    //filters
    const filterByFullTime = data => data.filter(job => job.fulltime === "true")
    const filterByCity = (data, city) => data.filter(job => job.city.toLowerCase() === city.toLowerCase())



    //function to sort jobs 
    const sortJobsDesc = jobs => (jobs.sort(function(a,b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.date) - new Date(a.date);
    }));


    // ask user for their location
    useEffect(() => {

        const userAllowedLocation = (location) => {
            // console.log(location.coords)
            setUserLocation({latitude: location.coords.latitude, longitude: location.coords.longitude})
        }

        const errorGettingLocation = () => {
            console.log('error getting location');
        }

        navigator.geolocation.getCurrentPosition(userAllowedLocation, errorGettingLocation)
    }, [])
    

    //sort jobs by date after job data update
    useEffect(() => {
        const dataToSort = structuredClone(jobData)
        setSortedData(sortJobsDesc(dataToSort))
    }, [jobData])
    
    // set new Randomn city filter after job data update
    useEffect(() => {
        if (!userLocation) setRandomCityFilter()
    }, [jobData])


    //function to locate nearest city and set it as a filter
    async function findAndSetNearestCity() {
        // console.log("Cities list in function: ", citiesFromData)
        let nearestCity = citiesFromData[0];
        let minDist = null; 

        for (const city of citiesFromData) {          
            const cityData = await getCityData(city)
            if (!cityData) continue
            // console.log("City data: ", cityData)
            const cityDistance = distance(cityData.lat, cityData.lon, userLocation.latitude, userLocation.longitude)

            if (minDist === null || cityDistance < minDist) {
                nearestCity = city
                minDist = cityDistance
            }
        }

        console.log("Nearest city: ", nearestCity)
        setSelectedCityFilter(nearestCity)
        return 
    }

    async function getCityData(city) {
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}}&limit=1&appid=9ee88e04f6e45307c78b6058c26e8c0a` 
        const res = await fetch(url)
        const cityData = await res.json()
        return cityData[0]       
    }

    function extractCityList(data) {
        let extractedCityList = [...new Set(sortedData.map(job => job.city))];
        setCitiesFromData(extractedCityList)
    }

    function setRandomCityFilter() {
        const randomArrayIndex = Math.floor(Math.random() * jobData.length)
        const randomCity = jobData.length > 0 ? jobData[randomArrayIndex].city : null
        setSelectedCityFilter(randomCity)
    }


    //set location filter after job data update
    useEffect(() => {
        // return if no data
        if (jobData.length <= 0) return
        extractCityList(sortedData)
        
    }, [sortedData])

    // set city filter when browser detects user location or set random city filter
    useEffect(() => {
        if (userLocation) {
            console.log('searching for job location nearest')
            findAndSetNearestCity()
        } else {
            setRandomCityFilter()
        }
    }, [userLocation, sortedData])

    
    // apply filters
    useEffect(() => {
        setFilteredData(sortedData)
        if (selectedCityFilter) setFilteredData(prev => filterByCity(prev, selectedCityFilter))
        if (fullTimeFilter) setFilteredData(prev => filterByFullTime(prev))
        if (locationSearchFilter) setFilteredData(prev => searchJobsByLocation(prev, locationSearchFilter))

    }, [sortedData, selectedCityFilter, fullTimeFilter, locationSearchFilter])

    

    //update selected city filter with radio button
    const handleRadioCityFilterClick = e => setSelectedCityFilter(e.target.value)

    //handle location city search
    const handleLocationSearchFilter = e => setLocationSearchFilter(e.target.value)

    
    //generate city filter radio elements
    const сityRadioElements = citiesFromData && citiesFromData.map(city => (
        <div className="search_filter_radio_button_block" key={nanoid()}>
            <input type="radio" value={`${city}`} name="city" id={`${city}_radio`} onChange={handleRadioCityFilterClick} checked={city === selectedCityFilter}/>
            <label htmlFor={`${city}_radio`} className="search_filter_radio"> {`${city}`}</label>
        </div>
    ));

    //search for Title, companies, expertise or benefits
    const searchJobs = query => {      
        // make search case insensitive and only for whole words (\b for word breaks with additional \ ot make it work)
        console.log("searching for ", query)
        const queryFormatted = new RegExp(`\\b${query.trim()}\\b`, "i");

        const searchJob = (job) => {
            if (job.title.search(queryFormatted) !== -1) return true;
            if (job.name.search(queryFormatted) !== -1) return true;
            if (job.content.search(queryFormatted) !== -1) return true;
            return false
        }

        const searchResults = jobData.filter(searchJob)
        setLocationSearchFilter("")
        setSelectedCityFilter(null)
        setFullTimeFilter(false)
        setSortedData(sortJobsDesc(searchResults))

        return
    }

    // search filter for location
    const searchJobsByLocation = (data, query) => {      
        // make search case insensitive and only for whole words (\b for word breaks with additional \ ot make it work)
        console.log("searching for location", query)
        const queryFormatted = new RegExp(`\\b${query.trim()}\\b`, "i");
        setSelectedCityFilter(null)

        const searchJobByLocation = (job) => {
            if (job.city.search(queryFormatted) !== -1) return true;
            if (job.zipcode.search(queryFormatted) !== -1) return true;
            if (job.country.search(queryFormatted) !== -1) return true;
            return false
        }

        const searchResults = data.filter(searchJobByLocation)
        return searchResults
    }

    
    return (
        <div>
            <SearchBox searchJobs={searchJobs} />
            <div className="container_main">
                
                <aside className="searh_filter_container">
                    <label className='search_filter_checkbox'><input value={fullTimeFilter} onClick={() => setFullTimeFilter(prev => !prev)} type="checkbox" name="" id="" />Full time</label>
                    <h4 className="search_filter_title">LOCATION</h4>
                    <div className="input_box">
                        <span className="world_icon material-symbols-outlined">public</span>
                        <input className="search_container_input" value={locationSearchFilter} onChange={handleLocationSearchFilter} type="text" placeholder='City, state, zip code or country' />
                    </div>
                    <div className="city_selection">
                        {сityRadioElements}
                    </div>
                </aside>

                <main className='job_list'>

                    {jobsToShow && jobsToShow.map(job => <JobCard key={nanoid()} job={job} />)}

                    
                    <Pagination 
                        filteredData={filteredData}
                        setJobsToShow={setJobsToShow}
                    />
                </main>
            </div>
        </div>
    )
}

export default Main