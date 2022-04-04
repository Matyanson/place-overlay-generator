<script lang="ts">
import { onMount } from "svelte";
import { canvasToBlob, drawImage, getFileText, getImageData, loadFile, readFileUrl, saveFile } from "./helper";

	type Pixel = [number, number, number, number];

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	let imgUrl = null;
	let rows = 20;
	let canvasWidth =2000;
	let canvasHeight = 2000;
	let offsetX = 0;
	let offsetY = 0;

	$: try {
		rows;
		redraw();
	} catch(e){}

	onMount(async () => {
		ctx = canvas.getContext('2d');
	})

	

	const loadData = async () => {
		const file = await loadFile('image/*');
		const url = await readFileUrl(file);
		imgUrl = url;

		redraw();
	}

	

	const drawPoints = (rows: number) => {
		const diameter = canvas.height / rows;
		const radius = diameter / 2;
		const columns = Math.floor(rows * (canvas.width / canvas.height));

		for(let i = 0; i < rows; i++) {
			for(let j = 0; j < columns; j++) {
				ctx.fillRect(diameter * j + radius / 2, diameter * i + radius / 2, radius, radius);
			}
		}
	}
	
	const redraw = async () => {
		if(ctx && imgUrl){
			await drawImage(imgUrl, ctx, canvas);
			drawPoints(rows);
		}
	}

	const createLayout = async() => {
		// setup canvas
		canvas.width = canvasWidth * 2;
		canvas.height = canvasHeight * 2;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// get data
		const columns = Math.floor(rows * (canvas.width / canvas.height));
		const originalImgData = await getImageData(imgUrl);
		const pixels = originalImgData.data;
		const diameter = originalImgData.height / rows;

		for(let y = 0; y < rows; y++) {
			for(let x = 0; x < columns; x++) {
				const imageX = Math.round(x * diameter);
				const imageY = Math.round(y * diameter);
				// get pixel
				const p: Pixel = getPixelInCoords(pixels, originalImgData.width, imageX, imageY);
				// get position on layout
				const layoutX = (offsetX + x) * 2;
				const layoutY = (offsetY + y) * 2;

				//put the pixel on canvas
				ctx.fillStyle = `rgba(${p[0]}, ${p[1]}, ${p[2]}, ${p[3]})`;
				ctx.fillRect(layoutX, layoutY, 1, 1);
			}
		}

		// download as img
		const blob = await canvasToBlob(canvas);
		saveFile('layout.png', [blob], 'image/png');
	}

	const getPixelIndex = (width: number, x: number, y: number): number => {
		return Math.floor(width * y + x) * 4;
	}

	const getPixelInCoords = (pixels: Uint8ClampedArray, width: number, x: number, y: number): Pixel => {
		const index = getPixelIndex(width, x, y);
		return [pixels[index], pixels[index + 1], pixels[index + 2], pixels[index + 3]];
	}

</script>

<main>
	canvas width: {canvasWidth} <input type="number" bind:value={canvasWidth} />
	canvas height: {canvasHeight} <input type="number" bind:value={canvasHeight} /><br>
	x offset: {offsetX} <input type="number" bind:value={offsetX} />
	y offset: {offsetY} <input type="number" bind:value={offsetY} /><br>

	<button on:click={loadData} >load Image</button><br>
	<input type="number" bind:value={rows} /> Rows: {rows}
	<canvas bind:this={canvas}></canvas>
	<button on:click={createLayout}>generate layout</button><br>
	(if nothing happens)
	right click the canvas > save as
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		height: 100%;
		background: skyblue;
	}
	main {
		text-align: center;
		padding: 1em;
	}

	canvas {
		width: 100%;
		user-select: none;
		background-color: rgba(0, 0, 0, 0.423);
		image-rendering: pixelated;
	}
</style>