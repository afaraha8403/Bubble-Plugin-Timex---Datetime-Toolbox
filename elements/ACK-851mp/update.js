let update = function(instance, properties, context) {
  let vError = instance.data.vError;
  let vLog = instance.data.vLog;

  instance.data.getFrequency = function(frequency) {
    let f = frequency.trim().toLowerCase();
    let r;
    if (!f) {
      vError('No frequency defined.  Please use one of the following: yearly, monthly, weekly, daily, hourly, minutely, secondly');
      return;
    }

    switch (f) {
      case 'yearly':
        r = rrule.RRule.YEARLY;
        break;
      case 'monthly':
        r = rrule.RRule.MONTHLY;
        break;
      case 'weekly':
        r = rrule.RRule.WEEKLY;
        break;
      case 'daily':
        r = rrule.RRule.DAILY;
        break;
      case 'hourly':
        r = rrule.RRule.HOURLY;
        break;
      case 'minutely':
        r = rrule.RRule.MINUTELY;
        break;
      case 'secondly':
        r = rrule.RRule.SECONDLY;
        break;

      default:
        vError(`${f} is not a valid frequency.  Please use one of the following: yearly, monthly, weekly, daily, hourly, minutely, secondly`);
        break;
    }
    return r;
  };

  instance.data.getWeekStartDay = function(weekStartDay) {
    let r;
    if (isNaN(weekStartDay)) {
      // "monday, tuesday, wednesday, thursday, friday, saturday, sunday"
      switch (weekStartDay) {
        case 'monday':
          r = rrule.RRule.MO;
          break;
        case 'tuesday':
          r = rrule.RRule.TU;
          break;
        case 'wednesday':
          r = rrule.RRule.WE;
          break;
        case 'thursday':
          r = rrule.RRule.TH;
          break;
        case 'friday':
          r = rrule.RRule.FR;
          break;
        case 'saturday':
          r = rrule.RRule.SA;
          break;
        case 'sunday':
          r = rrule.RRule.SU;
          break;
      }
    } else if (parseInt(weekStartDay)) {
      r = weekStartDay;
    } else {
      vLog(`${weekStartDay} is not a valid week start day.  Please use one of the following: 0, 1, 2, 3, 4, 5, 6 or a weekday name`);
    }
    return r;
  };

  instance.data.configToRule = function(config) {
    let { RRule } = rrule;
    let rule = new RRule(config);
    let ical = rule.toString();
    let readable = rule.toText();
    return { ical, readable, rule };
  };

  instance.data.remapObj = (obj, param_prefix) => {
    if (typeof obj !== 'object' || (obj && Array.isArray(obj))) return {};
    // eslint-disable-next-line no-param-reassign
    if (typeof param_prefix !== 'string' || !param_prefix || (typeof param_prefix === 'string' && !['_p_', '_api_c2_'].includes(param_prefix))) param_prefix = '_p_';
    /**
     * @param {Object} obj
     * @param {string} [key_parent]
     * @param {boolean} [is_array]
     * @return {Object}
     */
    const convert = (obj, key_parent, is_array) => {
      let result = {};
      Object.keys(obj).forEach(key => {
        let cell = obj[key]; let key_new = `${param_prefix}${key}`;
        if (key_parent && !is_array) key_new = `${key_parent}.${key}`;
        if ((!cell && cell !== 0 && cell !== false) || typeof cell === 'undefined') {
          result[key_new] = null;
        } else if (typeof cell !== 'object' && !Array.isArray(cell)) {
          result[key_new] = cell;
        } else if (typeof cell === 'object' && !Array.isArray(cell)) {
          result = Object.assign(result, convert(cell, key_new));
        } else if (Array.isArray(cell)) {
          if (typeof cell[0] === 'object') {
            result[key_new] = [];
            cell.forEach(value => {
              result[key_new].push(convert(value, key_new, true));
            });
          } else {
            // It's not an object array, so treat
            // it as an array of Bubble primitives.
            //
            result[key_new] = cell;
          }
        }
      });
      return result;
    };
    let r = convert(obj);
    vLog('Remapped object', r);
    return r;
  };

  instance.data.appendToConfigState = function() {
    // Get current rules from data
    let configArray = instance.data.rules;
    let exposedState = [];
    configArray.forEach(e => {
      let element = {};
      let c = e.config;
      element.id = e.id.toString();
      element.configuration = c;
      element.ical = e.ical;
      element.readable = e.readable;
      exposedState.push(instance.data.remapObj(element));
    });
    instance.publishState('configurations', exposedState);
    instance.triggerEvent('configuration_loaded');
  };
};
