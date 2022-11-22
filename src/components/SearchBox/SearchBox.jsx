import { useState } from 'react';
import './SearchBox.css';


const SearchBox = ({searchJobs}) => {
    
    const [query, setQuery] = useState('')

    return (<div className="search_container">
        <div className="input_box">
            <i className="case_icon"><span className="material-symbols-outlined">work</span></i>
            <input className="search_container_input" value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder='Title, companies, expertise or benefits' />
            <button onClick={() => searchJobs(query)} className='search_btn'>Search</button>
        </div>
    </div>)
}

export default SearchBox