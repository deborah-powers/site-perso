/* fixer une variable à partir de paramètres passés en url
<a href='page?url=bla/bla'>
<link href='$site-dp$/structure.css'/>
*/
String.prototype.replace = function (wordOld, wordNew){
	if (this.indexOf (wordOld) >=0){
		if (! wordNew) wordNew ="";
		var tabText = this.split (wordOld);
		return tabText.join (wordNew);
	}
	else return this;
}
Location.prototype.getParams = function(){
	let params ={};
	if (this.search && this.search.length >1){
		let queryStr = this.search.slice (1, this.search.length);
		queryStr = queryStr.replace ('=', '&')
		const queryLst = queryStr.split ('&');
		for (var i=0; i< queryLst.length; i=i+2) params [queryLst[i]] = queryLst[i+1];
	}
	return params;
}
params = window.location.getParams();
document.head.innerHTML = document.head.innerHTML.replace ('$site-dp$', params.url);
