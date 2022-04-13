//ゲーム用のボード
class OthelloBoard {
    constructor(parent) {
        this.parent = document.getElementById(parent);
        const sqArr = new Array(90);
    
        for (let i = 0; i < 91; i++) {
            //ボード上のセルを作る
            const el = document.createElement('div');
            el.className = 'cell';
            el.id = `${i}`;
            this.parent.appendChild(el);
            sqArr[i] = el;

            //外枠は表示なし
            if (Math.floor(i / 9) === 0 || Math.floor(i / 9) === 9 || i % 9 === 0) {
                document.getElementById(`${i}`).style.display = 'none';
            }

            //最初に全てのセルを石で埋めておく
            this.cell = document.getElementById(`${i}`);
            const disc = document.createElement('div');
            this.cell.appendChild(disc);
            disc.className = 'disc';
            disc.style.display = 'none';          
        }
    }

    //石の表示
    //非表示 : 0
    //黒    : 1
    //白    : 2
    //ボードの外枠: 8
    setDisc(n, d) {
        const cellNum = document.getElementById(`${n}`);
        const disc = cellNum.firstChild;
        if(d === 1) {
            disc.style.display = 'block';
            disc.style.backgroundColor = 'black';
        } else if(d === 2) {
            disc.style.display = 'block';
            disc.style.backgroundColor = 'white';
        }
    }

}

const othelloBoard = new OthelloBoard('board');

//スタート時の石の配置　(位置, 色)
othelloBoard.setDisc( 40,  2);
othelloBoard.setDisc( 50,  2);
othelloBoard.setDisc( 41,  1);
othelloBoard.setDisc( 49,  1);