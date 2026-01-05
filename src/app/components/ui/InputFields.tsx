"use client"
import {
    Combobox,
    Input,
    InputBase,
    Select,
    TextInput,
    useCombobox,
} from "@mantine/core";
import React, { useEffect, useMemo, useState } from "react";
import { EyeIcon, EyeOffIcon } from "../svg";

type InputFieldWithLabelProps = {
    name: string
    label?: string
    placeholder?: string
    className?: string
    disabled?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>

export function InputFieldWithLabel({
    name,
    label,
    placeholder,
    className = "",
    disabled = false,
    ...rest
}: InputFieldWithLabelProps) {
    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label htmlFor={name} className="text-sm font-medium">
                    {label}
                </label>
            )}

            <input
                id={name}
                name={name}
                placeholder={placeholder}
                disabled={disabled}
                className={`border p-2 rounded ${className}`}
                {...rest}
            />
        </div>
    )
}

type InputTextFieldProps<T> = {
    name: keyof T;
    label:string;
    placeholder: string;
    form: {
        values: T;
        errors: Partial<Record<keyof T, string>>;
        validateField: (field: keyof T) => void;
        setFieldValue: (field: keyof T, value: string) => void;
    };
    disabled:boolean;
    required?: boolean;
};

export function InputTextField<T>({
    name,
    label,
    placeholder,
    form,
    disabled,
    required,
}: InputTextFieldProps<T>) {
    const value = form.values[name] as string;
    const error = form.errors[name];
    const showFloatingLabel =
        value !== undefined && value !== null && value !== "";
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative w-full">
            <div className="relative w-full">
                    <div className={`absolute ${(showFloatingLabel || isFocused)?"-top-2.25":"top-1/10 opacity-0"} transition-all duration-300 px-1 left-4 z-30 text-[12px] text-black dark:text-white mobile-small-text bg-white dark:bg-[#121212] rounded`}>
                        {label}
                    </div>
                {!isFocused && !showFloatingLabel &&  (
                    <div
                        className={`absolute top-[50%] translate-y-[-50%] px-0.5 left-3 md:left-4 z-30 text-[14px] text-[#666] pointer-events-none body-regular`}
                    >
                        {placeholder}{" "}
                        {required === true && (
                            <span className="text-[#CB3332]">*</span>
                        )}
                    </div>
                )}
                <input
                    name={String(name)}
                    // placeholder={isFocused?"":placeholder}
                    value={value}
                    disabled={disabled}
                    className={`border rounded w-full text-[#333333] dark:text-[#cbccd3] focus:outline-none focus:ring-0`}
                    onBlur={() => {
                        form.validateField(name);
                        setIsFocused(false);
                    }}
                    onFocus={() => {
                        setIsFocused(true);
                    }}
                    style={{
                        borderRadius: "6px",
                        borderColor: error ? "#F07575" : "#666666",
                        padding: "16px",
                        paddingTop: "20px",
                        paddingBottom: "20px",
                        height: "2px",
                        fontSize: "16px",
                        lineHeight: "24px",
                        fontFamily: "sans-serif",
                        width: "100%"
                    }}
                    onChange={(e) => {
                        let updated = e.target.value;
                        if (name === "fullName") {
                            updated = updated.replace(/[^a-zA-Z\s]/g, "");
                        }
                        form.setFieldValue(name, updated);
                    }}
                />

                {/* <TextInput
                    // placeholder={placeholder}
                    name={String(name)}
                    value={value}
                    styles={{
                        input: {
                            background: "#ffffff",
                            borderRadius: "8px",
                            borderColor: error ? "#F07575" : "#666666",
                            padding: "16px",
                            paddingTop: "22px",
                            paddingBottom: "22px",
                            height: "24px",
                            fontSize: "16px",
                            color: "#333333",
                            lineHeight: "24px",
                            fontFamily: "Poppins, sans-serif",
                            width: "100%"
                        },
                    }}
                    onBlur={() => {
                        form.validateField(name);
                        setIsFocused(false);
                    }}
                    onFocus={() => {
                        setIsFocused(true);
                    }}
                    onChange={(e) => {
                        let updated = e.target.value;
                        if (name === "fullName") {
                            updated = updated.replace(/[^a-zA-Z\s]/g, "");
                        }
                        form.setFieldValue(name, updated);
                    }}
                /> */}
            </div>

            {/* {error && (
                <div className="text-[#F07575]! text-[12px]">{error}</div>
            )} */}
        </div>
    );
}
// ------------------------------------------------------------------------------------------------------------

