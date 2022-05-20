//***Function to Download all users in the Students Domain & Print them to a Google Sheet***//
//Adapted from this help page response _ https://support.google.com/a/thread/10511601/download-a-list-of-users-automatically?hl=en//

function listStudents() {
 var sh = 'ENTER SHEET ID'; //Find the sheet ID in the Google Sheets URL//
 var sheet = SpreadsheetApp.openById(sh);
 var sheet1 = sheet.getSheetByName('ENTER WORKSHEET NAME');
 var sheet1range = sheet.getRange("A:G")
 sheet1range.clear()
 var data = [];// array to store values
 data.push(['user_id','email' ,'first_name', 'last_name',  'suspended', 'last_login','created_on']);// store headers
 var pageToken, page;
 do {
   page = AdminDirectory.Users.list({
     domain: 'domain.org', //Replace with your domain
     pageToken: pageToken
    });
 var users = page.users;
 if (users) {
   for (var i = 0; i < users.length; i++) {
     var user = users[i];
     data.push([(user.hasOwnProperty('externalIds'))? 
                (user.externalIds[0].hasOwnProperty("value"))?
                user.externalIds[0].value : "" : ""  
                ,user.primaryEmail
                ,user.name.givenName
                ,user.name.familyName
                ,user.suspended
                ,user.lastLoginTime 
                ,user.creationTime ]);//store in an array of arrays (one for each row)
   }} 
   else {
    Logger.log('No users found.');
       }
    pageToken = page.nextPageToken;
  } 
  while (pageToken);
  sheet1.getRange(1,1,data.length,data[0].length).setValues(data);
  var dated = sheet.getRange("P1")
  dated.setValue(Utilities.formatDate(new Date(),Session.getScriptTimeZone(),'dd-MMM-yyy'));
  }
