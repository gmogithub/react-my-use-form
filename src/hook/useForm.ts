import React, { useEffect, useRef } from "react";

type ValidateType = (value: any) => boolean;
type FormatType = (value: any) => any;
type ParseType = (value: any) => any;

interface RegisterOption {
  validate?: ValidateType[],
  format?: FormatType,
  parse?: ParseType
}

interface FormInfo<T> {
  values: T,
  validations: { [propName: string]: ValidateType[] },
  formats: { [propName: string]: FormatType },
  parses: { [propName: string]: ParseType }
}

export function useForm<T = any>(initialValue: T = {} as T) {
  const stateRef = useRef<FormInfo<T>>({ validations: {}, formats: {}, parses: {}, values: initialValue });

  useEffect(() => {
    Object.keys(initialValue).forEach(name => {
      const elt = document.querySelector(`input[name='${name}']`);
      if (elt) {
        const value = initialValue[name as keyof T] as any;
        elt.setAttribute("value", value);
      }
    })
  }, [initialValue])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.type === "checkbox") {
      let oldValuesTmp: any = stateRef.current.values[e.target.name as keyof T];
      let oldValues: any = oldValuesTmp ? oldValuesTmp : [];
      if (e.target.checked) {
        oldValues.push(e.target.value);
      } else {
        oldValues.splice(oldValues.indexOf(e.target.value), 1);
      }
      stateRef.current.values[e.target.name as keyof T] = oldValues;
    } else {
      const fnFormat = stateRef.current.formats[e.target.name];
      const fnParse = stateRef.current.parses[e.target.name];
      let value = e.target.value;
      if (fnFormat) {
        value = fnFormat(e.target.value);
        e.target.value = value;
      }

      if (fnParse) {
        value = fnParse(value);
      }

      stateRef.current.values = { ...stateRef.current.values, [e.target.name]: value };
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {

  }

  function register(name: string, option?: RegisterOption) {

    if (option) {
      if (option.validate) {
        stateRef.current.validations = { ...stateRef.current.validations, [name]: option.validate }
      }

      if (option.format) {
        stateRef.current.formats = { ...stateRef.current.formats, [name]: option.format }
      }

      if (option.parse) {
        stateRef.current.parses = { ...stateRef.current.parses, [name]: option.parse }
      }
    }
    return { onChange: handleChange, onBlur: handleBlur, name };
  }

  function handleSubmit(fn: (s: T) => void) {
    return (e: any) => {
      e.preventDefault();
      if (validation()) {
        fn(stateRef.current.values);
      } else {
        alert("error")
      }
    };
  }

  function validation() {
    return Object.keys(stateRef.current.validations).reduce((acc, name) => {
      const fns = stateRef.current.validations[name];
      const value = stateRef.current.values[name as keyof T];
      const result = fns.reduce((acc2, fn) => {
        const res = fn(value);
        return acc && res;
      }, true);
      return acc && result;
    }, true);
  }

  return { register, handleSubmit, values: stateRef.current.values }
}
