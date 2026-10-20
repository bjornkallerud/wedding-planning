// Checkmark sync for the To do tab in index.html.
// Bound to a Google Sheet and deployed as a web app (Execute as: Me, Who has access: Anyone); see sync/README.md.
var SHEET = 'Checkmarks';
var ID = /^[a-z0-9-]{1,64}$/i;

function sheet_(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET);
  if(!sh){ sh = ss.insertSheet(SHEET); sh.appendRow(['id', 'done', 'updated']); sh.setFrozenRows(1); }
  return sh;
}

function read_(sh){
  var state = {}, rows = sh.getDataRange().getValues();
  for(var i = 1; i < rows.length; i++){ if(rows[i][0]) state[rows[i][0]] = rows[i][1] === true; }
  return state;
}

function json_(o){
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(){
  return json_({state: read_(sheet_())});
}

// Body: {"changes": {"<data-id>": true|false, ...}}; replies with the full state after applying them
function doPost(e){
  var changes = JSON.parse(e.postData.contents).changes || {};
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try{
    var sh = sheet_(), rows = sh.getDataRange().getValues(), row = {}, now = new Date();
    for(var i = 1; i < rows.length; i++) row[rows[i][0]] = i + 1;
    Object.keys(changes).forEach(function(id){
      if(!ID.test(id)) return;
      var done = changes[id] === true;
      if(row[id]) sh.getRange(row[id], 2, 1, 2).setValues([[done, now]]);
      else { sh.appendRow([id, done, now]); row[id] = sh.getLastRow(); }
    });
    return json_({state: read_(sh)});
  } finally {
    lock.releaseLock();
  }
}