type InputPasswordFieldProps<T> = {
  name: keyof T;
  label: string;
  placeholder: string;
  form: {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    validateField: (field: keyof T) => void;
    setFieldValue: (field: keyof T, value: string) => void;
  };
  disabled: boolean;
  required?: boolean;
};

export function InputPasswordField<T>({
  name,
  label,
  placeholder,
  form,
  disabled,
  required,
}: InputPasswordFieldProps<T>) {
  const value = form.values[name] as string;
  const error = form.errors[name];

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const showFloatingLabel =
    value !== undefined && value !== null && value !== "";

  return (
    <div className="relative w-full">
      <div className="relative w-full">
        {/* Floating label */}
        <div
          className={`absolute ${
            showFloatingLabel || isFocused
              ? "-top-2.25 opacity-100"
              : "top-1/2 opacity-0"
          } transition-all duration-300 px-1 left-4 z-30 text-[12px]
          text-black dark:text-white bg-white dark:bg-[#121212] rounded`}
        >
          {label}
        </div>

        {/* Placeholder */}
        {!isFocused && !showFloatingLabel && (
          <div
            className="absolute top-1/2 -translate-y-1/2 px-0.5 left-3 md:left-4 z-30 text-[14px] text-[#666] pointer-events-none"
          >
            {placeholder}
            {required && <span className="text-[#CB3332]">*</span>}
          </div>
        )}

        {/* Input */}
        <input
          type={showPassword ? "text" : "password"}
          name={String(name)}
          value={value}
          disabled={disabled}
          className={`border rounded w-full pr-12 text-[#333333] dark:text-[#cbccd3] focus:outline-none focus:ring-0
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            form.validateField(name);
            setIsFocused(false);
          }}
          style={{
            borderRadius: "6px",
            borderColor: error ? "#F07575" : "#666666",
            padding: "16px",
            paddingTop: "20px",
            paddingBottom: "20px",
            height: "2px",
            fontSize: "16px",
            lineHeight: "24px",
            fontFamily: "sans-serif",
            width: "100%",
          }}
          onChange={(e) => {
            form.setFieldValue(name, e.target.value);
          }}
        />

        {/* Eye toggle */}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#333] dark:hover:text-[#cbccd3]">
          {showPassword ? < EyeOffIcon /> : <EyeIcon/>}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-1 text-[#F07575] text-[12px]">
          {error}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------
// type MobileNumberInputProps<T> = {
//     name: keyof T;
//     placeholder: string;
//     form: {
//         values: T & {phone_dialCode: string};
//         errors: Partial<Record<keyof T, string>>;
//         validateField: (field: keyof T) => void;
//         setFieldValue: (
//             field: keyof T | "phone_dialCode",
//             value: string,
//         ) => void;
//     };
//     fieldGtmTag?: string;
//     disabled: boolean;
//     isVerified: boolean;
// };

// const countries = allCountries;

// type CountryItem = {
//     name: string;
//     flag: string;
//     code: string;
//     dial_code: string;
// };

// function CountryOption({name, flag, code, dial_code}: CountryItem) {
//     return (
//         <div className="grid grid-flow-col gap-1 place-items-center place-content-start h-full w-full">
//             <div>
//                 <img
//                     src={flag}
//                     alt=""
//                     style={{width: 16}}
//                 />
//             </div>
//             <div className="mobile-body-regular text-[#666666]">
//                 {dial_code}
//             </div>
//         </div>
//     );
// }

// export function MobileNumberInput<T>({
//     name,
//     placeholder,
//     form,
//     fieldGtmTag,
//     disabled,
//     isVerified
// }: MobileNumberInputProps<T>) {
//     const value = form.values[name] as string;
//     const error = form.errors[name];
//     const showFloatingLabel =
//         value !== undefined && value !== null && value !== "";

//     const [selectedCode, setSelectedCode] = useState("+254");
//     const [isFocused, setIsFocused] = useState(false);

//     const [search, setSearch] = useState("");

//     const combobox = useCombobox({
//         onDropdownClose: () => combobox.resetSelectedOption(),
//     });

//     const selectedOption = countries.find(
//         (item) => item.dial_code === selectedCode,
//     );

//     // const options = countries.map((item) => (
//     //     <Combobox.Option
//     //         value={item.dial_code}
//     //         key={item.dial_code}
//     //     >
//     //         <CountryOption {...item} />
//     //     </Combobox.Option>
//     // ));

//     const filteredOptions = useMemo(() => {
//         const cleanSearch = search.replace(/\D/g, "");
//         return countries
//             .filter((item) =>
//                 item.dial_code.replace("+", "").includes(cleanSearch),
//             )
//             .map((item, index) => (
//                 // <Combobox.Option
//                 //     key={item.dial_code}
//                 //     value={item.dial_code}
//                 // >
//                 //     <CountryOption {...item} />
//                 // </Combobox.Option>
//                 <button
//                     key={index}
//                     onClick={() => {
//                         combobox.closeDropdown();
//                         form.setFieldValue("phone_dialCode", item.dial_code);
//                         // this we are doing because on changing the code , may be old phone number was there which will invalid for new code
//                         form.setFieldValue(name, "");
//                         combobox.closeDropdown();
//                         setSelectedCode(item.dial_code);
//                         combobox.closeDropdown();
//                     }}
//                     className={`hover:bg-[#D9D9D9] bg-[#F4F4F4] w-full h-full rounded`}
//                 >
//                     <div className="grid grid-flow-col p-1 rounded gap-1 place-items-center place-content-start h-full w-full">
//                         <div>
//                             <img
//                                 src={item.flag}
//                                 alt=""
//                                 style={{width: 16}}
//                                 loading="lazy"
//                             />
//                         </div>
//                         <div className="mobile-body-regular text-[#666666]">
//                             {item.dial_code}
//                         </div>
//                     </div>
//                 </button>
//             ));
//     }, [search, countries]);

//     return (
//         <div className={`relative ${disabled ? "opacity-70 pointer-events-none" : ""}`}>
//             {/* {showFloatingLabel && (
//                 <div className="absolute top-[-9px] px-[2px] left-4 z-30 text-[12px] bg-white text-black">
//                     {placeholder}
//                 </div>
//             )} */}
//             {isVerified && (
//                 <div className="absolute top-1/2 right-3 -translate-y-1/2 z-40 ">
//                     <img src="https://cdn.icmhs.intellsys.tech/icmhs-green-tick.webp" alt="" style={{width: 20}} />
//                 </div>
//             )}

//             <div
//                 className="grid grid-cols-[100px_1px_auto] gap-0 w-full border rounded-lg overflow-hidden z-[999]"
//                 style={{borderColor: error ? "#F07575" : "#666666"}}
//             >
//                 <Combobox
//                     store={combobox}
//                     // withinPortal={false}
//                     onOptionSubmit={(val) => {
//                         setSelectedCode(val);
//                         form.setFieldValue("phone_dialCode", val);
//                         combobox.closeDropdown();
//                     }}
//                 >
//                     <Combobox.Target>
//                         <InputBase
//                             component="button"
//                             type="button"
//                             pointer
//                             rightSection={<PhoneCodeIcon />}
//                             rightSectionProps={{
//                                 style: {
//                                     margin: "0px 0px 0px 0px",
//                                     padding: "0px 0px 0px 0px",
//                                     width: "36px",
//                                     height: "100%",
//                                 },
//                             }}
//                             onClick={() => combobox.toggleDropdown()}
//                             rightSectionPointerEvents="none"
//                             styles={{
//                                 input: {
//                                     border: "none",
//                                     paddingTop: "12px",
//                                     paddingBottom: "12px",
//                                     paddingLeft: "12px",
//                                     paddingRight: "0px",

//                                     // height: "24px",
//                                     fontSize: "16px",
//                                     color: "#333333",
//                                     // lineHeight: "24px",
//                                     // fontFamily: "Poppins, sans-serif",
//                                     // display: "grid",
//                                     // gridTemplateColumns: "auto 1fr",
//                                     // alignItems: "center",
//                                 },
//                             }}
//                         >
//                             {selectedOption ? (
//                                 <>
//                                     <CountryOption {...selectedOption} />
//                                 </>
//                             ) : (
//                                 <Input.Placeholder>Select</Input.Placeholder>
//                             )}
//                         </InputBase>
//                     </Combobox.Target>

//                     <Combobox.Dropdown
//                         className="max-h-[200px] overflow-y-auto scroll-thin-modern w-[300px] !mb-2 !mt-2 z-[999]"
//                         style={{border: " 1px solid #666666", borderRadius: 8}}
//                     >
//                         {" "}
//                         <div className="p-1 mb-1">
//                             <input
//                                 type="text"
//                                 value={search}
//                                 maxLength={4}
//                                 onChange={(e) => {
//                                     const val = e.target.value;
//                                     if (/^\d*$/.test(val)) {
//                                         setSearch(val);
//                                     }
//                                 }}
//                                 placeholder="Search.."
//                                 className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
//                             />
//                         </div>
//                         {filteredOptions.length > 0 ? (
//                             <Combobox.Options className=" grid grid-cols-1 gap-1">
//                                 {filteredOptions}
//                             </Combobox.Options>
//                         ) : (
//                             <div className="mobile-small-text mx-1">
//                                 No result
//                             </div>
//                         )}
//                     </Combobox.Dropdown>
//                 </Combobox>

//                 <div className="grid place-items-center">
//                     <div className="h-[80%] w-[1px] bg-[#666666]"></div>
//                 </div>
//                 {/* Number Input */}
//                 <div className="w-full h-full relative z-20">
//                     <TextInput
//                         // placeholder={placeholder}
//                         name={String(name)}
//                         value={value}
//                         onBlur={() => {
//                             form.validateField(name);
//                             setIsFocused(false);
//                         }}
//                         onFocus={() => {
//                             setIsFocused(true);
//                         }}
//                         onChange={(e) => {
//                             const onlyNumbers = e.target.value
//                                 .replace(/[^0-9]/g, "")
//                                 .slice(
//                                     0,
//                                     [
//                                         "+254",
//                                         "+211",
//                                         "+256",
//                                         "+255",
//                                         "+252",
//                                         "+250",
//                                     ].includes(selectedCode)
//                                         ? 9
//                                         : 12,
//                                 );
//                             form.setFieldValue(name, onlyNumbers);
//                         }}
//                         onClick={() => {
//                             if (fieldGtmTag) {
//                                 sendGtmEvent(fieldGtmTag);
//                                 console.log(fieldGtmTag);
//                             }
//                         }}
//                         className=""
//                         styles={{
//                             input: {
//                                 background: "#ffffff",
//                                 border: "none",
//                                 // paddingLeft: "12px",
//                                 paddingTop: "22px",
//                                 paddingBottom: "22px",
//                                 height: "24px",
//                                 fontSize: "16px",
//                                 color: "#333333",
//                                 lineHeight: "24px",
//                                 fontFamily: "Poppins, sans-serif",
//                                 zIndex: 20,
//                                 maxWidth: 240
//                             },
//                         }}
//                     />

//                     {!isFocused && !showFloatingLabel && (
//                         <div
//                             className={`absolute top-[50%] translate-y-[-50%] px-[2px] left-3 md:left-4 z-30 text-[12px] bg-white text-[#666] pointer-events-none body-regular`}
//                         >
//                             {placeholder}{" "}
//                             <span className="text-[#CB3332]">*</span>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Optional error message */}
//             {/* {error && (
//         <div className="!text-[#F07575] text-[12px] mt-1">{error}</div>
//       )} */}
//         </div>
//     );
// }

// function PhoneCodeIcon() {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="7"
//             height="4"
//             viewBox="0 0 7 4"
//             fill="none"
//         >
//             <path
//                 d="M3.50001 4C3.41864 4 3.33719 3.96742 3.27506 3.90233L0.093247 0.569018C-0.0310823 0.438768 -0.0310823 0.227853 0.093247 0.097687C0.217576 -0.032479 0.418905 -0.0325623 0.543155 0.097687L3.50001 3.19534L6.45687 0.097687C6.5812 -0.0325623 6.78253 -0.0325623 6.90678 0.097687C7.03103 0.227936 7.03111 0.438852 6.90678 0.569018L3.72497 3.90233C3.66284 3.96742 3.58139 4 3.50001 4Z"
//                 fill="#666666"
//             />
//         </svg>
//     );
// }

// -----------------------------------------------------------------------------------------------------------------------------------------------------------

type InputSelectFieldProps<T> = {
    name: keyof T;
    placeholder: string;
    data: {
        value: string;
        label: string;
        disabled?: boolean;
    }[];
    form: {
        values: T;
        errors: Partial<Record<keyof T, string>>;
        validateField: (field: keyof T) => void;
        setFieldValue: (field: keyof T, value: string) => void;
    };
    isDisabled?: boolean;
    fieldGtmTag?: string;
};

export function InputSelectField<T>({
    name,
    placeholder,
    data,
    form,
    isDisabled,
    fieldGtmTag,
}: InputSelectFieldProps<T>) {
    const value = form.values[name] as string;
    const error = form.errors[name];
    const showFloatingLabel =
        value !== undefined && value !== null && value !== "";

    return (
        <div className="relative">
            {showFloatingLabel && (
                <div className="absolute top-[-9px] px-[2px] left-4 z-30 text-[12px] bg-white text-black">
                    {placeholder}
                </div>
            )}

            <Select
                data={data}
                placeholder={placeholder}
                disabled={isDisabled === true}
                value={value}
                searchable
                maxDropdownHeight={200}
                checkIconPosition="right"
                rightSection={
                    <>
                        <img
                            src="https://cdn.icmhs.intellsys.tech/select-drop-down-icon.svg"
                            alt=""
                        />
                    </>
                }
                styles={{
                    input: {
                        background: "#ffffff",
                        borderRadius: "8px",
                        borderColor: error ? "#F07575" : "#666666",
                        padding: "16px",
                        paddingRight: "24px",
                        paddingTop: "22px",
                        paddingBottom: "22px",
                        height: "24px",
                        fontSize: "16px",
                        color: "#333333",
                        lineHeight: "24px",
                        fontFamily: "Lato",
                    },
                }}
                onChange={(selectedValue) => {
                    if (selectedValue) {
                        form.setFieldValue(name, selectedValue);
                    }
                }}
                onBlur={() => form.validateField(name)}
                error={error}
            />
        </div>
    );
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------
type InputRadioFieldProps<T> = {
    name: keyof T;
    label: string;
    options: { label: string; gtmId?: string }[];
    required?: boolean;
    form: {
        values: T;
        errors: Partial<Record<keyof T, string>>;
        setFieldValue: (field: keyof T, value: string) => void;
        validateField: (field: keyof T) => void;
    };
    // required?: boolean;
};

export function InputRadioField<T>({
    name,
    label,
    options,
    form,
    required,
}: InputRadioFieldProps<T>) {
    const value = form.values[name] as string;
    const error = form.errors[name];

    return (
        <div className="w-full">
            <label
                className={`body-regular ${error ? "text-red-600" : "text-[#333333]"
                    }`}
            >
                {label}
                {required && <span className="text-red-600 ml-1">*</span>}
            </label>

            <div
                className="flex gap-3 md:gap-4 flex-wrap"
                onBlur={() => form.validateField(name)}
            >
                {options.map((opt) => {
                    const isSelected = value === opt.label;

                    return (
                        <div
                            key={opt.label}
                            className="grid grid-flow-col place-items-center place-content-start gap-1 cursor-pointer"
                            onClick={() => {
                                form.setFieldValue(name, opt.label);

                            }}
                        >
                            <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected
                                    ? "border-[#666666]"
                                    : "border-gray-400"
                                    }`}
                            >
                                {isSelected && (
                                    <div className="w-2 h-2 bg-gray-800 rounded-full" />
                                )}
                            </div>
                            <span className={`body-regular text-[#666666]`}>
                                {opt.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* {error && <div className="text-xs text-red-500 mt-1">{error}</div>} */}
        </div>
    );
}
// -----------------------------------------------------------------------------------------------------------------------------------------------------------

type DateProps = {
    label?: string;
    required?: boolean;
    value: {
        day: string;
        month: string;
        year: string;
    };
    onChange: (value: { day: string; month: string; year: string }) => void;
    error?: boolean;
    gtmFormId?: string;
};

const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
const months = [
    { label: "Jan", value: "01" },
    { label: "Feb", value: "02" },
    { label: "Mar", value: "03" },
    { label: "Apr", value: "04" },
    { label: "May", value: "05" },
    { label: "Jun", value: "06" },
    { label: "Jul", value: "07" },
    { label: "Aug", value: "08" },
    { label: "Sep", value: "09" },
    { label: "Oct", value: "10" },
    { label: "Nov", value: "11" },
    { label: "Dec", value: "12" },
];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

const eligibleYears = years
    .filter((year) => {
        const age = currentYear - year;
        return age >= 17 && age <= 35;
    })
    .map(String);

export default function DateOfBirthField({
    label = "Date of birth",
    required,
    value,
    onChange,
    error,
    gtmFormId,
}: DateProps) {
    const handleChange = (key: "day" | "month" | "year", val: string) => {
        onChange({ ...value, [key]: val });
    };

    return (
        <div className="w-full">
            <label
                className={`body-regular ${error === true ? "!text-red-600" : ""
                    }`}
            >
                {label}
                {required && <span className="text-red-600 ml-1">*</span>}
            </label>


            <div className="flex gap-4">
                {/* Day */}
                <Select
                    placeholder="DD"
                    checkIconPosition="right"
                    rightSection={
                        <>
                            <img
                                src="https://cdn.icmhs.intellsys.tech/select-drop-down-icon.svg"
                                alt=""
                                style={{ width: "12px" }}
                            />
                        </>
                    }
                    data={days.map((d) => ({ value: d, label: d }))}
                    value={value.day}
                    onChange={(val) => {
                        if (val !== null) {
                            handleChange("day", val);
                        }
                    }}

                    styles={{
                        input: {
                            background: "#ffffff",
                            borderRadius: "8px",
                            borderColor: "#666666",
                            // padding: "16px",
                            // paddingRight: "24px",
                            // paddingTop: "22px",
                            // paddingBottom: "22px",
                            // height: "24px",
                            // fontSize:"16px",
                            color: "#333333",
                            // lineHeight: "24px",
                            fontFamily: "Lato",
                        },
                    }}
                    allowDeselect={false}
                />

                {/* Month */}
                <Select
                    placeholder="MM"
                    checkIconPosition="right"
                    rightSection={
                        <>
                            <img
                                src="https://cdn.icmhs.intellsys.tech/select-drop-down-icon.svg"
                                alt=""
                                style={{ width: "12px" }}
                            />
                        </>
                    }
                    data={months.map((m) => ({ value: m.value, label: m.label }))}
                    value={value.month}
                    onChange={(val) => {
                        if (val !== null) {
                            handleChange("month", val);
                        }
                    }}

                    classNames={{ input: "w-24" }}
                    allowDeselect={false}
                    styles={{
                        input: {
                            background: "#ffffff",
                            borderRadius: "8px",
                            borderColor: "#666666",
                            // padding: "16px",
                            // paddingRight: "24px",
                            // paddingTop: "22px",
                            // paddingBottom: "22px",
                            // height: "24px",
                            // fontSize:"16px",
                            color: "#333333",
                            // lineHeight: "24px",
                            fontFamily: "Lato",
                        },
                    }}
                />

                {/* Year */}
                <Select
                    placeholder="YYYY"
                    checkIconPosition="right"
                    rightSection={
                        <>
                            <img
                                src="https://cdn.icmhs.intellsys.tech/select-drop-down-icon.svg"
                                alt=""
                                style={{ width: "12px" }}
                            />
                        </>
                    }
                    data={eligibleYears.map((y) => ({ value: y, label: y }))}
                    value={value.year}
                    onChange={(val) => {
                        if (val !== null) {
                            handleChange("year", val);
                        }
                    }}

                    classNames={{ input: "w-28" }}
                    allowDeselect={false}
                    styles={{
                        input: {
                            background: "#ffffff",
                            borderRadius: "8px",
                            borderColor: "#666666",
                            // padding: "16px",
                            // paddingRight: "24px",
                            // paddingTop: "22px",
                            // paddingBottom: "22px",
                            // height: "24px",
                            // fontSize:"14px" : "16px",
                            color: "#333333",
                            // lineHeight: "24px",
                            fontFamily: "Lato",
                        },
                    }}
                />
            </div>
        </div>
    );
}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------

type InputOtpFieldProps = {
    otp: string;
    setOtp: React.Dispatch<React.SetStateAction<string>>
    otpId: string;
    resendOtp: () => void;
    errorInOtp: boolean;
};

export function InputOtpField({
    otp,
    setOtp,
    otpId,
    resendOtp,
    errorInOtp
}: InputOtpFieldProps) {

    const showFloatingLabel =
        otp !== undefined && otp !== null && otp !== "";

    const [isFocused, setIsFocused] = useState(false);
    const showResendOtp = true;

    const [resendTime, setResendTime] = useState(30);

    useEffect(() => {
        const interval = setInterval(() => {
            setResendTime((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [otpId]);

    const handleResend = () => {
        setOtp("");
        setResendTime(30);
        resendOtp();
    };

    return (
        <div className="relative w-full">
            <div className="relative w-full">
                {(
                    <div className={`absolute transiton-all duration-200 ${(showFloatingLabel || isFocused) ? "top-0 opacity-100" : "top-2 opacity-0"} -translate-y-1/2 px-[2px] left-4 z-30 text-[12px] bg-white text-black mobile-small-text`}>
                        OTP
                    </div>
                )}

                {!isFocused && !showFloatingLabel && (
                    <div
                        className={`absolute top-[50%] translate-y-[-50%] px-[2px] left-3 md:left-4 z-30 text-[12px] bg-white text-[#666] pointer-events-none body-regular`}
                    >
                        Enter OTP
                        {(
                            <span className="text-[#CB3332]"> *</span>
                        )}
                    </div>
                )}


                {showResendOtp && (
                    <div
                        className={`absolute top-1/2 -translate-y-1/2 right-4 z-30 text-[12px] bg-white text-[#666] small-text !font-medium`}
                    >
                        {resendTime > 0 ? (
                            <div className="font-semibold!">Resend OTP in {resendTime}s</div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                className="font-semibold! text-[#B70229]"
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>
                )}
                <div className={`${errorInOtp ? "shake-animation" : ""}`} style={{ borderColor: errorInOtp ? "#F07575" : "#666666" }}>
                    <TextInput
                        name={String(otp)}
                        value={otp}
                        styles={{
                            input: {
                                background: "#ffffff",
                                borderRadius: "8px",
                                borderColor: errorInOtp ? "#F07575" : "#666666",
                                padding: "16px",
                                paddingTop: "22px",
                                paddingBottom: "22px",
                                height: "24px",
                                fontSize: "16px",
                                color: errorInOtp ? "#CB3332" : "#333333",
                                lineHeight: "24px",
                                fontFamily: "Poppins, sans-serif",
                            },
                        }}
                        onBlur={() => {
                            // form.validateField(name);
                            setIsFocused(false);
                        }}
                        onFocus={() => {
                            setIsFocused(true);
                        }}

                        onChange={(e) => {
                            let updated = e.target.value;
                            updated = updated.replace(/\D/g, "");
                            updated = updated.slice(0, 4);
                            setOtp(updated);
                        }}
                        onPaste={(e) => {
                            const pasted = e.clipboardData.getData("text");
                            if (!/^\d{1,4}$/.test(pasted)) {
                                e.preventDefault();
                            }
                        }}
                    /></div>
            </div>

            {/* {error && (
                <div className="!text-[#F07575] text-[12px]">{error}</div>
            )} */}
        </div>
    );
}