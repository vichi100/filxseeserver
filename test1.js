// var ObjectId = require('mongodb').ObjectID;
// x = ObjectId('60aaf7257327bc18ab1586a1') > ObjectId('60aaf7257327bc18ab1586a0');
// y = ObjectId('60aaf7257327bc18ab1586a1') < ObjectId('60aaf7257327bc18ab1586a0');
// console.log(ObjectId('60aaf7257327bc18ab1586a1'));
// console.log(y);

// arr = [ ObjectId('60aaf7257327bc18ab1586a1'), ObjectId('60aaf7257327bc18ab1586a0') ];

// v = arr.sort((a, b) => {
// 	if (a > b) {
// 		return 1;
// 	} else if (b > a) {
// 		return -1;
// 	} else if (a === b) {
// 		return 0;
// 	}
// });

// console.log(v);

function addCount() {
	// Variable declaration
	const x = {};
	const a = [];
	var sum = 0;
	for (var i = 1; i < 10000000; i++) {
		// Adding i to the sum variable
		sum = sum + 1;
		// x[sum] = sum + 1;
		a.push(sum);
	}
	return sum; // returning sum
}

var timetaken = 'Time taken by addCount function';

// Starts the timer. The label value is timetaken
console.time(timetaken);

console.log(addCount()); // function call

// Ends the timer and print the time
// taken by the piece of code
console.timeEnd(timetaken);
