var CsvUtility=new function(){  
  //---------------------------------------------------------
  /**
  * upload CSV Data  to  FIREBASE function     
  * @param  {string} auth token     
  * @param  {string} user uid on firebase
  * @param  {ARRAY} csvData
  */
  //---------------------------------------------------------
  this.elaborateData=function(userToken,values) {
    
    //RETRIVE ALL DATA NEEDED FROM FIREBASE 
    
    var batchRowArrayNode = 'config/batchRowArray';
    var batchRowColumnNode = 'config/batchRowColumn';
    
    var region_codelistNode = 'config/region_codelist';
    var product_codelistNode = 'config/product_codelist';
    
    //TODO _ automatic incrementer by the end of the year
    var batchKindOfFrcNode = 'config/batchKindOfFrc';
    var batchFrcFlagsColumnNode = 'config/batchFrcFlagsColumn';
    var batchFrcNotesColumnNode = 'config/batchFrcNotesColumn';
    var batchLastDateRowNode = 'config/batchLastDateRow';
    var batchCSVMappingNode= 'config/CSVMappingOrderFields';
    var sliderFrcNode = 'config/sliderFrc';
    var etlConfigNode = 'config/ETLConfig';
    //var userDataConfigNode ='users_data/'+uid;
    
    //last update row
    var batchLastUpdateRowNode= 'config/batchLastUpdateRow';
    //last update column
    var batchLastUpdateColumnNode= 'config/batchLastUpdateColumn';
    
    var batchRowArray=FirebaseConnector.getFireBaseDataParsed(batchRowArrayNode, userToken);
    var batchRowColumn=FirebaseConnector.getFireBaseDataParsed(batchRowColumnNode, userToken);    
    var region_codelist=FirebaseConnector.getFireBaseDataParsed(region_codelistNode, userToken);
    var product_codelist=FirebaseConnector.getFireBaseDataParsed(product_codelistNode, userToken);
    var sliderFrc=FirebaseConnector.getFireBaseDataParsed(sliderFrcNode, userToken);
    var etlConfig=FirebaseConnector.getFireBaseDataParsed(etlConfigNode, userToken);
    
    
    var batchLastUpdateRow=FirebaseConnector.getFireBaseDataParsed(batchLastUpdateRowNode, userToken);
    var batchLastUpdateColumn=FirebaseConnector.getFireBaseDataParsed(batchLastUpdateColumnNode, userToken);

    var dataNode,dataValues;
        
    
    var batchCSVMapping = FirebaseConnector.getFireBaseDataParsed(batchCSVMappingNode, userToken);

    
    var batchKindOfFrc=FirebaseConnector.getFireBaseDataParsed(batchKindOfFrcNode, userToken);
    var batchFrcFlagsColumn=FirebaseConnector.getFireBaseDataParsed(batchFrcFlagsColumnNode, userToken);
    var batchFrcNotesColumn=FirebaseConnector.getFireBaseDataParsed(batchFrcNotesColumnNode, userToken);
    var batchLastDateRow = FirebaseConnector.getFireBaseDataParsed(batchLastDateRowNode, userToken);
    
    //important to understand if the system has to switch frc columns    
    var isFrcA_AlreadySwitched=false;
    var isFrcB_AlreadySwitched=false;
    
    //important to understand if the system has to switch frc columns    
    var productsFrcA_AlreadySwitched=[];
    var productsFrcB_AlreadySwitched=[];
    
    var lenght = values.length;    

    for(var i=1; i<lenght;i++){
      
		//set the DATA NODE where upload data
		//fetch the correct DATA based on region_code
		if(i==1){
		dataNode= DatabaseUtility.fetchDataNodeByCountry(userToken,values[i][batchCSVMapping.region_code], region_codelist);
		dataValues= DatabaseUtility.fetchDataByCountry(userToken,values[i][batchCSVMapping.region_code], region_codelist);
		}

		var product_name = DatabaseUtility.getProductLabelFromCode(product_codelist,values[i][batchCSVMapping.product_code]);

		var elementSpreadSheetRow =  DatabaseUtility.getElementSpreadSheetRowFromElementCode(batchRowArray,values[i][batchCSVMapping.element_code], product_name);
      if(values[i][batchCSVMapping.element_code]==36){
        //Logger.log(product_name);
        //Logger.log(elementSpreadSheetRow);
       // Logger.log(values[i][batchCSVMapping.value]);
      }
		var elementSpreadSheetColumnFromYear = DatabaseUtility.getElementSpreadSheetColumnFromYear(batchRowColumn,values[i][batchCSVMapping.season], product_name)  

		var realElementSpreadSheetRow = elementSpreadSheetRow - 1 ;      
		var realElementSpreadSheetColumnFromYear = Utility.letterToColumn(elementSpreadSheetColumnFromYear) -1 ;

		var value = values[i][batchCSVMapping.value];
		// Adding  "forecasting_methodology" and "notes"
		var forecasting_methodology = values[i][batchCSVMapping.forecasting_methodology];
        
		var notes = values[i][batchCSVMapping.notes];
		//end

		var date = values[i][batchCSVMapping.date];

		if(realElementSpreadSheetRow < 0 || isNaN(realElementSpreadSheetRow)){
		continue;
		}
		else{
          //if is a frc A and if is not already switched for that product 
		if(values[i][batchCSVMapping.season].indexOf(batchKindOfFrc.A) > -1){
          if( productsFrcA_AlreadySwitched.indexOf(product_name)  == -1){
            //dataValues[product_name]= DatabaseUtility.switchFrc(dataValues[product_name],sliderFrc.sliderFrcA.from,sliderFrc.sliderFrcA.to);
            dataValues[product_name]= DatabaseUtility.copyFrc(dataValues[product_name],sliderFrc.sliderFrcA.from,sliderFrc.sliderFrcA.to);
            Logger.log({'Copied=': product_name, 'List': productsFrcA_AlreadySwitched});
            //Logger.log(dataValues[product_name][Utility.letterToColumn(sliderFrc.sliderFrcA.from)]);
				productsFrcA_AlreadySwitched.push(product_name);
              //Logger.log(DatabaseUtility.checkIfColumnIsEmpty(batchRowArray[product_name],dataValues[product_name],Utility.letterToColumn(sliderFrc.sliderFrcA.from)));
//              if(!DatabaseUtility.checkIfColumnIsEmpty(batchRowArray[product_name],dataValues[product_name],Utility.letterToColumn(sliderFrc.sliderFrcA.from))){
//                //Logger.log(values[i][batchCSVMapping.value]);
//                //dataValues[product_name]= DatabaseUtility.switchFrc(dataValues[product_name],sliderFrc.sliderFrcA.from,sliderFrc.sliderFrcA.to);
//                dataValues[product_name]= DatabaseUtility.copyFrc(dataValues[product_name],sliderFrc.sliderFrcA.from,sliderFrc.sliderFrcA.to);
//              }
//            else{
//                //dataValues[product_name]= DatabaseUtility.copyFrc(dataValues[product_name],sliderFrc.sliderFrcA.from,sliderFrc.sliderFrcA.to);
//               
//          
//              }				
          }
          dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][Utility.letterToColumn(sliderFrc.sliderFrcA.from)-1]=values[i][batchCSVMapping.value];
         

          //dataValues[product_name]= DatabaseUtility.copyFrc(dataValues[product_name],sliderFrc.sliderFrcA.from,sliderFrc.sliderFrcA.to);
           //dataValues[product_name]= DatabaseUtility.switchFrc(dataValues[product_name],sliderFrc.sliderFrcA.from,sliderFrc.sliderFrcA.to);

           Logger.log({'asheet':product_name,
                      'brow': realElementSpreadSheetRow,
                      'ccol':sliderFrc.sliderFrcA.from + Utility.letterToColumn(sliderFrc.sliderFrcA.from), 
                      'eExVal': values[i][batchCSVMapping.value],
                      'fRVal':dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][Utility.letterToColumn(sliderFrc.sliderFrcA.from)-1],
                       'gLastRVal':dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][Utility.letterToColumn(sliderFrc.sliderFrcA.to)-1]
                      });
          
          dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][Utility.letterToColumn(etlConfig[product_name]['flagColumnA'])-1]=forecasting_methodology.trim();
          dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][Utility.letterToColumn(etlConfig[product_name]['noteColumnA'])-1]=notes.trim(); 
          
		  //Logger.log(batchKindOfFrc.A+' '+realElementSpreadSheetRow+' flagColumnA='+etlConfig[product_name]['flagColumnA']);
		}

		//if is a frc A and if is not already switched for that product 
