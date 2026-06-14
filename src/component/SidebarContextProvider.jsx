import { createContext, useState } from "react";
import React from "react";


export const SidebarContext = createContext();

const SidebarContextProvider = ({ children }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarContextProvider;
