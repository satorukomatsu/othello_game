//ゲーム用のボードの定義
class OthelloBoard {
    constructor(parent) {
        this.parent = document.getElementById(parent);
        this.sqArr = new Array(91);
    
        for (let i = 0; i < 91; i++) {
            //ボード上のセルを作る
            const el = document.createElement('div');
            el.className = 'cell';
            this.parent.appendChild(el);
            this.sqArr[i] = el;

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
                onClickBoard(`${i}`);
                // console.log(`cell #${i}`)
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
        this.turn = 1;
        this.canReverse = false;

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

    //石の配置を決める配列の数字を取得するだけ
    getNum(n) {
        return this.discArr[n];
    }

    //石を置いて裏返し、ターンを切り替える
    moveDisc(pos) {
        const vector = [-10, -9, -8, -1, 1, 8, 9, 10]  //打ちたいマスの隣を判定するための数字

        //既に石があったら置けない
        if (this.discArr[pos] !== 0) {
            alert('そこには置けません');
            return;
        }
        
        //置きたいマスの周りの全８方向について裏返せるか調べていく 
        for (let i = 0; i < vector.length; i++) {
            const oppositDisc = this.turn === 2? 1 : 2; //相手の石
            // console.log('相手の石' + oppositDisc)
            const vec = vector[i];
            const currentPos = parseInt(pos);
            let num = currentPos + vec;
            let flipp = 0;
            if (this.discArr[num] === this.turn || this.discArr[num] === 0) {
                continue;
            }
            while (this.discArr[num] === oppositDisc) {
                num += vec;
                flipp++;
                // console.log('flipp #' + flipp)
            }
            if (this.discArr[num] === this.turn) {
                // console.log('実際の数字' + this.discArr[num])
                // console.log('myturn' + this.turn)
                for (let i = 0; i < flipp; i++) {
                    this.discArr[num - vec] = this.turn;
                    num -= vec;
                }
                this.discArr[pos] = this.turn;
                this.canReverse = true;
            }
        }

        //裏返せる石が見つかったらターンを切り替える
        if (this.canReverse) {
            this.setNextTurn(this.turn);
        }
    }

    //ターンの切り替えとパスしなければならないか
    setNextTurn(turn) {
        this.turn = turn === 2? 1 : 2;
        if (!this.canMoveDisc(this.turn)) {
            this.turn = this.turn === 2? 1 : 2;
            alert('石を置ける場所がありません。相手の番に移ります。');
            if (!this.canMoveDisc(this.turn)) {  //パスが２回続いたら終局判定
                this.turn = 0;
                alert('終局！！')
            }
        }        
        this.canReverse = false;
        return turn;
    }

    //打てるマスが存在するかを判定
    canMoveDisc(turn) {
        for (let i = 0; i < 91; i++) {
            const pos = this.discArr[i];
            const vector = [-10, -9, -8, -1, 1, 8, 9, 10]  //打ちたいマスの隣を判定するための数字

            //全ての空きマスについて打てるか調べていきたい
            if(pos === 0) {
                for (let j = 0; j < vector.length; j++) {
                    const oppositDisc = turn === 2? 1 : 2; //相手の石
                    const vec = vector[j];
                    let num = i + vec; //隣のマスの番号
                    
                    if (this.discArr[num] === turn || this.discArr[num] === 0) {
                        continue;
                    }
                    while (this.discArr[num] === oppositDisc) {
                        num += vec;   
                    }
                    if (this.discArr[num] === turn) {
                        return true;
                    }
                } 
            }
        }
        
        //全ての空きマスについて打てないならターンの切り替え
        return false;
    }

    //石の位置を全て初期値に戻す
    resetDisc() {
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

        this.turn = 1;
    }
}

//ゲームの状況を監視する
class GameStatus {
    constructor() {
        const cnt = document.getElementById('button__cnt');
        const pass = document.getElementById('button__pass');
        const reset = document.getElementById('button__reset');

        cnt.addEventListener('click', e => {
            onClickBtCnt();
        })
        pass.addEventListener('click', e => {
            onClickBtPass();
        })
        reset.addEventListener('click', e => {
            onClickBtReset();
        })
    }

    //現在のターンの監視と表示
    currentTurn(turn) {
        const t = document.getElementById('turn');
        if (turn === 1) {
            t.innerText = '黒の番です';
        } else if (turn === 2) {
            t.innerText = '白の番です';
        } else if (turn === 0) {
            t.innerText = '終局です！';
        }
    }

    //石の数を集計して、石の数と勝敗を表示する
    countDisc(arr) {
        let blackCnt = 0;
        let whiteCnt = 0;
        for (let i = 0; i < 91; i++) {
            if (arr[i] === 1) {
                blackCnt++;
            } else if (arr[i] === 2) {
                whiteCnt++;
            }
        }
        if (blackCnt === whiteCnt) {
            alert(`黒：${blackCnt} / 白：${whiteCnt}で引き分け！`)
        } else if (blackCnt > whiteCnt) {
            alert(`黒：${blackCnt} / 白：${whiteCnt}で黒の勝ち！`)
        } else {
            alert(`黒：${blackCnt} / 白：${whiteCnt}で白の勝ち！`)
        }
    }
}

const othelloBoard = new OthelloBoard('board');
const othelloDisc  = new OthelloDisc();
const gameStatus   = new GameStatus();

othelloBoard.currentDisc(othelloDisc);

//ボード上のクリックイベント
function onClickBoard(pos) {
    othelloDisc.moveDisc(pos);                 //石が置けるかの判定と裏返し処理
    othelloBoard.currentDisc(othelloDisc);     //石の表示
    gameStatus.currentTurn(othelloDisc.turn);  //現在のターンの監視
}

//集計ボタンのクリックイベント
function onClickBtCnt() {
    gameStatus.countDisc(othelloDisc.discArr);
}

//パスボタンのクリックイベント
function onClickBtPass() {
    othelloDisc.setNextTurn(othelloDisc.turn);
    gameStatus.currentTurn(othelloDisc.turn);
}

//リセットボタンのクリックイベント
function onClickBtReset() {
    othelloDisc.resetDisc();
    othelloBoard.currentDisc(othelloDisc);
    gameStatus.currentTurn(othelloDisc.turn);
}