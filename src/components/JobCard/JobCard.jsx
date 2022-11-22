import "./JobCard.css"
import {Link} from 'react-router-dom'
import {daysAgoFromDate} from '../../ultils'

const JobCard = ({job}) => { 
    const {
        id,
        name, 
        title,
        logo,
        city,
        date,
        fulltime
    } = job;


    const daysAgo = daysAgoFromDate(date)
    
    return (
    <Link to={`/job/${id}`} >
        <div className="job_card">
            <img src={logo} alt="" className="company_logo" />
            <div className="job_card_text">
                <p className="job_card_company_name">{name}</p>
                <h3 className="job_card_title">{title}</h3>
                <div className="job_card_bottom_row">
                    <div className="job_card_tags">
                        {fulltime === "true" ? <p className="job_card_tag">Full time</p> : null}
                    </div>
                    <div className="job_card_location">
                        <span className="location_icon material-symbols-outlined">public</span>
                        <p className="job_card_location_text">{city}</p>
                    </div>
                    <div className="job_card_published_ago">
                        <span className="time_icon material-symbols-outlined">schedule</span>
                        <p className="job_card_published_ago_text">{daysAgo} days ago</p>
                    </div>
                </div>
            </div>
        </div>
    </ Link>
)}

export default JobCard