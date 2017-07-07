// data: { content: string }
function Question(data) {
  mobx.extendObservable(this, data)
}

// data: { questions: Qestion[] }
function Intent(data) {
  mobx.extendObservable(this, data)
}

// data: { intents: Intent[] }
function IntentList(data) {
  mobx.extendObservable(this, data)
}

var intent1Questions = ["i1q1", "i2q2"].map(function (content) {
  return new Question({ content: content })
})

var intent2Questions = ["i2q1"].map(function (content) {
  return new Question({ content: content })
})

var intent1 = new Intent({
  questions: intent1Questions
})

var intent2 = new Intent({
  questions: intent2Questions
})

var intentList = new IntentList({ intents: [intent1, intent2] })

function renderQuestion(question) {
  return $('<div>').text(question.content)
}

function renderQuestionList(questions) {
  return questions.map(function (question) {
    return renderQuestion(question)
  })
}

function clickAddQuestionFn(intentIndex) {
  var content = $('.question-list').eq(intentIndex).find('.question-content').val()
  intentList.intents[intentIndex].questions.push(new Question({ content: content }))
}

function clickAddIntentFn() {
  intentList.intents.push(new Intent({ questions: [] })) 
}

function renderIntent(intent, index) {
  return $("<div>").addClass('question-list').data('index', index)
    .append(renderQuestionList(intent.questions))
    .append($('<input>').attr("type", "text").addClass("question-content"))
    .append($("<button>").addClass('add-question-btn').text("add question"))
    .append($("<div>").text("-----------"))
}

function renderIntentList(intentList) {
  return intentList.intents.map(function (intent, index) {
    return renderIntent(intent, index)
  })
}

function render(intentList) {
  $("#intent-list").html(renderIntentList(intentList))
}

mobx.reaction(function () { return intentList.intents.length }, function (change) {
  render(intentList)
}, true)

mobx.reaction(function () {
  return intentList.intents.map(function (intent) { return intent.questions.length })
}, function () {
  render(intentList)
}, true)

$('#intent-list').on('click', '.add-question-btn', function (e) {
  clickAddQuestionFn($(e.target).closest('.question-list').data('index'))
})

$('.add-intent-btn').on('click', clickAddIntentFn)