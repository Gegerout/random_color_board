const container = document.querySelector(".container"),
size = document.querySelector("#size"),
gapSlider = document.querySelector("#gap"),
modeBtn = document.querySelector("#mode"),
shapeBtn = document.querySelector("#shape"),
colorBtn = document.querySelector("#color"),
colorPicker = document.querySelector("#color-picker"),
randomBtn = document.querySelector("#random-color"),
clearBtn = document.querySelector("#clear"),
saveBtn = document.querySelector("#save");

let spanBg = "#1e1f26", 
shape = "square", // circle, triangle, diamond
mode = "draw", 
color = "ff0000",
singleColor = false;

colors = [
    "#ff0000",
    "#ff4000",
    "#ff8000",
    "#ffbf00",
    "#ffff00",
    "#bfff00",
    "#80ff00",
    "#40ff00",
    "#00ff00",
    "#00ff40",
    "#00ff80",
    "#00ffbf",
    "#00ffff",
    "#00bfff",
    "#0080ff",
    "#0040ff",
    "#0000ff",
    "#4000ff",
    "#8000ff",
    "#bf00ff",
    "#ff00ff",
    "#ff00bf",
    "#ff0080",
    "#ff0040",
    "#ff0000"
]

function createGrid() {
    container.innerHTML = "";
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const spanWidth = parseInt(size.value);
    const spanHeight = parseInt(size.value);
    const gap = parseInt(gapSlider.value);

    //calculate the number of columns and rows to fill container

    const columns = Math.round(containerWidth / (spanWidth + gap));
    const rows = Math.round(containerHeight / (spanHeight + gap));

    //create the span elements and add to container

    for(let i = 0; i < rows; i++) {
        const row = document.createElement("div");
        row.classList.add("row");

        for(let j = 0; j < columns; j++) {
            const span = document.createElement("span");
            span.style.width = `${spanWidth}px`;
            span.style.height = `${spanHeight}px`;
            span.style.margin = `${gap / 2}px`;
            span.style.backgroundColor = spanBg;

            if (shape === "circle") {
                span.style.borderRadius = "50%";
            }

            if (shape === "triangle") {
                span.style.width = 0;
                span.style.height = 0;
                span.style.backgroundColor = "transparent";
                span.style.borderLeft = `${spanWidth / 2}px solid transparent`;
                span.style.borderRight = `${spanWidth / 2}px solid transparent`;
                span.style.borderBottom = `${spanHeight}px solid ${spanBg}`;
            }

            if (shape === "diamond") {
                span.style.transform = "rotate(45deg)";
            }

            row.appendChild(span);
        }

        container.appendChild(row);
    }
}

createGrid();

window.addEventListener("resize", () => {
    createGrid();
});

// mouse support

document.addEventListener("mousedown", function() {
    document.addEventListener("mousemove", mouseMoveHandler);
});

document.addEventListener("mouseup", function() {
    document.removeEventListener("mousemove", mouseMoveHandler);
});

function mouseMoveHandler(event) {
    const target = event.target;
    if (target.tagName === "SPAN") {
        // lets add erase functionality
        if(mode === "draw") {
            draw(target);
        }
        else {
            erase(target);
        }
    }
}

//add touch support

document.addEventListener("touchstart", function () {
    document.addEventListener("touchmove", touchMoveHandler) 
});

document.addEventListener("touchend", function () {
    document.removeEventListener("touchmove", touchMoveHandler) 
});

function touchMoveHandler(e) {
    //get the touch coordinates
    var touch = e.touches[0];
    var targetElement = document.elementFromPoint(touch.clientX, touch.clientY);

    if(targetElement.tagName === "SPAN") {
        if(mode === "draw") {
            draw(targetElement);
        }
        else {
            erase(targetElement);
        }
    }
}

function draw(target) {
    // if single color on use that color only else generate random color and user
    let randomColor = singleColor ? color : colors[Math.floor(Math.random() * colors.length)]

    if(shape === "square" || shape === "circle" || shape === "diamond") {
        target.style.backgroundColor = randomColor;
    }
    if(shape === "triangle") {
        const spanHeight = parseInt(size.value);
        target.style.borderBottom = `${spanHeight}px solid ${randomColor}`;
    }

    //add some glow
    // don't add glow to triangle as it looks weird
    if(shape !== "triangle") {
        target.style.boxShadow = `0 0 2px ${randomColor}, 0 0 10px ${randomColor}`;
    }
}

function erase(target) {
    if(shape === "square" || shape === "circle" || shape === "diamond") {
        target.style.backgroundColor = spanBg;;
    }
    if(shape === "triangle") {
        const spanHeight = parseInt(size.value);
        target.style.borderBottom = `${spanHeight}px solid ${spanBg}`;
    }
    target.style.boxShadow = "none";
}

modeBtn.addEventListener("click", () => {
    // if its draw make it erase or vice versa
    mode = mode === "draw" ? "erase" : "draw";
    modeBtn.textContent = mode;
});

shapeBtn.addEventListener("click", () => {
    const shapes = ["square", "circle", "triangle", "diamond"];
    const index = shapes.indexOf(shape);
    //select next shape from shapes array and if its last select first shape
    if(index < shapes.length - 1) {
        shape = shapes[index + 1];
    }
    else {
        shape = shapes[0];
    }

    shapeBtn.textContent = shape;

    //on changing shape recreate grid

    createGrid();
});

colorBtn.addEventListener("click", () => {
    colorPicker.click();
});

colorPicker.addEventListener("change", (e) => {
    color = e.target.value;
    colorBtn.style.backgroundColor = color;

    // turn on single color to use selected color

    singleColor = true;
});

//lets use random again on random btn

randomBtn.addEventListener("click", () => {
    singleColor = false;
});

// lets add size and gap change functional

size.addEventListener("input", () => {
    createGrid();
});

gapSlider.addEventListener("input", () => {
    createGrid();
});

clearBtn.addEventListener("click", clear);

//funny
// function clear() {
//     //adding a transition on clear
//     const spans = document.querySelectorAll("span");
//     spans.forEach((span) => {
//         draw(span);
//         setTimeout(() => {
//             erase(span);
//         }, 1000);
//     });
// }

function clear() {
    //adding a transition on clear
    const spans = document.querySelectorAll("span");
    spans.forEach((span) => {
        draw(span);
        setTimeout(() => {
            erase(span);
        }, 1000);
    });
}

function download() {
    html2canvas(container).then(function (canvas) {
        var link = document.createElement("a");
        link.download = "drawwal.png"
        link.href = canvas.toDataURL();
        link.click();
    })
}

saveBtn.addEventListener("click", download);