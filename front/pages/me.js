import React, { useState, useCallback, memo } from "react";
import ReactDOM from "react-dom";

// parent 안에서 펑션 정의. 정의된 펑션은 arrow
// 그러나 memo는 declaration
// useCallback, memo 같이 쓰여야 렌더를 막는다. usecallback []가 리렌더 되면 useMemo도 리렌더된다.

function Parent() {
  const [item, setItem] = useState({ name: "item", value: 0 });

  const handleChangeItem = () => {
    const newValue = item.value + 1;
    setItem({ ...item, value: newValue });
  };

  const handleClicks = useCallback(() => {
    const newValue = item.value + 1;
    setItem({ ...item, value: newValue });
  }, [item]);

  return (
    <>
      Name: {item.name} Value: {item.value}
      <Child1 changeItem={handleChangeItem} />
      <Child2 changeItem={handleChangeItem} />
      <button onClick={handleClicks}>Onchange</button>
    </>
  );
}

const Child1 = ({ changeItem }) => {
  // function handleClick() {
  //   changeItem();
  // }
  console.log("child render");
  return (
    <div>
      <button onClick={changeItem}>change state in child 1</button>
    </div>
  );
};

const Child2 = React.memo(function Child2({ changeItem }) {
  // function handleClick() {
  //   changeItem();
  // }
  console.log("child render");
  return (
    <div>
      <button onClick={changeItem}>change state in child 2</button>
    </div>
  );
});

export default Parent;
