// var recognition = null;
var instOM = null;
var wordsArray = [];

window.onload = function(){
	resizeGame();	
	initiateDifficulty("scoreBoard");
	instOM = new objectManager().init();
};





//obj handles all the processing
function objectManager(){
	this.objectArray = [];
	this.difficulty = 3;
	this.timer = null;
	this.recognition = null;
	this.intervalID = null;
	this.currWordInd = 0;
	this.currAttemps = 3;
	this.sndBuzz = null;
	this.gameRunning = false;
}
//initialize resources
objectManager.prototype.init = function(){
	this.recognition = recognitionInit();
	createWords();
	initiateButtons();
	restartGame();
	this.sndBuzz = new Audio("failbuzz.mp3");
	$("#currWord").contents().last()[0].textContent = wordsArray[0].targetL;
	this.timer = new gameTimer()
	this.objectArray.push(this.timer);
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
	// navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
	// navigator.getUserMedia( {audio:true},success,fallback );
	
	recognition = new webkitSpeechRecognition();
  	recognition.continuous = true;
 	recognition.interimResults = true;
 	recognition.lang = "en-US";
 	recognitionBegan = false
 	recognition.maxAlternatives = 20;
 	// var final_span = document.getElementById("final_span");
 	// var interim_span = document.getElementById("interim_span");
 	
 	$(".beginButton").click(function(){
 			document.getElementById("iconMic").className = "icon-microphone-off";
 			if (recognitionBegan == false){
 				recognition.start();
 			} else {
 				recognition.stop();
 			}
 		// if (instOM != null){
 		// 	instOM.currWordInd = 0;
			// $("#currWord").contents().last()[0].textContent = wordsArray[0].targetL;
 		// }
 	});
 	recognition.onerror = function(event){
 		if (event.error == "not-allowed"){
 			alert("Cannot access your microphone. Check your permissions for this site.")
 		} else {
 			console.log("error",event.error);
 		}
 	}
	recognition.onresult = function(event) {
		// var interim_transcript = '';
		var final_transcript = '';
		// for (var i = event.resultIndex; i < event.results.length; ++i) {
		// 	if (event.results[i].isFinal) {
		// 		final_transcript += event.results[i][0].transcript;
		// 	}
		// }
		if (event.results[event.resultIndex].isFinal){
			document.getElementById("currWord").getElementsByTagName("i")[0].className = "";
			for (var x = event.resultIndex; x< event.results.length ; x++){
				for (var y = 0; y < event.results[x].length ; y++){
					if (compareWords(event.results[x][y].transcript)){
						return true;
					}
				}
			}
			guessWrong();
		} else {
			document.getElementById("currWord").getElementsByTagName("i")[0].className = "icon-spinner icon-spin";
		}
		// compareWords(final_transcript)
		// console.log(recognition.confidence);
	};
	recognition.onend = function(){
		restartGame();
		recognitionBegan = false;
		document.getElementById("iconMic").className = "icon-microphone";
		$("#beginButton").find("span").text("Not recording");
		$("#fadeBackground").removeClass("displayNone");
		instOM.timer.end();
		instOM.gameRunning = false;
		document.getElementById("currWord").getElementsByTagName("i")[0].className = "";
	}
	recognition.onstart = function(){
		recognitionBegan = true;
		$("#fadeBackground").addClass("displayNone");
		$("#beginButton").find("span").text("Recording");
		document.getElementById("iconMic").className = "icon-microphone micOn";
		instOM.timer.init(60);
		instOM.gameRunning = true;
	}

	return recognition;
	// recognition.onaudiostart = function(){
	// 	console.log("audio start")
 // 		// instOM.timer.init(15);		
	// }
}












function compareWords(result){
	console.log(result)
	var matches = result.match(/\d+/g);
	var len = matches || [] 
	for (x=0; x<len.length ;x++){
	    matches[x] = toWords(matches[x]);
		result = result.replace(/\d+/,matches[x]);
	}
	result = result.trim();
	result = result.replace(/\s+/g, " ");

	console.log(result)
	if (wordsArray[instOM.currWordInd].targetL)
		if (result.toLowerCase() == wordsArray[instOM.currWordInd].targetL.toLowerCase()){
			guessRight(result);
			return true;
		} else if (result != ""){
			return false;
		}
}

