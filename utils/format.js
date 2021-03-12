;
(function ($) {
  'use strict'

  function blank(str) {
    str = str || ''
    return str.split('##')
  }

  function blanklength(str) {
    return str.replace('blank', '')
  }

  function isBlank(str) {
    return str.indexOf('blank') != -1
  }

  function instead(str) {
    while (str.indexOf('##break##') != -1) {
      str = str.replace('##break##', '\n')
    }
    str = str.replace('【点评】', '\n【点评】')
    str = str.replace('【分析】', '\n【分析】')
    return str
  }

  function format(topics) {
    topics.forEach(element => {
      var i = 1
      var titleArr = blank(element.title)
      var titleArr2 = []
      var blankNum = 0
      var myAnswerTemp = []
      titleArr.forEach(item => {              
        if(item.indexOf('blank') != -1){
          var item2 ={
            blank:1,
            index:i,
            text:''
          }
          i+=1
          blankNum+=1
          myAnswerTemp.push('')
        }else if(item == 'break'){
          var item2 ={
            blank:0,
            text:'break'
          }
        }else{
          var item2 ={
            blank:0,
            text:item
          }
        }
        titleArr2.push(item2)
      });
      element.blankNum = blankNum
      element.titleArr = titleArr2

      var optionForPick = []
      
      
      var option= element.option

      option.forEach(item => {              
          var item2 ={
            hasPick:0,
            text:item
          }
          optionForPick.push(item2)
      });
      element.optionForPick = optionForPick
      element.myAnswerTemp=myAnswerTemp
      
    });
    return topics
  }

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return format
    })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = format
  } else {
    $.format = format
  }
})(this)