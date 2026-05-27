/* eslint-disable no-undef */

let initialize = function(instance, context) {
  // Internal Logging functions
  const verboseUser = context.keys['Verbose Logging'];
  instance.data.vError = function(message, object = '', plugin = 'Date & Time Toolkit - Recurrence') {
    console.log(`%c📍 ${plugin} Error`, 'background: #ffb0b0; color: black; display: block; padding:2px', message, object); // eslint-disable-line no-console
    context.reportDebugger(`⏲️ ${plugin} Error ${message}`);
  };
  let vError = instance.data.vError;

  instance.data.vLog = function(message, object = '', plugin = 'Date & Time Toolkit - Recurrence') {
    const verbose = verboseUser !== undefined || verboseUser !== '' || verboseUser != null ? verboseUser : false;
    if (verbose === 'true' || verbose === 'yes' || verbose === true) {
      console.log(`%c⏲️ ${plugin} Log`, 'background: #acf2be; color: black; display: block; padding:2px', message, object); // eslint-disable-line no-console
    }
  };
  let vLog = instance.data.vLog;

  // Retry Handler
  // Internal Logging functions
  let retryEvery = parseInt(context.keys['Retry Every (ms)']);
  let noRetries = parseInt(context.keys['No. of Retries']);
  let expDelay = parseInt(context.keys['Exponential Delay']);
  // Fix handle limits and NaN
  retryEvery = retryEvery >= 5 ? retryEvery : 15;
  noRetries = noRetries >= 10 ? noRetries : 15;
  expDelay = expDelay >= 1 && expDelay <= 5 ? expDelay : 1;
  vLog('Custom retry settings (if applicable)', { retryEvery, noRetries, expDelay });

  // Determine if the scripts are loaded & make ready
  function checkScripts(callback, result) {
    vLog('Checking for required typeof(s)...');
    let allLoaded = [];

    // check if google is loaded
    if (typeof rrule === 'undefined') {
      allLoaded.push(false);
      vLog('🔴 rrule type missing');
    } else {
      allLoaded.push(true);
      vLog('🟢 rrule typeof found');
    }

    vLog('typeof loaded?', allLoaded);

    // Return Value
    if (allLoaded.includes(false) || allLoaded.length <= 0) {
      vLog('Retrying typeof check with max 10 retries...');
      // eslint-disable-next-line n/no-callback-literal
      return callback({ message: 'typeof not loaded', typeof: allLoaded }, null);
    } else {
      return callback(null, true);
    }
  };

  // async check scripts and retry
  $(document).ready(function() {
    vLog('Checking requirements...');
    async.retry({
      times: 10,
      interval: function(retryCount) {
        let t = 10 * Math.pow(1, retryCount);
        vLog(`Retry ${retryCount} (${t}ms)`);
        return t;
      }
    }, checkScripts, function(err, result) {
      if (err) {
        vLog('Bubble did not load required typeof(s)! Loading internal requirements...', err);
      }
      if (result) {
        // Requirements loaded continuing to init the map
        initGmap();
      }
    });
  });

  function initGmap() {
    vLog('All scripts are loaded');
    // Make State Ready
    instance.data.ready = true;
    vLog('Initialization complete');
    instance.publishState('ready', instance.data.state);
    instance.triggerEvent('ready');

    // Create unique ID of instance
    let instanceid = (Math.random() * Math.pow(2, 54)).toString(36);

    // Create the DIV
    let div;
    div = $('<div class="rrule" id="rrule_' + instanceid + '"></div>');
    instance.canvas.append(div);

    // Capture Parent div
    let parentDiv = $(div).parent();

    // create instances
    instance.data.instanceid = instanceid;
    instance.data.instanceName = `rrule_${instanceid}`;
    instance.data.currentDiv = div;
    instance.data.parentDiv = parentDiv;
    vLog('Instance details', { instanceid: instance.data.instanceid, div: instance.data.div, parentDiv: instance.data.parentDiv });
    instance.data.rules = [];
  }
};
