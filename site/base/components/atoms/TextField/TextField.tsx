import React, { forwardRef, useLayoutEffect, useRef, useState } from 'react';

interface Props {
  name?: string;
  type?: string;
  label: string;
  value?: string;
  placeholder?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyPress?: React.KeyboardEventHandler<HTMLInputElement>;
}

function TextField(
  {
    label,
    value,
    helperText,
    error,
    startAdornment,
    endAdornment,
    onChange,
    ...props
  }: Props,
  ref: any
) {
  const spanStartAdornmentRef = useRef<HTMLSpanElement>(null);
  const spanEndAdornmentRef = useRef<HTMLSpanElement>(null);
  const [valueState, setValueState] = useState(value ?? '');
  const [paddingState, setPaddingState] = useState({
    paddingLeft: '1rem',
    paddingRight: '1rem',
  });

  let contentBounds: DOMRect | undefined;
  useLayoutEffect(() => {
    let paddingLeft, paddingRight;
    if (spanStartAdornmentRef.current) {
      contentBounds = spanStartAdornmentRef.current.getBoundingClientRect();
      paddingLeft = contentBounds.width + 'px';
    }
    if (spanEndAdornmentRef.current) {
      contentBounds = spanEndAdornmentRef.current.getBoundingClientRect();
      paddingRight = contentBounds.width + 'px';
    }

    setPaddingState({
      paddingLeft: paddingLeft ?? '1rem',
      paddingRight: paddingRight ?? '1rem',
    });

    return () => {
      setPaddingState({
        paddingLeft: '1rem',
        paddingRight: '1rem',
      });
    };
  }, [startAdornment, endAdornment]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueState(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative w-full min-w-[200px] h-14">
        <input
          ref={ref}
          autoComplete="do-not-autofill"
          value={valueState}
          className={`peer is-text-field w-full h-full py-[15px] bg-transparent text-base text-gray-900 dark:text-light disabled:text-gray-100 dark:disabled:text-midnight-600 font-normal rounded-[7px] outline-0 focus:outlined-0 border-[1.5px] border-t-transparent dark:border-t-transparent disabled:border-t-transparent dark:disabled:border-t-transparent ${
            error
              ? 'border-red-500 placeholder-shown:border-t-transparent placeholder-shown:border-red-500 hover:border-t-transparent hover:border-red-500 focus:border-t-transparent focus:border-red-500'
              : 'border-gray-900 dark:border-light disabled:border-gray-100 dark:disabled:border-midnight-600 placeholder-shown:border-t-transparent disabled:placeholder-shown:border-t-transparent dark:placeholder-shown:border-t-transparent dark:disabled:placeholder-shown:border-t-transparent placeholder-shown:border-gray-400 disabled:placeholder-shown:border-gray-100 dark:placeholder-shown:border-midnight-300 dark:disabled:placeholder-shown:border-midnight-600 hover:border-t-transparent dark:hover:border-t-transparent hover:border-gray-900 dark:hover:border-light focus:border-t-transparent dark:focus:border-t-transparent focus:border-gray-900 dark:focus:border-light disabled:cursor-not-allowed'
          } placeholder:text-gray-400 disabled:placeholder:text-gray-100 dark:placeholder:text-midnight-300 dark:disabled:placeholder:text-midnight-600`}
          style={{
            paddingLeft: startAdornment ? paddingState.paddingLeft : '1rem',
            paddingRight: endAdornment ? paddingState.paddingRight : '1rem',
          }}
          onChange={handleChange}
          {...props}
        />
        <label
          className={`absolute flex -top-1.5 left-0 w-full h-full select-none pointer-events-none text-xs font-normal ${
            error
              ? 'text-red-500 peer-placeholder-shown:text-red-500 peer-focus:text-red-500'
              : 'text-gray-900 dark:text-light peer-placeholder-shown:text-gray-400  peer-disabled:text-gray-100  dark:peer-placeholder-shown:text-midnight-300 dark:peer-disabled:text-midnight-600 peer-focus:text-gray-900 dark:peer-focus:text-light'
          } before:block before:content[' '] before:border-t-[1.5px] before:border-l-[1.5px] ${
            error
              ? 'before:border-red-500 peer-placeholder-shown:before:border-red-500 peer-hover:before:border-red-500 peer-focus:before:border-red-500'
              : 'before:border-gray-900 dark:before:border-light peer-placeholder-shown:before:border-gray-400 peer-disabled:before:border-gray-100 dark:peer-placeholder-shown:before:border-midnight-300 dark:peer-disabled:before:border-midnight-600 peer-hover:before:border-gray-900 dark:peer-hover:before:border-light peer-focus:before:border-gray-900 dark:peer-focus:before:border-light'
          } before:rounded-tl-md before:pointer-events-none before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 after:block after:content[' '] after:border-t-[1.5px] after:border-r-[1.5px] ${
            error
              ? 'after:border-red-500 peer-placeholder-shown:after:border-red-500 peer-hover:after:border-red-500 peer-focus:after:border-red-500'
              : 'after:border-gray-900 dark:after:border-light peer-placeholder-shown:after:border-gray-400 peer-disabled:after:border-gray-100 dark:peer-placeholder-shown:after:border-midnight-300 dark:peer-disabled:after:border-midnight-600 peer-hover:after:border-gray-900 dark:peer-hover:after:border-light peer-focus:after:border-gray-900 dark:peer-focus:after:border-light'
          } after:rounded-tr-md after:pointer-events-none after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1`}
        >
          {label}
        </label>
        {startAdornment && (
          <span
            ref={spanStartAdornmentRef}
            className="absolute top-0 left-0 pl-4 py-4 pr-4 text-base text-gray-400 dark:text-midnight-300 peer-[.is-text-field]:peer-focus:text-gray-900 dark:peer-[.is-text-field]:peer-focus:text-white"
          >
            {startAdornment}
          </span>
        )}
        {endAdornment && (
          <span
            ref={spanEndAdornmentRef}
            className="absolute top-0 right-0 pr-4 py-4 text-base text-gray-400 dark:text-midnight-300 peer-[.is-text-field]:peer-focus:text-gray-900 dark:peer-[.is-text-field]:peer-focus:text-white"
          >
            {endAdornment}
          </span>
        )}
      </div>
      {helperText && (
        <p
          className={`mx-4 mt-1 text-xs ${
            error
              ? 'text-red-500'
              : `text-gray-${props.disabled ? 100 : 400} dark:text-midnight-${
                  props.disabled ? 600 : 300
                }`
          }`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

export default forwardRef(TextField);
