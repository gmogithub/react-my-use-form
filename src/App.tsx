import React, {useState} from 'react';
import './App.css';
// import { useForm } from "react-hook-form";
import {formatIban, formatInteger} from "./utils/form/formFormat";
import {parseIban, parseInteger} from "./utils/form/formParse";
import {useStateForm} from "./hook/useStateForm";
import {isRequiredForm} from "./utils/formValidator";
import {SFFormTextField} from "./components/field/textfield/SFFormTextField";

let counter = 0;

function App() {
  const { register, handleSubmit } = useStateForm({integer: "20"});
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(c => ++c);
  }

  return (
    <div className="App">
      <button onClick={handleClick}>{count}</button>
      <form onSubmit={handleSubmit((values) => {
        console.log(values)
      })}>
        <input {...register("integer", { format: formatInteger, parse: parseInteger })} placeholder={"Integer"}/>
        <SFFormTextField {...register("lastName2", { validate: [isRequiredForm]})} placeholder={"nom 2"}/>
        <input {...register("iban", { format: formatIban, parse: parseIban })} placeholder={"iban"}/>
        <input {...register("firstName")} placeholder={"prénom"}/>
        <input type={"checkbox"} value={"01"} {...register("valid")}/>
        <input type={"checkbox"} value={"02"} {...register("valid")}/>
        <input type={"submit"} value={"submit"}/>
        <p>{counter++}</p>
      </form>
    </div>
  );
}

export default App;
