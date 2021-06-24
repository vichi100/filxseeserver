// const sum = 8 + 8.1 + 9.2;
// const avg = sum / 3;
// console.log(avg);
// const love = avg * avg / 10;
// console.log('love: ', love);
// const ent = 7 * 3 / 10;
// console.log('ent: ', ent);
// const timePass = ent * 8 / 10;
// console.log('time: ', timePass);

function* splitNParts(num, parts) {
	let sumParts = 0;
	for (let i = 0; i < parts - 1; i++) {
		const pn = Math.fround(Math.random() * (num - sumParts));
		yield pn;
		sumParts += pn;
	}
	yield num - sumParts;
}
var x = splitNParts(4, 3);

console.log([ ...x ]);
