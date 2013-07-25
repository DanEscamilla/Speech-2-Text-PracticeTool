// var recognition = null;
var instOM = null;
var wordsArray = [];
window.onload = function(){
	console.log("win load")
	instOM = new objectManager().init();
};

//obj handles all the processing
function objectManager(){
	this.objectArray = [];
	// this.timer = null;
	var recognition = null;
	this.intervalID = null;
	this.currWordInd = 0;
	this.currAttemps = 3;
}
//initialize resources
objectManager.prototype.init = function(){
	recognitionInit();
	wordsIni(["hola","adios","carro","estrella","platano","pera"],["hello","goodbye","car","star","banana","pear"],[1,2]);
	console.log(wordsArray)
	$("#currWord").contents().last()[0].textContent = wordsArray[0].targetL;
	// this.timer = new gameTimer()
	// this.objectArray.push(this.timer);
	this.intervalID = window.setInterval(function(){instOM.step()},1000/60);
	return this;
}
//gameLoop
objectManager.prototype.step = function(){
	for (var x=0; x<this.objectArray.length ; x++){
		if (this.objectArray[x].update)
			this.objectArray[x].update();
	}
}


//Recognition Init
function recognitionInit(){

	recognition = new webkitSpeechRecognition();
  	recognition.continuous = true;
 	// recognition.interimResults = true;
 	recognition.lang = "en-US";
 	recognitionBegan = false
 	// var final_span = document.getElementById("final_span");
 	// var interim_span = document.getElementById("interim_span");
 	
 	document.getElementById("beginButton").onclick = function(){
 		if (recognitionBegan == false){
 			recognition.start();
 			recognitionBegan = true;
 		} 
 		if (instOM != null){
 			instOM.currWordInd = 0;
			$("#currWord").contents().last()[0].textContent = wordsArray[0].targetL;
 		}
 	}

	recognition.onresult = function(event) {
		// var interim_transcript = '';
		var final_transcript = '';

		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				final_transcript += event.results[i][0].transcript;
			}
		}
		final_transcript = final_transcript;
		// final_span.innerHTML = final_transcript;
		// interim_span.innerHTML = interim_transcript;
		compareWords(final_transcript)
		// console.log(recognition.confidence);
	};
	recognition.onend = function(){
		alert("service ended");
		recognitionBegan = false;
	}
	recognition.onspeechstart = function(){
		console.log("speechStart")
		$("#currWord").find("i").addClass("icon-spinner icon-spin icon-medium")
	}
	recognition.onspeechend = function(){
		console.log("speechEnd")
		$("#currWord").find("i").removeClass("icon-spinner icon-spin icon-medium")	
	}
	// recognition.onaudiostart = function(){
	// 	console.log("audio start")
 // 		// instOM.timer.init(15);		
	// }
}
function compareWords(result){
	result = result.trim();
	if (wordsArray[instOM.currWordInd].targetL)
		if (result.toLowerCase() == wordsArray[instOM.currWordInd].targetL.toLowerCase()){
			guessRight(result);
		} else if (result != ""){
			guessWrong(result);
		}
}

function guessRight(result){
    console.log(result.toLowerCase(),wordsArray[instOM.currWordInd].targetL.toLowerCase())
	nextWord();
}
function guessWrong(result){
    console.log(result.toLowerCase(),wordsArray[instOM.currWordInd].targetL.toLowerCase())
	console.log("attepts left:",instOM.currAttemps)
	instOM.currAttemps -= 1;
	if (instOM.currAttemps > 0){
		$(".icon-heart").first().remove()
	} else {
		nextWord();
	}
}
function nextWord(){
	instOM.currWordInd++;
	instOM.currAttemps = 3;
	$("#attemptsDiv").html('Attempts:<i class="icon-heart"></i> <i class="icon-heart"></i> <i class="icon-heart"></i> ');
	if (wordsArray[instOM.currWordInd]){
		$("#currWord").contents().last()[0].textContent = wordsArray[instOM.currWordInd].targetL;
	} else {
		$("#currWord").contents().last()[0].textContent = "ALL WORDS ARE DONE!";

	}
}

function word(nativeL,targetL,points){
	this.nativeL = nativeL;
	this.targetL = targetL;
	// this.points = (points<18) ? points : 18;
}
word.prototype.audioIni = function(){
	//code fo call for audio;
	this.audio = new Audio("http://www.ispeech.org/p/generic/getaudio?text="+this.targetL+"&voice=usenglishfemale&speed=0&action=convert");		
}

//
function wordsIni(arr,arr2,arr3){
	for(var x=0;x<arr.length;x++){
		wordsArray.push(new word(arr[x],arr2[x],arr3[x]));
	}
}
//Timer class
// function gameTimer(){
// 	this.currentDate = 0;
// 	this.initialDate = null;
// 	this.timerAmount = 10000;
// }
// gameTimer.prototype.update = function(){
// 	this.currentDate = new Date().getTime();
// 	var secondsLeft = ((this.initialDate+this.timerAmount-this.currentDate)/1000);
// 	if (secondsLeft <0){
// 		secondsLeft = 0;
// 	}
// 	$(this.ele).text(secondsLeft.toFixed(2));
// 	// $(this.DOM).text(+"");
// }
// gameTimer.prototype.init = function(amount){
// 	this.timerAmount = amount*1000;
// 	this.initialDate = new Date().getTime();
// 	// this.DOM = document.createElement('div');
// 	this.ele = $("#timerDiv");
// 	return this;
// }