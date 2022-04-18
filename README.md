# Othello_Game
昔からの定番ゲーム「オセロ」をWeb上で！

# 開発環境
OS  
macOS Monterey v.12.3  
エディタ  
Visual Studio Code  

# 使用言語
HTML  
Sass  
Javascript  

# 概要
0,   1,  2,  3,  4,  5,  6,  7,  8  
9, {10, 11, 12, 13, 14, 15, 16, 17}  
18,{19, 20, 21, 22, 23, 24, 25, 26}   
27,{28, 29, 30, 31, 32, 33, 34, 35}
36,{37, 38, 39, 40, 41, 42, 43, 44}  
45,{46, 47, 48, 49, 50, 51, 52, 53}  
54,{55, 56, 57, 58, 59, 60, 61, 62}  
63,{64, 65, 66, 67, 68, 69, 70, 71}  
72,{73, 74, 75, 76, 77, 78, 79, 80}  
81, 82, 83, 84, 85, 86, 87, 88, 89, 90

・８x８マスのボードで添字は0〜90  
・片面が黒、もう片面が白の２色の石を使用  
・スタート時に黒２個、白２個の石が中央に配置された状態でスタート  
・黒が先攻、白が後攻で１つずつ石を順番に置いていく  
・マスが空いているところで、なおかつ相手の石を自分の石で挟めるところに石を置ける（縦、横、斜めが可）  
・相手の石を挟んだら、石を裏返し自分の石とする  
・自分の石を置けるマスがない場合はパスとなり、相手の順番に移る  
・ゲーム終了の条件は全てのマスが石で埋まるか、置いてある石が黒・白のどちらか１色のみになる  
・最終的に自分の石の数が多い場合に勝ちとなる

# 操作
・マウスで自分の打ちたいマスをクリックすると石を置ける