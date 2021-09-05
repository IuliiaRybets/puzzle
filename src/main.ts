const inputRows = document.getElementById("rows") as HTMLInputElement;
const inputCols = document.getElementById("cols") as HTMLInputElement;
const inputImg = document.getElementById("img") as HTMLInputElement;
const elemPuzzle = document.getElementById("puzzle") as HTMLDivElement;
const elemImgFilename = document.getElementById("imgfilename") as HTMLDivElement;
const timer = parseInt((3000 / 1000).toFixed(1));

let puzzleImg;

function counter(rows: number, cols: number, image: string): void {
    let start = Date.now();
    let interval = setInterval( () => {
        let diff = timer - (((Date.now() - start) / 1000) | 0);
        document.getElementById("counter").innerHTML = `
            <h1 class="timer"> ${diff} </h1>
        `;

        if (diff <= 0) {
            clearInterval(interval);
            document.getElementById("counter").innerHTML = `<h1 class="timer"> START </h1>`;
            loadPuzzle(rows, cols, image);
        } 
    }, 1000);
}

function loadPuzzle(rows: number, cols: number, img: string): void {
    console.log("halalo");
   /* puzzleImg = document.getElementById("submit").addEventListener("click", ( evt ) => {
        evt.preventDefault();

    }); */  
}

function toBase64 ( file: File ): Promise<any> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = ( ) => {
            resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
    });
}

async function onSubmit(evt: MouseEvent): Promise<void> {
    evt.preventDefault();

    const rows = parseInt(inputRows.value);
    const cols = parseInt(inputCols.value);
    const imageFile = inputImg.files[0];
    const imageBase64Uri = await toBase64(imageFile);
    counter(rows, cols, imageBase64Uri);

    elemPuzzle.innerHTML = `
        <div class="col-xl-12">
            <div class="puzzle-container">
                <img src="${imageBase64Uri}" alt="puzzle" >
            </div>
        </div> `;
    
}

function updateImgFilename(): void {
    if ( inputImg.files && inputImg.files[0] ) {
        elemImgFilename.innerText = inputImg.files[0].name;
    } else {
        elemImgFilename.innerText = 'Datei auswählen ...';
    }
}

function main(): void {
    // document.getElementById('container').innerHTML = this.puzzle();

    document.getElementById("submit").addEventListener("click", onSubmit);
    inputImg.addEventListener('change', updateImgFilename);

    updateImgFilename();
}

main();
