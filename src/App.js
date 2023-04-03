import { Space } from "antd";
import React, { useState, createContext } from "react";
import FormComponent from "./FormComponent";
import TableComponent from "./TableComponent";
export const UserContext = createContext();

function App() {
  const [input, setInput] = useState("");
  const [display, setDisplay] = useState([]);

  return (
    <UserContext.Provider value={{ display, setDisplay, input, setInput }}>
      <Space className="   w-screen h-screen  bg-gray-500 flex  flex-col items-center  justify-start ">
        <p className="   text-yellow-400  font-bold  text-5xl  my-10  mt-20 ">
          {" "}
          TODO APP{" "}
        </p>
        <Space className=" flex flex-row pt-10 "></Space>
        <FormComponent></FormComponent>
        <TableComponent></TableComponent>
      </Space>
    </UserContext.Provider>
  );
}

export default App;
