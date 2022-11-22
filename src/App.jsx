import './App.css'
import { Routes, Route } from "react-router-dom";
import Main from './routes/Main';
import JobDescription from './routes/JobDescription'
function App() {
  
  const LogoMain = () => <h1 className="logo_mainpage">Github <span className="logo_light">Jobs</span></h1>

  return (
    <div className="App">
      
      <LogoMain />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/job/:id" element={<JobDescription />} />
      </Routes>
    </div>
  )
}

export default App
