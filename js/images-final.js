imageFilenames = ["dsc_6001.jpg", "dsc_6081.jpg", "dsc_6013.jpg", "dsc_6268.jpg", "dsc_6397.jpg", "dsc_6345.jpg", "dsc_6378.jpg", "dsc_6413.jpg", "dsc_6417.jpg"]

var parentElement;
var moveImg;
var imgParent;
var imgParentIndex;
var imgXCoord;
var imgYCoord;

function init() {
	var imgGrid = parentElement = document.getElementById("img-grid");
	
	//Generate image and add to image grid
	for (var i = 0; i < imageFilenames.length; i++) {
		var imgContainer = document.createElement("li");
		imgContainer.className = "img-container";

		var img = document.createElement("img");
		img.className = "img";
		img.src = "images/" + imageFilenames[i];
		//Add mousedown/touchstart event listener
		img.onmousedown = img.ontouchstart = onMouseDownHandler;

		imgContainer.appendChild(img);
		imgGrid.appendChild(imgContainer);
	}
	//Add mouseup/touchend event listener
	document.onmouseup = document.ontouchend = onMouseUpHandler;
}

function onMouseDownHandler(event) {
	event.preventDefault();
	
	//Get coordinates of selected image
	imgXCoord = event.pageX - event.currentTarget.offsetLeft;
	imgYCoord = event.pageY - event.currentTarget.offsetTop;
	
	if (typeof event.currentTarget != 'undefined') {
		//Get image parent index
		imgParent = event.currentTarget.parentNode;		
		imgParentIndex = getChildIndex(parentElement, imgParent);
		
		moveImg = event.currentTarget;
		moveImg.style.opacity = 0.5;
		//Create clone that will remain static when the 
		//selected image is moving around the grid
		imgParent.appendChild(moveImg.cloneNode(true));

		moveImg.style.position = 'absolute';
		moveImg.style.zIndex = 2;
		
		//Add mousemove/touchmove event listener
		moveImg.onmousemove = moveImg.ontouchmove = onMouseMoveHandler;
		onMouseMoveHandler(event);
	}
}

function onMouseMoveHandler(event) {
	//Get mouse coordinates to calculate position of moving image
	var mouseXCoord = event.pageX;
	var mouseYCoord = event.pageY;
	
	var newMouseXCoord = event.pageX - event.currentTarget.parentNode.offsetLeft;
	var newMouseYCoord = event.pageY - event.currentTarget.parentNode.offsetTop;
	
	moveImg.style.left = (mouseXCoord - imgXCoord) + "px";
	moveImg.style.top = (mouseYCoord - imgYCoord) + "px";
	
	//Loop through image grid array
	var imgContainers = parentElement.childNodes;
	for (var i = 0; i < imgContainers.length; i++) {
		//Get target index to determine the new position in the image grid
		var targetIndex = getChildIndex(parentElement, imgContainers[i]);
		
		//Get target constraints to compare with coordinates of the moving image 
		if (targetIndex != imgParentIndex) {
			var minTopConstraint = imgContainers[i].childNodes[0].offsetTop;
			var maxTopConstraint = imgContainers[i].childNodes[0].offsetTop + imgContainers[i].childNodes[0].clientHeight;
			var minLeftConstraint = imgContainers[i].childNodes[0].offsetLeft;
			var maxLeftConstraint = imgContainers[i].childNodes[0].offsetLeft + imgContainers[i].childNodes[0].clientWidth;

			if (minTopConstraint <= newMouseYCoord && newMouseYCoord <= maxTopConstraint) {
				if (minLeftConstraint <= newMouseXCoord && newMouseXCoord <= maxLeftConstraint) {
					if (targetIndex < imgParentIndex) {
						parentElement.insertBefore(moveImg.parentNode, imgContainers[i]);
					} else {
						insertAfter(imgContainers[i], moveImg.parentNode);
					}
					imgParentIndex = getChildIndex(parentElement, imgParent);
					break;
				}
			}
		}
	}
}

function onMouseUpHandler(event) {
	//Set image in new position, remove image clone and reset variables
	if (moveImg && imgParent) {
		moveImg.style.opacity = 1;
		moveImg.style.position = 'static';
		moveImg.style.zIndex = 1;
		moveImg.onmousemove = null;
		imgParent.removeChild(imgParent.childNodes[1]);

		moveImg = null;
		imgParent = null;
	}	
}

function getChildIndex (parent, child) {
	for (var i = 0; i < parentElement.childNodes.length; i++) {
		if (child == parent.childNodes[i]) {
			return i;
		}
	}
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

//On document load, call init()
document.addEventListener("DOMContentLoaded", function(event) {	
	init();
});

