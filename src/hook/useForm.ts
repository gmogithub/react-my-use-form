import React, { ChangeEventHandler, FocusEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { SFMessageValidator } from "../utils/formValidator";
import { sleep } from "../utils/utils";

type ValidateType = <T> (value: any, values?: T) => (boolean | Promise<boolean>);
type FormatType = (value: any) => any;
type ParseType = (value: any) => any;

interface RegisterOption {
  validate?: ValidateType[],
  format?: FormatType,
  parse?: ParseType
}

type ErrorsState = { [propName: string]: string | undefined };

interface UseFormGlobalOption {
  validateOnChange?: boolean,
  validateOnBlur?: boolean,
  renderingDelay?: number // in ms
}

interface FormInfo<T> {
  values: T,
  fieldsRegister: string[],
  validations: { [propName: string]: ValidateType[] },
  formats: { [propName: string]: FormatType },
  parses: { [propName: string]: ParseType }
}

interface UserFormInputEvent {
  target: {
    name: string,
    value: any
    type?: string,
    checked?: boolean
  }
}

type UseFormChangeEvent = (e: UserFormInputEvent) => void;
type UseFormBlurEvent = (e: UserFormInputEvent) => void;

export interface UseFormEvent {
  onChange?: UseFormChangeEvent,
  onBlur?: UseFormBlurEvent,
}

interface InputRegister extends UseFormEvent {
  value?: any,
  name: string,
  error?: string,
  ref: any
}

export function useForm<T = any>(initialValue: T = {} as T, optionProp?: UseFormGlobalOption) {
  const option = optionProp ? optionProp : { validateOnChange: true, validateOnBlur: true, renderingDelay: 0 };
  const stateRef = useRef<FormInfo<T>>({
    fieldsRegister: [],
    validations: {},
    formats: {},
    parses: {},
    values: {} as T
  });
  const eltsRef = useRef<{ [propName: string]: any }>({})
  const [errors, setErrors] = useState<ErrorsState>({});


  useEffect(() => {

    (async () => {
      if (option.renderingDelay !== undefined && option.renderingDelay > 0) {
        console.info("waiting render before default value")
        await sleep(option.renderingDelay);
      }
      setDefaultValues(initialValue);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue, option.renderingDelay]);

  function formatAndParseValue(name: string, value: any) {
    const fnFormat = stateRef.current.formats[name];
    const fnParse = stateRef.current.parses[name];
    let resultFormat = value;
    let resultParse = value;

    if (fnFormat) {
      resultFormat = fnFormat(value);
      resultParse = resultFormat;
    }

    if (fnParse) {
      resultParse = fnParse(resultFormat);
    }

    if (!fnFormat) {
      resultFormat = resultParse;
    }

    return { valueFormat: resultFormat, valueParse: resultParse };
  }

  const handleChange: UseFormChangeEvent = async (e: UserFormInputEvent) => {
    const type = e.target.type;
    const name: string = e.target.name;
    const value = e.target.value;
    const checked = e.target.checked;
    if (type === "checkbox") {
      let oldValuesTmp: any = stateRef.current.values[name as keyof T];
      let oldValues: any = oldValuesTmp ? oldValuesTmp : [];
      if (checked) {
        oldValues.push(value);
      } else {
        oldValues.splice(oldValues.indexOf(value), 1);
      }
      stateRef.current.values[name as keyof T] = oldValues;
    } else if (type === "radio") {
      stateRef.current.values[name as keyof T] = value;
    } else {
      const result = formatAndParseValue(name, value);

      e.target.value = result.valueFormat;
      stateRef.current.values = { ...stateRef.current.values, [name]: result.valueParse };
      if (option && option.validateOnChange) {
        const nextError = await validationField(name, result.valueParse);
        setErrors(prevErrors => {
          const prevError = prevErrors[name];
          if (nextError !== prevError) {
            return { ...prevErrors, [name]: nextError };
          }
          return prevErrors;
        });
      }
    }
  }

  const handleBlur: UseFormBlurEvent = async (e: UserFormInputEvent) => {
    if (option && option.validateOnBlur) {
      let value = e.target.value;
      const nextError = await validationField(e.target.name, value);
      setErrors(prevErrors => {
        const prevError = prevErrors[e.target.name];
        if (nextError !== prevError) {
          return { ...prevErrors, [e.target.name]: nextError };
        }
        return prevErrors;
      });
    }
  }

  const register = useCallback((name: string, option?: RegisterOption) => {
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

    const values = stateRef.current.values;
    if (!Boolean(values[name as keyof T])) {
      // @ts-ignore
      stateRef.current.values[name] = "";
    }

    const error = errors[name];
    let result: InputRegister = {
      onChange: handleChange,
      onBlur: handleBlur,
      name,
      error,
      ref: (elt: any) => eltsRef.current[name] = elt
    };

    if (!stateRef.current.fieldsRegister.includes(name)) {
      stateRef.current.fieldsRegister.push(name);
    }

    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/*render,*/ errors]);

  function handleSubmit(fn: (s: T) => void) {
    return async (e: any) => {
      e.preventDefault();
      const values = stateRef.current.values;
      const valid = await validation(values);
      if (valid) {
        fn(values);
      } else {
        const nextErrors = await (Object.keys(values).reduce(async (acc, name) => {
          const value = values[name as keyof T];
          const validField = await validationField(name, value);
          const accAwait = await acc;
          return { ...accAwait, [name]: validField };
        }, Promise.resolve({})));
        setErrors(nextErrors);
      }
    };
  }

  async function validationField(name: string, value: any) {
    const fns = stateRef.current.validations[name] ? stateRef.current.validations[name] : [];
    let messageError: string | undefined;
    const valid = await fns.reduce(async (acc, fn) => {
      const res = fn(value, stateRef.current.values);
      const response = res instanceof Promise ? (await res) : res;
      if (!response && !Boolean(messageError)) {
        messageError = SFMessageValidator.getMessageError(fn);
      }
      return await acc && response;
    }, Promise.resolve(true));
    if (!valid) {
      return messageError;
    }

    return undefined;
  }

  async function validation(values: T) {
    return Object.keys(values).reduce(async (acc: Promise<boolean>, name) => {
      const value = values[name as keyof T];
      const validField = await validationField(name, value);
      const valid = !Boolean(validField);
      return await acc && valid;
    }, Promise.resolve(true));
  }

  function setDefaultValues(values: Partial<T>) {
    Object.keys(values).forEach((name) => {
      const elt = eltsRef.current[name];
      if (elt) {
        const value = values[name as keyof T] as any;
        if (value) {
          if (elt.type === "checkbox") {
            const elts = document.getElementsByName(name);
            elts.forEach((el: any) => {
              console.log(el.value, value, value.includes(el.value))
              el.checked = value.includes(el.value);
            })
          } else if (elt.type === "radio") {

          } else {
            const result = formatAndParseValue(name, value);
            elt.value = result.valueFormat;
            stateRef.current.values[name as keyof T] = result.valueParse;
          }
        }
      }
    });
  }

  return { register, handleSubmit, values: stateRef.current.values, errors, setDefaultValues }
}

export interface UseFormProps extends UseFormEvent {
  errors?: { [propName: string]: boolean }
  error?: string
  // render?: { count: number },
  name?: string
}
