function waitElementAppears (innerText){
	/*
	https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
	If you get "parameter 1 is not of type 'Node'" error, see
	https://stackoverflow.com/a/77855838/492336
	*/
	function resolveFunc (resolve){
		var observer = new MutationObserver (function (mutations){
//			mutations[0].target	élément dans lequel les nouveaux ont été insérés
//			mutations[0].addedNodes	élements insérés
			var n=0;
			const nbNodes = mutations[0].addedNodes.length;
			while (n< nbNodes && ! mutations[0].addedNodes[n].innerText.includes (innerText)) n+=1;
			if (n< nbNodes){
				observer.disconnect();
				resolve (mutations[0].addedNodes[n]);
		}});
		observer.observe (document.body, { childList: true, subtree: true });
		const element = document.body.findByInnerText (innerText);
		return resolve (element);
	}
	return new Promise (resolveFunc);
}
const elementAssync = waitElementAppears ('Oui');
elementAssync.then (function (element){ console.log ('assynchrone', element); });
const elementSync = await waitElementAppears ('Non');
console.log ('synchrone', elementSync);
