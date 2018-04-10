/*
	definicion de la libreria phoneCountry developed for seek
	by:
		Artur - Wampy				
*/
(function($) {


var countrysJson;
var template_countrys;
var template_codes;

function phoneCountry(configs) {
	this.configs = configs;
}
phoneCountry.prototype.init = function(){
	console.log(arguments[0]);
}

//connect with country json 
phoneCountry.prototype.jsonVar = function(url,$telefono,$pais,myCountry){
	var datos = [];
	$.ajax({
		url: url,
		method: 'GET',
	    dataType: 'json',
	    beforeSend: function(){
	    	$('body').addClass('modelo_load');
	    },
	    success: function(data){
	    	for (var a=0;a<data.length;a++){
	    		datos.push(data[a]);
	    	}
	    },
	    complete: function(data){
	    	$('body').removeClass('modelo_load');
	    	template_countrys = phoneP.countrysSelect(datos);
			template_codes = phoneP.codesSelect(datos); 			
			phoneP.constructorDev($telefono,template_codes,template_countrys);
			phoneP.allFunctions($pais,$telefono,myCountry); 
	    	return datos;
	    }
	});		
}
//developed select countrys
phoneCountry.prototype.countrysSelect = function(jsonVar){
	var template = '';
	if (jsonVar != 0) {
		template = '<div class="contentSelectCountrys contentSelecteds">';
		template = template + '<div class="selecteds"><span class="selected"><i class="flag"></i></span></div>';
		template = template + '<div class="selectedsbody"><input id="filterInternoCountry" type="text"><ul>';
		for (var a=0;a<jsonVar.length;a++){
			template = template + '<li data="'+jsonVar[a].dial_code+'" data-flag="'+jsonVar[a].code+'" data-country="'+jsonVar[a].name+'">'+jsonVar[a].name+'<i class="flag-icon flag-icon-'+jsonVar[a].code.toLowerCase()+'">'+'</i></li>';
		}
		template = template + '</ul></div></div>';
		return template;
	}
	else {
		console.log('No se pudo conectar');
	}
}

//developed per codes
phoneCountry.prototype.codesSelect = function(jsonVar){
	var template = '';
	if (jsonVar != 0) {
		template = '<div class="contentCodesSelects contentSelecteds">';
		template = template + '<div class="selecteds"><i class="selected"></i></div>';
		template = template + '<div class="selectedsbody"><input id="filterInternoCodes" type="text"><ul>';
		for (var a=0;a<jsonVar.length;a++){
			template = template + '<li data="'+jsonVar[a].code+'" data-country="'+jsonVar[a].name+'" data-code="'+jsonVar[a].dial_code+'">'+jsonVar[a].dial_code+'<i class="flag-icon flag-icon-'+jsonVar[a].code.toLowerCase()+'">'+'</i></li>';
		}
		template = template + '</ul></div></div>';
		return template;
	}
	else {
		console.log('No se pudo conectar');
	}
}

//constructorDilema
phoneCountry.prototype.constructorDev = function($id,codesSelect,countrySelect){
	var $div = $id.closest('div');
	$id.hide();
	$div.append('<div class="especialSelect"></div>');
	$div.find('.especialSelect').append('<div class="codeZone">'+codesSelect+'</div>');
	$div.find('.especialSelect').append('<input type="tel" class="teleNew" placeholder="Teléfono">');
	$div.find('.especialSelect').append('<div class="flagZone">'+countrySelect+'</div>');
}



//allFunctions
phoneCountry.prototype.allFunctions = function($id_country,$id,myLocation){
	//open
	$('.selecteds').live('click',function(){
		$(this).closest('.contentSelecteds').find('.selectedsbody').addClass('open');
	});
	//countrys
	$('.contentSelectCountrys li').live('click',function(){
		var $this = $(this);
		var data = $this.attr('data');
		var flag = $this.attr('data-flag').toLowerCase();
		var country = $this.attr('data-country');
		$this.closest('.selectedsbody').find('input').val(country);
		//codes
		$('.contentCodesSelects').find('.selected').attr('data',data);
		$('.contentCodesSelects').find('.selected').html(data);
		$('.contentCodesSelects').closest('.selectedsbody').find('input').val(country);
		//selected
		$('.contentSelectCountrys').find('.selected i').attr('class', '');
		$('.contentSelectCountrys').find('.selected i').addClass('flag-icon');
		$('.contentSelectCountrys').find('.selected i').addClass('flag-icon-'+flag);
		$('.contentSelectCountrys').find('.selected i').attr('data'+country);
		$this.closest('.contentSelecteds').find('.selectedsbody').removeClass('open');
		$id_country.val(country);
	});
	//codes
	$('.contentCodesSelects li').live('click',function(){
		var $this = $(this);
		var flag = $this.attr('data').toLowerCase();
		var data = $this.attr('data-code');
		var country = $this.attr('data-country');
		$this.closest('.selectedsbody').find('input').val(country);
		//country
		$('.contentSelectCountrys').find('.selected i').attr('class', '');
		$('.contentSelectCountrys').find('.selected i').addClass('flag-icon');
		$('.contentSelectCountrys').find('.selected i').addClass('flag-icon-'+flag);		
		$('.contentSelectCountrys').find('.selected i').attr('data'+country);
		//selected
		$('.contentCodesSelects').find('.selected').attr('data',data);
		$('.contentCodesSelects').find('.selected').html(data);
		$('.contentSelectCountrys').closest('.selectedsbody').find('input').val(country);
		$this.closest('.contentSelecteds').find('.selectedsbody').removeClass('open');
		var valor = $('.teleNew').val();
		$id.val('('+data+')'+valor);
	});
	//typed and create input
	$('.teleNew').live('keypress',function(){
		var valor = $('.teleNew').val();
		var data = $('.contentCodesSelects').find('.selected').attr('data');
		$id.val('('+data+')'+valor);
	});
	//autoCropSelect
	var $countrys = $('.contentSelectCountrys li');
	for (var a=0;a<$countrys.length;a++) {
		var dial_code = $countrys.eq(a).attr('data-flag');
		if (myLocation == dial_code) {
			$countrys.eq(a).trigger('click');
		}		
	}	
	//filter
	$('.selectedsbody input').on('input',function(e){
		var $this = $(this);
		var $body = $this.closest('.selectedsbody');
		var valor = $this.val();
		valor = valor.replace("+", "");
		console.log(valor);
		$body.find("li").each(function() {
				//country
				var dead = $(this).attr('data-country');
				var code = $(this).attr('data-code');
	            if (dead.search(valor) > -1 || code.search(valor) > -1) {
	                $(this).show();
	                $body.find("li").eq(0).hide();
	            }
	            else {
	                $(this).hide();
	            }
	    });
		e.stopPropagation();		        
	});

	//close filter
    $(document).on('click',function(e) {
        if (!$(e.target).is('.selecteds, .selectedsbody *, .selecteds *')) {
            $(".selectedsbody").removeClass('open');
        }
    });

}

phoneCountry.prototype.initial = function(url,$telefono,$pais){		
	//llamar luego de library
	$.get("https://ipinfo.io?token=6d857d5a9beb75", function(response) {
		countrysJson = phoneP.jsonVar(url,$telefono,$pais,response.country);
	}, "jsonp");
}


phoneP = new phoneCountry();
phoneP.init("Inicia phoneCountry");

})( jQuery );