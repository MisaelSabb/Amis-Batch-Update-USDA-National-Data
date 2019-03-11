var ElaborateUsdaData=new function(){  
   this.apiReqData ={
       "queryId":0,
       "commodityGroupCode":null,
       "commodities":["0440000", "2222000",/*"4232000",*/ "0422110", "0410000"],// 0440000:corn,4232000:soyabean oil, 0422110:rice Milled, 0410000 wheat,
       //"attributes":[4,20,28,57,81,84,86,88,113,130,192,125,176,178,184],//All attributes
       "attributes":[4,20,28,54,57,81,182,84,86,88,113,130,7,192,149,125,161,176,178,184],//All attributes
       "countries":["US"],//US
       "marketYears":[2011,2012,2013,2014,2015,2016,2017,2018],
       //"marketYears":[2016,2017,2018],
       "chkCommoditySummary":false,
       "chkAttribSummary":false,
       "chkCountrySummary":false,
       "commoditySummaryText":"",
       "attribSummaryText":"",
       "countrySummaryText":"",
       "optionColumn":"year",
       "chkTopCountry":false,
       "topCountryCount":"",
       "chkfileFormat":false,
       "chkPrevMonth":false,
       "chkMonthChange":false,
       "chkCodes":false,
       "chkYearChange":false,
       "queryName":"",
       "sortOrder":"Commodity/Attribute/Country",
       "topCountryState":false
     }
   this.elaborate=function(array,userToken) {  
     var elaArray = [["region_code","product_code","element_code","season","date","value","forecasting_methodology","notes"]];
     var fbCommodityNode = FirebaseConnector.getFireBaseDataParsed('config/usdaMapping/commodities/', userToken)
     //Logger.log(fbCommodityNode)
     var fbAttributeNode = FirebaseConnector.getFireBaseDataParsed('config/usdaMapping/attributes/', userToken)
     array = JSON.parse(array).queryResult;
     var todayDate = Utilities.formatDate(new Date(), "GMT+1", "yyyy-MM-dd");
     var tempCommodity='A';
     for (var i = 0; i < array.length; i++) {
       var line = '';
       for (var ind in array[i]) {
         if( array[i]['commodity'] != null){
           //Logger.log(new String(array[i]['commodity']))
           tempCommodity = fbCommodityNode[new String(array[i]['commodity']).replace(/[" "]/g, "_")];
           
           if(fbCommodityNode[new String(array[i]['commodity']).replace(/[" "]/g, "_")] == undefined){
             //Logger.log(new String(array[i]['commodity']).replace(/[" "]/g, "_"))
           }
           
         }
         //Logger.log(fbCommodityNode[new String(array[i]['commodity'])])
         
         if(ind.indexOf('20') !== -1 ){           
           var attribute = fbAttributeNode[new String(array[i]['attribute']).replace(/[.]/g, "")]
           if(new String(array[i]['attribute']).replace(/[.]/g, "")=='Crush'){
             //Logger.log(array[i]);
             //Logger.log(array[i]['attribute']);
             //Logger.log([259,tempCommodity,attribute,this.yearFormat(ind),todayDate, array[i][ind], '','']);
           }
           //this is for extraction rate that must be in percentage
           if(attribute==3){
             elaArray.push([259,tempCommodity,attribute,this.yearFormat(ind),todayDate, (array[i][ind])/100, '',''])
           }else{
             //value without changes
             elaArray.push([259,tempCommodity,attribute,this.yearFormat(ind),todayDate, array[i][ind], '',''])
           }
           
           
         }
       }
     }
     return elaArray;
   }
   this.yearFormat = function(str) {
     return str.slice(0, 5) + str.slice(7)
   }
   this.fetchUsdaFromApi=function(dataFromUsdaApi,userToken) {     
     var options={
         'method' : 'post',
         'contentType': 'application/json', 
         'Api_key':Config.USDAApiKey,
         'payload' : JSON.stringify(this.apiReqData)
       };

       var resp= UrlFetchApp.fetch( Config.USDAFetchAPI, options );
       Logger.log(resp.getContentText());
       return resp.getContentText();
   }
}
