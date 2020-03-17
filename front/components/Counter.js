import React from "react";
const Counter = ({ value, children, onClick }) => {
  console.log("Render: ", children);

  return (
    <button onClick={onClick}>
      {children}: {value}
    </button>
  );
};

// export default React.memo(Counter);
export default React.memo(Counter);
