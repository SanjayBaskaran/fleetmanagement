import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  console.log(req.body);
  const truck_info = req.body;
  const client = await MongoClient.connect(
    "mongodb://localhost:27017/fleet_management"
  );
  const db = await client.db();
  const truckCollection = await db.collection("truck");
  const result = await truckCollection.findOne({
    truckId: truck_info.truck_id,
  });
  if (result) {
        if(result.status == "in"){
            //truck status already in so the truck is leaving right now
            const query = {truckId:truck_info.truck_id};
            const update = {
                $set:{
                    status:"out"
                }
            };
            const updateStatus = await truckCollection.updateOne(query, update);

        }else if(result.status == "out"){
            //truck status already out so the truck is entering right now
            const query = {truckId:truck_info.truck_id};
            const update = {
                $set:{
                    status:"in"
                }
            };
            const updateStatus = await truckCollection  .updateOne(query, update);
        }
    res.status(200).json({ details: result });
  } else {
      if( truck_info.truck_id != "" && truck_info.truck_id != undefined){
        console.log("data not found");
        const data = {"truckId":truck_info.truck_id,"status":"in"}
        const result = await truckCollection.insertOne(data);
        console.log(result);
        client.close();
        res.status(201).json(result);
      }
    res.status(401).json({ message: "Invalid TRUCK id" });
  }
  client.close();
}
