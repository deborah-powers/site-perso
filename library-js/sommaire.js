// const titleTag =[ 'H1', 'H2', 'H3', 'H4', 'H5', 'H6' ];
const titleTag =[ 'H1', 'H2', 'H3' ];
const summaryStyle =`
<style type='text/css'>
	ul#summary {
		color: purple;
		background-color: ivory;
	}
	ul#summary *{
		color: inherit;
		background-color: inherit;
	}
	ul#summary > li.H1 {
		font-size: 1.5em;
		color: ivory;
		background-color: purple;
	}
	ul#summary > li.H3 { margin-left: 2em; }
</style>`;

HTMLElement.prototype.getTitles = function(){
	var titleList =[];
	if (titleTag.includes (this.tagName)) titleList.push (this);
	else{
		var titleChild =[];
		for (var child of this.children){
			titleChild = child.getSummary();
			for (var tchild of titleChild) titleList.push (tchild);
	}}
	return titleList;
}
function linkTemplate (tagName, linkId, message){ return `\n<li class='${tagName}'><a href='#${linkId}'>${message}</a></li>`; }
HTMLBodyElement.prototype.createSummary = function(){
	const titleList = this.getTitles();
	var summary ="<ul id='summary'>";
	for (var t=0; t< titleList.length; t++){
		if (titleList[t].id === undefined) titleList[t].id = 'h'+t;
		summary = summary + linkTemplate (titleList[t].tagName, titleList[t].id, titleList[t].innerText);
	}
	summary = summary + '\n</ul>';
	if (! document.head.innerHTML.includes ('ul#summary')) document.head.innerHTML = document.head.innerHTML + summaryStyle;
	this.innerHTML = summary + this.innerHTML;
}
document.body.createSummary();
// const titles = document.querySelectorAll ('h1,h2');