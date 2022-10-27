import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  console.log(req.body);
  const truck_info = req.body;

  console.log(truck_info);
  const client = await MongoClient.connect(
    "mongodb://localhost:27017"
  );
  const db = await client.db();
  const truckCollection = await db.collection("truck");
  const logCollection = await db.collection("log");
  const result = await truckCollection.findOne({
    truckId: truck_info.truck_id,
  });
  console.log("result",result);
  if (result) {
    if (result.status == "in") {
      //truck status already in so the truck is leaving right now
      let query = { truckId: truck_info.truck_id };
      let update = {
        $set: {
          status: "out",
        },
      };
      const updateStatus = await truckCollection.updateOne(query, update);
      const lastLog = await logCollection.aggregate([
        {
          $group: {
            _id: "$truckId",
            entryId: { $max: "$entryId" },
          },
        },
      ]);
      const lastData = await lastLog.toArray();
      const filteredData = lastData.filter(item => {return item._id == truck_info.truck_id});
      console.log("Filtered Data",filteredData)
      console.log(lastData);
      let id= filteredData[0].entryId == undefined ? 1:filteredData[0].entryId;
      console.log("id",id);

      let price = 0;
      query = { entryId: id, truckId: truck_info.truck_id };
      const lastRecord = await logCollection.findOne(query);
      
      var startTime=lastRecord.inTime;

      var endTime= new Date().getHours() + ":" + new Date().getMinutes();
      var dateExit = new Date().getDate() +
      "/" +
      new Date().getMonth() +
      "/" +
      new Date().getFullYear();
      let hours  = eval(startTime.split(":")[0]+"-"+endTime.split(":")[0]);

      console.log("last Record ",hours,startTime.split(":")[0]+"-"+endTime.split(":")[0]);
      if(lastRecord.inDate == dateExit){
        price = ((hours==0)?1:hours)*50;
      }else{
        price = eval(lastRecord.inDate.split("/")[0] - dateExit.split("/")[0]) *200
      }
      update = {
        $set: {
          outTime: new Date().getHours() + ":" + new Date().getMinutes(),
          outDate:
            new Date().getDate() +
            "/" +
            new Date().getMonth() +
            "/" +
            new Date().getFullYear(),
          price : price
        },
      };
      const insertInlog = await logCollection.updateOne(query, update);
    } else if (result.status == "out") {
      //truck status already out so the truck is entering right now
      const query = { truckId: truck_info.truck_id };
      const update = {
        $set: {
          status: "in",
        },
      };
      const updateStatus = await truckCollection.updateOne(query, update);
      const lastLog = await logCollection.aggregate([
        {
          $group: {
            _id: "$truckId",
            entryId: { $max: "$entryId" },
          },
        },
      ]);
      const lastData = await lastLog.toArray();
      const filteredData = lastData.filter(item => {return item._id == truck_info.truck_id});
      if (filteredData.length > 0) {
        let data = {
          entryId: filteredData[0].entryId + 1,
          truckId: truck_info.truck_id,
          inTime: new Date().getHours() + ":" + new Date().getMinutes(),
          inDate:
            new Date().getDate() +
            "/" +
            new Date().getMonth() +
            "/" +
            new Date().getFullYear(),
        };
        const insertInlog = await logCollection.insertOne(data);
      } else {
        let data = {
          entryId: 1,
          truckId: truck_info.truck_id,
          inTime: new Date().getHours() + ":" + new Date().getMinutes(),
          inDate:
            new Date().getDate() +
            "/" +
            new Date().getMonth() +
            "/" +
            new Date().getFullYear(),
        };
        const insertInlog = await logCollection.insertOne(data);
      }
    }

    res.status(200).json({ details: result });
  } else {
    console.log(truck_info.truck_id);
    if (truck_info.truck_id != "" && truck_info.truck_id != undefined) {
      console.log("data not found");
      let data = { truckId: truck_info.truck_id, status: "in" };
      const result = await truckCollection.insertOne(data);
      data = {
        entryId: 1,
        truckId: truck_info.truck_id,
        inTime: new Date().getHours() + ":" + new Date().getMinutes(),
        inDate:
          new Date().getDate() +
          "/" +
          new Date().getMonth() +
          "/" +
          new Date().getFullYear(),
      };
      const insertInlog = await logCollection.insertOne(data);
      client.close();
    }
    res.status(401).json({ message: "Invalid TRUCK id" });
  }
}
