async function(properties, context) {
  const Moment = require('moment');
  const MomentRange = require('moment-range');
  const moment = MomentRange.extendMoment(Moment);

  // Load bubble properties
  let day_start = properties.day_start;
  let day_end = properties.day_end;
  let step_units = properties.step_units;
  let steps = properties.steps;
  let range_option = properties.range_option;

  function splitDatesHours(start, end, unit, steps) {
    // Format dates
    let dStart = new Date(start);
    let dEnd = new Date(end);

    let day_start = moment(dStart);
    let day_end = moment(dEnd);
    let day = moment.range(day_start, day_end);
    let time_slots = Array.from(day.by(unit, { step: steps }));

    // Result Object
    let result = {};

    // Capture results for date_list & date_range_list
    let date_list = [];
    let date_range_list = [];
    time_slots.forEach(e => {
      // Determine Case for date_range_list
      switch (range_option) {
        case 'Start Date/Time':
          date_range_list.push([day.start._d, e._d]);
          break;

        case 'End Date/Time':
          date_range_list.push([e._d, day.end._d]);
          break;

        case 'Previous Date/Time':
          date_range_list.push([date_list.slice(-1)[0], e._d]);
          break;

        default:
          date_range_list.push([day.start._d, e._d]);
      }

      // Push results for date_list
      date_list.push(e._d);
    });

    // Update result object
    result.date_list = date_list;
    result.count = date_list.length;

    // clean first item in array
    date_range_list.shift();
    // Add last hour of the day
    // date_range_list.push([date_list.slice(-1)[0],day.end._d]);

    result.date_range_list = date_range_list;
    return result;
  }

  try {
    let results = splitDatesHours(day_start, day_end, step_units, steps);
    console.log({
      date_list: results.date_list,
      date_list_ranges: results.date_range_list,
      count: results.count
    });

    return {
      date_list: results.date_list,
      date_list_ranges: results.date_range_list,
      count: results.count
    };
  } catch (error) {
    console.log('Error:', error);
    return { error: error.toString() };
  }
}