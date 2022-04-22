/** 
ボードイメイージ

0,    1,  2,  3,  4,  5,  6,  7,  8  

9,   {10, 11, 12, 13, 14, 15, 16, 17}
18,  {19, 20, 21, 22, 23, 24, 25, 26}
27,  {28, 29, 30, 31, 32, 33, 34, 35}
36,  {37, 38, 39, 40, 41, 42, 43, 44}
45,  {46, 47, 48, 49, 50, 51, 52, 53}
54,  {55, 56, 57, 58, 59, 60, 61, 62}
63,  {64, 65, 66, 67, 68, 69, 70, 71}
72,  {73, 74, 75, 76, 77, 78, 79, 80}

81,   82, 83, 84, 85, 86, 87, 88, 89, 90

ボードの外まで数字を入れておけば、端かどうかの判定がなくて済み簡潔なため
*/

//石の表示/非表示とターン切り替えに使う数字
const DISC_HIDDEN = 0;
const BLACK       = 1;
const WHITE       = 2;
const OUTSIDE     = 8;
const GAME_END    = 0;

//ボードの長さ
const BOARD_LENGTH = 9;

//マスの隣かどうかの判定に使う
const VERTICAL   = BOARD_LENGTH;
const DIAGONAL_R = BOARD_LENGTH - 1;
const DIAGONAL_L = BOARD_LENGTH + 1;
const HORIZONTAL = 1;

//ゲーム用のボードクラス
class OthelloBoard {
    constructor(parent) {
        this.parent = document.getElementById(parent);
        this.sqArr = new Array(91);
        this.makeBoard();
    }

    //ボードを作成する関数をコンストラクターと分ける
    makeBoard() {
        for (let i = 0; i < this.sqArr.length; i++) {
            //ボード上のセルを作る
            const el = document.createElement('div');
            el.className = 'cell';
            this.parent.appendChild(el);
            this.sqArr[i] = el;

            //外枠は表示なし
            if (Math.floor(i / BOARD_LENGTH) === 0 || Math.floor(i / BOARD_LENGTH) === 9 || i % BOARD_LENGTH === 0) {
                this.sqArr[i].style.display = 'none';
            }

            //最初に全てのセルを石で埋めておく
            const disc = document.createElement('div');
            disc.className = 'disc';
            disc.style.display = 'none';
            el.appendChild(disc);
            el.disc = disc;

            el.addEventListener('click', e => {
                onClickBoard(`${i}`);
            })
        }
    }
    
    //石の表示・非表示、黒(1)・白(2)
    //例 : setDisc(35, 1) -> ボード35の位置に黒石を表示
    setDisc(n, d) {
        this.sqArr[n].disc.style.display = d === 0? 'none' : 'block';
        if (d === 1) {
            this.sqArr[n].disc.style.backgroundColor = 'black';
        } else if (d === 2) {
            this.sqArr[n].disc.style.backgroundColor = 'white';
        }
    }

    //現在のボードの石の位置を取得して表示する
    currentDisc(discArr) {
        for (let i = 0; i < this.sqArr.length; i++) {
            this.setDisc(i, discArr.getNum(i));  //getNum(i) => OthelloDiscのdiscArr[i]
        }
    }
}

//石の動作クラス
class OthelloDisc {
    constructor() {
        this.discArr = new Array(91);
        this.turn;
        this.canReverse = false; //ボードクリック時に裏返せる石がなくてもターンが切り替わらないように変数追加
        this.initialSet();
    }

    //石の配置の初期設定
    initialSet() {
        for (let i = 0; i < this.discArr.length; i++) {
            if (Math.floor(i / BOARD_LENGTH) === 0 || Math.floor(i / BOARD_LENGTH) === 9 || i % BOARD_LENGTH === 0) {
                this.discArr[i] = OUTSIDE;
            } else {
                this.discArr[i] = DISC_HIDDEN;
            }
        }

        this.discArr[40] = WHITE;
        this.discArr[50] = WHITE;
        this.discArr[41] = BLACK;
        this.discArr[49] = BLACK;

        this.turn = BLACK;
    }

    //石の配置を決める配列の数字を取得するだけ
    getNum(n) {
        return this.discArr[n];
    }

    //石を置いて裏返し、ターンを切り替える
    moveDisc(pos) {
        const vector = [VERTICAL, -VERTICAL, HORIZONTAL, -HORIZONTAL, DIAGONAL_L, -DIAGONAL_L, DIAGONAL_R, -DIAGONAL_R];
        //既に石があったら置けない
        if (this.discArr[pos] !== 0) {
            alert('そこには置けません');
            return;
        }
        
        //置きたいマスの周りの全８方向について裏返せるか調べていく 
        for (let i = 0; i < vector.length; i++) {
            const oppositDisc = this.turn === WHITE? BLACK : WHITE; //相手の石
            const vec = vector[i];
            const currentPos = parseInt(pos);
            let num = currentPos + vec;
            let flipp = 0;
            if (this.discArr[num] === this.turn || this.discArr[num] === DISC_HIDDEN) {
                continue;
            }
            while (this.discArr[num] === oppositDisc) {
                num += vec;
                flipp++;
            }
            if (this.discArr[num] === this.turn) {
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
        this.turn = turn === WHITE? BLACK : WHITE;
        if (!this.canMoveDisc(this.turn)) {
            this.turn = this.turn === WHITE? BLACK : WHITE;
            alert('相手の石を置ける場所がありません。もう一度自分の番です。');
            if (!this.canMoveDisc(this.turn)) {  //パスが２回続いたら終局判定
                this.turn = GAME_END;
                alert('終局！！')
            }
        }        
        this.canReverse = false;
        return turn;
    }

    //打てるマスが存在するかを判定
    canMoveDisc(turn) {
        for (let i = 0; i < this.discArr.length; i++) {
            const pos = this.discArr[i];
            const vector = [VERTICAL, -VERTICAL, HORIZONTAL, -HORIZONTAL, DIAGONAL_L, -DIAGONAL_L, DIAGONAL_R, -DIAGONAL_R];

            //全ての空きマスについて打てるか調べていきたい
            if(pos === 0) {
                for (let j = 0; j < vector.length; j++) {
                    const oppositDisc = turn === WHITE? BLACK : WHITE; //相手の石
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
        
        //全ての空きマスについて打てない
        return false;
    }
}

//ゲーム状況の監視クラス
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
        if (turn === BLACK) {
            t.innerText = '黒の番です';
        } else if (turn === WHITE) {
            t.innerText = '白の番です';
        } else if (turn === GAME_END) {
            t.innerText = '終局です！';
        }
    }

    //石の数を集計して、石の数と勝敗を表示する
    countDisc(arr) {
        let blackCnt = 0;
        let whiteCnt = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === BLACK) {
                blackCnt++;
            } else if (arr[i] === WHITE) {
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
    alert('パスです');
    gameStatus.currentTurn(othelloDisc.turn);
}

//リセットボタンのクリックイベント
function onClickBtReset() {
    othelloDisc.initialSet();
    othelloBoard.currentDisc(othelloDisc);
    gameStatus.currentTurn(othelloDisc.turn);
}