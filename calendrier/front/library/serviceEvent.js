angular.module ('events').service ('eventService', function(){
	function createEvt(){
		var event ={
			// champs de la date
			year:			2018,
			month:			1,
			day:			1,
			hour:			0,
			minute:			0,
			recurrence:		'no',
			// champs du lieu
			city:			"",
			adress:			"",
			itinerary:		"",
			// champs du contact
			contact_name:	"",
			contact_coord:	"",
			// champs des infos
			title:			"",
			note:			"",
			tags:			"",
			priority:		'low'
		};
		return event;
	}
	function copyEvt (evt){
		var newEvt = createEvt();
		// champs de la date
		newEvt.year				= evt.year;
		newEvt.month			= evt.month;
		newEvt.day				= evt.day;
		newEvt.hour				= evt.hour;
		newEvt.minute			= evt.minute;
		newEvt.recurrence		= evt.recurrence;
		// champs du lieu
		newEvt.city				= evt.city;
		newEvt.adress			= evt.adress;
		newEvt.itinerary		= evt.itinerary;
		// champs du contact
		newEvt.contact_name		= evt.contact_name;
		newEvt.contact_coord	= evt.contact_coord;
		// champs des infos
		newEvt.title			= evt.title;
		newEvt.note				= evt.note;
		newEvt.tags				= evt.tags;
		newEvt.priority			= evt.priority;
		return newEvt;
	}
	function fromForm (evt, date, place, contact, message){
		// champs de la date
		evt.year			= date.year;
		evt.month			= date.month;
		evt.day				= date.day;
		evt.hour			= date.hour;
		evt.minute			= date.minute;
		evt.recurrence		= date.recurrence;
		// champs du lieu
		evt.city			= place.city;
		evt.adress			= place.adress;
		evt.itinerary		= place.itinerary;
		// champs du contact
		evt.contact_name	= contact.contact_name;
		evt.contact_coord	= contact.contact_coord;
		// champs des infos
		evt.title			= message.title;
		evt.note			= message.content;
		evt.tags			= message.tags;
		evt.priority		= message.priority;
	}
	function toForm (evt, date, place, contact, message){
		// champs de la date
		date.year				= evt.year;
		date.month				= evt.month;
		date.day				= evt.day;
		date.hour				= evt.hour;
		date.minute				= evt.minute;
		date.recurrence			= evt.recurrence;
		// champs du lieu
		place.city				= evt.city;
		place.adress			= evt.adress;
		place.itinerary			= evt.itinerary;
		// champs du contact
		contact.contact_name	= evt.contact_name;
		contact.contact_coord	= evt.contact_coord;
		// champs des infos
		message.title			= evt.title;
		message.note			= evt.note;
		message.tags			= evt.tags;
		message.priority		= evt.priority;
	}
	return {
		createEvt,
		copyEvt,
		fromForm,
		toForm
	};
});