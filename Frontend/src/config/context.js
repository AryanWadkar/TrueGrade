import React, { createContext,useState } from "react";

const MentorContext = createContext();

const MentorProvider = ({ children }) => {
  const [mentor, setMentor] = useState(null);

  const login = (mentorData) => {
    setMentor(mentorData);
  };

  return (
    <MentorContext.Provider value={{ mentor, login }}>
      {children}
    </MentorContext.Provider>
  );
};

export{
  MentorContext,
  MentorProvider
}
