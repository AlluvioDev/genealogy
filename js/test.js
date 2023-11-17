var personsSrc= "https://raw.githubusercontent.com/AlluvioDev/genealogy/main/data/testData.json";
var persons;

var TEMPLATE_SIDEBAR_ITEM = `<li onclick='showMe("{{PERSON_ID}}")'>{{SECOND_NAME}}, {{FIRST_NAME}}</li>`;
var TEMPLATE_NODE = `<div class="node {{SEX}}" data-pid="{{PERSON_ID}}">
	<div>{{FIRST_NAME}} {{SECOND_NAME}}</div>
</div>`;

const nodesInRow = 9; //Нечётное!
const nodesInColumn = 9; //Нечётное!
const cellsInRow = nodesInRow * 2 - 1;
const cellsInColumn = nodesInColumn * 2 - 1;
const cellSize = 30;

async function loadPersons() {
	const response = await fetch(personsSrc);
	persons = await response.json();
	persons = persons.sort((a, b) => {
	  if (a.secondName < b.secondName) {
		return -1;
	  }
	});
	var sidebar = "";
	for (let i = 0; i < persons.length; i++) {
		sidebar += TEMPLATE_SIDEBAR_ITEM
			.replace("{{PERSON_ID}}", persons[i]["id"])
			.replace("{{SECOND_NAME}}", persons[i]["secondName"])
			.replace("{{FIRST_NAME}}", persons[i]["firstName"]);
	}
	document.getElementById("relList").innerHTML = sidebar;

  return true;
};
loadPersons();

function showMe(personId) {
	drawPersonInCell(3, 3, personId);
}

function sortSet(set) {
  const entries = [];
  for (const member of set) {
    entries.push(member);
  }
  set.clear();
  for (const entry of entries.sort()) {
    set.add(entry);
  }
  return set;
};

function findPersonByFieldValue(fieldName, fieldValue){
	for (let i = 0; i < persons.length; i++){
		if (persons[i][fieldName] == fieldValue) {
			return persons[i];
		}
	}
	return 0;
}

function drawTable() {
  var myTableDiv = document.getElementById("genGrid");
  var table = document.createElement('TABLE');
  var tableBody = document.createElement('TBODY');
  table.appendChild(tableBody);
  
  var id = 0;

  for (var i = 0; i < cellsInColumn; i++) {
    var tr = document.createElement('TR');
    tableBody.appendChild(tr);

    for (var j = 0; j < cellsInRow; j++) {
      var td = document.createElement('TD');
      td.setAttribute('row_id',i);
      td.setAttribute('col_id',j);
      td.setAttribute('cell_id',id);
      td.setAttribute('title', 'i = ' + i + ', j = ' + j);
      id++;
      tr.appendChild(td);
    }
  }
  myTableDiv.appendChild(table);
}
drawTable();

