import "./JobDescription.css"
import { useContext } from 'react'
import { Context } from '../context'
import {Link, useParams} from 'react-router-dom';
import {daysAgoFromDate} from '../ultils'

function JobDescription() {
    
    const {id} = useParams();
    const {jobData} = useContext(Context)
    const job = jobData.find(job => job.id === id)

    console.log("id: ",id)

    return (<div className="job_desc_container">
        <aside className="job_desc_side_info">
            <div className="job_desc_back_to_btn">
                <span class="material-symbols-outlined">keyboard_backspace </span>
                <Link to="/"><button className="back_to_btn_text">Back to search</button></Link>
            </div>
            <h4 className="search_filter_title">How to Apply</h4>
            <p className="job_desc_side_quest">Please email a copy of your resume and online portfolio to {job.author}</p>
        </aside>
        <main className="job_desc_main_container">
            <div className="job_desc_top_row">
                <h3 className="job_card_title">{job.title}</h3>
                {job.fulltime === "true" ? <p className="job_card_tag">Full time</p> : null}
            </div>
            <div className="job_card_published_ago">
                <span className="time_icon material-symbols-outlined">schedule</span>
                <p className="job_card_published_ago_text">{daysAgoFromDate(job.date)} days ago</p>
            </div>
            <div className="job_desc_company_info">
                <img src={job.logo} alt="" className="company_logo" />
                <div className="job_desc_company_info_text">
                    <p className="job_card_company_name">{job.name}</p>
                    <div className="job_card_location">
                        <span className="location_icon material-symbols-outlined">public</span>
                        <p className="job_card_location_text">{job.city}</p>
                    </div>
                </div>
            </div>

            <p className="job_desc_text">{job.content}</p>


        </main>
    </div>

)}

export default JobDescription