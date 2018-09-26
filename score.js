var instScore = null;
var difficulty = 1;
var initiateScore = function(tempArray,ele){
	this.scoreBoard = ele;
	this.interval = null;
	this.currentWidth = 1;
	this.maxHeight =  100;//95;
	this.maxWidth =  100;//93;
	this.currentHeight = 1;
	this.barArray = [];
	this.scoreBoard.className = "showScore2";
	this.restartDiv = document.createElement('div');
	var e = this;
	this.restartDiv.onclick = function(){
		restartGame();
	}
	var divTitle = document.createElement("div");
	divTitle.appendChild(document.createTextNode("Scoreboard"));
	divTitle.className = "divTitle";	
	e.scoreBoard.appendChild(divTitle);
	e.scoreBoard.appendChild(e.restartDiv);
	e.restartDiv.className = "restart";
	e.restartDiv.innerHTML = "Restart";
	for (x=0;x<tempArray.length;x++){
	 	if (x%2 == 0 || x == 0)
	 		this.barArray.push(new bar(Math.floor((tempArray[x].score*100)/tempArray[x].maxScore),1,tempArray[x].targetL,ele))
	 	else
	 		this.barArray.push(new bar(Math.floor((tempArray[x].score*100)/tempArray[x].maxScore),1,tempArray[x].targetL,ele))
	 }
	 setTimeout(function(){
	 for (x=0;x<tempArray.length;x++){
	 		e.barArray[x].pushBar();
	 }
	},2200);
	// if (Modernizr.csstransitions==false){
	ele.style.top = "0%"; 
	ele.style.left = (1.7+Math.floor(this.maxWidth/2))+"%";
	// this.pushBoardHeight = function(){
	// 	e.interval = setInterval(function(){
	// 		e.currentHeight+=3;
	// 		e.scoreBoard.style.height = (e.currentHeight)+"%";
	// 		e.scoreBoard.style.top = (Math.floor(e.maxHeight/2)-Math.floor(e.currentHeight/2))+"%";
	// 		if (e.currentHeight >= e.maxHeight-1){
	// 			e.scoreBoard.style.top = "";
	// 			e.scoreBoard.style.height = (e.maxHeight)+"%";
	// 			clearInterval(e.interval);
	// 			e.pushBoardWidth();	
	// 		}
	// 	},30);
	// 	//(1*1000)/e.maxHeight);
	// }
	this.pushBoardWidth = function(){
		e.interval = setInterval(function(){
			e.currentWidth+=2;
			e.scoreBoard.style.width = (e.currentWidth)+"%";
			e.scoreBoard.style.left = (Math.floor(e.maxWidth/2)-Math.floor(e.currentWidth/2))+"%";
			if (e.currentWidth >= e.maxWidth-1){
				e.scoreBoard.style.left = "";
				e.scoreBoard.style.width = "";
				e.scoreBoard.style.height = "";
				e.scoreBoard.appendChild(e.restartDiv);
				e.restartDiv.className = "restart";
				e.restartDiv.innerHTML = "Restart";
				clearInterval(e.interval);
				 // for (x in tempArray){
				 // 	if (x%2 == 0 || x == 0)
				 // 		new bar(Math.floor((tempArray[x].score*100)/tempArray[x].maxScore),1,tempArray[x].spanish,ele).pushBar(6.41,25.9+(x*6.8));
				 // 	else
				 // 		new bar(Math.floor((tempArray[x].score*100)/tempArray[x].maxScore),1,tempArray[x].spanish,ele).pushBar(53.9,25.9+((x-1)*6.8));
				 // }
			}
		},30);
	}
	this.pushBoardWidth();
	// }
	this.restart = function(){
		while( this.scoreBoard.hasChildNodes() ){
		    this.scoreBoard.removeChild(this.scoreBoard.lastChild);
		}
		this.scoreBoard.className = "hideScore";
	}
	// this.pushBoardHeight();
}

var bar = function(Percentage,secs,string,ele){
	this.bar = document.createElement('div')
	this.bar.className = "bar";
	if  (ele != null)
		ele.appendChild(this.bar);
	this.innerBar = document.createElement('div')
	this.innerBar.className = "innerBar";
	this.currentWidth = 1;
	this.textDiv  = document.createElement('div');
	this.textNode = document.createTextNode(string);
	this.textDiv.appendChild(this.textNode);
	this.bar.appendChild(this.textDiv);
	this.interval = null;
	this.len = Math.floor(Percentage-(Percentage/25));
	this.secs = secs;
	this.textDiv.className = "textBar"
	this.bar.appendChild(this.innerBar)
	this.image = 1;
    // if (x != null){
    //         this.bar.style.left = x+"%";
    //     }
    // if (y != null){
    //         this.bar.style.top = y+"%";   
    //     }
	this.pushBar = function(){
		var e = this;
		// if (Modernizr.csstransitions){
		if (this.len > 0){
			this.innerBar.style.width = this.len+"%";
			console.log(this.len)
		}
		// } else {	
        // if (e.currentWidth < e.len)
		// e.interval = setInterval(function(){
		// 	e.currentWidth+=.3;
		// 	e.image++;
		// 	e.innerBar.style.backgroundPosition = (e.image*2)+"px"
		// 	e.innerBar.style.width = e.currentWidth+"%";
		// 	if (e.currentWidth >= e.len){
		// 		clearInterval(e.interval);
		// 	}
		// },(this.secs*1000)/200);
		// }
	}
}
var initiateDifficulty = function(Id){
	this.ele = document.getElementById(Id);
	this.ele.className = "showScore"
	var divTitle = document.createElement("div");
	divTitle.appendChild(document.createTextNode("Choose difficulty"));
	divTitle.className = "divTitle";	
	this.ele.appendChild(divTitle);
	this.initateButtons = function(y,num,text){
		var divTemp = document.createElement('div');
		divTemp.onclick = function(){
			var ele = document.getElementById(Id);
			changeDifficulty(num);
			ele.className = "hideScore";
			cicleChild(Id);
			start();
		}
		divTemp.className = "restartDif"
		this.ele.appendChild(divTemp);
		divTemp.appendChild(document.createTextNode(text));
		divTemp.style.top = y+"%";
	}
	this.initateButtons(30,1,"Easy");
	this.initateButtons(50,2,"Normal");
	this.initateButtons(70,3,"Hard");
}
var cicleChild = function(ele){
	var el = document.getElementById(ele);
	while( el.hasChildNodes() ){
	    el.removeChild(el.lastChild);
	}
}
result = 0;
function blah(arr,maxN){
    var currArr = [];
    var nArray = [];
    for (x=0;x<arr.length;x++){
        nArray.push(Math.floor(maxN/arr[x])-(maxN%arr[x]));
    }
    
}
blah([5,3],1000);