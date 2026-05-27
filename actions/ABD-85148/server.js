function(properties, context) {

    let day_of_the_week = properties.day_of_the_week;
    let starting_date_iso = properties.starting_date_iso;

    function getNextDayOfWeek(day_of_the_week, iso) {
        //Minus 1 from month as bubble months don't start at 0
        let date = new Date(iso);
        console.log(date)
        let resultDate = new Date(date.getTime());
        console.log(resultDate)
        resultDate.setDate(date.getDate() + (7 + day_of_the_week - date.getDay() - 1) % 7 + 1);
        return resultDate;
    }

    return {
        next_date: getNextDayOfWeek(day_of_the_week, starting_date_iso)
    }
    
}