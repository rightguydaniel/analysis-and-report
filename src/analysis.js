const { getTrips } = require('api');
const { getDriver } = require('api');

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
  // Your code goes here
  try{
  const allTripsInformation =  await getTrips();
  console.log(allTripsInformation)

  let noOfCashTrips = 0;
  let noOfNonCashTrips = 0;
  let billedTotal = 0;
  let cashBilledTotal = 0;
  let nonCashBilledTotal = 0;
  let driverTripId = []
  let driverIDs = []
  let driverTrips = {}
  let driverEarnings = {}

  for(let i = 0; i < allTripsInformation.length; i++){
    let trips = allTripsInformation[i]
    //converting all billed amount from string to number
    typeof trips.billedAmount === "string" ? trips.billedAmount = Number(trips.billedAmount.split(',').join('')) : trips.billedAmount = trips.billedAmount;
    // to get no of cash trips and no of non cash trips
    trips.isCash === true ? noOfCashTrips++ : noOfNonCashTrips++ ;
    //to get amount of cash trips and non cash trips
    trips.isCash === true ? cashBilledTotal += trips.billedAmount : nonCashBilledTotal += trips.billedAmount;
    
    //to get driver with highest no of trips
    driverTripId.push(trips.driverID)
    // console.log(driverTripId)
    driverIDs = [...new Set(driverTripId)]
    // console.log(new Set(driverIDs))
    
    driverTrips.hasOwnProperty(trips.driverID) ? driverTrips[trips.driverID]++ :driverTrips[trips.driverID] = 1;
    //to get driver with highest earnings
    driverEarnings.hasOwnProperty(trips.driverID) ? driverEarnings[trips.driverID] += trips.billedAmount: driverEarnings[trips.driverID] = trips.billedAmount;
  }
  
console.log(driverTrips)
  billedTotal = cashBilledTotal + nonCashBilledTotal
  let maxDriverTrips = Object.entries(driverTrips).sort((a,b)=> b[1]-a[1])
  let maxDriverEarnings = Object.entries(driverEarnings).sort((a,b)=> b[1]-a[1])

  // console.log(maxDriverEarnings)
  let driverWithMostTripsID = maxDriverTrips[0][0]
  let driverWithHighestEarningsID = maxDriverEarnings[0][0]


  let driverWithMostTrips = await getDriver(driverWithMostTripsID)
  let driverWithHighestEarnings = await getDriver(driverWithHighestEarningsID)
  // console.log(driverWithHighestEarnings)
  
  let noOfTripsOfDriverWithHighestEarning = 0
  for(let i=0; i<maxDriverTrips.length; i++){
    if(maxDriverTrips[i][0] === driverWithHighestEarningsID){
      noOfTripsOfDriverWithHighestEarning = maxDriverTrips[i][1]
    }
  }
  
  let driverWithMostTripsEarning = 0
  for(let i = 0; i < maxDriverEarnings.length; i++){
    if(maxDriverEarnings[i][0] === driverWithMostTripsID){
      driverWithMostTripsEarning = maxDriverEarnings[i][1];
    }
  }
  let noOfDriversWithMoreThanOneVehicle = 0;
  let driverArr = []
  for(let i = 0; i < driverIDs.length; i++){
    driverArr.push(getDriver(driverIDs[i]))
  }
  driverArr = await Promise.allSettled(driverArr)
  driverArr.pop()

  for(let i =0; i < driverArr.length; i++){
    if(driverArr[i].value.vehicleID.length > 1){
      noOfDriversWithMoreThanOneVehicle++
    }
  }

  //Final Output
  let output = {
    "noOfCashTrips": noOfCashTrips,
    "noOfNonCashTrips": noOfNonCashTrips,
    "billedTotal": billedTotal,
    "cashBilledTotal": cashBilledTotal,
    "nonCashBilledTotal": Number(nonCashBilledTotal.toFixed(2)),
    "noOfDriversWithMoreThanOneVehicle": noOfDriversWithMoreThanOneVehicle,
    "mostTripsByDriver": {
      "name": driverWithMostTrips.name,
      "email": driverWithMostTrips.email,
      "phone": driverWithMostTrips.phone,
      "noOfTrips": maxDriverTrips[0][1],
      "totalAmountEarned": driverWithMostTripsEarning
    },
    "highestEarningDriver": {
      "name": driverWithHighestEarnings.name,
      "email": driverWithHighestEarnings.email,
      "phone": driverWithHighestEarnings.phone,
      "noOfTrips": noOfTripsOfDriverWithHighestEarning,
      "totalAmountEarned": maxDriverEarnings[0][1]
    }
  }
  return output
}catch(err){
  console.log(err.message)
}
}
analysis()
module.exports = analysis;
