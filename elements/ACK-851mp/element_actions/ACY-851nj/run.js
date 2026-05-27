let action = function(instance, properties, context) {
  let vError = instance.data.vError;
  let vLog = instance.data.vLog;

  if (!instance.data.ready) {
    vLog('Plugin not ready yet');
    return;
  }

  let l = instance.data.rules;

  // Build rule
  let rule_id = properties.rule_id ? properties.rule_id : l.length + 1;
  let freq = instance.data.getFrequency(properties.frequency);
  let dtstart = properties.starts_on ? properties.starts_on : new Date();
  let interval = properties.interval;
  let wkst = instance.data.getWeekStartDay(properties.week_start_day);
  let count = properties.count;
  let until = properties.until;
  let bysetpos = properties.by_step_position ? properties.by_step_position.split(',').map(Number) : null;
  let bymonth = properties.by_month ? properties.by_month.split(',').map(Number) : null;
  let bymonthday = properties.by_month_day ? properties.by_month_day.split(',').map(Number) : null;
  let byyearday = properties.by_year_day ? properties.by_year_day.split(',').map(Number) : null;
  let byweekno = properties.by_week_no ? properties.by_week_no.split(',').map(Number) : null;
  let byweekday = properties.by_week_day ? properties.by_week_day.split(',').map(Number) : null;
  let byhour = properties.by_hour ? properties.by_hour.split(',').map(Number) : null;
  let byminute = properties.by_minute ? properties.by_minute.split(',').map(Number) : null;
  let bysecond = properties.by_second ? properties.by_second.split(',').map(Number) : null;

  vLog('Requested configuration', properties);

  // TODO add the remaining required checks
  if (!freq) {
    vError('No frequency defined.  Please use one of the following: yearly, monthly, weekly, daily, hourly, minutely, secondly');
    return;
  }

  if (!count && !until) {
    vError('a count limit or an until date must be defined');
    return;
  }

  let preRule = {
    freq,
    dtstart,
    interval,
    wkst,
    count,
    until,
    bysetpos,
    bymonth,
    bymonthday,
    byyearday,
    byweekno,
    byweekday,
    byhour,
    byminute,
    bysecond
  };

  vLog('Converted preRule', preRule);

  preRule = Object.fromEntries(Object.entries(preRule).filter(([_, v]) => v != null));
  let config = Object.fromEntries(Object.entries(properties).filter(([_, v]) => v != null));
  // let config = r;

  // Convert configuration to RRule
  let rule = instance.data.configToRule(preRule);
  instance.data.rules.push({ id: rule_id.toString(), config, ...rule });

  vLog(`New rule id ${rule_id.toString()} added. ${l.length} rules total`, instance.data.rules);

  // Update the state
  instance.data.appendToConfigState();
};
