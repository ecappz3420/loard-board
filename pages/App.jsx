"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
const Select = dynamic(() => import("react-select"), { ssr: false });
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import CustomInput from "./CustomInput";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import CurrencyField from "./CurrencyField";

// Validations
const formSchema = z.object({
  Service_Locations: z.object({
    label: z.string().nonempty({ message: "Required to fill the value" }),
    value: z.string().nonempty({ message: "Required to fill the value" }),
  }),
  Rate_Confirmation: z
    .string()
    .nonempty({ message: "Required to fill the value" }),
  Trucks: z.coerce.number().optional(),
  Customer: z.object({
    label: z.string().nonempty({ message: "Required to fill the value" }),
    value: z.string().nonempty({ message: "Required to fill the value" }),
  }),
  Maximum_Load: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional(),
  Completion: z.coerce.date().optional(),
  Commodity: z.object({
    label: z.string().nonempty({ message: "Required to fill the value" }),
    value: z.string().nonempty({ message: "Required to fill the value" }),
  }),
  Loader: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .optional(),
  Capacity: z.coerce.number().optional(),
  Origin: z.object({
    label: z.string().nonempty({ message: "Required to fill the value" }),
    value: z.string().nonempty({ message: "Required to fill the value" }),
  }),
  Vendor_Bill: z.object({
    currency: z.string().nonempty({ message: "Required" }),
    amount: z.coerce.number().min(0, { message: "Amount must be positive" }),
  }),
  Vendor_Bill_Converted: z.object({
    currency: z.string().nonempty({ message: "Required" }),
    amount: z.coerce.number().min(0, { message: "Amount must be positive" }),
  }),
  Maximum_Fuel: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .optional(),
  Destinations: z
    .object({
      label: z.string().nonempty({ message: "Required" }),
      value: z.string().nonempty({ message: "Required" }),
    })
    .optional(),
  Select_Book: z.object({
    label: z.string(),
    value: z.string(),
  }),
  Miximum_Disputch: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .optional(),
  Rate_Per_MT: z.object({
    currency: z.string().nonempty({ message: "Required" }),
    amount: z.coerce.number().min(0, { message: "Amount must be positive" }),
  }),
  Rate_Per_MT_Converted: z.object({
    currency: z.string().nonempty({ message: "Required" }),
    amount: z.coerce.number().min(0, { message: "Amount must be positive" }),
  }),
  Commencement: z.coerce.date(),
});

