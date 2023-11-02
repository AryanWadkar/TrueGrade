import styles from './sidebar.module.css';
import {useContext} from 'react';
import { MentorContext } from "../config/context";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket , faCaretRight} from '@fortawesome/free-solid-svg-icons'

function Sidebar({ setActiveSection,currActive }) {
  const { mentor, login} = useContext(MentorContext);
  return (
    <div className={styles.bg}>
        <div className={styles.upper}>
            <div className={styles.greet}>
                <p className={styles.wish}>Greetings,</p>
                <p className={styles.mentor}>{mentor?mentor.name:"Loading..."}</p>
            </div>
            <SideBarButton currActiveVal={currActive} setActiveSectionfn={setActiveSection} myVal="all" label="All Students"/>
            <SideBarButton currActiveVal={currActive} setActiveSectionfn={setActiveSection} myVal="assigned" label="Assigned"/>
        </div>
        <div className={styles.logout}>
        <FontAwesomeIcon icon={faArrowRightFromBracket} /><p className={styles.lgtxt}>Logout</p>
        </div>
    </div>
  );
}

function SideBarButton({currActiveVal,setActiveSectionfn,myVal,label}){
    return(
        <div className={currActiveVal===myVal? `${styles.btn} ${styles.sel}` : `${styles.btn}`} onClick={() => setActiveSectionfn(myVal)}>
        {label} <FontAwesomeIcon icon={faCaretRight} />
    </div>
    );
}

export default Sidebar;
