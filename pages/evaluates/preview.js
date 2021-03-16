// pages/evaluates/preview.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eval: {
      created_at: '2020-11-11 12:33',
      subject: '英语',
      textbook: "三年级上册",
      evalType: '单元测评', //期中/单元
      evalRange: 2,
      units: ["第一单元", "第二单元第二单元第二单元第二单元", "第二单元第二单元第二单元第二单元", "第二单元第二单元第二单元第二单元", "第二单元第二单元第二单元第二单元", "第二单元第二单元第二单元第二单元"],
      class: {
        id: 1,
          name: "一年级一班",
          studentCount: 30,
          grade: "三年级"
      },
      evalPurpose: '推广',
      finishCount: 11,
      openCount: 511,
      userCount: 111,
      topicsCount: 20,
    },
    topics: [{
      "subs": null,
      "questionImage": "",
      "title": "<p>橡皮</p>",
      "abilities": null,
      "optionType": 1,
      "checkStatus": 1,
      "judgeType": 0,
      "id": 31766,
      "parsingVideo": "",
      "serialNumber": null,
      "knowledgeIds": null,
      "audioFileUrl": "",
      "sort": 0,
      "myAnswer": null,
      "analysis": "<p>【分析】根据所给的汉语，橡皮 eraser，A书包，C桌子，故选 B</p>\n<p>【点评】本题考查了汉译英，注意平时牢记单词拼写</p>",
      "mainType": 0,
      "mainTypeShow": "",
      "isFav": 0,
      "parentId": null,
      "optionImages": [],
      "difficulty": 2,
      "questionTypeName": "单选题",
      "answer": ["1"],
      "mainTitle": "",
      "showAnswer": "B",
      "questionType": 1,
      "knowledges": [{
        "abilityIds": null,
        "id": 244,
        "title": "汉译英",
        "parentId": 242
      }],
      "isCorrect": null,
      "option": ["<p><span class=\"op-item-nut\">A .</span><span class=\"op-item-meat\">bag</span></p>", "<p><span class=\"op-item-nut\">B .</span><span class=\"op-item-meat\">eraser</span></p>", "<p><span class=\"op-item-nut\">C .</span><span class=\"op-item-meat\">desk</span></p>"]
    }, {
      "subs": null,
      "questionImage": "https://fxb2api.uelink.com.cn/upload/questionImage/20200921/202009211603596672.png",
      "title": "<p>根据图片内容补全下列单词中所缺的字母。</p>\n<p>cr（&nbsp; &nbsp; &nbsp; &nbsp;）yon</p>",
      "abilities": null,
      "optionType": 1,
      "checkStatus": 1,
      "judgeType": 0,
      "id": 44385,
      "parsingVideo": "",
      "serialNumber": null,
      "knowledgeIds": null,
      "audioFileUrl": "",
      "sort": 0,
      "myAnswer": null,
      "analysis": "<p>【分析】图片是蜡笔，蜡笔crayon。故答案为A. a</p>",
      "mainType": 0,
      "mainTypeShow": "",
      "isFav": 0,
      "parentId": null,
      "optionImages": [],
      "difficulty": 2,
      "questionTypeName": "单选题",
      "answer": ["0"],
      "mainTitle": "",
      "showAnswer": "A",
      "questionType": 1,
      "knowledges": [{
        "abilityIds": null,
        "id": 31,
        "title": "单词拼写",
        "parentId": 30
      }],
      "isCorrect": null,
      "option": ["<p>A.a</p>", "<p>B.c</p>", "<p>D.r</p>"]
    }, {
      "subs": null,
      "questionImage": "",
      "title": "<p>&mdash;I want to see the film. It's interesting.</p>\n<p>&mdash;________ I am hungry now. I want to eat first.</p>",
      "abilities": null,
      "optionType": 1,
      "checkStatus": 1,
      "judgeType": 0,
      "id": 57921,
      "parsingVideo": "",
      "serialNumber": null,
      "knowledgeIds": null,
      "audioFileUrl": "",
      "sort": 0,
      "myAnswer": null,
      "analysis": "<p>【分析】句意：&mdash;&mdash;我想去看那部电影。它很有趣。&mdash;&mdash;但是现在我饿了。我想先吃饭。A并且，B因此，C但是。两个句子之间是转折关系，用but表示转折，故选C。<br />【点评】考查连词辨析。</p>",
      "mainType": 0,
      "mainTypeShow": "",
      "isFav": 0,
      "parentId": null,
      "optionImages": [],
      "difficulty": 1,
      "questionTypeName": "单选题",
      "answer": ["2"],
      "mainTitle": "",
      "showAnswer": "C",
      "questionType": 1,
      "knowledges": [{
        "abilityIds": null,
        "id": 115,
        "title": "连词辨析",
        "parentId": 112
      }],
      "isCorrect": null,
      "option": ["<p>A. And</p>", "<p>B.&nbsp;So</p>", "<p>C. But</p>"]
    }, {
      "subs": null,
      "questionImage": "",
      "title": "Let's play!",
      "abilities": null,
      "optionType": 1,
      "checkStatus": 1,
      "judgeType": 0,
      "id": 3442,
      "parsingVideo": "",
      "serialNumber": null,
      "knowledgeIds": null,
      "audioFileUrl": null,
      "sort": null,
      "myAnswer": null,
      "analysis": "",
      "mainType": 0,
      "mainTypeShow": "",
      "isFav": 0,
      "parentId": null,
      "optionImages": [],
      "difficulty": 1,
      "questionTypeName": "单选题",
      "answer": ["0"],
      "mainTitle": "",
      "showAnswer": "A",
      "questionType": 1,
      "knowledges": [],
      "isCorrect": null,
      "option": ["A .让我们一起玩吧！", "B .棒极了！"]
    }, {
      "subs": null,
      "questionImage": "",
      "title": "<p>I can see &ldquo;B&rdquo;.&nbsp;</p>",
      "abilities": null,
      "optionType": 1,
      "checkStatus": 1,
      "judgeType": 0,
      "id": 31751,
      "parsingVideo": "",
      "serialNumber": null,
      "knowledgeIds": null,
      "audioFileUrl": "",
      "sort": 0,
      "myAnswer": null,
      "analysis": "<p>【分析】包意：我看见&ldquo;B&ldquo;。选项A 是 B，选项B 是 D，故答案为 A</p>\n<p>【点评】考查園片匹配，理解句意，观家图片。</p>",
      "mainType": 0,
      "mainTypeShow": "",
      "isFav": 0,
      "parentId": null,
      "optionImages": [],
      "difficulty": 2,
      "questionTypeName": "单选题",
      "answer": ["0"],
      "mainTitle": "",
      "showAnswer": "A",
      "questionType": 1,
      "knowledges": [{
        "abilityIds": null,
        "id": 166,
        "title": "看图完成句子",
        "parentId": 149
      }],
      "isCorrect": null,
      "option": ["<p><span class=\"op-item-nut\">A .</span><span class=\"op-item-meat\"><img src=\"https://tikupic.21cnjy.com/33/68/33688011a432427b7ff59c4d72827ba8.jpg\" alt=\"\" width=\"56\" height=\"60\" data-cke-saved-src=\"//tikupic.21cnjy.com/33/68/33688011a432427b7ff59c4d72827ba8.jpg\" /></span></p>", "<p><span class=\"op-item-nut\">B .</span><span class=\"op-item-meat\"><img src=\"https://tikupic.21cnjy.com/b2/fc/b2fc18a60b409192dc39e6e610da7786.jpg\" alt=\"\" width=\"59\" height=\"60\" data-cke-saved-src=\"//tikupic.21cnjy.com/b2/fc/b2fc18a60b409192dc39e6e610da7786.jpg\" /></span></p>"]
    }, {
      "subs": null,
      "questionImage": "",
      "title": "\u2014\u2014Let's play.      \u2014\u2014（）",
      "abilities": null,
      "optionType": 1,
      "checkStatus": 1,
      "judgeType": 0,
      "id": 3418,
      "parsingVideo": "",
      "serialNumber": null,
      "knowledgeIds": null,
      "audioFileUrl": null,
      "sort": null,
      "myAnswer": null,
      "analysis": "",
      "mainType": 0,
      "mainTypeShow": "",
      "isFav": 0,
      "parentId": null,
      "optionImages": [],
      "difficulty": 1,
      "questionTypeName": "单选题",
      "answer": ["2"],
      "mainTitle": "",
      "showAnswer": "C",
      "questionType": 1,
      "knowledges": [],
      "isCorrect": null,
      "option": ["A .Bye!", "B .Hello!", "C .Great!"]
    }, {
      "subs": null,
      "questionImage": "",
      "title": "<p>&mdash;Let's play. OK?</p>\n<p>&mdash;（&nbsp; &nbsp; &nbsp; &nbsp;）</p>",
      "abilities": null,
      "optionType": 1,
      "checkStatus": 1,
      "judgeType": 0,
      "id": 44378,
      "parsingVideo": "",
      "serialNumber": null,
      "knowledgeIds": null,
      "audioFileUrl": "",
      "sort": 0,
      "myAnswer": null,
      "analysis": "<p>【分析】句意: &mdash; 我们玩吧。好吗？ &mdash; ......。A选项意思是: 好极了。 B选项意思是: 再见。这是提建议，A选项回答正确。故答案为: A.</p>\n<p>【点评】这是考查情景交际的题目。要熟练掌握学过的口语。</p>",
      "mainType": 0,
      "mainTypeShow": "",
      "isFav": 0,
      "parentId": null,
      "optionImages": [],
      "difficulty": 2,
      "questionTypeName": "单选题",
      "answer": ["0"],
      "mainTitle": "",
      "showAnswer": "A",
      "questionType": 1,
      "knowledges": [{
        "abilityIds": null,
        "id": 214,
        "title": "情景交际",
        "parentId": 200
      }],
      "isCorrect": null,
      "option": ["<p>A.Great！</p>", "<p>B.Bye.</p>"]
    }, {
      "subs": null,
      "questionImage": "",
      "title": "<p>&mdash; Is there a bookstore near here?</p>\n<p>&mdash; _______</p>",
      "abilities": null,
      "optionType": 1,
      "checkStatus": 1,
      "judgeType": 0,
      "id": 57919,
      "parsingVideo": "",
      "serialNumber": null,
      "knowledgeIds": null,
      "audioFileUrl": "",
      "sort": 0,
      "myAnswer": null,
      "analysis": "<p>【分析】句意：&mdash; 这里附近有家书店吗？&mdash; ......。A选项是：是，有。B选项：不客气。C选项是：看这家书店。根据句意，A选项正确。故答案为：A.</p>\n<p>【点评】这是考查情景交际的题目。要掌握There be句型的句子。</p>",
      "mainType": 0,
      "mainTypeShow": "",
      "isFav": 0,
      "parentId": null,
      "optionImages": [],
      "difficulty": 1,
      "questionTypeName": "单选题",
      "answer": ["0"],
      "mainTitle": "",
      "showAnswer": "A",
      "questionType": 1,
      "knowledges": [{
        "abilityIds": null,
        "id": 187,
        "title": "情景询问",
        "parentId": 168
      }, {
        "abilityIds": null,
        "id": 214,
        "title": "情景交际",
        "parentId": 200
      }],
      "isCorrect": null,
      "option": ["<p>A. Yes, there is.</p>", "<p>B.&nbsp;You're welcome.</p>", "<p>C. Look at the bookstore.</p>"]
    }, {
      "subs": null,
      "questionImage": "",
      "title": "<p>如果你想让别人打开书，你可以说：(&nbsp;&nbsp;&nbsp;&nbsp; )</p>",
      "abilities": null,
      "optionType": 1,
      "checkStatus": 1,
      "judgeType": 0,
      "id": 31756,
      "parsingVideo": "",
      "serialNumber": null,
      "knowledgeIds": null,
      "audioFileUrl": "",
      "sort": 0,
      "myAnswer": null,
      "analysis": "<p>【分析】打开是 open，打开你的书是 Open your book. B 是合上你的书。C 是打招呼，你好的意思。所以答案是A</p>",
      "mainType": 0,
      "mainTypeShow": "",
      "isFav": 0,
      "parentId": null,
      "optionImages": [],
      "difficulty": 2,
      "questionTypeName": "单选题",
      "answer": ["0"],
      "mainTitle": "",
      "showAnswer": "A",
      "questionType": 1,
      "knowledges": [],
      "isCorrect": null,
      "option": ["<p><span class=\"op-item-nut\">A .</span><span class=\"op-item-meat\">Open your book!</span></p>", "<p><span class=\"op-item-nut\">B .</span><span class=\"op-item-meat\">Close your book!</span></p>", "<p><span class=\"op-item-nut\">C .</span><span class=\"op-item-meat\">Hello.</span></p>"]
    }, {
      "subs": null,
      "questionImage": "",
      "title": "表达自己有一本书时，应该说：    （）",
      "abilities": null,
      "optionType": 1,
      "checkStatus": 1,
      "judgeType": 0,
      "id": 3036,
      "parsingVideo": "",
      "serialNumber": null,
      "knowledgeIds": null,
      "audioFileUrl": null,
      "sort": null,
      "myAnswer": null,
      "analysis": "",
      "mainType": 0,
      "mainTypeShow": "",
      "isFav": 0,
      "parentId": null,
      "optionImages": [],
      "difficulty": 1,
      "questionTypeName": "单选题",
      "answer": ["1"],
      "mainTitle": "",
      "showAnswer": "B",
      "questionType": 1,
      "knowledges": [],
      "isCorrect": null,
      "option": ["A .It's a book.", "B .I have a book.", "C.This is a book."]
    }]
  ,

},
onload:function(options){
  wx.hideShareMenu();
},
publish: function (e) {
  wx.navigateTo({
    url: 'share'
  });

},
back:function(e){
  var route = getCurrentPages()
  if(route.length>1){
    wx.navigateBack({
      delta: 1
    });
  }else{
    wx.redirectTo({
      url: 'create'
    });
  }
  
}


})