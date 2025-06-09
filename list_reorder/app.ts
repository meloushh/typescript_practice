let active_drag: Drag|null = null;
let hovered_item: HTMLElement|null = null;



let reorderable_lists = document.querySelectorAll<HTMLElement>('.list_reorderable');
reorderable_lists.forEach((list: HTMLElement) => {
    list.onmousedown = ListMouseDown;
    list.onmousemove = ListMouseMove;
})
document.onmouseup = MouseUp;








class Drag {
    list: HTMLElement;
    item_height: number = 0;
    source_i: number = -1;
    target_i: number = -2;
    items: Array<HTMLElement> = [];

    constructor(event: MouseEvent) {
        this.list = event.currentTarget as HTMLElement;
        for (const child of this.list.children) {
            this.items.push(child as HTMLElement);
        }
        this.item_height = this.list.offsetHeight / this.list.childElementCount;
        this.source_i = this.DetermineItemIndex(event);
        this.target_i = this.source_i;


        this.UpdateDisplay(event);
    }

    DetermineItemIndex(event: MouseEvent): number {
        let rel_y = event.clientY - this.list.offsetTop;
        let i = Math.floor(rel_y / this.item_height);
        return Math.min(i, this.items.length - 1);
    }

    End(): void {
        if (this.source_i !== this.target_i) {
            let temp = this.items[this.source_i];
            this.items[this.source_i] = this.items[this.target_i];
            this.items[this.target_i] = temp;

            this.list.replaceChildren();
            for (let i = 0; i < this.items.length; i++) {
                this.list.appendChild(this.items[i]);
            }
        }

        this.source_i = -1;
        this.target_i = -1;
        this.UpdateDisplay();
    }

    UpdateDisplay(event: MouseEvent|null = null): void {
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (this.target_i === i && this.target_i != this.source_i) {
                item.classList.add('target');
            }
            else if (this.source_i === i) {
                item.classList.add('source');
            } else {
                item.classList.remove('target', 'source');
            }
        }
    }
}

function ListMouseDown(event: MouseEvent) {
    active_drag = new Drag(event);
}

function ListMouseMove(event: MouseEvent) {
    if (active_drag !== null) {
        active_drag.target_i = active_drag.DetermineItemIndex(event);
        active_drag.UpdateDisplay(event);
    }
}

function MouseUp(event: MouseEvent) {
    if (active_drag !== null) {
        active_drag.End();
        active_drag = null;
    }
}
