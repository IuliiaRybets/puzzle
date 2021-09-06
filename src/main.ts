const inputRows = document.getElementById("rows") as HTMLInputElement;
const inputCols = document.getElementById("cols") as HTMLInputElement;
const inputImg = document.getElementById("img") as HTMLInputElement;
const elemPuzzle = document.getElementById("puzzle") as HTMLDivElement;
const elemImgFilename = document.getElementById("imgfilename") as HTMLDivElement;
const timer = parseInt((3000 / 1000).toFixed(1));

let currDraggingPuzzleTile: HTMLDivElement | null = null;

function showCounter(value: string | number, isError?: boolean): void {
    document.getElementById("counter").innerHTML = `
        <h1 class="timer"> ${value} </h1>
    `;

    if ( isError ) {
        document.querySelector(".counter").classList.add('error');
    } else {
        document.querySelector(".counter").classList.remove('error');
    }
}

function loadPuzzle(rows: number, cols: number, image: string): void {    
    let puzzleCont = document.getElementById("puzzle-container") as HTMLDivElement;
    let w = puzzleCont.offsetWidth;
    let h = puzzleCont.offsetHeight;

    puzzleCont.style.width = w + 'px';
    puzzleCont.style.height = h + 'px';

    const puzzleDivs: Array<HTMLDivElement> = [];

    let i = 0;

    for ( let y = 0; y < cols; y++) {
        for (let x = 0; x < rows; x++) {
            const width = x * w / rows + "px";
            const height = y * h / cols + "px";
            const div = document.createElement("div");
            div.className = 'puzzle-tile';
            div.dataset.index = '' + i;

            div.style.flexGrow = '0'; 
            div.style.flexShrink = '0';
            div.style.width = w / rows + "px";
            div.style.height = h / cols + "px";            
            div.style.backgroundImage = "url(" + image + ")"
            div.style.backgroundPositionX = "-" + width;
            div.style.backgroundPositionY = "-" + height;
            div.style.backgroundSize = w + "px";
            div.style.backgroundRepeat = "no-repeat";
            div.draggable = true;

            div.addEventListener('dragstart', dragStart);
            div.addEventListener('dragend', dragEnd);
            div.addEventListener('dragover', dragOver);
            div.addEventListener('dragenter', dragEnter);
            div.addEventListener('dragleave', dragLeave);
            div.addEventListener('drop', drop);

            puzzleDivs.push(div);
            i++;
        }
    }

    shuffleArray(puzzleDivs);
    
    for ( const div of puzzleDivs ) {
        puzzleCont.appendChild(div);
    }

    document.getElementById("imgPzl").style.display = "none";

}

function dragStart(evt: Event): void {
    if ( ! running ) {
        evt.preventDefault();

        return;
    }

    currDraggingPuzzleTile = this;

    this.style.boxShadow = '10px 10px 20px rgba(0,0,0,0.5)';
}
  
function dragEnd(): void {
    currDraggingPuzzleTile = null;

    this.style.boxShadow = 'none';
}

function dragOver(evt: Event): void {
    evt.preventDefault();
}

function dragEnter(): void {
    this.style.opacity = '0.5';
}

function dragLeave(): void {
    this.style.opacity = '1';
}

function isFinished(): boolean {
    const puzzleTitles = document.querySelectorAll('.puzzle-container .puzzle-tile') as NodeListOf<HTMLDivElement>;

    for ( let i = 0; i < puzzleTitles.length; i++ ) {
        if ( puzzleTitles[i].dataset.index !== ('' + i) ) {
            return false;
        }
    }

    return true;
}

function checkIsFinished() {
    if ( isFinished() ) {
        finished = true;

        showCounter('Finished!');
        document.getElementById("submit").removeAttribute("disabled");
    }
}

function swapChildElements(parent: HTMLDivElement, child1: HTMLDivElement, child2: HTMLDivElement): void {
    const tmpElem = document.createElement('div');

    if ( !parent.contains(child1) || !parent.contains(child2) ) {
        // Child is not valid to be dropped, don't swap it
        return;
    }

    parent.replaceChild(tmpElem, child1);
    parent.replaceChild(child1, child2);
    parent.replaceChild(child2, tmpElem);
}

function drop() {

    if ( ! currDraggingPuzzleTile ) {
        return;
    }

    this.style.opacity = '1';
    this.style.boxShadow = 'none';

    currDraggingPuzzleTile.style.opacity = '1';
    currDraggingPuzzleTile.style.boxShadow = 'none';

    swapChildElements(this.parentElement, this, currDraggingPuzzleTile);

    checkIsFinished();
}

function sleep(ms: number): Promise<void> {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

let running = false;
let finished = false;

async function runGame(rows: number, cols: number, imageFileURI: string) {
    if ( running ) {
        return;
    }

    running = true;
    finished = false;

    for ( let counter = 3; counter >= 1; counter-- ) {
        showCounter(counter);

        await sleep(1000);
    }

    showCounter('Start');

    await sleep(1000);

    loadPuzzle(rows, cols, imageFileURI);

    for ( let counter = rows*cols*2; counter >= 0 && !finished; counter-- ) {
        showCounter(counter);

        await sleep(1000);
    }

    running = false;

    if ( finished ) {
        return;
    }

    showCounter('Failed', true);
    document.getElementById("submit").removeAttribute("disabled");
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

    if ( running ) {
        return;
    }

    document.getElementById("submit").setAttribute("disabled", "disabled");

    const rows = parseInt(inputRows.value);
    const cols = parseInt(inputCols.value);
    const imageFile = inputImg.files[0];
  
    if(!rows || !cols || !imageFile || (rows === 1 && cols === 1)) {
        elemPuzzle.innerHTML = `
        <div class="col-xl-12">
            <div id="puzzle-container" class="puzzle-container error">
                <h3>Bitte fühlen Sie alle Felder aus</h3>
            </div>
        </div> `;

        return;
    }

    const imageBase64Uri = await toBase64(imageFile);

    elemPuzzle.innerHTML = `
        <div class="col-xl-12">
            <div id="puzzle-container" class="puzzle-container">
                <img id="imgPzl" src="${imageBase64Uri}" alt="puzzle" >
            </div>
        </div> `;
    
    runGame(cols, rows, imageBase64Uri);
}

function updateImgFilename(): void {
    if ( inputImg.files && inputImg.files[0] ) {
        elemImgFilename.innerText = inputImg.files[0].name;
    } else {
        elemImgFilename.innerText = 'Datei auswählen ...';
    }
}

function main(): void {
   
    document.getElementById("submit").addEventListener("click", onSubmit);
    inputImg.addEventListener('change', updateImgFilename);
    
    updateImgFilename();
   
}

main();
