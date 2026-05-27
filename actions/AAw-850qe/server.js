async function(properties, context) {
  // Needs minifications to be turned off

  function roundToNearest(number, roundTo, upDownNill) {
    roundTo = 1 / (roundTo);
    if (upDownNill === 'Round Up') {
      return Math.ceil(number * roundTo) / roundTo;
    }
    if (upDownNill === 'Round Down') {
      return Math.floor(number * roundTo) / roundTo;
    }
    if (upDownNill === 'Auto') {
      return Math.round(number * roundTo) / roundTo;
    }
  }

  try {
    let hours = properties.hours;
    let minutes = properties.minutes;
    let seconds = properties.seconds;
    let precision = properties.precision;
    let round_to_closest = properties.round_to_closest;
    let round_updown = properties.round_updown;

    let md = minutes * (1 / 60);
    console.log('md', md);
    let sd = seconds * (1 / 3600);
    console.log('sd', sd);

    let result = hours + md + sd;
    console.log('result', result);
    result = parseFloat(result).toFixed(precision);
    if (round_updown === 'Don\'t Round') {
      return {
        output: result
      };
    } else {
      let r = roundToNearest(result, round_to_closest, round_updown);
      return {
        output: r
      };
    }
  } catch (e) {
    console.log(e);
    return {
      error: e.toString()
    };
  }
}