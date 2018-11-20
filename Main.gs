
function LIB_FUNC(){AmisLib.Utility.LIB_FUNC.apply(this, arguments);}

/* The script is deployed as a web app and renders the form */
function doGet(e) {
  return HtmlService
    .createHtmlOutputFromFile('forms.html')
    .setTitle("USDA NATIONAL UPLOAD DATA");
}

//TODO place the USDA API logic call here
function uploadData(userToken, uid){  
  //1)fetch data from usda API
  //ElaborateUsfetchUsdaFromApi
  var apiData = ElaborateUsdaData.fetchUsdaFromApi();
  //2)format those data like 'matrix' for CSV upload
  var usdaArray = ElaborateUsdaData.elaborate(apiData, userToken);
  //3) call CsvUtility.elaborateData 
  //Logger.log(usdaArray);
  CsvUtility.elaborateData(userToken, usdaArray)
  return 'done';
}