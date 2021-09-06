import React from "react";
import { Controller } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import { FormInputProps } from "./FormInputProps";

export const FormInputText = ({ name, control, ...props }: FormInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error }
      }) => (
        <TextField
          helperText={error ? error.message : null}
          error={!!error}
          onChange={onChange}
          value={value}
          fullWidth
          {...props}
        />
      )}
    />
  );
};
