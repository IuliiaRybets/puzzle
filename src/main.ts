const inputRows = document.getElementById("rows") as HTMLInputElement;
const inputCols = document.getElementById("cols") as HTMLInputElement;
const inputImg = document.getElementById("img") as HTMLInputElement;
const elemPuzzle = document.getElementById("puzzle") as HTMLDivElement;
const elemImgFilename = document.getElementById("imgfilename") as HTMLDivElement;
const timer = parseInt((3000 / 1000).toFixed(1));

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

function loadPuzzle(rows: number, cols: number, image: string): void {    
    let puzzleCont = document.getElementById("puzzle-container") as HTMLDivElement;
    let w = puzzleCont.offsetWidth;
    let h = puzzleCont.offsetHeight;

    puzzleCont.style.width = w + 'px';
    puzzleCont.style.height = h + 'px';

    const puzzleDivs: Array<HTMLDivElement> = [];

    for (let x = 0; x < rows; x++) {
        for ( let y = 0; y < cols; y++) {
            const width = x * w / rows + "px";
            const height = y * h / cols + "px";
            const div = document.createElement("div");

            div.style.flexGrow = '0'; 
            div.style.flexShrink = '0';
            div.style.width = w / rows + "px";
            div.style.height = h / cols + "px";            
            div.style.backgroundImage = "url(" + image + ")"
            div.style.backgroundPositionX = "-" + width;
            div.style.backgroundPositionY = "-" + height;
            div.style.backgroundSize = w + "px";
            div.style.backgroundRepeat = "no-repeat";

            puzzleDivs.push(div);
        }
    }

    shuffleArray(puzzleDivs);

    for ( const div of puzzleDivs ) {
        puzzleCont.appendChild(div);
    }

    document.getElementById("imgPzl").style.display = "none";
}

function shuffleArray<T>(arr: Array<T>): void {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
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
    console.log(rows, cols, imageFile);
    if(rows && cols && imageFile) {
        counter(rows, cols, imageBase64Uri);

        elemPuzzle.innerHTML = `
            <div class="col-xl-12">
                <div id="puzzle-container" class="puzzle-container">
                    <img id="imgPzl" src="${imageBase64Uri}" alt="puzzle" >
                </div>
            </div> `;
    } else {
        elemPuzzle.innerHTML = `
        <div class="col-xl-12">
            <div id="puzzle-container" class="puzzle-container">
                <h3>Bitte fühlen Sie alle Fehlder ein</h3>
            </div>
        </div> `;
    }
   
    
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
