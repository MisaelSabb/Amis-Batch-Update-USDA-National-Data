var Utility=new (function(){
  
  this.letterToColumn = function(letter)
  {
    var column = 0, length = letter.length;
    for (var i = 0; i < length; i++)
    {
      column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column;
  };
  
  /**
  * includes html files into an html
  * @param  {string} filename
  * @return {string}          the content
  */
  this.include=function(filename) {
    return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
  };
  
   /**
  * workaround that allows you to call any library function if you paste in this one generic wrapper function. Then you can call this from the spreadsheet.
  * For example, if I had a library called MyLib with a function add(x, y) (pretend x is in cell A1 and y is in cell A2) I could call it like this: =LIB_FUNC("MyLib", "add", A1, A2).
  * @param       {string} functionName
  * @constructor
  */
  this.LIB_FUNC=function(functionName) {
    var currFn=this;
    var extraArgs = [];
    var fnArr=functionName.split(".");

    var fnArr_length=fnArr.length;
    for (var i = 0; i<fnArr_length; i++) {
      currFn=currFn[fnArr[i]];

      if(!currFn) throw "No such function: " + fnArr[i];
    }

    if (arguments.length > 1) {
      extraArgs = Array.apply(null, arguments).slice(1);
    }

    return currFn.apply(this, extraArgs);
  };
  
  this.test=function(filename) {
    Browser.msgBox('test');
  };
    
});