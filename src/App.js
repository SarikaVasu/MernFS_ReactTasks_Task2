import { useState } from "react";
import Calculator from "./components/Calculator";


function App() {
  
  const [currExp,setCurrExp] = useState("");
  const [result,setResult] = useState(null);
  const [history,setHistory] = useState([]);
  const  [format,setFormat] = useState(false);

  return (
    <div className="App">
      <Calculator 
        currExp = {currExp}
        setCurrExp = {setCurrExp}
        result = {result}
        setResult = {setResult}
        history = {history}
        setHistory = {setHistory}
        format = {format}
        setFormat = {setFormat}/>
    </div>
  );
}

export default App;
