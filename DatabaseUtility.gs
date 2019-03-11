var DatabaseUtility=new function(){
  
   //retrive the dataNode for a specific country
   this.fetchDataNodeByCountry=function(userToken,regionCode,region_codelist) {     
     
     var absoluteDataSheetPathNode = 'config/absoluteDataSheetPath';     
     var absoluteDataSheetPath=FirebaseConnector.getFireBaseDataParsed(absoluteDataSheetPathNode, userToken);          
     var countryDataNode = region_codelist[parseInt(regionCode).toString()].toLowerCase() +'Data';     
     return absoluteDataSheetPath+'/'+countryDataNode;
   }
  
   //retrive the dataSet for a specific country
   this.fetchDataByCountry=function(userToken,regionCode,region_codelist) {     
     
     var absoluteDataSheetPathNode = 'config/absoluteDataSheetPath';     
     var absoluteDataSheetPath=FirebaseConnector.getFireBaseDataParsed(absoluteDataSheetPathNode, userToken);          
     
     var countryDataNode = region_codelist[parseInt(regionCode).toString()].toLowerCase() +'Data';
     
     return FirebaseConnector.getFireBaseDataParsed(absoluteDataSheetPath+'/'+countryDataNode, userToken);
     
   }
   
   //retrive the product label by product_code (eg. 1 = 'Wheat') and it lowercase it
   this.getProductLabelFromCode= function(product_codelist,product_code){
     //Logger.log(product_codelist);
     //Logger.log(product_code);
     return product_codelist[parseInt(product_code).toString()].toLowerCase();
   }
   
   //retrive the element SPREADSHEET ROW by element_code (eg. 1 = 'Wheat') and it lowercase it
   this.getElementSpreadSheetRowFromElementCode= function(batchRowArray,element_code, product_name){
     return batchRowArray[product_name.toLowerCase()][parseInt(element_code).toString()];
   }
   
   //retrive the element SPREADSHEET ROW by element_code (eg. 1 = 'Wheat') and it lowercase it
   this.getElementSpreadSheetColumnFromYear= function(batchRowColumn,year, product_name){
     
     //IT PARSE VALUESE LIKE 2016/17 into 2016.0     
     return batchRowColumn[product_name.toLowerCase()][parseInt(year).toString()];
   }
   
   //it simulated the ADD NEW FORECAST
   this.switchFrc=function (dataValuesForProduct,sliderFrcColumnFrom,sliderFrcColumnTo){
     //Logger.log(sliderFrcColumnFrom);
     //Logger.log(sliderFrcColumnTo);
     sliderFrcColumnFrom= Utility.letterToColumn(sliderFrcColumnFrom)-1;
     sliderFrcColumnTo= Utility.letterToColumn(sliderFrcColumnTo)-1;
     //Logger.log(sliderFrcColumnFrom);
     //Logger.log(sliderFrcColumnTo);
     var length = dataValuesForProduct.length;
     for(var i=0;i<length;i++){
       //Logger.log(dataValuesForProduct[i][sliderFrcColumnTo]);
       dataValuesForProduct[i][sliderFrcColumnTo]=dataValuesForProduct[i][sliderFrcColumnFrom];
       dataValuesForProduct[i][sliderFrcColumnFrom]='';
     }     
     return dataValuesForProduct;
   }
   //copy forecast
   this.copyFrc=function (dataValuesForProduct,sliderFrcColumnFrom,sliderFrcColumnTo){     
     sliderFrcColumnFrom= Utility.letterToColumn(sliderFrcColumnFrom)-1;
     sliderFrcColumnTo= Utility.letterToColumn(sliderFrcColumnTo)-1;
     //Logger.log(sliderFrcColumnFrom);
     //Logger.log(sliderFrcColumnTo);
     var length = dataValuesForProduct.length;
     for(var i=0;i<length;i++){
       //Logger.log({'col': sliderFrcColumnTo, 'arr':dataValuesForProduct[i]});
       //Logger.log(dataValuesForProduct[i][sliderFrcColumnTo]);
       dataValuesForProduct[i][sliderFrcColumnTo]=dataValuesForProduct[i][sliderFrcColumnFrom];  
       dataValuesForProduct[i][sliderFrcColumnFrom] = '';
       
     }     
     return dataValuesForProduct;
   }
   this.checkIfColumnIsEmpty= function(batchRowArrayForSpecificCommodity, valuesForSpecifiCommodity, yearColumnNumber){
     
     for(var i=0;i<batchRowArrayForSpecificCommodity.length;i++){
       if(batchRowArrayForSpecificCommodity[i]){
         if(valuesForSpecifiCommodity[batchRowArrayForSpecificCommodity[i]-1][yearColumnNumber-1]){           
           //Logger.log('column not empty');
           return false;
         }
       }
     }
     return true;
   }
}