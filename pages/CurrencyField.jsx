import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import currencies from "./currencies";

const CurrencyField = ({ name, label, control, onChange, handleBaseCurrencyChange }) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex items-center border rounded space-x-2 w-[300px]">
              <select
                value={field.value?.currency || "USD"}
                onChange={(e) => {
                  const newValue = { ...field.value, currency: e.target.value };
                  handleBaseCurrencyChange(e.target.value);
                  field.onChange(newValue);
                  if (onChange) onChange(newValue);
                }}
                className="p-2 rounded outline-none"
              >
                {currencies.map((curr, i) => (
                  <option value={curr.code} key={i}>
                    {curr.code}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                value={field.value?.amount || ""}
                onChange={(e) => {
                  const newValue = {
                    ...field.value,
                    amount: e.target.value ? parseFloat(e.target.value) : "",
                  };
                  field.onChange(newValue);
                  if (onChange) onChange(newValue); // Call external onChange if provided
                }}
                className="w-full border-0 outline-none p-2 rounded"
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CurrencyField;
