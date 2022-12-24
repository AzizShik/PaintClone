window.addEventListener('load', () => {
	const paintToolsBrush = document.querySelector('.paint__tools-brush');
	const paintToolsSizeSpan = document.querySelector('.paint__tools-size-span');
	const paintToolsBrushInput = document.querySelector(
		'.paint__tools-brush-size'
	);
	const paintToolsTitle = document.querySelector('.paint__tool-name');
	const paintToolsElaser = document.querySelector('.paint__board-elaser ');
	const boardEl = document.querySelector('.board');
	const paintContainer = document.querySelector('.paint__container');
	const paintBrushColorInput = document.querySelector(
		'.paint__tools-brush-color'
	);
	const paintDripColorInput = document.querySelector(
		'.paint__board-bg-color-input'
	);
	const uploadLS = document.querySelector('.paint__board-upload-ls');
	const paintUndoToolsElement = document.querySelector('.paint__board-undo');
	const paintSaveLS = document.querySelector('.paint__board-save-ls');
	const paintUploadLS = document.querySelector('.paint__board-upload-ls');
	const paintClearLS = document.querySelector('.paint__board-delete');
	const downloadBtn = document.querySelector('.paint__board-save-image');

	const canvas = document.createElement('canvas');
	canvas.id = 'canvas';
	const context = canvas.getContext('2d');
	let currentSize = 10;
	let bucketColor = '#FFFFFF';
	let currentColor = '#333333';
	let isMouseDown = false;
	let isEraser = false;
	let paintDataArr = [];

	paintToolsBrush.addEventListener('click', () => {
		displayBrush();
	});

	paintToolsElaser.addEventListener('click', () => {
		displayElaser();
	});

	paintBrushColorInput.addEventListener('input', () => {
		const color = paintBrushColorInput.value;
		currentColor = color;
		context.strokeStyle = currentColor;
	});

	paintDripColorInput.addEventListener('input', () => {
		const color = paintDripColorInput.value;
		bucketColor = color;
		createCanvas();
		restoreDrawn();
	});

	uploadLS.addEventListener('click', () => {
		restoreDrawn();
	});

	paintUndoToolsElement.addEventListener('click', () => {
		paintDataArr = [];
		createCanvas();
	});

	paintSaveLS.addEventListener('click', () => {
		localStorage.setItem('drawArr', JSON.stringify(paintDataArr));
	});

	paintUploadLS.addEventListener('click', () => {
		if (localStorage.getItem('drawArr') !== null) {
			paintDataArr = JSON.parse(localStorage.getItem('drawArr'));
			restoreDrawn();
		}
	});

	paintClearLS.addEventListener('click', () => {
		localStorage.removeItem('drawArr');
	});

	function displayBrush() {
		paintToolsElaser.classList.remove('active');
		paintToolsBrush.classList.add('active');
		paintToolsTitle.textContent = 'Brush';

		const color = paintBrushColorInput.value;
		currentColor = color;
		context.strokeStyle = currentColor;
	}

	function displayElaser() {
		isEraser = true;
		paintToolsBrush.classList.remove('active');
		paintToolsElaser.classList.add('active');
		paintToolsTitle.textContent = 'Elaser';

		currentColor = bucketColor;
		context.strokeStyle = currentColor;
	}

	paintToolsBrushInput.addEventListener('input', () => {
		const inputValue = paintToolsBrushInput.value;
		currentSize = inputValue;
		context.lineWidth = currentSize;
		paintToolsSizeSpan.textContent = `${zeroPrefix(inputValue)}`;
	});

	downloadBtn.addEventListener('click', () => {
		downloadBtn.href = canvas.toDataURL('image/jpeg', 1);
		downloadBtn.download = 'paint-example.jpeg';
	});

	function zeroPrefix(number) {
		return number < 10 ? `0${number}` : number;
	}

	function storeDrawn(x, y, currentSize, currentColor) {
		const line = {
			x,
			y,
			currentSize,
			currentColor,
			isEraser,
		};
		paintDataArr.push(line);
	}

	function restoreDrawn() {
		for (let i = 1; i < paintDataArr.length; i++) {
			context.beginPath();
			context.moveTo(paintDataArr[i - 1].x, paintDataArr[i - 1].y);
			context.lineWidth = paintDataArr[i].currentSize;
			context.lineCap = 'round';
			if (paintDataArr[i].isEraser) {
				context.strokeStyle = bucketColor;
			} else {
				context.strokeStyle = paintDataArr[i].currentColor;
			}
			context.lineTo(paintDataArr[i].x, paintDataArr[i].y);
			context.stroke();
		}
	}

	function createCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight - paintContainer.clientHeight;
		document.querySelector('body').append(canvas);
		context.fillStyle = bucketColor;
		context.fillRect(
			0,
			0,
			window.innerWidth,
			window.innerHeight - paintContainer.clientHeight
		);
	}

	function getMousePosition(e) {
		const boundaries = canvas.getBoundingClientRect();
		return {
			x: e.clientX - boundaries.left,
			y: e.clientY - boundaries.top,
		};
	}

	canvas.addEventListener('mousedown', (e) => {
		isMouseDown = true;
		const currentPosition = getMousePosition(e);
		context.moveTo(currentPosition.x, currentPosition.y);
		context.beginPath();
		context.lineWidth = currentSize;
		context.lineCap = 'round';
		context.strokeStyle = currentColor;
	});

	canvas.addEventListener('mousemove', (e) => {
		if (isMouseDown) {
			const currentPosition = getMousePosition(e);
			context.lineTo(currentPosition.x, currentPosition.y);
			context.stroke();
			console.log(currentPosition.x, currentPosition.y);
			storeDrawn(
				currentPosition.x,
				currentPosition.y,
				currentSize,
				currentColor,
				isEraser
			);
		} else {
			storeDrawn(undefined);
		}
	});

	canvas.addEventListener('mouseup', (e) => {
		isMouseDown = false;
	});

	createCanvas();
	paintToolsBrush.click();
});
