import { useRouter } from "next/router";
import react, { useEffect } from "react";
export default function Id() {
  const router = useRouter();
//   console.log(router);
  useEffect(() => {
    fetch("/api/checkTruck", {
      method: "POST",
      body: JSON.stringify({ truck_id: router.query.id }),
    })
      .then((res) => {
          console.log(res);
      })
      .catch((err) => {
          console.log(err);
      });
  },);
  return (<>
  TEST
  </>);
}
