import {FaAlignJustify,FaBackspace,FaDivide,FaMinus,FaPlus,FaTimes} from 'react-icons/fa';
import { useEffect } from 'react';

//negative number, in exp check or postfix

const Calculator = ({currExp,setCurrExp,result,setResult,history,setHistory,format,setFormat}) => {

    const calButtons = [
        [7,4,1,0],
        [8,5,2,'.'],
        [9,6,3,'='],
        [<FaBackspace/>,<FaDivide/>,<FaTimes/>,<FaMinus/>,<FaPlus/>]
    ];

    useEffect (() => {
        if(format) {
            Calculate();
        } 
    },[format])

    useEffect(() => {
        if((currExp[currExp.length-1] === '÷') || (currExp[currExp.length-1] === '×') || (currExp[currExp.length-1] === '+') || (currExp[currExp.length-1] === '-')) {
            setFormat(false);
        } else {
            for(let i = 0; i < currExp.length; i++) {
                if((currExp[i] === '÷') || (currExp[i] === '×') || (currExp[i] === '+') || (currExp[i] === '-')) {
                    if((currExp[i-1] === '÷') || (currExp[i-1] === '×') || (currExp[i-1] === '+') || (currExp[i-1] === '-')) {
                        setFormat(false);
                    }
                } else {
                    setFormat(true);
                }
            }
        }
    },[currExp])

    useEffect(() => {
        if(currExp.length > 1) {
            if(history.length === 0) {
                const addHistory = [...history,currExp];
                setHistory(addHistory);
            } else {
                let i;
                for ( i of history) {
                    if(i !== currExp) {
                        const addHistory = [...history,currExp];
                        setHistory(addHistory);
                    }
                }
            }
        }
        if(history.length > 6) {
            history.shift();
            setHistory(history);
        }
    },[result])

    const rank = (op) => {
        if((op === '/') || (op === '*')) {
            return 2;
        } else {
            return 1;
        }
    }

    const formatExp = () => {

        let exp = currExp.split("");
        let expList = [];
        let num = 0;
        let index = 0;
        let operator = "";

        for (let i = 0; i < exp.length; i++) {
            if (exp[i] === "÷") {
                exp[i] = "/";
            } else if (exp[i] === "×") {
                exp[i] = "*";
            }
        }

        for (let j = 0; j < exp.length; j++) {
            if((exp[j] === '/') || (exp[j] === '*') || (exp[j] === '-') || (exp[j] === '+')) {
                num = exp.slice(index,j).toString();
                index = j+1;
                expList.push(num);
                operator = exp.slice(j,j+1).toString();
                expList.push(operator);
            }
        } 

        expList.push(exp.slice(index,exp.length).toString());

        for(let k = 0; k < expList.length; k += 2) {
            expList[k] = Number(expList[k].split(",").join(""));
        } 
        
        return(postFix(expList));
        
    }

    const postFix = (expList) => {

        let formatList = expList;
        let stack = [];
        let expStack = [];
        let top = -1;

        for (let i = 0; i < formatList.length; i++) {
            if((typeof formatList[i]) === "number" ) {
                expStack.push(formatList[i]);
            } else if ((typeof formatList[i]) === "string") {
                if (top === -1) {
                    stack.push(formatList[i]);
                    top++;
                } else {
                    if(rank(formatList[i]) > rank(stack[top])) {
                        stack.push(formatList[i]);
                        top++;
                    } else if (rank(formatList[i]) <= rank(stack[top])) {
                        while ((top !== -1) && (rank(formatList[i]) <= rank(stack[top]))) {
                            expStack.push(stack.pop());
                            top--;
                        }
                        stack.push(formatList[i]);
                        top++;
                    } 
                }  
            }
        }
        while(top !== -1) {
            expStack.push(stack.pop());
            top--;
        }
        
        return(expStack);
        
    } 

    const evalPostFixExp = (postFixExp) => {

        let Expression = postFixExp;

        let tempRes = 0;
        let i =0;
        while(Expression.length > 1) {
            for (i; i < Expression.length; i++) {
                if((typeof Expression[i]) === "string") {
                    try {
                        if (Expression[i] === "/") {
                            tempRes = Expression[i-2] / Expression[i-1];
                            Expression.splice(i-2,3,tempRes);
                        } 
                        if (Expression[i] === "*") {
                            tempRes = Expression[i-2] * Expression[i-1];
                            Expression.splice(i-2,3,tempRes);
                        }
                        if (Expression[i] === "+") {
                            tempRes = Expression[i-2] + Expression[i-1];
                            Expression.splice(i-2,3,tempRes);
                        } 
                        if (Expression[i] === "-") {
                            tempRes = Expression[i-2] - Expression[i-1];
                            Expression.splice(i-2,3,tempRes);
                        }
                    } catch(err) {
                        alert(err);
                    }
                    i=0;
                }
            }
        }

        setResult(Expression[0]);
    }

    const Calculate = () => {
        if(currExp.length > 0) {
            const postFixExp = formatExp();
            if (postFixExp.length > 2) {
                evalPostFixExp(postFixExp);
            } else {
                setResult(null) ;
            }
        } else {
            setResult(null);
        }
    }

    const BackSpace = () => {
        if (currExp.length === 0) {
            setResult(null);
        } else {
            setCurrExp(currExp.slice(0,-1));
    }}

    const pressed = (val,indexButton) => {
        if (document.getElementById("calBody").style.visibility === "hidden") {
            document.getElementById("historyDisplay").style.visibility = "hidden";
            document.getElementById("calBody").style.visibility = "visible";
        }

        if (typeof val === "number") {
            setCurrExp(currExp + val.toString());
        } else if (typeof val === "string") {
            if(val === ".") {
                setCurrExp(currExp + val.toString());
            } else if (val === "=") {
                if(!format) {
                    document.getElementById("resultDisplay").style.content = "Invalid expression";
                }  
            }
        } else if (typeof val === "object") {
            switch (indexButton) {
                case 0:
                    BackSpace();
                    break;
                case 1:
                    setCurrExp(currExp + "÷");
                    break;
                case 2:
                    setCurrExp(currExp + "×");
                    break;
                case 3:
                    setCurrExp(currExp + "-");
                    break;
                case 4:
                    setCurrExp(currExp + "+");
                    break;
                default:
                    break;
            }
        }
    }

    const clearDisplay = () => {    
        setCurrExp("");
        setResult(null);
        document.getElementById("calBody").style.visibility = "hidden";
        document.getElementById("historyDisplay").style.visibility = "hidden";
    }

    const showHistory = () => {
        clearDisplay();
        try {
            document.getElementById("historyDisplay").style.visibility = "visible";      
        } catch (err) {
            alert(err);
        }
    }

  return (
    <main>   

        <article className="cal">

            <aside className="calDisplay">
                <aside className="calNav">
                    <span className='icon'>
                        <button onClick={clearDisplay}>
                            <span className='icon1'>C</span>
                        </button>
                        <button onClick={showHistory}>
                            <span className='icon2'>
                                <FaAlignJustify/>
                            </span>
                        </button>
                    </span>
                </aside>
                <aside className="calBody" id="calBody">
                    <span className="calExpDisplay" id="calExpDisplay">
                        <span id='currExpDisplay'>
                            {currExp}
                        </span>
                        <article id='historyDisplay'>
                        {
                            <ul id='history'>
                            {
                                history.length > 0 ? (
                                    history.map((historyItem,indexHistory) => (
                                        <li key = {indexHistory} className='historyItem'>
                                        {historyItem}
                                        </li>
                                    ))
                                ) : (
                                    <li>No History available yet...</li>
                                )   
                            }
                            </ul>
                        }
                        </article>
                    </span>
                    <span className='resultDisplay' id='resultDisplay'>
                        {result}
                    </span>
                </aside>
            </aside>

            <aside className="calPad">
                <ul>
                    {
                        calButtons.map((buttons,indexButtons) => (
                            <li key = {indexButtons}>
                                {
                                    buttons.map((button,indexButton) => (
                                        <span className='buttonKeys'
                                            key = {indexButton}>
                                            <button className='buttonKey'
                                                onClick={()=>pressed(button,indexButton)}>
                                                {button}
                                            </button>
                                        </span>
                                    ))
                                }
                            </li>

                        ))
                    }
                </ul>
            </aside>
        </article>
    </main>
  )
}

export default Calculator;







