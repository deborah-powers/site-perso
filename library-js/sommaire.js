// const titleTag =[ 'H1', 'H2', 'H3', 'H4', 'H5', 'H6' ];
const titleTag =[ 'H1', 'H2', 'H3' ];
const summaryStyle =`
<style type='text/css'>
	ul#summary {
		color: purple;
		background-color: ivory;
		border: solid 2px purple;
		list-style-type: none;
	}
	ul#summary *{
		color: inherit;
		background-color: inherit;
	}
	ul#summary > li.H1 {
		color: ivory;
		background-color: purple;
	}
	ul#summary > li.H2 { font-weight: bold; }
	ul#summary > li.H3 { margin-left: 2em; }
	ul#summary > li:focus-within {
		background-color: palegreen;
		color: purple;
	}
	ul#summary span {
		/* source: https://gist.github.com/ffoodd/000b59f431e3e64e4ce1a24d5bb36034
		visibles uniquement par les lecteurs d'écran */
		clip: rect(1px, 1px, 1px, 1px);
		-webkit-clip-path: inset(50%);
		clip-path: inset(50%); 
		overflow: hidden;
		width: 1px;
		height: 1px;
		margin: -1px;
		white-space: nowrap;
		padding: 0;
		border: 0;
		position: absolute;
	}
</style>`;

HTMLElement.prototype.getTitles = function(){
	var titleList =[];
	if (titleTag.includes (this.tagName)) titleList.push (this);
	else{
		var titleChild =[];
		for (var child of this.children){
			titleChild = child.getTitles();
			for (var tchild of titleChild) titleList.push (tchild);
	}}
	return titleList;
}
HTMLElement.prototype.linkTemplate = function(){
	var level = 'intitulé';
	if (this.tagName === 'H2') level = 'chapître';
	else if (this.tagName === 'H3') level = 'section';
	return `\n<li class='${this.tagName}'><a href='#${this.id}'><span>${level} </span>${this.innerText}</a></li>`;
}
function linkTemplate (tagName, linkId, message){
	var level = 'chapître';
	if (tagName === 'H2') level = 'section';
	else if (tagName === 'H3') level = 'sous-section';
	return `\n<li class='${tagName}'><span>${level}</span><a href='#${linkId}'>${message}</a></li>`;
}
HTMLBodyElement.prototype.createSummary = function(){
	const titleList = this.getTitles();
	var summary ="<ul id='summary' aria-label='sommaire'>";
	for (var t=0; t< titleList.length; t++){
		if (titleList[t].id ==="") titleList[t].id = 'h'+t;
		summary = summary + titleList[t].linkTemplate();
	//	summary = summary + linkTemplate (titleList[t].tagName, titleList[t].id, titleList[t].innerText);
	}
	summary = summary + '\n</ul>';
	if (! document.head.innerHTML.includes ('ul#summary')) document.head.innerHTML = document.head.innerHTML + summaryStyle;
	this.innerHTML = summary + this.innerHTML;
}
HTMLAnchorElement.prototype.showFocus = function(){
	this.onFocus = function (event){
		console.log (event.target);
		vent.target.parentElement.style.backgroundColor = 'orange';
	}
}
document.body.createSummary();
// const titles = document.querySelectorAll ('h1,h2');