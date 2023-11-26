/*
carousel-dp {
	width: 100%;
	height: 12cm;
	background-color: var(--text-color);
}
<carousel-dp images='imgList'> </carousel-dp>
l'espace est considéré comme le premier enfant qui permet de lancer la création des autres
var imgList =[
	'C:\\wamp64\\www\\html\\model-css\\exemple-img.bmp',
	'C:\\Users\\LENOVO\\Desktop\\images divers\\nuancier 16 couleurs.bmp',
	'C:\\Users\\LENOVO\\Desktop\\images divers\\jessica rae 3 sharkboy and shrimpgirl.jpg'
];
setCarouselImages();
*/
class Carousel extends HTMLElement{
	static observedAttributes =[ 'images' ];

	constructor(){
		super();
		this.posRef =0;
		this.images =[];
		this.imagesName ="";
	}
	connectedCallback(){
		this.style.display = 'flex';
		this.style.justifyContent = 'space-between';
		this.style.alignItems = 'stretch';
		const self = this;
		var nbChildren =0;
		var observer = new MutationObserver (function (mutations){
			nbChildren +=1;
			if (nbChildren ===1){
				self.appendChild (document.createElement ('button'));
				self.children[0].addEventListener ('click', function (event){ self.goLeft(); });
				self.children[0].style.flexGrow = '1';
				self.children[0].innerHTML = '<';
			}
			else if (nbChildren ===2){
				self.appendChild (document.createElement ('img'));
				self.children[1].style.flexGrow = '2';
				self.children[1].style.objectFit = 'contain';
				self.children[1].style.maxWidth = '50%';
			}
			else if (nbChildren ===3){
				self.appendChild (document.createElement ('button'));
				self.children[2].addEventListener ('click', function (event){ self.goRight(); });
				self.children[2].style.flexGrow = '1';
				self.children[2].innerHTML = '>';
		}});
		observer.observe (this, { childList: true });
	}
	setImages (images){
		// images est une list de string envoyée par l'utilisateur
		this.images = images;
		this.children[1].src = this.images[0];
	}
	attributeChangedCallback (name, oldValue, newValue){ this.imagesName = newValue; }
	goLeft(){
		this.posRef -=1;
		if (this.posRef <0) this.posRef = this.images.length -1;
		this.children[1].src = this.images [this.posRef];
	}
	goRight(){
		this.posRef +=1;
		if (this.posRef >= this.images.length) this.posRef =0;
		this.children[1].src = this.images [this.posRef];
}}
customElements.define ('carousel-dp', Carousel);

function setCarouselImages(){
	const carousels = document.getElementsByTagName ('carousel-dp');
	for (var c=0; c< carousels.length; c++) carousels[c].setImages (window [carousels[c].imagesName]);
}
