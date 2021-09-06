import React from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
} from "@material-ui/core";
import { Controller } from "react-hook-form";
import { FormInputProps } from "./FormInputProps";

export const FormInputCheckbox: React.FC<FormInputProps> = ({
  name,
  control,
  label,
  ...props
}) => {

  return (
    <FormControl size={"small"} variant={"outlined"}>

      <div>
        <FormControlLabel
            control={
            <Controller
                name={name}
                render={({
                field: { onChange, value }
                }) => {
                return (
                    <Checkbox
                    checked={value}
                    onChange={onChange}
                    {...props}
                    />
                );
                }}
                control={control}
            />
            }
            label={label}
        />
      </div>
    </FormControl>
  );
};