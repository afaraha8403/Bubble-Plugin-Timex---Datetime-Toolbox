let action = function(instance, properties, context) {
  let vError = instance.data.vError;
  let vLog = instance.data.vLog;

  instance.data.rules = [];
  instance.data.appendToConfigState();
  // Usage - instance.publishState(string: Exposed state name, Value);
  instance.publishState('occurrences', []);
  vLog('reset complete');
};
