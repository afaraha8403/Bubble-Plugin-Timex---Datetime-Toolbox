function(properties, context) {

let decimal_hours = properties.decimal_hours

function SplitTime(numberOfHours){
    let Days=Math.floor(numberOfHours/24);
    let Remainder=numberOfHours % 24;
    let Hours=Math.floor(Remainder);
    let Minutes=Math.floor(60*(Remainder-Hours));
    return({"day":Days,"hrs":Hours,"min":Minutes})
};

let hours= decimal_hours;
    let timeResult=SplitTime(hours);
    let hReadable = timeResult.day + " Day(s) " + timeResult.hrs + " Hour(s) & " + timeResult.min + " Minute(s)";    
    

return {
    "minutes": timeResult.day,
    "hours":timeResult.hrs,
    "minutes": timeResult.min,
    "human_readable":hReadable
}
}