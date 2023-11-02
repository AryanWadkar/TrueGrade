import { useState, useEffect} from 'react';
import styles from './assigned.module.css'
import Collapsible from 'react-collapsible';
import {useContext} from 'react';
import { MentorContext } from "../config/context";
import {FilterButton} from './buttons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner} from '@fortawesome/free-solid-svg-icons'
const urls = require('../config/urls');

function AssignedSection() {
  const [filter,updateFilter]=useState("all");
  const [lists, setLists] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasError,setHasError] = useState(false);
  const { mentor, login} = useContext(MentorContext);


  const populateLists=async()=>{
    setIsLoading(true);
    setHasError(false);
    try{
      await fetch(`${urls.getmentee}`,{
        method: 'GET',
        headers:{
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${mentor.token}`
        }
      }).then(response=>response.json()).then(jsonRes=>{
        let allStudentsData=jsonRes.data
        const arrlen=allStudentsData.length;
        const completeListx=[];
        const incompleteListx=[];
        for(let i=0; i<arrlen; i++)
        {
          const score = allStudentsData[i]['marks']['score'];
          if(Object.values(score).some(x=>x===null))
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
      });
    }catch(err){
      console.log(err);
      alert(String(err.message));
      setHasError(true);
    }
    setIsLoading(false);
  }

  const handleFilterUpdate=(newFilter)=>{
      updateFilter(newFilter);
  }

  const handleFinalSubmit=async()=>{
    setIsLoading(true);
    setHasError(false);
    await fetch(urls.finalsubmit, {
          method: 'POST',
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
        <div className={styles.heading}>Assigned Students</div>
        {isLoading?
          (<FontAwesomeIcon icon={faSpinner} className={styles.loader}/>):
          (hasError?(<div>An Error has occurred please refresh</div>):
              (<>
                <div className={`${styles.btnholder} ${styles.filters}`}>
                  <FilterButton currFilter={filter} myFilter={"all"} label="All" updateFn={handleFilterUpdate}/>
                  <FilterButton currFilter={filter} myFilter={"complete"} label="Graded" updateFn={handleFilterUpdate}/>
                  <FilterButton currFilter={filter} myFilter={"incomplete"} label="Ungraded" updateFn={handleFilterUpdate}/>
                </div>
                <div className={styles.data}>
                  {lists[filter]?<div>{lists[filter].map((ele,i)=>
                  <StudentMarksWidget ele={ele} populate={populateLists} mentorToken={mentor.token}key={ele._id} pIndex={i+1}/>
                  )}</div>:<FontAwesomeIcon icon={faSpinner}  className={styles.loader}/>}
                </div>
                <div className={`${styles.btnholder} ${styles.editbtn}`}>
                  <div className={styles.finsubmit} onClick={handleFinalSubmit}>
                    Final Submit
                  </div>
                </div>
              </>
              )
            )
        }
      </div>
    );
  }
  
  function StudentMarksWidget({ele,populate,mentorToken,pIndex}){
    const [score, setScore] = useState(ele.marks.score);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError,setHasError] = useState(false);

    const handleInputChange = (field, value) => {
      setScore((prevScore) => ({
        ...prevScore,
        [field]: Math.min(ele.marks.maxScore[field],parseInt(value)), 
      }));
    };

    const calculateTotalScore = () => {
      let total = 0;
      let outOf = 0;
  
      for (const key in score) {
        if (score[key] != null && !isNaN(score[key])) {
          total += score[key];
        }
        outOf += ele.marks.maxScore[key]; 
      }
      return { total, outOf };
    };
  
    const handleSubmitMarks=async ()=>{
      setIsLoading(true);
      setHasError(false);
      await fetch(urls.savemarks, {
            method: 'POST',
            body: JSON.stringify({
              studentID:ele._id,
              "score":score
            }),
            headers:{
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
              'Authorization':`Bearer ${mentorToken}`
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
            populate();
          }
      }).catch((err)=>{
        alert(err);
      });
    }

    const handleRemoveStudent=async()=>{
        setIsLoading(true);
        setHasError(false);
        await fetch(urls.removementee, {
              method: 'POST',
              body: JSON.stringify({
                studentID:ele._id
              }),
              headers:{
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${mentorToken}`
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
              populate();
            }
        }).catch((err)=>{
          alert(err);
        });
    }

   const totalScoreInfo = calculateTotalScore();

    return(
      <Collapsible 
              trigger={
                <div className={styles.info}>
                <div className={styles.index}>{pIndex}.</div>
                {ele.name}
            </div>}
              triggerStyle={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor:'#FFFFFF',
                color:'#000',
                paddingLeft:'10px',
                marginRight:'10px',
                borderBottom:'1px solid #C5C5C5'
                }}>
                {isLoading?
                  (<FontAwesomeIcon icon={faSpinner}  className={styles.loader}/>):
                  (hasError?(<div>An Error has occurred please refresh</div>):
                      (                  
                        <div>
                            {Object.entries(score).map(([key,value],i) => {
                                return (
                                  <div className={styles.marksWrapper} key={key}>
                                      <div  className={styles.info}>
                                        <div className={styles.index}>{pIndex}.{i+1}</div>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                      </div>
                                      <p>
                                        <input className={styles.marksInput} type='number' value={value?String(value):""} min={0} max={10} onChange={(e) => handleInputChange(key, e.target.value)}></input> / {ele.marks.maxScore[key]}
                                      </p>
                                  </div>
                                )
                            })}
                            <div className={styles.marksWrapper}><p>Total</p> <p>{totalScoreInfo.total} / {totalScoreInfo.outOf} </p></div>
                            <div className={`${styles.btnholder} ${styles.editbtn}`}>
                              <div className={`${styles.btn} ${!ele.marks.lock?`${styles.redbtn}`:`${styles.greyedbtn}`}`} onClick={handleRemoveStudent}>
                                Remove Student
                              </div>
                              <div className={`${styles.btn} ${!ele.marks.lock?`${styles.bluebtn}`:`${styles.greyedbtn}`}`} onClick={handleSubmitMarks}> 
                                Save Marks
                              </div>
                            </div>
                          </div>
                        )
                    )
                }
      </Collapsible>

    );
  }

  export default AssignedSection;