//		if(values[i][batchCSVMapping.season].indexOf(batchKindOfFrc.A) > -1){
//          
//			if(productsFrcA_AlreadySwitched.indexOf(product_name)  == -1 ){
//				productsFrcA_AlreadySwitched.push(product_name);
//              if(!DatabaseUtility.checkIfColumnIsEmpty(batchRowArray[product_name],dataValues[product_name],Utility.letterToColumn(sliderFrc.sliderFrcA.from))){
//                dataValues[product_name]= DatabaseUtility.switchFrc(dataValues[product_name],sliderFrc.sliderFrcA.from,sliderFrc.sliderFrcA.to);
//              }else{
//                //dataValues[product_name]= DatabaseUtility.copyFrc(dataValues[product_name],sliderFrc.sliderFrcA.from,sliderFrc.sliderFrcA.to);
//              }				
//			}
//          dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][Utility.letterToColumn(etlConfig[product_name]['flagColumnA'])-1]=forecasting_methodology;
//          dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][Utility.letterToColumn(etlConfig[product_name]['noteColumnA'])-1]=notes; 
//          
//		  //Logger.log(batchKindOfFrc.A+' '+realElementSpreadSheetRow+' flagColumnA='+etlConfig[product_name]['flagColumnA']);
//		}
        if(values[i][batchCSVMapping.season].indexOf(batchKindOfFrc.B) > -1 ){          
		  if( (productsFrcB_AlreadySwitched.indexOf(product_name)  == -1)){
             dataValues[product_name]= DatabaseUtility.copyFrc(dataValues[product_name],sliderFrc.sliderFrcB.from,sliderFrc.sliderFrcB.to);
		    productsFrcB_AlreadySwitched.push(product_name);
//            if(!DatabaseUtility.checkIfColumnIsEmpty(batchRowArray[product_name],dataValues[product_name],Utility.letterToColumn(sliderFrc.sliderFrcB.from))){
//              //dataValues[product_name]= DatabaseUtility.switchFrc(dataValues[product_name],sliderFrc.sliderFrcB.from,sliderFrc.sliderFrcB.to, values[i][batchCSVMapping.value]);            
//             
//            }else{
//              //dataValues[product_name]= DatabaseUtility.copyFrc(dataValues[product_name],sliderFrc.sliderFrcB.from,sliderFrc.sliderFrcB.to);
//              
//              
//            }		    
		  }
           dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][Utility.letterToColumn(sliderFrc.sliderFrcB.from)-1]=values[i][batchCSVMapping.value];
          
		  dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][Utility.letterToColumn(etlConfig[product_name]['flagColumnB'])-1]=forecasting_methodology.trim();
          dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][Utility.letterToColumn(etlConfig[product_name]['noteColumnB'])-1]=notes.trim(); 
          //Logger.log(batchKindOfFrc.B+' '+realElementSpreadSheetRow+' flagColumnB='+etlConfig[product_name]['flagColumnB']);
		}
		//if is a frc B and if is not already switched for that product 
