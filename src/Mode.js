import React from "react";

export default () => {
  return (
    <div className="grid grid-cols-2 text-center gap-x-4 text-lg font-medium mb-8">
      <div className="w-auto"> Solo</div>
      <div className="w-auto  border-b-4 rounded-b-sm  border-cm-dark-dark">
        {" "}
        Duo
      </div>
    </div>
  );
};
