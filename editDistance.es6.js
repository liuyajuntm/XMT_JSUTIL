//递归版本，性能太差， 10+字符就已经很慢了
// const editDistance = (src, dst)=>{
// 	if(src.length == 0 && dst.length == 0){
// 		return 0;
// 	}
// 	else if(src.length == 0 && dst.length > 0){
// 		return dst.length;
// 	}
// 	else if(dst.length == 0 && src.length > 0){
// 		return src.length;
// 	}
// 	else{
// 		return Math.min(editDistance(src.substr(0, src.length - 1),dst) + 1,  
// 			editDistance(src,dst.substr(0, dst.length - 1)) + 1,
// 			editDistance(src.substr(0, src.length - 1),dst.substr(0, dst.length - 1)) + 
// 			singleStep(src.charAt(src.length - 1), dst.charAt(dst.length - 1)));
// 	}
// }

//reference:
//http://www.cnblogs.com/grenet/archive/2010/06/01/1748448.html
//http://blog.csdn.net/majinfei/article/details/16979049
//


let src = "tangmin";
let dst = "angdminm";

const singleStep = (src , dst)=>{
	if(src === dst){
		return 0
	}
	return 1;
}

const DIRECTION = {
	LEFT: -1,
	MID : 0,
	UP: 1
}

const getDirection = (Int pre_row,Int pre_column,Int now_row,Int now_column)=>{
	if(now_row - pre_row === 1 && now_column - pre_column === 1){
		return DIRECTION.MID;
	}
	if(now_row - pre_row === 1 && now_column - pre_column === 0)
	{
		return DIRECTION.UP;
	}
	if(now_row - pre_row === 0 && now_column - pre_column === 1){
		return DIRECTION.LEFT;
	}
}


const editDistanceDP = (src, dst)=>{
	let srcLen = src.length + 1;//m
	let dstLen = dst.length + 1;//n
	let store = new Array();
	for(let i = 0; i < srcLen; i++){
		let row = new Array(dstLen);
		row.fill(-1);//init as an impossible vale
		store.push(row);
	}
	for(let i = 0; i < srcLen; i++){
		store[i][0] = i;
	}
	for(let j = 0; j < dstLen; j++){
		store[0][j] = j;
	}
	for(let i = 1; i < srcLen; i++){
		for(let j = 1; j <dstLen; j++){
			let upValue = store[i - 1][j] + 1;
			let leftValue = store[i][j - 1] + 1;
			let midValue = store[i - 1][j - 1] + singleStep(src[i - 1], dst[j - 1]);
			store[i][j] = Math.min(upValue, leftValue, midValue);
		}
	}
	return store;
}


const backTracking = (store, src, dst)=>{
	let srcLen = src.length;
	let dstLen = dst.length;
	let len = srcLen > dstLen ? srcLen : dstLen;
	let srcArr = new Array(len);
	let dstArr = new Array(len);
	let i = srcLen;
	let j = dstLen;
	let k = 0;
	while(i > 0 && j > 0){
		if(src.charAt(i - 1) === dst.charAt(j - 1)){
			srcArr[k] = src.charAt(i - 1);
			dstArr[k] = dst.charAt(j - 1);
			i--;
			j--;
			k++;
		}
		else{
			let pre_i = 0;
			let pre_j = 0;
			if(store[i][j-1] >= store[i-1][j]){
				pre_i = i - 1;
				pre_j = j;
			}
			else{
				pre_i = i;
				pre_j = j -1;
			}
			if(store[pre_i][pre_j] > store[i - 1][j - 1]){
				pre_i = i - 1;
				pre_j = j - 1;
			}
			let direction = getDirection(pre_i, pre_j, i, j);
			switch(direction){
				case DIRECTION.MID:
					srcArr[k] = src.charAt(i - 1);
					dstArr[k] = dst.charAt(j - 1);
				break;
				case DIRECTION.UP:
					srcArr[k] = src.charAt(i - 1);
					dstArr[k] = '_';
				break;
				case DIRECTION.LEFT:
					srcArr[k] = "_";
					dstArr[k] = dst.charAt(j - 1);
				break;
				default:
					console.log("error:: backTracking the direction is : " + direction);
				break;
			}
			k++;
			i = pre_i;
			j = pre_j;
		}
	}
	if(j === 0 && i > 0){
		for(let index = i; index > 0; index --){
			srcArr[k] = src.charAt(index - 1);
			dstArr[k] = "_";	
			k++;
		}
	}
	else if(j > 0 && i === 0 ){
		for(let index = j; index > 0; index --){
			srcArr[k] = "_";
			dstArr[k] = dst.charAt(index - 1);
			k++;
		}
		
	}
	return {srcArr, dstArr};
}
//console.log("recur: " + editDistance(src, dst));
//console.log("dp : " + editDistanceDP(src,dst));

let {srcArr, dstArr} = backTracking(editDistanceDP(src,dst), src, dst);
console.log("src : " + srcArr.reverse());
console.log("dst : " + dstArr.reverse());

