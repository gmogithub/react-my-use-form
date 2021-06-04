import React, { useState } from 'react';
import './App.css';
// import { useForm } from "react-hook-form";
import { useForm } from "./hook/useForm";

export interface IbanCodeLocale {
  AD: number,
  AE: number,
  AT: number,
  AZ: number,
  BA: number,
  BE: number,
  BG: number,
  BH: number,
  BR: number,
  CH: number,
  CR: number,
  CY: number,
  CZ: number,
  DE: number,
  DK: number,
  DO: number,
  EE: number,
  ES: number,
  FI: number,
  FO: number,
  FR: number,
  GB: number,
  GI: number,
  GL: number,
  GR: number,
  GT: number,
  HR: number,
  HU: number,
  IE: number,
  IL: number,
  IS: number,
  IT: number,
  JO: number,
  KW: number,
  KZ: number,
  LB: number,
  LI: number,
  LT: number,
  LU: number,
  LV: number,
  MC: number,
  MD: number,
  ME: number,
  MK: number,
  MR: number,
  MT: number,
  MU: number,
  NL: number,
  NO: number,
  PK: number,
  PL: number,
  PS: number,
  PT: number,
  QA: number,
  RO: number,
  RS: number,
  SA: number,
  SE: number,
  SI: number,
  SK: number,
  SM: number,
  TN: number,
  TR: number
}

const JSUtils = {
  isString(value: any): value is string {
    return typeof value === 'string';
  }
}

export const IBAN_CODE_LENGTHS: IbanCodeLocale = {
  AD: 24, AE: 23, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29,
  CH: 21, CR: 21, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, ES: 24,
  FI: 18, FO: 18, FR: 27, GB: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21,
  HU: 28, IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28,
  LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27,
  MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
  RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26
};

function isRequired(value: string) {
  return Boolean(value);
}

function formatNumber(value: string) {
  return value.replace(new RegExp("[a-z][A-Z]*"), "");
}

function parseNumberInt(value: any) {
  return parseInt(value, 10);
}

const formatIban = (value: string) => {
  let result = "";
  if (JSUtils.isString(value)) {
    if (!value) {
      return value;
    }
    result = value.toUpperCase();
    const locales: string[] = Object.keys(IBAN_CODE_LENGTHS);
    const locale = result.substring(0, 2);
    let length = 2;
    if (locale.length === 2 && locales.includes(locale)) {
      length = IBAN_CODE_LENGTHS[locale as keyof IbanCodeLocale];
    }

    result = result
      .substring(0, length)
      .replace(new RegExp('[^0-9A-Z]', 'g'), '')
      .replace(new RegExp('(.{4})', 'g'), '$1 ')
      .trim();
  }
  return result;
};

function parseIban(value: string) {
  if (JSUtils.isString(value)) {
    if (!value) return value;
    return value.replace(new RegExp(' ', 'g'), '').toUpperCase();
  }
  return '';
}

let counter = 0;

function App() {
  const { register, handleSubmit } = useForm({lastName: "greg", iban: "45454", valid: ["1"]});
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
        <input {...register("lastName", { format: formatNumber, parse: parseNumberInt })} placeholder={"nom"}/>
        <input {...register("lastName2", { format: formatNumber, parse: parseNumberInt })} placeholder={"nom 2"}/>
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
