import React, { useEffect } from "react";
import logo from "./logo.svg";
import { useDB, useAllDocs, useFind, useGet } from "react-pouchdb";
import useSWR from "swr";
import "./App.css";
import { fetcher } from "./utils/fetch";
import Q from "./components/Q";

function App() {
  const db = useDB("customer");
  const { data: customer, error } = useSWR("/customer", fetcher);
  const customerData = useGet("customer", { id: "5face9bafb3a0c7cd7704c90" });
  console.log(customerData);

  useEffect(() => {
    const getAndUpdate = async () => {
      if (customer?.length) {
        db.put({
          ...customer[0],
          _id: customer[0]._id,
          _rev: customerData?._rev,
        });
      }
    };
    getAndUpdate();
  }, [customer]);
  
  return (
    <div>
      <h1>Customer : {customerData?.name}</h1>
      {customerData?.services.map((_id: string, k) => (
        <Q _id={_id} key={k} />
      ))}
    </div>
  );
}

export default App;
