import './App.css';
import AllStudentsSection from './components/allstudents';
import AssignedSection from './components/assigned';
import Sidebar from './components/sidebar';
import React, { useState,useEffect} from 'react';
import {useContext} from 'react';
import { MentorContext } from "./config/context";

function App() {
  const [activeSection, setActiveSection] = useState("all");  
  const { mentor, login} = useContext(MentorContext);
  useEffect(()=>{
    //hypothetical API call that gives mentor details
    const mentorData = {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZW50b3JJRCI6IjY1NDExYmQwMzk4MGMwN2Q4NjA0ZTA1MyIsInB1cnBvc2UiOiJvcHMiLCJhY2Nlc3MiOiJtZW50b3IiLCJpYXQiOjE2OTg5MjIyOTB9.Vc-eSDpx7JxUBQjPLkgQpWEh00OLLfUu77CooXm4dyM",
      name: "Mentor 2",
    };
    login(mentorData);
  },[]);
  return (
    <div className="App">
      <Sidebar setActiveSection={setActiveSection} currActive={activeSection}/>
      {activeSection==="all" && <AllStudentsSection/>}
      {activeSection==="assigned" && <AssignedSection/>}
    </div>
  );
}

export default App;
