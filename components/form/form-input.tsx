"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import { Control, FieldPath, FieldValues } from "react-hook-form";


import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";


type TFormInput<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TFieldName;
  control: Control<TFieldValues>;
  formLabelProps: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    title: string;
  };
  description?: string;
  required?: boolean;
  suffix?: React.ReactNode;
  onChangeCallBack?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & Omit<InputProps, "onChange" | "value">;

export const FormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  children,
  formLabelProps,
  description,
  required,
  name,
  control,
  suffix,
  onChangeCallBack,
  ...props
}: TFormInput<TFieldValues, TFieldName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value, ...fieldProps }, fieldState }) => (
        <FormItem>
          <FormLabel {...formLabelProps}>
            {formLabelProps.title}
            {required && <span className=" text-red-500">*</span>}
          </FormLabel>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
          <FormControl>
            <div className="group relative">
              <Input
                {...fieldProps}
                {...props}
                value={value ?? ""}
                error={fieldState.error}
                onChange={(e) => {
                  if (typeof onChangeCallBack !== "function") {
                    onChange(e);
                    return;
                  }

                  const formatValue = onChangeCallBack?.(e);
                  onChange(formatValue);
                }}
              />
              <div className="absolute right-5 top-[50%] -translate-y-[50%]">
                {suffix}
              </div>
            </div>
          </FormControl>
          {children}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
