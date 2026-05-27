let action = function(instance, properties, context) {
  let vError = instance.data.vError;
  let vLog = instance.data.vLog;

  if (!instance.data.ready) {
    vLog('Plugin not ready yet');
    return;
  }

  if (instance.data.rules) {
    let l = instance.data.rules;
    vLog(`${l.length} rules cleared`);
    instance.data.rules = [];
    // Update the state
    instance.data.appendToConfigState();
  } else {
    vLog('No rules to clear');
  }
};
