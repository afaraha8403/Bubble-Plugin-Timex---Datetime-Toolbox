function(instance, properties, context) {

//Load bubble properties
let focus_date = properties.focus_date;
let target_start = properties.target_start;
let target_end = properties.target_end;
let target_stretch = properties.target_stretch;
let unit_type = properties.unit_type;
let range_option = properties.range_option;


function targetDates(initialDate, startRange, endRange, getDate, getOffset) {
    let currentDate = moment(initialDate).milliseconds(0);
    let startTarget = currentDate.clone().startOf(startRange);
    let endTarget = currentDate.clone().endOf(endRange);

    let results = {}; //Object holding the results days, ranges, count 

    //Determine the number of days between 2 dates for use in for loop
    let maxi;
    maxi = endTarget.diff(startTarget, getDate) + getOffset;

    //Get days
    let date_list = [];
    let date_range_list = [];
    let i;
    for (i = 0; i <= maxi; i++) {

        //Get the moment object
        let date_extract = moment(startTarget).add(i, getDate);



        //Determine Case for date_range_list
        switch (range_option) {
            case 'Start Date/Time':
                //TODO: change all occurances to https://momentjs.com/docs/#/manipulating/end-of/
                date_range_list.push([startTarget._d, date_extract._d]);
                //days_range.push([startTarget._d, moment(startTarget).add(i, getDate)._d]);
                break;

            case 'End Date/Time':
                date_range_list.push([date_extract._d, endTarget._d]);
                //days_range.push([i._d, endTarget.end._d]);
                break;

            case 'Previous Date/Time':
                if (date_list.length == 0 || date_list == undefined) {
                    let last_date = currentDate.clone().startOf(startRange).subtract(1, 'days')._d;
                    date_range_list.push([last_date, date_extract._d]);
                } else {
                    let last_date = date_list.slice(-1)[0];
                    date_range_list.push([last_date, date_extract._d]);
                }
                break;

            default:
                //eslint-disable-next-line rule
                console.log('Timex Plugin', 'No option selected for a Rang Option!');
                /* eslint-enable no-console */
                date_range_list.push([startTarget.start._d, i._d]);
        }

        //Push the result date
        date_list.push(date_extract._d);


    }

    //update results object
    results.days = date_list;
    results.count = date_list.length;
    results.range_results = date_range_list;

    //TODO: Add starting date and ending date
    //TODO: Add week control start of week
    return results;
}

$(document).ready(function () {
    setTimeout(function () {
        //Usage - instance.publishState(string: Exposed state name, Value);
        let re = targetDates(focus_date, target_start, target_end, unit_type, target_stretch);
        instance.publishState('date_results', re.days);
        instance.publishState('count', re.count);
        //Usage - instance.triggerEvent(string: Event's name);
        instance.triggerEvent('results_available');
    }, 150);
});
  
  
}