function guessRight(result){
	wordsArray[instOM.currWordInd].addScore();
	$("#textDiv").removeClass("right");
	window.setTimeout(function(){$("#textDiv").addClass("right");},10);
	nextWord();
}

function guessWrong(result){
    // console.log(result.toLowerCase(),wordsArray[instOM.currWordInd].targetL.toLowerCase())
	console.log("attepts left:",instOM.currAttemps)
	instOM.currAttemps -= 1;
	instOM.sndBuzz.play();
	$("#textDiv").removeClass("wrong");
	window.setTimeout(function(){$("#textDiv").addClass("wrong");},10);
	if (instOM.currAttemps > 0){
		$(".icon-heart").first().remove()
	} else {
		nextWord();
	}
}

function nextWord(){
	instOM.currWordInd++;
	instOM.currAttemps = 7-instOM.difficulty;
	$("#attemptsDiv").html('Attempts');
	for (x=0;x<instOM.currAttemps;x++)
		$("#attemptsDiv").append('<i class="icon-heart"></i>');
	if (wordsArray[instOM.currWordInd]){
		// $("#textDiv").html('<td id="currWord"><i></i>undef</td>');
		wordsArray[instOM.currWordInd].audioIni();
		$("#currWord").contents().last()[0].textContent = wordsArray[instOM.currWordInd].targetL;	
	} else {
		gameDone();
	}
}











function word(nativeL,targetL,score){
	this.nativeL = nativeL;
	this.targetL = targetL;
	this.score = 0;
	this.maxScore = 18;
	this.score = (score) ? score : 0;
	this.audio = null;
}
word.prototype.audioIni = function(){
	//code fo call for audio;
	this.audio = new Audio("http://www.ispeech.org/p/generic/getaudio?text="+this.targetL+"&voice=usenglishfemale&speed=0&action=convert");		
}
word.prototype.addScore = function(){
	this.score = (this.score<18-instOM.difficulty) ? this.score+instOM.difficulty : 18;
	console.log("score",this.score)
}
word.prototype.playAudio = function(){
	if (this.timeoutID){
		window.clearTimeout(this.timeoutID);
	}
	this.audio.load();
    // this.audio.currentTime = 0;	
	this.audio.play();
	this.timeoutID = this.stopAudio();
}
word.prototype.stopAudio = function(){
	var e = this
	return window.setTimeout(function(){
		e.audio.pause();
		// e.timeoutID = null;
		// e.audio.currentTime = 0;
	},1200);	
}
//
function wordsIni(arr,arr2,arr3){
	for(var x=0;x<arr.length;x++){
		wordsArray.push(new word(arr[x],arr2[x],arr3[x]));
	}
}










// Timer class
function gameTimer(){
	this.currentDate = 0;
	this.initialDate = null;
	this.timerAmount = 10000;
	this.done = true;
}
gameTimer.prototype.update = function(){
	if (this.done == true)
		return 0;
	this.currentDate = new Date().getTime();
	var secondsLeft = ((this.initialDate+this.timerAmount-this.currentDate)/1000);
	if (secondsLeft <0){
		secondsLeft = 0;
	}
	$(this.ele).text(secondsLeft.toFixed(0));
	// $(this.DOM).text(+"");
}
gameTimer.prototype.end = function(){
	this.initialDate = 0;
	this.done = true;
}
gameTimer.prototype.init = function(amount){
	this.timerAmount = amount*1000;
	this.initialDate = new Date().getTime();
	this.done = false;
	// this.DOM = document.createElement('div');
	this.ele = $("#timer");
	return this;
}







var th = ['','mil','million', 'billion','trillion'];
var ht = ['ciento','doscientos','trescientos',"cuatrocientos",'quinientos','seiscientos','setecientos','ochocientos','novecientos'];
var dg = ['cero','uno','dos','tres','cuatro', 'cinco','seis','siete','ocho','nueve']; 
var tn = ['diez','once','doce','trece', 'catorce','quince','dieciséis', 'diecisiete','dieciocho','diecinueve'];
var tn2 = ['veinte','veintiuno','veintidós','veintitrés','veinticuatro','veinticinco','veintiséis','veintisiete','veintiocho','veintinueve'];
var tw = ['veinte','treinta','cuarenta','cincuenta', 'sesenta','setenta','ochenta','noventa'];

