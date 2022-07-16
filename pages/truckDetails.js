import React from "react";

export default function TruckDetails() {
  const [truckDetails, setTruckDetails] = React.useState([
    {
      truckId: "",
      inTime: "",
      inDate: "",
      outDate: "",
      outTime: "",
    },
  ]);
  React.useEffect(() => {
    fetch("/api/getTruckDetails")
      .then((res) => {
        res
          .json()
          .then((response) => {
            console.log(response.services);
            setTruckDetails((details) => {
              return response.services;
            });
          })
          .catch((err) => {});
      })
      .catch((err) => {
        console.log(err);
      });
  },[]);
  return (
    <>
      <table>
        <tr>
          <th>truckId</th>
          <th>inTime</th>
          <th>inDate</th>
          <th>outDate</th>
          <th>outTime</th>
        </tr>
    {truckDetails.length > 0 &&(
        truckDetails.map((log) => {
            return (
              <tr key={log?._id}>
                <td>{log?.truckId}</td>
                <td>{log?.inTime}</td>
                <td>{log?.inDate}</td>
                <td>{log?.outDate}</td>
                <td>{log?.outTime}</td>
              </tr>
            );
          })
    )}
      </table>
    </>
  );
}
