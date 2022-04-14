//ゲーム用のボードの定義
class OthelloBoard {
    constructor(parent) {
        this.parent = document.getElementById(parent);
        this.sqArr = new Array(91);
        this.tarn = 1;  //ターン：黒ー１、白−２
    
        for (let i = 0; i < 91; i++) {
            //ボード上のセルを作る
            const el = document.createElement('div');
            el.className = 'cell';
            this.parent.appendChild(el);
            this.sqArr[i] = el;
            console.log(this.sqArr[i])

            //外枠は表示なし
            if (Math.floor(i / 9) === 0 || Math.floor(i / 9) === 9 || i % 9 === 0) {
                this.sqArr[i].style.display = 'none';
            }

            //最初に全てのセルを石で埋めておく
            const disc = document.createElement('div');
            disc.className = 'disc';
            disc.style.display = 'none';
            el.appendChild(disc);
            el.disc = disc;

            //クリックしたら反応するイベント
            el.addEventListener('click', e => {
                onClickBoard(`${i}`)
            })
        }
    }
    
    //石の表示・非表示、黒・白
    setDisc(n, d) {
        this.sqArr[n].disc.style.display = d === 0? 'none' : 'block';
        if (d > 0) {
            this.sqArr[n].disc.style.backgroundColor = d === 1? 'black' : 'white';
        }
    }

    //現在の盤上の数字を取得して石を表示する
    currentDisc(discArr) {
        for (let i = 0; i < 91; i++) {
            this.setDisc(i, discArr.getNum(i));
        }
    }
}



//石の動作の定義
class OthelloDisc {
    constructor() {
        this.discArr = new Array(91);
        this.vector = [1]
        this.turn = 1;

        //石の表示
        //非表示 　　　: 0
        //黒    　　　: 1
        //白    　　　: 2
        //ボードの外枠: 8
        for (let i = 0; i < 91; i++) {
            if (Math.floor(i / 9) === 0 || Math.floor(i / 9) === 9 || i % 9 === 0) {
                this.discArr[i] = 8;
            } else {
                this.discArr[i] = 0;
            }
        }

        this.discArr[40] = 2;
        this.discArr[50] = 2;
        this.discArr[41] = 1;
        this.discArr[49] = 1;
    }

    //配列の数字を取得するだけ
    getNum(n) {
        return this.discArr[n];
    }

    //石を置いて裏返す
    moveDisc(pos) {
        if (this.discArr[pos] !== 0) {  //既に石があったら置けない
            alert('そこには置けません');
            return;
        }
        const oppositDisc = this.turn === 2? 1 : 2;
        for (let i = 0; i < this.vector.length; i++) {
            const vec = this.vector[i];
            let currentPos = parseInt(pos);
            let n = currentPos + vec;
            let flipp = 0;
            if (this.discArr[n] === this.turn) {
                alert('そこには置けません');
                return;
            }
            while (this.discArr[n] === oppositDisc) {
                n += vec;
                flipp++;
            }
            if (this.discArr[n] === this.turn) {
                for (let i = 0; i < flipp; i++) {
                    this.discArr[n - vec] = this.turn;
                }
                this.discArr[pos] = this.discArr;
            }
        }
    }
    
}

const othelloBoard = new OthelloBoard('board');
const othelloDisc = new OthelloDisc();

othelloBoard.currentDisc(othelloDisc)

function onClickBoard(pos) {
    // console.log(pos)
    othelloDisc.moveDisc(pos);
    othelloBoard.currentDisc(othelloDisc);
}