//		if(values[i][batchCSVMapping.season].indexOf(batchKindOfFrc.B) > -1 ){          
//		  if(productsFrcB_AlreadySwitched.indexOf(product_name)  == -1){
//		    productsFrcB_AlreadySwitched.push(product_name);
//            if(!DatabaseUtility.checkIfColumnIsEmpty(batchRowArray[product_name],dataValues[product_name],Utility.letterToColumn(sliderFrc.sliderFrcB.from))){
//              dataValues[product_name]= DatabaseUtility.switchFrc(dataValues[product_name],sliderFrc.sliderFrcB.from,sliderFrc.sliderFrcB.to);            
//            }else{
//              //dataValues[product_name]= DatabaseUtility.copyFrc(dataValues[product_name],sliderFrc.sliderFrcB.from,sliderFrc.sliderFrcB.to);            
//            }		    
//		  }
//		  dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][Utility.letterToColumn(etlConfig[product_name]['flagColumnB'])-1]=forecasting_methodology;
//          dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][Utility.letterToColumn(etlConfig[product_name]['noteColumnB'])-1]=notes; 
//          //Logger.log(batchKindOfFrc.B+' '+realElementSpreadSheetRow+' flagColumnB='+etlConfig[product_name]['flagColumnB']);
//		}
        //Logger.log(etlConfig[product_name]['flagColumnA']);
		//update value
		dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realElementSpreadSheetColumnFromYear).toString()]=value;
		// update forcasting_methodology and notes
        
          if(values[i][batchCSVMapping.element_code]==36){
        Logger.log(product_name);
        Logger.log(parseInt(realElementSpreadSheetColumnFromYear).toString())
        Logger.log(parseInt(realElementSpreadSheetRow).toString())
        Logger.log(dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realElementSpreadSheetColumnFromYear).toString()]);
        Logger.log(value);
      }
          
                
		//update last date
		dataValues[product_name][parseInt(batchLastDateRow[product_name]-1).toString()][parseInt(realElementSpreadSheetColumnFromYear).toString()]=date;

		var lastUpdateInFirebase  = new Date(dataValues[product_name][batchLastUpdateRow[product_name]][batchLastUpdateColumn[product_name]]);
		var lastUpdateFromCsv = date;

		//update the last update date on the spreadsheet
		if(new Date(lastUpdateFromCsv) > lastUpdateInFirebase ){
		  //update last date update
		  //dataValues[product_name][batchLastUpdateRow[product_name]][batchLastUpdateColumn[product_name]]=new Date(lastUpdateFromCsv);          
		  //dataValues[product_name][batchLastUpdateRow[product_name]][batchLastUpdateColumn[product_name]]=moment(lastUpdateFromCsv).format('DD-MM-YYYY');          
		  dataValues[product_name][batchLastUpdateRow[product_name]][batchLastUpdateColumn[product_name]]=moment(new Date(lastUpdateFromCsv).toISOString()).utc();
		}        

		//update FRC NOTES AND FLAGS
		//if(date.indexOf(batchKindOfFrc.A) > -1){
		//var realFrcFlagColumn = Utility.letterToColumn(batchFrcFlagsColumn.A) -1 ;
		//var realFrcNotesColumn = Utility.letterToColumn(batchFrcNotesColumn.A) -1 ;


		// dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realFrcFlagColumn).toString()]=flag;
		//dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realFrcNotesColumn).toString()]=notes;

		//}else if(fakeDate.indexOf(batchKindOfFrc.B) > -1){
		//var realFrcFlagColumn = Utility.letterToColumn(batchFrcFlagsColumn.B) -1 ;
		//var realFrcNotesColumn = Utility.letterToColumn(batchFrcNotesColumn.B) -1 ;


		//dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realFrcFlagColumn).toString()]=flag;
		//dataValues[product_name][parseInt(realElementSpreadSheetRow).toString()][parseInt(realFrcNotesColumn).toString()]=notes;
		//}

		}      
    } 
    
    //before write I'll check if some frc column it's empty... If empty force switch
    //for(var commodityLooped in batchRowArray)   {                  
      //if(DatabaseUtility.checkIfColumnIsEmpty(batchRowArray[commodityLooped],dataValues[commodityLooped],Utility.letterToColumn(sliderFrc.sliderFrcA.to))){
        //Logger.log('column empty A');
       // dataValues[commodityLooped]= DatabaseUtility.switchFrc(dataValues[commodityLooped],sliderFrc.sliderFrcA.from,sliderFrc.sliderFrcA.to);
     // }else{
        //Logger.log('column NOT empty A');
     // }      
     //  if(DatabaseUtility.checkIfColumnIsEmpty(batchRowArray[commodityLooped],dataValues[commodityLooped],Utility.letterToColumn(sliderFrc.sliderFrcB.to))){
        //Logger.log('column empty B');
     //   dataValues[commodityLooped]= DatabaseUtility.switchFrc(dataValues[commodityLooped],sliderFrc.sliderFrcB.from,sliderFrc.sliderFrcB.to);         
    //  }else{
        //Logger.log('column NOT empty B');
   //   }     
   // }
    FirebaseConnector.writeOnFirebase(dataValues,dataNode,userToken);
    
  }
  //---------------------------------------------------------
  // END Fetch Sheet Data from FIREBASE function
  //--------------------------------------------------------- 
}
