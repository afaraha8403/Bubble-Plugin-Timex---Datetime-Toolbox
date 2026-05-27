let action = function(instance, properties, context) {
  let vError = instance.data.vError;
  let vLog = instance.data.vLog;
  let DateTime = luxon.DateTime;
  let browser_timezone = properties.browser_timezone;

  if (browser_timezone) {
    browser_timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    vLog('Using browser timezone', browser_timezone);
  }

  let rule_id = (properties.rule_id) ? properties.rule_id.toString() : null;

  if (!instance.data.ready) {
    vLog('Plugin not ready yet');
    return;
  }

  let l = instance.data.rules;
  if (l.length <= 0) {
    vLog('No rules added');
    return;
  }

  function publishResults(data) {
    let r;
    vLog(`Timezone: ${browser_timezone}`);
    if (!browser_timezone) {
      r = data.rule.all().map(date =>
      // Luxon https://moment.github.io/luxon/api-docs/index.html#datetimesetzone
        DateTime.fromJSDate(date)
          .toUTC()
          .setZone('local', { keepLocalTime: true })
          .toJSDate()
      );
    } else {
      r = data.rule.all().map(date =>
        // Luxon https://moment.github.io/luxon/api-docs/index.html#datetimesetzone
        DateTime.fromJSDate(date)
          .toUTC()
          .setZone(browser_timezone)
          .toJSDate()
      );
    }

    instance.publishState('occurrences', r);
    instance.triggerEvent('occurrences_loaded');
    vLog('Occurrences loaded', r);
  }

  if (rule_id) {
    l.forEach(e => {
      if (e.id === rule_id) {
        publishResults(e);
      }
    });
  } else {
    publishResults(l[0]);
  }
};
