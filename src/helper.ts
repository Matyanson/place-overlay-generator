
const sleep = ms => new Promise(r => setTimeout(r, ms));

export const saveFile = (fileName: string, blobParts: BlobPart[], mimeType: string) => {
    let blob = new Blob(blobParts, {type: mimeType});
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
};

export const loadFile = (accept: string = 'text/json'): Promise<File> => {
    return new Promise((resolve, reject) => {
        const inputEl = document.createElement('input');
        inputEl.type = 'file';
        inputEl.accept = accept;
        inputEl.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            resolve(target.files[0]);
        }
        inputEl.click();
    });
}

export const getFileText = (blob: Blob | File): Promise<string> => {
    let reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = () => {
            if(typeof(reader.result) !== 'string') reject('data file type is not a string');
            else resolve(reader.result);
        }
        reader.readAsText(blob);
    });
}

export const readFileUrl = (blob: Blob | File): Promise<string> => {
    let reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = () => {
            if(typeof(reader.result) !== 'string') reject('data file type is not a string');
            else resolve(reader.result);
        }
        reader.readAsDataURL(blob);
    });
}

export const getImageData = (path: string, ctx: CanvasRenderingContext2D = null, scaleX = 1, scaleY = 1): Promise<ImageData> => {
    
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = path;
        img.addEventListener('load', async function() {
            const width = img.width * scaleX;
            const height = img.height * scaleY;
            if(ctx == null){
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                ctx = canvas.getContext('2d');
            }
            ctx.drawImage(img, 0, 0, width, height);
            const data = ctx.getImageData(0, 0, width, height);
            resolve(data);
        }, false);
    });
}

export const drawImage = (path: string, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): Promise<ImageData> => {
    
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = path;
        img.addEventListener('load', async function() {
            const ratio = img.width / img.height;
            canvas.height = canvas.width / ratio;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
            resolve(data);
        }, false);
    });
}

export const to6digits = (n: number) => {
    const numString = String(n);
    return Array(6 - numString.length).fill('0').concat(numString).join('');
}