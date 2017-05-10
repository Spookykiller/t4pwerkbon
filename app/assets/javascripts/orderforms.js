$(document).ajaxSend(function(event, request, settings) {
  if (typeof(AUTH_TOKEN) == "undefined") return;
  // settings.data is a serialized string like "foo=bar&baz=boink" (or null)
  settings.data = settings.data || "";
  request = "test";
  settings.data += (settings.data ? "&" : "") + "authenticity_token=" + encodeURIComponent(AUTH_TOKEN);
});

$( document ).ready(function() {
    $('input').click(function(){
        update_subtotal();
        selected_values();
    });
    
    $('.new_werkbon').click(function(){
        update_subtotal();
        selected_values();
    });
    
    $('#orderform_details').hide();
    $('.calculation').hide();
    $('.exceptions').hide();
    $('#options').hide();

    hideEmptyCols();
    
    update_subtotal();
    selected_values();
    
    $("input:radio[name=printstyle]").click(function() {
        var value = $(this).val();
        if (value == 'geel') {
            $('#werkbon_totale_prijs').css('color', 'white');
            $('.item_artikel_prijs').css('color', 'white');
            $('.item_totaal_prijs').css('color', 'white');
            $('.item_totaal_arbeid').css('color', 'white');
        } else {
            $('#werkbon_totale_prijs').css('color', 'black');
            $('.item_artikel_prijs').css('color', 'black');
            $('.item_totaal_prijs').css('color', 'black');
            $('.item_totaal_arbeid').css('color', 'black');
        }
    });
    
    $("#datepicker").datepicker({ dateFormat: 'dd/mm/yy' });
    $("#datepicker1").datepicker({ dateFormat: 'dd/mm/yy' });
    
    getWerkbonTypeAfter();
    getWerkbonType();
    
    $('table').on('cocoon:after-insert', function(e, insertedItem){
        $('input').click(function(){
	        $(this).select();
	        update_subtotal();
        });
        getWerkbonTypeAfter();
        update_subtotal();
    });
    
        // Leverancier
    $.post( "http://www.de4gees.nl/AFAS-ProfitClass-PHP-master/connectors/pilot_leverancier_connector.php", function( data ) {
        
        var arr = data;
        var lang = [];
        var obj = JSON.parse(arr);
        $.each(obj, function() {
            lang.push(this['CreditorName'])
        });

        $(".leverancier_input").autocomplete({
            source: lang
        });
                
    }).fail(function() {
        console.log('Oeps, er is iets mis gegaan met het ophalen van leveranciers!'); // or whatever
    });

});


// Automatisch prijs invullen vanuit gekozen invulopties in het formulier. 
// Een invuloptie kan namelijk een artikel, welke een prijs heeft, met zich mee gekregen hebben.
// Wanneer er een invuloptie, die gekoppeld is aan een artikel, met een prijs hoger dan 0 euro gekozen wordt, 
// wordt automatisch de prijs ingevuld 

function selected_values() {
    // initialiseer de prijs op null
    var price = null;
    
    // Zet op alle select options een change listener
    $('select').change(function(){
        // vind de rij waarbij de veranderde select option hoort
        var row = $(this).closest('tr.row');
        
        // zoek iedere select option in die rij
        $(row).find('select').each(function(x){
            // pak de prijs van het artikel die hoort bij de gekozen optie
            var selected_option_price = Number($('option:selected', this).attr('id'))
            
            // check of de prijs wel een echt nummer is
            if (!isNaN(selected_option_price))  {
                // voeg de prijs van de select option toe aan de prijs van de regel
                price = price + selected_option_price;
            }
        });
        
        // check of de totale prijs van de row groter is dan 0
        if (price > 0) {
            // vind het bijhorende prijzen vak van de rij en vul deze in met de totale rij prijs, afgerond op 2 decimalen
            $(row).find('.item_artikel_prijs').val(Number(price).toFixed(2));
        }
        
        // zet de rij prijs weer op null voor de volgende rij
        price = null;
    });
}

function update_subtotal() {
    
    var subtotal = 0;
    var price = 0;
    $('.row:visible').each(function(i){
        var prijs = Number($(this).find('.item_artikel_prijs').val());
        var hoeveelheid = Number($(this).find('.item_hoeveelheid').val());
        
        var totaal_prijs = Number(hoeveelheid) * Number(prijs);
        $(this).find('.item_totaal_prijs').val(totaal_prijs.toFixed(2));
        
        if (!isNaN(totaal_prijs)) subtotal += Number(totaal_prijs);
    });
    
    $('#werkbon_totale_prijs').val(subtotal.toFixed(2));
    
}

function getWerkbonType() {

    $('#orderform_werkbon_type').change(function(){
        var value = $(this).val()
        var item = $('#item_orderform_werkbon_type').val();
       
        $('#orderform_details').fadeIn( "slow");
        $('.calculation').fadeIn( "slow");
        $('.exceptions').fadeIn( "slow");
        $('#options').fadeIn( "slow");
        
        $('tr.row').each(function () {
            item = $(this).find('#item_werkbon_type').val();
            if (item != value) {
                $(this).hide();
            }
            if (item == value) {
                $(this).show();
            }
        });
        
        if (value != "Vloeren") {
            $('.vloeren').hide();
        } else {
            $('.vloeren').show();
        }
        
        if (value != 'Gordijnen') {
            $('.gordijnen').hide();
        } else {
            $('.gordijnen').show();
        }
        
        if (value != 'Vouwgordijnen') {
            $('.vouwgordijnen').hide();
        } else {
            $('.vouwgordijnen').show();
        }
        
        if (value != 'Raamdecoratie') {
            $('.raam').hide();
        } else {
            $('.raam').show();
        }
        
        if (value != 'Behang') {
            $('.behang').hide();
        } else {
            $('.behang').show();
        }
        
        if (value == 'Karpetten' || value == 'Meubels en lampen') {
            $('.calculation').hide();
        }
        update_subtotal();
    });
    
}

function getWerkbonTypeAfter() {
    var value = $('#orderform_werkbon_type').val();

    $('.vloeren').hide();

    $('.gordijnen').hide();

    $('.vouwgordijnen').hide();

    $('.raam').hide();
    
    $('.behang').hide();
    
    $('.karpetten').hide();

    $('.meubels_lampen').hide();

    switch(value) {
        case '':
            
            break;
        case 'Vloeren':
            $('.vloeren').show();
            break;
        case 'Gordijnen':
            $('.gordijnen').show();
            break;
        case 'Vouwgordijnen':
            $('.vouwgordijnen').show();
            break;
        case 'Raamdecoratie':
            $('.raam').show();
            break;
        case 'Behang':
            $('.behang').show();
            break;
        case 'Karpetten':
            $('.calculation').hide();
            break;
        case 'Meubels en lampen':
            $('.calculation').hide();
            break;
    }
}


// print functie die aangeroepen wordt op de print orderform pagina
function printpage() {
    window.print();
}

function hideEmptyCols() {

    $('#mytable').each(function(a, tbl) {    
        $(tbl).find('th').each(function(i) {
            var remove = true;
            var currentTable = $(this).parents('table');
            var tds = currentTable.find('tr td:nth-child(' + (i + 1) + ')');
            
            tds.each(function(j) { 
                console.log($(this).find('input,textarea,select').val())
                
                if ($(this).find('input,textarea,select').val().length > 0) {
                    remove = false
                } else {
                    console.log(false)
                }
            });
            
            if (remove) {
                $(this).hide();
                tds.hide();
                console.log($(this).hide())
            }

        });
    });

}