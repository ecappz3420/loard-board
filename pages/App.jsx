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
import dropdown from "../utils/dropdown";
import submitHandler from "../utils/submissionHandler";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import currencies from "../utils/currencies";
import Load from "./Load";

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
    .array(z.object({ label: z.string(), value: z.string() }))
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
    .array(z.object({ label: z.string(), value: z.string() }))
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

const App = () => {
  const [options, setOptions] = useState({
    Service_Locations: [],
    Customers: [],
    Loaders: [],
    Origins: [],
    Destinations: [],
    Select_Book: [],
  });
  const [open, setOpen] = useState(false);

  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [convertedCurrency, setConvertedCurrency] = useState("ZMW");
  const [conversionRate, setConversionRate] = useState(0);
  const [vendorBill, setVendorBill] = useState(0);
  const [vendorBillConverted, setVendorBillConverted] = useState(0);
  const [ratePerMt, setRatePerMt] = useState(0);
  const [ratePerMtConverted, setRatePerMtConverted] = useState(0);
  const [currencyModify, setCurrencyModify] = useState(0);
  const [loading, setLoading] = useState(true);

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
      Vendor_Bill_Converted: { currency: "ZMW", amount: "" },
      Select_Book: { label: "", value: "" },
      Rate_Per_MT: { currency: "USD", amount: "" },
      Rate_Per_MT_Converted: { currency: "ZMW", amount: "" },
      Commencement: undefined,
      Destinations: { label: "", value: "" },
      Maximum_Load: [],
      Completion: undefined,
      Miximum_Disputch: [],
      Maximum_Fuel: [],
      Trucks: 0,
      Capacity: 0,
    },
  });

  // Handle currency conversion
  const fetchCurrency = async (base, currnc) => {
    try {
      const query = new URLSearchParams({ currency: base });
      const response = await fetch(`/api/currency-exchange?${query}`, {
        method: "GET",
      });
      const result = await response.json();
      return result.data.conversion_rates[currnc];
    } catch (error) {}
  };

  const handleBaseCurrencyChange = async (baseCurr) => {
    setBaseCurrency(baseCurr);
    const conversion_rate = await fetchCurrency(baseCurr, convertedCurrency);
    setConversionRate(conversion_rate);
    setCurrencyModify(conversion_rate);
    setVendorBillConverted(
      () => parseFloat(conversion_rate) * parseFloat(vendorBill)
    );
    setRatePerMtConverted(
      () => parseFloat(conversion_rate) * parseFloat(ratePerMt)
    );
  };
  const handleCurrencyChange = async (currnc) => {
    setConvertedCurrency(currnc);
    const conversion_rate = await fetchCurrency(baseCurrency, currnc);
    setConversionRate(conversion_rate);
    setCurrencyModify(conversion_rate);
    setVendorBillConverted(
      () => parseFloat(conversion_rate) * parseFloat(vendorBill)
    );
    setRatePerMtConverted(
      () => parseFloat(conversion_rate) * parseFloat(ratePerMt)
    );
  };

  const handleConversionRate = () => {
    setConversionRate(currencyModify);
    const vendor_bill = vendorBill * currencyModify;
    const rate_per_mt = ratePerMt * currencyModify;
    setVendorBillConverted(vendor_bill.toFixed(2));
    setRatePerMtConverted(rate_per_mt.toFixed(2));
  };

  const handleVendorBillChange = (bill) => {
    setVendorBill(bill.amount);
    const convertedValue = bill.amount * conversionRate;
    setVendorBillConverted(parseFloat(convertedValue.toFixed(2)));
  };

  const handleRatePerMtChange = (bill) => {
    setRatePerMt(bill.amount);
    const convertedValue = bill.amount * conversionRate;
    setRatePerMtConverted(parseFloat(convertedValue.toFixed(2)));
  };

  // Handle data fetching
  const handleFetch = async (reportName, criteira) => {
    const query = new URLSearchParams({
      reportName,
      criteira: criteira || "(ID != 0)",
    });
    try {
      const response = await fetch(`/api/zoho?${query}`, { method: "GET" });
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      const currencyResponse = await fetchCurrency(
        baseCurrency,
        convertedCurrency
      );
      setConversionRate(currencyResponse);
      setCurrencyModify(currencyResponse);

      const serviceLocationRecords = await handleFetch(
        "Service_Locations",
        "(ID != 0)"
      );
      const customeRecords = await handleFetch("All_Customers", "(ID != 0)");
      const loaderRecords = await handleFetch(
        "All_Vendor_Statuses",
        "(ID != 0)"
      );
      const originRecords = await handleFetch("All_Sites", "(ID != 0)");
      const bookRecords = await handleFetch("All_Books", "(ID != 0)");

      setOptions((prev) => ({
        ...prev,
        Service_Locations: serviceLocationRecords.records.data.map((data) => ({
          label: data.Tracking_Route,
          value: data.ID,
        })),
        Customers: customeRecords.records.data.map((data) => ({
          label: data.Customer_Name,
          value: data.ID,
        })),
        Loaders: loaderRecords.records.data.map((data) => ({
          label: data.Vendor_Status,
          value: data.ID,
        })),
        Origins: originRecords.records.data.map((data) => ({
          label: data.Loading_Site,
          value: data.ID,
        })),
        Select_Book: bookRecords.records.data.map((data) => ({
          label: data.Organization_Name,
          value: data.ID,
        })),
      }));
      setLoading(false);
    };
    init();
  }, []);

  const dummyOptions = [
    { label: "Choice 1", value: "Choice 1" },
    { label: "Choice 2", value: "Choice 2" },
    { label: "Choice 3", value: "Choice 3" },
  ];

  const onSubmit = async (data) => {
    const handledData = await submitHandler(data);
    const formData = {
      ...handledData,
      Vendor_Bill_Converted:
        currencies.find((i) => i.code === convertedCurrency).symbol +
        " " +
        vendorBillConverted,
      Rate_Per_MT_Converted:
        currencies.find((i) => i.code === convertedCurrency).symbol +
        " " +
        ratePerMtConverted,
    };
    try {
      const response = await fetch(`/api/zoho`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formName: "Load_Board",
          formData: formData,
        }),
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const onError = (error) => {
    console.log("Error: ", error);
  };
  if (!loading) {
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
                        options={options.Customers}
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
                          className="w-[300px] h-[30px]"
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
                        options={dropdown.maximum_load}
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
                        options={dropdown.commodity}
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
                        options={options.Loaders}
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
                        options={options.Origins}
                        isClearable
                        onChange={(value) => field.onChange(value)}
                        {...field}
                        className="w-[300px]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div>
                <CurrencyField
                  name="Vendor_Bill"
                  control={form.control}
                  label="Vendor Bill"
                  onChange={(value) => handleVendorBillChange(value)}
                  handleBaseCurrencyChange={handleBaseCurrencyChange}
                />
                {baseCurrency !== convertedCurrency && (
                  <div className="p-1 text-xs flex items-center text-blue-500 justify-start gap-[10px]">
                    <div>{`1 ${baseCurrency} = ${conversionRate} ${convertedCurrency}`}</div>
                    <small
                      className="cursor-pointer"
                      onClick={() => setOpen(true)}
                    >
                      Edit
                    </small>
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modify Currency</DialogTitle>
                        </DialogHeader>
                        <div>
                          <Input
                            value={currencyModify}
                            onChange={(e) => setCurrencyModify(e.target.value)}
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            type="submit"
                            onClick={() => {
                              handleConversionRate();
                              setOpen(false);
                            }}
                          >
                            Save
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
              <FormField
                control={form.control}
                name="Vendor_Bill_Converted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor Bill Converted</FormLabel>
                    <div className="flex h-11 items-center border rounded space-x-2 w-[300px]">
                      <select
                        value={convertedCurrency || "USD"}
                        onChange={(e) => {
                          const newValue = {
                            ...field.value,
                            currency: e.target.value,
                          };
                          field.onChange(newValue);
                          handleCurrencyChange(e.target.value);
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
                        value={vendorBillConverted || vendorBill}
                        className="w-full border-0 outline-none p-2 rounded"
                        readOnly
                      />
                    </div>
                  </FormItem>
                )}
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
                name="Destinations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Select
                        options={options.Origins}
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
                        options={options.Select_Book}
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
                        isMulti
                        onChange={(value) => field.onChange(value)}
                        {...field}
                        className="w-[300px]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div>
                <CurrencyField
                  name="Rate_Per_MT"
                  control={form.control}
                  label="Rate Per MT"
                  onChange={(value) => handleRatePerMtChange(value)}
                  handleBaseCurrencyChange={handleBaseCurrencyChange}
                />
                {baseCurrency != convertedCurrency && (
                  <div className="p-1 text-xs flex items-center text-blue-500 justify-start gap-[10px]">
                    <div>{`1 ${baseCurrency} = ${conversionRate} ${convertedCurrency}`}</div>
                    <small
                      className="cursor-pointer"
                      onClick={() => setOpen(true)}
                    >
                      Edit
                    </small>
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modify Currency</DialogTitle>
                        </DialogHeader>
                        <div>
                          <Input
                            value={currencyModify}
                            onChange={(e) => setCurrencyModify(e.target.value)}
                          />
                        </div>
                        <DialogFooter>
                          <Button
                            onClick={() => {
                              handleConversionRate();
                              setOpen(false);
                            }}
                          >
                            Save
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
              <FormField
                name="Rate_Per_MT_Converted"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate Per MT Converted</FormLabel>
                    <div className="flex h-11 items-center border rounded space-x-2 w-[300px]">
                      <select
                        value={convertedCurrency || "USD"}
                        onChange={(e) => {
                          const newValue = {
                            ...field.value,
                            currency: e.target.value,
                          };
                          field.onChange(newValue);
                          handleCurrencyChange(e.target.value);
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
                        value={ratePerMtConverted || ratePerMt}
                        className="w-full border-0 outline-none p-2 rounded"
                        readOnly
                      />
                    </div>
                  </FormItem>
                )}
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
  } else {
    return (<Load />);
    
  }
};

export default App;
