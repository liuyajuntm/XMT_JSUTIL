let walk = require("walk");
let nodePath = require("path");

let _getLastName = (string path)=>{
	let name = null;
	if(!(/\\/.test(path))){
		name = path;
	}
	else{
		name = path.match(/([^\\]+\\)+(.+)/);
		if(name){
			name = name[2];
		}
	}
	return name;
}
/*
*
*/

const _getWidgetDirMap = (String dirPath)=>{
	let widgetDirMap = new Map();
	let options = {
		listeners:{
			file: (dir,stat,next)=>{
				let path = nodePath.normalize(dir);
				let widgetSubDir = widgetDirMap.get(path);
				let name = null;
				if(widgetSubDir){
					name = _getLastName(path);
					if(!name){
						console.log("fail to get path name");
					}
					else{
						let strReg = "\^"+ name +"\\.";
						let reg = new RegExp(strReg);
						if(reg.test(stat.name)){
							widgetSubDir.push(nodePath.normalize(path + "/" + stat.name));
							widgetDirMap.set(path, widgetSubDir);
						}
					}
				}
				next();
			},
			directories: (root, dirStatsArray, next)=>{
				dirStatsArray.forEach((stat)=>{
					let dirPath = root + "/" + stat.name;
					dirPath = nodePath.normalize(dirPath);
					widgetDirMap.set(dirPath,[]);
				})
				next();
			}
		}
	}
	walk.walkSync(dirPath,options);
	return widgetDirMap;
}

let _capsuleWidget = (String path, Array files)=>{
	let widgetCapsule = {
		name : _getLastName(path),
		js: null,
		tpl: null,
		css: null
	};
	files.forEach((String file) =>{
		console.log("name : " + file);
		let jsReg = /(\.js)$/;
		let tplReg = /(\.html)$/;
		let cssReg = /(\.css)$/;
		if(jsReg.test(file)){
			widgetCapsule.js = file;
		}
		else if(tplReg.test(file)){
			widgetCapsule.tpl = file;
		}
		else if(cssReg.test(file)){
			widgetCapsule.css = file;
		}
	})
	if((!widgetCapsule.name) || (!widgetCapsule.js) || (!widgetCapsule.tpl)){
		return null;
	}
	return widgetCapsule;
}

let _getWidgetCapsuleMap = ()=>{
	let widgetCapsuleMap = new Map();
	let widgetDirMap = _getWidgetDirMap("./");
	for(let [path, files] of widgetDirMap.entries()){
		let capsule = _capsuleWidget(path, files);
		if(capsule){
			widgetCapsuleMap.set(capsule.name, capsule);
		}
	}
	return widgetCapsuleMap;
}


let widgetCapsuleMap = _getWidgetCapsuleMap();

for(let [widgetName, files] of widgetCapsuleMap.entries()){
	console.log("widget name : " + widgetName);
}