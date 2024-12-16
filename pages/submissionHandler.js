const submitHandler = async (data) => {
    const formatDate = (date) => {
      if (!date) return "";
      const d = new Date(date);
      const day = d.getDate().toString().padStart(2, "0");
      const month = d.toLocaleString("default", { month: "short" }); // e.g., "Jan"
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };
  
    const formData = {
      ...data,
      Commencement: data.Commencement ? formatDate(data.Commencement) : "",
      Commodity: data.Commodity?.value || "",
      Customer: data.Customer?.value || "",
      Completion: data.Completion ? formatDate(data.Completion) : "",
      Destinations: data.Destinations?.value || "",
      Loader: data.Loader ? data.Loader.map((value) => value.value) : null,
      Maximum_Fuel: data.Maximum_Fuel?.value || "",
      Maximum_Load: data.Maximum_Load
        ? data.Maximum_Load.map((value) => value.value)
        : null,
      Miximum_Disputch: data.Miximum_Disputch?.value || "",
      Origin: data.Origin?.value || "",
      Rate_Per_MT: data.Rate_Per_MT?.amount || "",
      Rate_Per_MT_Converted: data.Rate_Per_MT_Converted
        ? `$${data.Rate_Per_MT_Converted.amount}`
        : "",
      Select_Book: data.Select_Book?.value || "",
      Service_Locations: data.Service_Locations?.value || "",
      Vendor_Bill: data.Vendor_Bill?.amount || "",
      Vendor_Bill_Converted: data.Vendor_Bill_Converted
        ? `$${data.Vendor_Bill_Converted.amount}`
        : "",
    };
  
    console.log(formData);
  };
  
  export default submitHandler;
  