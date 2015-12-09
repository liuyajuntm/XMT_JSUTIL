let walk = require("walk");
const _traverse = (String dirPath)=>{
	let arrPath = [];
	let options = {
		listeners:{
			file: (dir,stat,next)=>{
				let newRoot = dir.replace(/\\/,"/");
				arrPath.push(newRoot+ "/" + stat.name);	
				next();
			}
		}
	}
	walk.walkSync(dirPath,options);
	return arrPath;
}

console.log(_traverse("./"));