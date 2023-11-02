import styles from './allstudents.module.css'
import { useEffect, useState} from 'react';
import {useContext} from 'react';
import { MentorContext } from "../config/context";
import {FilterButton} from './buttons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner} from '@fortawesome/free-solid-svg-icons'

const urls = require('../config/urls');



function AllStudentsSection() {
  const [filter,updateFilter]=useState("all");
  const [lists, setLists] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasError,setHasError] = useState(false);
  const { mentor, login} = useContext(MentorContext);


  const populateLists=async()=>{
    setIsLoading(true);
    setHasError(false);
    let allStudentsData=[];
    try{
      await fetch(urls.getall).then(response=>response.json()).then(jsonRes=>allStudentsData=jsonRes.data);
    }catch(err){
      console.log(err);
      alert(String(err.message));
      setHasError(true);
    }
    setIsLoading(false);

    const arrlen=allStudentsData.length;
    const completeListx=[];
    const incompleteListx=[];
    for(let i=0; i<arrlen; i++)
    {
      if(allStudentsData[i]['marks']['mentorID']!=="" || allStudentsData[i]['marks']['lock']===true)
      {
          incompleteListx.push(allStudentsData[i]);
      }else{
          completeListx.push(allStudentsData[i]);
      }
    }
    setLists({
      "all":allStudentsData,
      "complete":completeListx,
      "incomplete":incompleteListx
    });
  }

  const handleFilterUpdate=(newFilter)=>{
      updateFilter(newFilter);
  }

  async function assignHandler (student){
    setIsLoading(true);
    setHasError(false);
    await fetch(urls.addmentee, {
      method: 'POST',
      body: JSON.stringify({
        studentID:student._id
      }),
      headers:{
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${mentor.token}`
      }
    }).then((response) =>{
      if (!response.ok) {
      response.json().then((data) => {
        alert(data.message);
        setIsLoading(false);
      });
    } else {
      response.json().then((data) => {
        alert(data.message);
      });
      populateLists();
    }
  }).catch((err)=>{
    alert(err);
  });
  }

  useEffect(() => {
    populateLists();
  },[]);


    return (
      <div className={styles.bg}>
        <div className={styles.heading}>All Students</div>
        {isLoading?(<FontAwesomeIcon icon={faSpinner}  className={styles.loader}/>):(hasError?(<p>An Error occurred, please refresh</p>):(<>
          <div className={styles.filters}>
            <FilterButton currFilter={filter} myFilter={"all"} label="All" updateFn={handleFilterUpdate}/>
            <FilterButton currFilter={filter} myFilter={"complete"} label="Available" updateFn={handleFilterUpdate}/>
            <FilterButton currFilter={filter} myFilter={"incomplete"} label="Unavailable" updateFn={handleFilterUpdate}/>
        </div>
        <div className={styles.data}>
          {lists[filter]?<div>{lists[filter].map((ele,i)=> <StudentEntry assignHandlerfn={assignHandler} studentData={ele} index={i}/>
          )}</div>:<FontAwesomeIcon icon={faSpinner}  className={styles.loader}/>}
        </div>
        </>))}

      </div>
    );
  }

  function StudentEntry({studentData,assignHandlerfn,index}){
    return(
    <div key={studentData._id} className={styles.student}>
      <div className={styles.info}>
          <div className={styles.index}>{index+1}.</div>
          {studentData.name}
      </div>
      <div className={`${styles.addbtn} ${studentData.marks.mentorID===""? `${styles.greenbtn}`:`${styles.greyedbtn}`}`} onClick={()=>assignHandlerfn(studentData)}>ADD</div>
    </div>
    );
  }


  
  export default AllStudentsSection;