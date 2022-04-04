<script lang="ts">
import { onMount } from "svelte";
import { drawImage, getFileText, getImageData, loadFile, readFileUrl, saveFile } from "./helper";

	type Coords = { x: number, y: number };

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let cWidth = 0;
	let cHeight = 0;

	let imgUrl = null;

	onMount(async () => {
		ctx = canvas.getContext('2d');
	})

	

	const loadData = async () => {
		const file = await loadFile('image/*');
		const url = await readFileUrl(file);
		imgUrl = url;
		await drawImage(url, ctx, canvas);
	}
</script>

<main>
	<button on:click={loadData} >load Image</button>
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