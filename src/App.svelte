<script lang="ts">
import { onMount } from "svelte";
import { getFileText, getImageData, loadFile, saveFile } from "./helper";

	type Coords = { x: number, y: number };

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let iWidth = 0;
	let iHeight = 0;

	let i = $gridDataList.length - 1;
	let m: Coords = { x: 0, y: 0 };
	let point1: Coords;
	let point2: Coords;

	$: {
		if(canvas){
			(async () => {
				await drawImg(i);
				drawGrid($gridDataList[i]);
			})();
		}
	}


	onMount(async () => {
		ctx = canvas.getContext('2d');
	})

	

	const downloadData = () => {
		const jsonString = JSON.stringify($gridDataList);
		saveFile('grid_data.json', [jsonString], 'text/json');
	}

	const loadData = async () => {
		const file = await loadFile();
		const text = await getFileText(file);
		const obj = JSON.parse(text);
		$gridDataList = obj;
	}
</script>

<main>
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

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
		margin: 0;
	}

	canvas {
		/*width: 100%;*/
		user-select: none;
		cursor: crosshair;
	}
</style>