import React from "react";

export default function TruckDetails() {
  const [truckDetails, setTruckDetails] = React.useState([]);
  React.useEffect(() => {
    fetch("/api/getTruckDetails")
      .then((res) => {
        res
          .json()
          .then((response) => {
            console.log(response.services);
            setTruckDetails((details) => {
              return [...response.services];
            });
          })
          .catch((err) => {});
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <table>
      <thead>
        <tr>
          <th>TruckId</th>
          <th>In Time</th>
          <th>In Date</th>
          <th>Out Date</th>
          <th>Out Time</th>
        </tr>
      </thead>
      <tbody>
        {truckDetails.length > 0 &&
          truckDetails.map((log) => {
            return (
              <tr key={log._id}>
                <td>{log?.truckId}</td>
                <td>{log?.inTime}</td>
                <td>{log?.inDate}</td>
                <td>{log?.outDate}</td>
                <td>{log?.outTime}</td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
