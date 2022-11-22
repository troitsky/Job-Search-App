import { createContext, useState, useEffect } from "react";

const Context = createContext();

function ContextProvider({ children }) {

    const [jobData, setJobData] = useState([]);

    const dataUrl = 'https://apis.camillerakoto.fr/fakejobs/jobs'
    const localDataUrl = "/jodData.json"
    useEffect(() => {

        // async function fetchLocal (url) {
        //     const res = await fetch(localDataUrl)
        //     const data = await res.json()
        //     console.log(data)
        // }

        // fetchLocal(localDataUrl)

        fetch(localDataUrl)
            .then(res => res.json())
            .then(data => setJobData(data))
    }, [])

    return (
        <Context.Provider value={{jobData}}>
            {children}
        </Context.Provider>
    )
}

export { ContextProvider, Context }