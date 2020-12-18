import React, { useEffect } from "react";
import { useDB, useAllDocs, useFind, useGet } from "react-pouchdb";
import useSWR from "swr";
import { fetcher } from "./../utils/fetch";
import _ from 'lodash';
interface IQ {
  _id: string;
}

const Q = ({ _id }: IQ) => {
  const { data: service, error } = useSWR(`/service/${_id}`, fetcher);
  const serviceData = useGet("services", { id: _id });
  console.log(service);

  const db = useDB("services");
  console.log(serviceData?.queues);
  console.log(service?.queues);

  useEffect(() => {
    const getAndUpdate = async () => {
      if (service) {
        db.put({
          ...service,
          queues: checkNumber(serviceData?.queues, service?.queues),
          _id: service._id,
          _rev: serviceData?._rev,
        });
      }
    };
    getAndUpdate();
  }, [service]);

  const checkNumber = (offline, online) => {
    // return [...checkData(offline), ...checkData(online)];
    const data = [...checkData(offline), ...checkData(online)];
    console.log(data);
    const unique = _.uniqBy(data, 'name'); 
    console.log(unique);
    return unique;
  };

  const transform = (arr) => {
    if (!arr) {
      return [];
    }
    return arr.reduce((memo, item) => {
      if (typeof item !== "undefined") {
        if (Array.isArray(item)) item = transform(item);
        memo.push(item);
      }
      return memo;
    }, []);
  };

  const checkData = (data) => {
    data = transform(data);
    return !data.length ? [] : data;
  };
  
  const mongoObjectId = () => {
    const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
    return (
      timestamp +
      "xxxxxxxxxxxxxxxx"
        .replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16))
        .toLowerCase()
    );
  };

  const AddQ = async () => {
    let origDoc = await db.get(_id);
    db.put({
      ...serviceData,
      queues: [
        ...serviceData.queues,
        {
          _id: mongoObjectId(),
          name: serviceData.queues.length
            ? (
                +serviceData.queues[serviceData.queues.length - 1].name + 1
              ).toString()
            : "1",
          status: "ACTIVE",
          color: "red",
        },
      ],
      _id: _id,
      _rev: origDoc._rev,
    });
  };
  
  return (
    <div>
      <h2>
        service : {serviceData?.name} id : {_id}
      </h2>
      <div className="flex">
        {serviceData?.queues?.map(
          (queue, k) =>
            queue && (
              <div
                key={k}
                className="q"
                style={{ color: queue?.color ? "red" : "black" }}
              >
                {queue.name}
              </div>
            )
        )}
      </div>
      <button className="button" onClick={AddQ}>
        Add Q
      </button>
    </div>
  );
};
export default Q;
