import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import CreateDigitalLog from "@/navigation/CreateDigitalLog";

const DigitalLog = () => {

 const [searchQuery, setSearchQuery] = useState("");
 const navigate = useNavigate()
 

  return (
    <div className="p-0">
      <div>
        <CreateDigitalLog
          title="Digital LogBook Tbale"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => navigate("/user-management/manage-user/user-creation")}
        />
      </div>
     Cooming Soon...
    </div>
  );
};

export default DigitalLog;
