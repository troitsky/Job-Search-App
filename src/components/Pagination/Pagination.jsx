
import "./pagination.css"
import { useState, useEffect } from "react"
import { nanoid } from 'nanoid'

const Pagination = props => {
    
    const {
        setJobsToShow,
        filteredData,
    } = props

    const JOBS_PER_PAGE = 5
    

    const [paginationAcitve, setPaginationActive] = useState(false)
    const [numOfPages, setNumOfPages] = useState(null)
    const [curPage, setCurPage] = useState(null)

    // set pagination afger data filteres update
    useEffect(() => {
        const numOfJobs = filteredData.length

        if (numOfJobs > JOBS_PER_PAGE) {
            setPaginationActive(true)
            setNumOfPages(Math.ceil(numOfJobs/JOBS_PER_PAGE))
            setCurPage(1)
        } else {
            setPaginationActive(false)
            setCurPage(null)
            setJobsToShow(filteredData)
        }

    }, [filteredData])

    //change jobs shown when page is changed
    useEffect(() => {
        
        const numOfJobs = filteredData.length
        if (numOfJobs <= JOBS_PER_PAGE) return

        // const lastJobToShowIndexPlusOne = Math.ceil(numOfJobs / numOfPages) * curPage
        let firstJobToShowIndex, lastJobToShowIndexPlusOne;

        if (curPage === numOfPages) {
            lastJobToShowIndexPlusOne = numOfJobs;
            if (numOfJobs % JOBS_PER_PAGE > 0) {
                firstJobToShowIndex = numOfJobs - (numOfJobs % JOBS_PER_PAGE)
            } else {
                firstJobToShowIndex =  lastJobToShowIndexPlusOne - JOBS_PER_PAGE
            }
            
        }
        else if (curPage !== numOfPages) {
            lastJobToShowIndexPlusOne = curPage * JOBS_PER_PAGE;
            firstJobToShowIndex =  lastJobToShowIndexPlusOne - JOBS_PER_PAGE
        }

        setJobsToShow(filteredData.slice(firstJobToShowIndex, lastJobToShowIndexPlusOne))
        
        // console.log("lastJobToShowIndexPlusOne: ", lastJobToShowIndexPlusOne)
        // console.log("firstJobToShowIndex: ", firstJobToShowIndex)       

        // console.log("Cur page: ", curPage)
        // console.log("numOfJobs: ", numOfJobs)

    }, [curPage])

    //handle next page
    const nextPage = () => curPage < numOfPages && setCurPage(prev => prev + 1)
    
    //handle previous page
    const prevPage = () => curPage > 1 && setCurPage(prev => prev - 1)


     //generate page link  elements

    let pageLinks = []

    const selectedPageStyle = { 
        backgroundColor: "#1E86FF",
        color: "white"
    }

    if (numOfPages && numOfPages > 1) {
        
        //pagination links when we show all pages
        if (numOfPages <=7 ){
            // console.log("adding simple pagination")
            for (let i = 1; i <= numOfPages; i++) {
                pageLinks.push(<a key={nanoid()} style={curPage === i ? selectedPageStyle : null} onClick={() => setCurPage(i)}>{i}</a>)
            }
        }
        //pagination links when we show not all pages because there are too many
        else if (numOfPages > 7 ){
            // console.log("adding dynamic pagination")
            //add first page
            pageLinks.push(<a key={nanoid()} id={"first"} style={curPage === 1 ? selectedPageStyle : null} onClick={() => setCurPage(1)}>{1}</a>)
            
            //if current page is near first diaplay first 4 pages after first
            if (4 - curPage >= 0) {
                for (let i = 2; i < 6; i++) {
                    pageLinks.push(<a key={nanoid()} id={"beginning"+i} style={curPage === i ? selectedPageStyle : null} onClick={() => setCurPage(i)}>{i}</a>)
                }
            } else { 
                pageLinks.push(<span key={nanoid()}>...</span>)
            }
            
            //if there are many pages and current one is not near the end and or start
            if (numOfPages > 8 && curPage > 4 && (numOfPages - curPage) > 3) {
                for (let i = curPage - 1; i < curPage + 2; i++) {
                    pageLinks.push(<a key={nanoid()} id={"middle"+i} style={curPage === i ? selectedPageStyle : null} onClick={() => setCurPage(i)}>{i}</a>)
                }
            }

            //if current page is near last display final 4 pages before last
            if (numOfPages - curPage <= 3) {
                for (let i = numOfPages-4; i < numOfPages; i++) {
                    pageLinks.push(<a key={nanoid()} id={"ending"+i} style={curPage === i ? selectedPageStyle : null} onClick={() => setCurPage(i)}>{i}</a>)
                }
            } else { 
                pageLinks.push(<span key={nanoid()}>...</span>)
            }

            //add last page
            pageLinks.push(<a key={nanoid()} id={"last"} style={curPage === numOfPages ? selectedPageStyle : null} onClick={() => setCurPage(numOfPages)}>{numOfPages}</a>)

        }
    }


    return (
        <>
        {
           paginationAcitve && (<div className="pagination">
                <a onClick={prevPage} href="#" >&laquo;</a>
                {pageLinks}
                <a onClick={nextPage} href="#">&raquo;</a>
            </div>)
        }
        </>   
    )
}

export default Pagination