const app = {
    init() {
        this.container = document.querySelector(".grid-container");
        this.pickerContainer = document.querySelector(".color-picker");
        this.nbrCols = 100;
        this.nbrColors = 5;
        this.nbrRows = Math.floor(window.innerHeight/(window.innerWidth/this.nbrCols));
        this.interact();
    },
    interact() {
        window.addEventListener('resize', () => this.init());
        window.addEventListener('contextmenu', e => utils.setContext(e, this.pickerContainer));
        this.pickerContainer.addEventListener('mouseleave', function() { this.classList.remove('isVisible')})

        utils.makeRows(this.container, this.nbrRows, this.nbrCols);
        utils.appendPicker(this.pickerContainer, this.nbrColors);
    }
}

const utils = {
    isDrawing : false,
    lastTarget : null,
    drawingColor : "#ff0000",
    makeRows(container, rows, cols) {
        container.innerText = "";
        for (let i = 0; i < (rows * cols); i++) {
            let cell = document.createElement("div");
            cell.classList.add('grid-item');
            cell.addEventListener('mousedown', e => { this.isDrawing = true; this.draw(e); })
            cell.addEventListener('mouseup', () => { this.isDrawing = false; this.lastTarget = null; })
            cell.addEventListener('mousemove', e => this.draw(e))
            container.appendChild(cell);
        };
    },
    setContext(e, pickerContainer) {
        e.preventDefault();
        pickerContainer.style.top = `${e.clientY-5}px`;
        pickerContainer.style.left = `${e.clientX-5}px`;
        pickerContainer.classList.toggle('isVisible');
    },
    generateColors() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    generatePicker(nbrColors) {
        this.colors = [];
        for(let i = 0; i < nbrColors; i++) {
            this.colors.push(this.generateColors());
        }
        return this.colors;
    },
    appendPicker(pickerContainer, nbrColors) {
        pickerContainer.innerText = "";
        this.generatePicker(nbrColors).forEach(picker => {
            const c = document.createElement('div');
            c.style.backgroundColor = picker;
            c.addEventListener('click', e => { e.stopPropagation(); this.drawingColor = picker; });
            pickerContainer.appendChild(c);
        });
    },
    hexToRgb(hex) {
        hex = hex.substring(1);
        const [r, g, b] = [0, 2, 4]
            .map(el => hex.substr(el, 2))
            .map(el => parseInt(el, 16));
        return `rgb(${r}, ${g}, ${b})`;
    },
    draw(e) {
        if (e.which === 1 && this.isDrawing && e.target != this.lastTarget) {
            const targetColor = e.target.style.backgroundColor;
            let isActivated = e.target.classList.contains('activated');

            if (targetColor && targetColor != this.hexToRgb(this.drawingColor)) {
                isActivated = false;
            }

            if (!isActivated) {
                e.target.style.backgroundColor = this.drawingColor;
                e.target.classList.add('activated');
            } else {
                e.target.style.backgroundColor = null;
                e.target.classList.remove('activated');
            }

            this.lastTarget = e.target;
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    app.init();
})