function toWords(s){
	s = s.toString(); s = s.replace(/[\, ]/g,'');
	 if (s != parseFloat(s)) 
	 	return 'not a number';
	 var x = s.indexOf('.');
	 if (x == -1) 
	 	x = s.length;
	 if (x > 15) 
	 	return 'too big';
     if (s == '0'){
         return 'cero'
     } else if (s == '1'){
         return 'uno'
     }
	 var n = s.split('');
	 var str = '';
	 var sk = 0;
	 for (var i=0;i < x;i++) {
	 	if ((x-i)%3==2) {
	 		if (n[i] == '1') {
	 			str += tn[Number(n[i+1])] + ' ';
				 i++;
				 sk=1;
            } else if (n[i]== '2'){
                str += tn2[Number(n[i+1])] + ' ';
                i++;
				sk=1;
            } else if (n[i]!=0) {
				str += tw[n[i]-2] + ' y ';
				sk=1;
			}
		} else if (n[i]!=0) {
	 		if ((x-i)%3==0){
	 			str += ht[n[i]-1]+" ";
            } else {
                if (sk == 0){
                    if (n[i] > 1 ){
                        //console.log(n[i]);
                        str += dg[n[i]] +'';
                    } else if (n[i] == 1 && ((x-i-1)/3)>1){
                        str += "un "
                    }
                }else{
                    str += dg[n[i]] +'';
                }
            }
			sk=1;
        } else {
            if (str.substr(str.length-2) == 'y ')
                str = str.substr(0,str.length-2);
        }
		if ((x-i)%3==1) {
            if (sk){
				str += th[(x-i-1)/3]+' ';
            }
            sk=0;
		}
	} 
    if (str == "ciento  "){
        str = "cien"
    }
	if (x != s.length) {
		var y = s.length;
		str += 'point ';
		for (var i=x+1;i<y;i++)
			str += dg[n[i]] +' ';
	} 
	return str.replace(/\s+/g,' ');
}










//AUTORESIZE
function resizeGame() {
    var gameArea = document.getElementById('room');
    var newHeight = window.innerHeight;
    var fontSize = 18	;
  	resizePercentage =((656*100)/newHeight);
    gameArea.style.fontSize = Math.floor((fontSize*100)/resizePercentage)+"px";
}

window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);









//WORDS INITIALIZE
function createWords(){
	wordsIni(
		["manzana","caza","casa","estrella","plátano","pera"],
		["apple","hunt","home","star","banana","pear"],
		[1,2]);
}

function gameDone(){
	instOM.recognition.abort();
	instOM.gameRunning = false;
	// $("#currWord").contents().last()[0].textContent = "ALL WORDS ARE DONE!";
	instScore = new initiateScore(wordsArray,document.getElementById("scoreBoard"));
}

function start(){
	$("#attemptsDiv").html('Attempts');
	for (x=0;x<instOM.currAttemps;x++)
		$("#attemptsDiv").append('<i class="icon-heart"></i>');
}


function restartGame(){
	if (instScore != null){
		instScore.restart();
	}
	if (instOM != null){
		instOM.currWordInd = 0;
		instOM.currAttemps = 7-instOM.difficulty;
	}

	wordsArray[0].audioIni();
	$("#currWord").contents().last()[0].textContent = wordsArray[0].targetL;
}


function initiateButtons(){
	$("#skip").click(function(){
		if (instOM.gameRunning == true)
			nextWord();
	})
	$("#playWord").click(function(){
		wordsArray[instOM.currWordInd].playAudio();
	})
}


var changeDifficulty = function(num){
	switch(num){
		case 1:
			instOM.difficulty = 3;
			instOM.currAttemps = 4;
		break;
		case 2:
			instOM.difficulty = 4;
			instOM.currAttemps = 3;
		break;
		case 3:
			instOM.difficulty = 5;
			instOM.currAttemps = 2;
		break;
	}
}
