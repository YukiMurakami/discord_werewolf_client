# Discord人狼クライアント

## 実行方法
----
### 資材を持ってくる
- 置き場を決める
- 今回はapacheを使って、公開する
- /var/www/html 配下に discord_werewolf ディレクトリを作って、そこで資材を展開する
```
$ cd /var/www/html/discord_werewolf/
$ git clone https://github.com/YukiMurakami/discord_werewolf_client.git

$ cd discord_werewolf_client
```
- この時点で、apacheの設定やTLS化ができていれば、https://example.com/discord_werewolf/discord_werewolf_client/index.html
などでアクセスできる

-----

### 接続情報を設定する
```
// 本番用の設定ファイルにシンボリックリンクを張り替える
$ ln -sf config.prod.js config.js

// 接続情報を編集
$ vim config.js
// URIにws://HOST:PORT を設定。HOST, PORTはサーバー側に合わせる
// TLS化が必要な場合はwss://HOST:PORTとする
```
----

### 音の設定
- soundsディレクトリ以下のreadmeに沿って、必要な音声ファイルをいれる

----

### 背景画像の設定
- images/backgrounds ディレクトリ以下のreadmeに沿って、必要な16:9の背景画像をいれる

----

### バージョン履歴

#### 1.0
- 基本役職（村人、人狼、占い師、霊媒師、狩人、狂人、共有者、妖狐、狂信者、猫又、背徳者、パン屋）を追加
- 役かけ、連続護衛、初日占いのルール設定を追加

