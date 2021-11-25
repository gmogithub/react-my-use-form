import {useCallback, useRef, useState} from "react";
import {SFMessageValidator} from "../utils/formValidator";


type UseFormChangeEvent = (e: UserFormInputEvent) => void;

export interface UseFormEvent {
    onChange?: UseFormChangeEvent,
    onBlur?: UseFormBlurEvent,
}

type ValidateType = <T> (value: any, values?: T) => (boolean | Promise<boolean>);
type FormatType = (value: any) => any;
type ParseType = (value: any) => any;
type ErrorsState = { [propName: string]: string | undefined };
type UseFormChangeFunc = (e: UserFormInputEvent) => void;
type UseFormBlurEvent = (e: UserFormInputEvent) => void;

interface InputRegister extends UseFormEvent {
    value?: any,
    name: string,
    error?: string
}

interface RegisterOption {
    validate?: ValidateType[],
    format?: FormatType,
    parse?: ParseType
}

interface UserFormInputEvent {
    target: {
        name: string,
        value: any
        type?: string,
        checked?: boolean
    }
}

interface FormInfo {
    validations: { [propName: string]: ValidateType[] },
    formats: { [propName: string]: FormatType },
    parses: { [propName: string]: ParseType }
}

interface UseFormGlobalOption {
    validateOnChange?: boolean,
    validateOnBlur?: boolean
}

// const handleChangeDebounced = debounced(500, (e, setValues, setErrors, option, formatAndParseValue, validationField) => {
//     const type = e.target.type;
//     const name: string = e.target.name;
//     const value = e.target.value;
//     const checked = e.target.checked;
//     console.log(e)
//
//     setValues((allValuesPrev: any) => {
//         console.log("===")
//         const valuePrev = allValuesPrev[name];
//         if (type === "checkbox") {
//             const val: any = valuePrev ? valuePrev : [];
//             if (checked) {
//                 val.push(value);
//             } else {
//                 val.splice(val.indexOf(value), 1);
//             }
//             return {...allValuesPrev, [name]: val};
//         } else if (type === "radio") {
//             return {...allValuesPrev, [name]: value}
//         } else {
//             const result = formatAndParseValue(name, value);
//             if (option && option.validateOnChange) {
//                 validationField(name, result.valueParse).then((nextError : any) => {
//                     setErrors((prevErrors: any) => {
//                         const prevError = prevErrors[name];
//                         if (nextError !== prevError) {
//                             return {...prevErrors, [name]: nextError};
//                         }
//                         return prevErrors;
//                     });
//                 });
//             }
//             return {...allValuesPrev, [name]: result.valueFormat};
//         }
//     });
// });

export function useStateForm<T = any>(initialValue?: T, optionProp?: UseFormGlobalOption) {
    const option = optionProp ? optionProp : {validateOnChange: true, validateOnBlur: true};
    const [values, setValues] = useState<T>(initialValue ? initialValue : {} as T);
    const [errors, setErrors] = useState<ErrorsState>({});
    const stateRef = useRef<FormInfo>({
        validations: {},
        formats: {},
        parses: {}
    });


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

        return {valueFormat: resultFormat, valueParse: resultParse};
    }

    function parseValues(vals: T) {
        return Object.keys(vals).reduce((acc, key) => {
            return {...acc, [key]: formatAndParseValue(key, vals[key as keyof T]).valueParse};
        }, {} as T)
    }

    const handleChange: UseFormChangeFunc = async (e: UserFormInputEvent) => {
        const type = e.target.type;
        const name: string = e.target.name;
        const value = e.target.value;
        const checked = e.target.checked;

        setValues(allValuesPrev => {
            const valuePrev = allValuesPrev[name as keyof T];
            if (type === "checkbox") {
                const val: any = valuePrev ? valuePrev : [];
                if (checked) {
                    val.push(value);
                } else {
                    val.splice(val.indexOf(value), 1);
                }
                return {...allValuesPrev, [name]: val};
            } else if (type === "radio") {
                return {...allValuesPrev, [name]: value}
            } else {
                const result = formatAndParseValue(name, value);
                if (option && option.validateOnChange) {
                    validationField(name, result.valueParse).then(nextError => {
                        setErrors(prevErrors => {
                            const prevError = prevErrors[name];
                            if (nextError !== prevError) {
                                return {...prevErrors, [name]: nextError};
                            }
                            return prevErrors;
                        });
                    });
                }
                return {...allValuesPrev, [name]: result.valueFormat};
            }
        });
    }

    const handleBlur: UseFormBlurEvent = async (e: UserFormInputEvent) => {
        if (option && option.validateOnBlur) {
            let value = e.target.value;
            const name: string = e.target.name;
            const result = formatAndParseValue(name, value);
            const nextError = await validationField(e.target.name, result.valueParse);
            setErrors(prevErrors => {
                const prevError = prevErrors[e.target.name];
                if (nextError !== prevError) {
                    return {...prevErrors, [e.target.name]: nextError};
                }
                return prevErrors;
            });
        }
    }

    const register = useCallback((name: string, option?: RegisterOption) => {
        if (option) {
            if (option.validate && stateRef.current.validations[name] === undefined) {
                console.log("validate init")
                stateRef.current.validations = {...stateRef.current.validations, [name]: option.validate}
            }

            if (option.format && stateRef.current.formats[name] === undefined) {
                stateRef.current.formats = {...stateRef.current.formats, [name]: option.format}
            }

            if (option.parse && stateRef.current.parses[name] === undefined) {
                stateRef.current.parses = {...stateRef.current.parses, [name]: option.parse}
            }
        }


        const error = errors[name];


        if (values[name as keyof T] === undefined) {
            setValues({...values, [name]: ""});
        }

        const value = values[name as keyof T] ? values[name as keyof T] : "";
        console.log(value);
        let result: InputRegister = {
            onChange: handleChange,
            onBlur: handleBlur,
            name,
            error,
            value
        };



        return result;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [/*render,*/ errors, values]);

    function handleSubmit(fn: (s: T) => void) {
        return async (e: any) => {
            e.preventDefault();
            const valuesParse = parseValues(values);
            const valid = await validation(valuesParse);
            if (valid) {
                fn(valuesParse);
            } else {
                const nextErrors = await (Object.keys(values).reduce(async (acc, name) => {
                    const value = values[name as keyof T];
                    const validField = await validationField(name, value);
                    const accAwait = await acc;
                    return {...accAwait, [name]: validField};
                }, Promise.resolve({})));
                setErrors(nextErrors);
            }
        };
    }

    async function validationField(name: string, value: any) {
        const fns = stateRef.current.validations[name] ? stateRef.current.validations[name] : [];
        let messageError: string | undefined;
        const valid = await fns.reduce(async (acc, fn) => {
            const res = fn(value, values);
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


    return {register, handleSubmit, values, errors}
}