// Default Values
const App = () => {
  const [options, setOptions] = useState({
    Service_Locations: [],
    Customers: [],
    Loaders: [],
    Origins: [],
    Destinations: [],
    Select_Book: [],
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    shouldFocusError: false,
    defaultValues: {
      Service_Locations: { label: "", value: "" },
      Rate_Confirmation: "",
      Customer: { label: "", value: "" },
      Commodity: { label: "", value: "" },
      Loader: [],
      Origin: { label: "", value: "" },
      Vendor_Bill: { currency: "USD", amount: "" },
      Vendor_Bill_Converted: { currency: "USD", amount: "" },
      Select_Book: { label: "", value: "" },
      Rate_Per_MT: { currency: "USD", amount: "" },
      Rate_Per_MT_Converted: { currency: "USD", amount: "" },
      Commencement: undefined,
      Destinations: { label: "", value: "" },
      Maximum_Load: [],
      Completion: undefined,
      Miximum_Disputch: { label: "", value: "" },
      Maximum_Fuel: 0,
      Capacity: 0,
      Trucks: 0,
    },
  });

  const handleFetch = async (reportName, criteira) => {
    const query = new URLSearchParams({
      reportName,
      criteira: criteira || "(ID != 0)",
    });
    try {
      const response = await fetch(`/api/zoho?${query}`, { method: "GET" });
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const init = async () => {
      const serviceLocationRecords = await handleFetch(
        "Service_Locations",
        "(ID != 0)"
      );
      const serviceLocResponse = serviceLocationRecords.records.data;
      setOptions((prev) => ({
        ...prev,
        Service_Locations: serviceLocResponse.map((data) => ({
          label: data.Tracking_Route,
          value: data.ID,
        })),
      }));
    };
    init();
  }, []);

  const dummyOptions = [
    { label: "Choice 1", value: "12345" },
    { label: "Choice 2", value: "2343245" },
    { label: "Choice 3", value: "342454" },
  ];

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
  };

  const onError = (error) => {
    console.log("Error: ", error);
  };
  return (
    <div className="p-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-16 gap-y-4">
            <FormField
              control={form.control}
              name="Service_Locations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Location</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      options={options.Service_Locations}
                      isSearchable
                      isClearable
                      onChange={(value) => field.onChange(value)}
                      onBlur={field.onBlur}
                      className="w-[300px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <CustomInput
              name="Rate_Confirmation"
              control={form.control}
              label="Rate Confirmation"
            />
            <CustomInput
              name="Trucks"
              control={form.control}
              label="Trucks"
              type="number"
            />
            <FormField
              control={form.control}
              name="Customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <FormControl>
                    <Select
                      options={dummyOptions}
                      {...field}
                      isClearable
                      isSearchable
                      onChange={(value) => field.onChange(value)}
                      className="w-[300px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="Completion"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Completion</FormLabel>
                  <FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        format="DD-MMM-YYYY"
                        className="w-[300px]"
                        onChange={(date) => field.onChange(date)}
                        value={field.value || null}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="Maximum_Load"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Load</FormLabel>
                  <FormControl>
                    <Select
                      options={dummyOptions}
                      isClearable
                      isMulti
                      onChange={(value) => field.onChange(value)}
                      {...field}
                      className="w-[300px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Commodity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commodity</FormLabel>
                  <FormControl>
                    <Select
                      options={dummyOptions}
                      isClearable
                      onChange={(value) => field.onChange(value)}
                      {...field}
                      className="w-[300px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Loader"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loader</FormLabel>
                  <FormControl>
                    <Select
                      options={dummyOptions}
                      isClearable
                      isMulti
                      onChange={(value) => field.onChange(value)}
                      {...field}
                      className="w-[300px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <CustomInput
              name="Capacity"
              control={form.control}
              label="Capacity"
              type="number"
            />
            <FormField
              control={form.control}
              name="Origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origin</FormLabel>
                  <FormControl>
                    <Select
                      options={dummyOptions}
                      isClearable
                      onChange={(value) => field.onChange(value)}
                      {...field}
                      className="w-[300px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <CurrencyField
              name="Vendor_Bill"
              control={form.control}
              label="Vendor Bill"
            />
            <CurrencyField
              name="Vendor_Bill_Converted"
              control={form.control}
              label="Vendor Bill Converted"
            />
            <FormField
              control={form.control}
              name="Maximum_Fuel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Fuel</FormLabel>
                  <FormControl>
                    <Select
                      options={dummyOptions}
                      isClearable
                      onChange={(value) => field.onChange(value)}
                      {...field}
                      className="w-[300px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Destinations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Select
                      options={dummyOptions}
                      isClearable
                      onChange={(value) => field.onChange(value)}
                      {...field}
                      className="w-[300px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Select_Book"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Book</FormLabel>
                  <FormControl>
                    <Select
                      options={dummyOptions}
                      isClearable
                      onChange={(value) => field.onChange(value)}
                      {...field}
                      className="w-[300px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Miximum_Disputch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Dispatch</FormLabel>
                  <FormControl>
                    <Select
                      options={dummyOptions}
                      isClearable
                      onChange={(value) => field.onChange(value)}
                      {...field}
                      className="w-[300px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <CurrencyField
              name="Rate_Per_MT"
              control={form.control}
              label="Rate Per MT"
            />
            <CurrencyField
              name="Rate_Per_MT_Converted"
              control={form.control}
              label="Rate Per MT Converted"
            />

            <FormField
              control={form.control}
              name="Commencement"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Commencement</FormLabel>
                  <FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        format="DD-MMM-YYYY"
                        className="w-[300px]"
                        onChange={(date) => field.onChange(date)}
                        value={field.value || null}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-center gap-5 p-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default App;
