var myBag = [];
myBag.push({ name: 'pokeball', quantity: 5, image: 'items/pokeball.png' });
function showBag() {
	let bagContents = '<ol>';
	for (let i = 0; i < myBag.length; i++) {
		bagContents +=
			"<li><button onclick='catchPokemon()'><img src='" +
			myBag[i].image +
			"'/><h3>x" +
			myBag[i].quantity +
			'</h3></button></li>';
	}
	bagContents += '</ol>';
	document.getElementById('myBag').innerHTML = '<h4>My Bag</h4>' + bagContents;
}

var pokeballPrice = 50;
function showShop() {
	document.getElementById('shop').innerHTML =
		"<h3>Shop</h3><form><div><label for='pokeball-number'></label><input type='number' id='pokeball-number'/></div><div>1 pokeball = " +
		pokeballPrice +
		" Bucks</div><div><input type='button' onclick='shopPokeball()' value='shop'/></div></form>";
}

function shopPokeball() {
	var quantity = parseInt(document.getElementById('pokeball-number').value);
	let price = 0;
	if (quantity > 0) {
		price = quantity * pokeballPrice;
		if (price > myMoney) {
			alert('Unsufficient money');
		} else {
			myMoney -= price;
			myBag[0].quantity += quantity;
			showBag();

			document.getElementById('myMoney').innerHTML = 'Money:' + myMoney;
		}
	} else {
		alert('Please enter a numeric value');
	}
}
