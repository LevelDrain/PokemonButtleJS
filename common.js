// -- グローバル変数初期化 --
// 最大HP
var maxEnemyHP = 3000;
var maxAllyHP = 500;
// 現在HP（変化する）
var enemyHP = 3000;
var allyHP = 500;
// メッセージに使用する変数
var allyAttack = 0;
var enemyAttack = 0;
var allySkill = null;
var enemySkill = null;
// 麻痺フラグ
var paralys = false;
var firstParalys = false;

// -- 敵ポケモン（enemy）のオブジェクト --
var enemy = {
	name: "たつべえ", // 敵の名前
	// 味方のダメージを通知（一括で管理）
	message: function () {
		var message = document.getElementById('message2');
		message.innerHTML = enemySkill + "！ " + enemyAttack + "ダメージを うけた";
	},
	// 「かえんほうしゃ」のダメージ計算と表示
	skill1: function () {
		enemyAttack = 100;
		allyHP = allyHP - 100;
		enemySkill = this.name + "の かえんほうしゃ";
		var meterberA = document.getElementById('allyDamaged');
		meterberA.value = allyHP / maxAllyHP * 100;
		this.message();
	},
	// 「ひっかく」のダメージ計算と表示
	skill2: function () {
		enemyAttack = 20;
		allyHP = allyHP - 20;
		enemySkill = this.name + "の ひっかく";
		var meterberA = document.getElementById('allyDamaged');
		meterberA.value = allyHP / maxAllyHP * 100;
		this.message();
	},
	// 「ひのこ」のダメージ計算と表示
	skill3: function () {
		enemyAttack = 50;
		allyHP = allyHP - 50;
		enemySkill = this.name + "の ひのこ";
		var meterberA = document.getElementById('allyDamaged');
		meterberA.value = allyHP / maxAllyHP * 100;
		this.message();
	},
	// 「だいもんじ」のダメージ計算と表示
	skill4: function () {
		enemyAttack = 150;
		allyHP = allyHP - 150;
		enemySkill = this.name + "の だいもんじ";
		var meterberA = document.getElementById('allyDamaged');
		meterberA.value = allyHP / maxAllyHP * 100;
		this.message();
	},
	// 敵の攻撃を一括管理するメソッド
	attack: function () {
		var cure = 0; // 麻痺解除フラグ

		if (paralys == true) {
			//麻痺していれば解除可能かどうか判定
			cure = Math.floor(2 * Math.random() + 1);

			if (cure == 1 || firstParalys == true) {
				// 「乱数1のとき」または「麻痺したターン」は攻撃できない
				firstParalys = false; //初回の麻痺フラグを解除
				var message = document.getElementById('message2');
				message.innerHTML = this.name + "は からだがしびれてうごかない！";
			} else if (cure == 2) {
				// 「乱数2のとき」は攻撃できないが、状態異常をリセット
				paralys = false;
				cure = 0; // 乱数の初期化
				message = document.getElementById('message2');
				message.innerHTML = this.name + "の しびれがとれた！";
			}
		} else {
			// ランダムにスキルを呼び出す
			var rand = Math.floor(4 * Math.random());
			switch (rand) {
				case 0:
					this.skill1(); // かえんほうしゃ
					break;
				case 1:
					this.skill2(); // ひっかく
					break;
				case 2:
					this.skill3(); // ひのこ
					break;
				case 3:
					this.skill4(); // だいもんじ
					break;
			}
		}
	}
}

// -- 味方ポケモン（ally）のオブジェクト --
var ally = {
	name: "ねこはち", // 味方の名前
	skill1: function () {
		// 通常攻撃技「でんきショック」
		allyAttack = 100;
		enemyHP = enemyHP - 100; // 相手へのダメージ計算
		allySkill = this.name + "の でんきショック";
		// 敵HPゲージの更新
		var meterberE = document.getElementById('enemyDamaged');
		meterberE.value = enemyHP / maxEnemyHP * 100;
		// メッセージの更新
		var message = document.getElementById('message1');
		message.innerHTML = allySkill + "！ " + allyAttack + "ダメージを あたえた";
	},
	skill2: function () {
		// 麻痺攻撃「でんじは」
		paralys = true;
		firstParalys = true;
		allySkill = this.name + "の でんじは";
		var message = document.getElementById('message1');
		message.innerHTML = enemy.name + "は まひしてしまった！";
	},
	skill3: function () {
		// HP回復「ねむる」
		allyHP = 500; // HPを回復させる
		var meterberA = document.getElementById('allyDamaged');
		meterberA.value = allyHP / maxAllyHP * 100; // 味方HPメーターの更新
		allySkill = this.name + "の ねむる";
		var message = document.getElementById('message1');
		message.innerHTML = this.name + "は " + allyHP + "かいふくした！";
	},
	// 味方の攻撃を一括管理するメソッド（ボタンと連動）
	attack: function (id) {
		switch (id) {
			case 0:
				this.skill1(); // でんきショック
				break;
			case 1:
				this.skill2(); // でんじは
				break;
			case 2:
				this.skill3(); // ねむる
				break;
		}
	}
}

