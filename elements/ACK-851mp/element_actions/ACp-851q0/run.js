let action = function(instance, properties, context) {
  let vError = instance.data.vError;
  let vLog = instance.data.vLog;

  let rule_id = properties.rule_id.toString();

  if (!instance.data.ready) {
    vLog('Plugin not ready yet');
    return;
  }

  if (!instance.data.rules) {
    vLog('No rules added');
    return;
  }

  let l = instance.data.rules;

  l.forEach(e => {
    if (e.id === rule_id) {
      l.splice(l.indexOf(e), 1);
    }
  });

  instance.data.rules = l;

  vLog(`Rule ID ${rule_id} removed`, instance.data.rules);
  // Update the state
  instance.data.appendToConfigState();
};
