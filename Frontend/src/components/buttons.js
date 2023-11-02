import styles from './buttons.module.css'

function FilterButton({currFilter,myFilter,updateFn,label}){
    return(
    <div className={`${styles.btn} ${styles.filterbtn} ${currFilter===myFilter? `${styles.sel}`:""}`} onClick={()=>updateFn(myFilter)}>
    {label}
  </div>);
}

export{FilterButton};