// -- 戦闘結果を判定する関数 --
function judge() {
	if (allyHP <= 0 && enemyHP <= 0) {
		// 相打ちになって両方倒れた場合
		allyHP = 0;// マイナスにしない（以下同じ）
		enemyHP = 0;
		// 両方のポケモンの画像を消す
		document.getElementById('ally').style.backgroundImage = "none";
		document.getElementById('enemy').style.backgroundImage = "none";
		// メッセージの更新
		var message1 = document.getElementById('message1');
		var message2 = document.getElementById('message2');
		message1.innerHTML = "たたかえる ポ〇モンが いなくなった……";
		message2.innerHTML = "";
	} else if (allyHP <= 0) {
		// 先に味方ポケモンが倒れた場合
		allyHP = 0;
		// 味方ポケモンの画像を消す
		document.getElementById('ally').style.backgroundImage = "none";
		// メッセージの更新
		message1 = document.getElementById('message1');
		message2 = document.getElementById('message2');
		message1.innerHTML = ally.name + "は たおれた！";
		message2.innerHTML = "";
	} else if (enemyHP <= 0) {
		// 先に敵ポケモンが倒れた場合
		enemyHP = 0;
		// 敵ポケモンの画像を消す
		document.getElementById('enemy').style.backgroundImage = "none";
		// メッセージの更新
		message1 = document.getElementById('message1');
		message2 = document.getElementById('message2');
		message1.innerHTML = enemy.name + "を たおした！";
		message2.innerHTML = "";
	}

	// HP表示の更新（全ての計算結果を反映）
	var gageA = document.getElementById('HPgageA');
	var gageE = document.getElementById('HPgageE');
	gageA.innerHTML = allyHP + " / " + maxAllyHP;
	gageE.innerHTML = enemyHP + " / " + maxEnemyHP;
}


// -- 戦闘画面とボタンの処理 --
window.onload = function () {
	// HP表記の初期化
	var startGageE = document.getElementById('HPgageE');
	var startGageA = document.getElementById('HPgageA');
	startGageE.innerHTML = enemyHP + " / " + maxEnemyHP;
	startGageA.innerHTML = allyHP + " / " + maxAllyHP;

	// HPゲージの初期化
	var meterberE = document.getElementById('enemyDamaged');
	var meterberA = document.getElementById('allyDamaged');
	meterberE.value = enemyHP / maxEnemyHP * 100;
	meterberA.value = allyHP / maxAllyHP * 100;

	// 初期メッセージ
	var message1 = document.getElementById('message1');
	var message2 = document.getElementById('message2');
	message1.innerHTML = "ポ〇モンが あらわれた！";
	message2.innerHTML = "";

	// ボタン名を取得して配列に入れる
	var orders = document.getElementsByName("allySkill");
	var reset = document.getElementsByName("reset");

	// コマンド「でんきショック」
	orders[0].onclick = function () {
		ally.attack(0);
		enemy.attack();
		judge();

		// HPが0になった場合はボタンをロック（以下同じ）
		if (allyHP == 0 || enemyHP == 0) {
			for (var i = 0; i < 3; i++) {
				orders[i].disabled = true;
			}
		}
	};

	// コマンド「でんじは」
	orders[1].onclick = function () {
		ally.attack(1);
		enemy.attack();
		judge();
		if (allyHP == 0 || enemyHP == 0) {
			for (var i = 0; i < 3; i++) {
				orders[i].disabled = true;
			}
		}
	};

	// コマンド「ねむる」
	orders[2].onclick = function () {
		ally.attack(2);
		enemy.attack();
		judge();
		if (allyHP == 0 || enemyHP == 0) {
			for (var i = 0; i < 3; i++) {
				orders[i].disabled = true;
			}
		}
	};

	// リセットボタン
	reset[0].onclick = function () {
		// 各パラメータの初期化
		paralys = false;
		firstParalys = false;
		allyHP = maxAllyHP;
		enemyHP = maxEnemyHP;
		startGageE.innerHTML = enemyHP + " / " + maxEnemyHP;
		startGageA.innerHTML = allyHP + " / " + maxAllyHP;

		// 倒れたポケモンの画像を復帰
		document.getElementById('ally').style.backgroundImage = "url('images/bakemonP.png')";
		document.getElementById('enemy').style.backgroundImage = "url('images/bakemonL.png')";

		// HPゲージ・戦闘メッセージの更新
		meterberE.value = enemyHP / maxEnemyHP * 100;
		meterberA.value = allyHP / maxAllyHP * 100;
		message1.innerHTML = "ポ〇モンが あらわれた！";
		message2.innerHTML = "";

		// ボタンのロックを解除
		for (var i = 0; i < 3; i++) {
			orders[i].disabled = false;
		}
	};
}