function drawInCell(row_id, col_id, inner) {
	console.log("td[row_id='" + row_id + "'][col_id='" + col_id + "']");
	if(!inner) {
		document.querySelector("td[row_id='" + row_id + "'][col_id='" + col_id + "']").innerHTML = "oops";
	} else {
		document.querySelector("td[row_id='" + row_id + "'][col_id='" + col_id + "']").innerHTML = inner;
	}
	return;
}
/* 
function drawRelationLine(row_id, col_id, type, lineStyle) {
	console.log("Try draw " + type + " line in cell i=" + row_id + " j=" + col_id);
	let oneLine = '<svg class="cell"><line x1="{{X1}}" y1="{{Y1}}" x2="{{X2}}" y2="{{Y2}}" class="' + lineStyle + '" /></svg> ';
	let twoLines = '<svg class="cell"><line x1="{{L1_X1}}" y1="{{L1_Y1}}" x2="{{L1_X2}}" y2="{{L1_Y2}}" class="' + lineStyle + '" /><line x1="{{L2_X1}}" y1="{{L2_Y1}}" x2="{{L2_X2}}" y2="{{L2_Y2}}" class="' + lineStyle + '" /></svg> ';
	
	let resultLine = "";
	switch (type){
		case "horizontal": // ―
			resultLine = oneLine
				.replace("{{X1}}", 0)
				.replace("{{Y1}}", cellSize/2)
				.replace("{{X2}}", cellSize)
				.replace("{{Y2}}", cellSize/2);
		break;
		
		case "vertical":  // │
			resultLine = oneLine
				.replace("{{X1}}", cellSize/2)
				.replace("{{Y1}}", 0)
				.replace("{{X2}}", cellSize/2)
				.replace("{{Y2}}", cellSize);
		break;
		
		case "halfCrossTop": // ┴
			resultLine = twoLines
				.replace("{{L1_X1}}", 0)
				.replace("{{L1_Y1}}", cellSize/2)
				.replace("{{L1_X2}}", cellSize)
				.replace("{{L1_Y2}}", cellSize/2)
				
				.replace("{{L2_X1}}", cellSize/2)
				.replace("{{L2_Y1}}", 0)
				.replace("{{L2_X2}}", cellSize/2)
				.replace("{{L2_Y2}}", cellSize/2);
		break;
		
		case "halfCrossBottom": // ┬
			resultLine = twoLines
				.replace("{{L1_X1}}", 0)
				.replace("{{L1_Y1}}", cellSize/2)
				.replace("{{L1_X2}}", cellSize)
				.replace("{{L1_Y2}}", cellSize/2)
				
				.replace("{{L2_X1}}", cellSize/2)
				.replace("{{L2_Y1}}", cellSize/2)
				.replace("{{L2_X2}}", cellSize/2)
				.replace("{{L2_Y2}}", cellSize);
		break;
		
		case "halfCrossLeft": // ┤
			resultLine = twoLines
				.replace("{{L1_X1}}", 0)
				.replace("{{L1_Y1}}", cellSize/2)
				.replace("{{L1_X2}}", cellSize/2)
				.replace("{{L1_Y2}}", cellSize/2)
				
				.replace("{{L2_X1}}", cellSize/2)
				.replace("{{L2_Y1}}", 0)
				.replace("{{L2_X2}}", cellSize/2)
				.replace("{{L2_Y2}}", cellSize);
		break;
		
		case "halfCrossRight":  // ├
			resultLine = twoLines
				.replace("{{L1_X1}}", cellSize/2)
				.replace("{{L1_Y1}}", cellSize/2)
				.replace("{{L1_X2}}", cellSize)
				.replace("{{L1_Y2}}", cellSize/2)
				
				.replace("{{L2_X1}}", cellSize/2)
				.replace("{{L2_Y1}}", 0)
				.replace("{{L2_X2}}", cellSize/2)
				.replace("{{L2_Y2}}", cellSize);
		break;
		
		case "cross":  // ┼
			resultLine = twoLines
				.replace("{{L1_X1}}", 0)
				.replace("{{L1_Y1}}", cellSize/2)
				.replace("{{L1_X2}}", cellSize)
				.replace("{{L1_Y2}}", cellSize/2)
				
				.replace("{{L2_X1}}", cellSize/2)
				.replace("{{L2_Y1}}", 0)
				.replace("{{L2_X2}}", cellSize/2)
				.replace("{{L2_Y2}}", cellSize);
		break;
	}
	
	drawInCell(row_id, col_id, resultLine);
}

function drawNode(row_id, col_id, nodeId) {
	if(isDrowed(nodeId)) {return;}
	console.log("Draw person '" + nodeId + "' in i=" + row_id + " j=" + col_id);
	let sexMarker = "";
	if(getNode(nodeId)) {
		sexMarker = "circle_" + getNode(nodeId)["sex"];
	}
	let inner = "<div class='circle centered " + sexMarker +"' id='node_" + nodeId + "'></div>";
	drawInCell(row_id, col_id, inner);
	drawedNodes.push(new DrawedNode(nodeId, row_id, col_id));
	document.getElementById("node_" + nodeId).addEventListener("click", function (e) {
		drawParents(nodeId);
		drawPartner(nodeId);
	});
	console.log(drawedNodes);
}

var drawedNodes = [];

function DrawedNode(nodeId, nodeRow, nodeCol) {
  this.nodeId = nodeId;
  this.nodeRow = nodeRow;
  this.nodeCol = nodeCol;
}
function isDrowed(nodeId) {
	for(let i in drawedNodes) {
		if(drawedNodes[i]["nodeId"] == nodeId) return true;
	}
	return false;
}
function getNode(nodeId) {
	for(let node in nodeList) {
		if(nodeList[node]["id"] == nodeId) return nodeList[node];
	}
	return false;
}

function drawInCenter(nodeId) {
	if(!getNode(nodeId)) {console.log("Error on drawInCenter method"); return;}
	
	let row = (cellsInRow + 1)/2 - 1;
	let col = (cellsInColumn + 1)/2 - 1;
	
	drawNode(row, col, nodeId);
}
 */
function drawPersonInCell(row_id, col_id, person_id) {
	let person = findPersonByFieldValue("id", person_id);
	if(person == 0) {console.log("person #" + person_id + " not found");return;}
	let personCell = TEMPLATE_NODE
		.replace("{{SEX}}", person["sex"])
		.replace("{{PERSON_ID}}", person["id"])
		.replace("{{SECOND_NAME}}", person["secondName"])
		.replace("{{FIRST_NAME}}", person["firstName"]);
	drawInCell(row_id, col_id, personCell);
	return;
}

var scale = 1,
	panning = false,
	pointX = 0,
	pointY = 0,
	start = { x: 0, y: 0 },
	zoom = document.getElementById("zoom");

function setTransform() {
	zoom.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
}

zoom.onmousedown = function (e) {
	e.preventDefault();
	start = { x: e.clientX - pointX, y: e.clientY - pointY };
	panning = true;
}

zoom.onmouseup = function (e) {
	panning = false;
}

zoom.onmousemove = function (e) {
	e.preventDefault();
	if (!panning) {
		return;
	}
	pointX = (e.clientX - start.x);
	pointY = (e.clientY - start.y);
	setTransform();
}

zoom.onwheel = function (e) {
	e.preventDefault();
	var xs = (e.clientX - pointX) / scale,
		ys = (e.clientY - pointY) / scale,
		delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
	(delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
	pointX = e.clientX - xs * scale;
	pointY = e.clientY - ys * scale;

	setTransform();
}
