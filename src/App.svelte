<script lang="ts">
import { onMount } from "svelte";
import { drawImage, getFileText, getImageData, loadFile, readFileUrl, saveFile } from "./helper";

	type Coords = { x: number, y: number };

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let cWidth = 0;
	let cHeight = 0;

	let imgUrl = null;
	let rows = 20;
	let canvasWidth = 2000;
	let canvasHeight = 2000;

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
		await drawImage(imgUrl, ctx, canvas);
		drawPoints(rows);
	}
	}
</script>

<main>
	<button on:click={loadData} >load Image</button><br>
	<input type="number" bind:value={rows} /> Rows: {rows}
	<canvas bind:this={canvas}></canvas>
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
	}
</style>