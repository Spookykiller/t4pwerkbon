$(document).ajaxSend(function(event, request, settings) {
  if (typeof(AUTH_TOKEN) == "undefined") return;
  // settings.data is a serialized string like "foo=bar&baz=boink" (or null)
  settings.data = settings.data || "";
  request = "test";
  settings.data += (settings.data ? "&" : "") + "authenticity_token=" + encodeURIComponent(AUTH_TOKEN);
});

$( document ).ready(function() {
    
    // filter options for orders
    $("div.filter_options").click(function () {
        $(this).find('ul').fadeToggle( "slow", "linear" );
    });
    
    // active link binding class
    $("[href]").each(function() {
        if (this.href == window.location.href) {
            $(this).addClass("active");
        }
    });

    selected_values();
    
    $('input').click(function(){
	    $(this).select();
        update_subtotal();
        selected_values();
    });
    
    update_subtotal();
    selected_values();
    
    $("input:radio[name=printstyle]").click(function() {
        var value = $(this).val();
        if (value == 'geel') {
            $('.item_artikel_prijs').css('color', 'white');
            $('.item_totaal_prijs').css('color', 'white');
            $('.item_totaal_arbeid').css('color', 'white');
        } else {
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

    // Project naam & project nummer
    $.post( "http://www.de4gees.nl/AFAS-ProfitClass-PHP-master/connectors/pilot_projects_connector.php", function( data ) {
        var arr = data;
        var debtorId = [];
        var project_nummer = [];
        var obj = JSON.parse(arr);
        $.each(obj, function() {
            if (this['DebtorId']) {
                debtorId.push(this['DebtorId']);
            }
            project_nummer.push(this['ProjectId']);
        });
        
        // Debiteurnummer
        $("#order_debtorid").autocomplete({
            source: debtorId,
            select: function(event, ui) {
                var item_value = (ui.item.value);
                getSibDat(obj, 'DebtorId', item_value, ['ProjectGroup', 'CheckedOut', 'DebtorId', 'ProjectId']);
            }
        });
        
        // Project nummer
        $("#order_project_nummer").autocomplete({
            source: project_nummer,
            select: function(event, ui) {
                var item_value = (ui.item.value);
                getSibDatId(obj, 'ProjectId', item_value, ['ProjectGroup', 'CheckedOut', 'DebtorId']);
            }
        });
                
    }).fail(function(fail) {
        console.log('Oeps, er is iets mis gegaan met het ophalen van projecten!'); // or whatever
    });
    
    // Naam klant
    $.post( "http://www.de4gees.nl/AFAS-ProfitClass-PHP-master/connectors/pilot_debtor_connector.php", function( data2 ) {
        var arr = data2;
        var lang = [];
        var obj = JSON.parse(arr);
        $.each(obj, function() {
            lang.push(this['DebtorName'])
        });

        $("#order_naam").autocomplete({
            source: lang,
            select: function(event, ui) {
                var item_value = (ui.item.value);
                getSibDatKlant(obj, 'DebtorName', item_value, ['SearchName', 'AdressLine1', 'AdressLine3', 'AdressLine4', 'DebtorId', 'Email', 'TelNr']);
            }
        });
                
    }).fail(function() {
        console.log('Oeps, er is iets mis gegaan met het ophalen van leveranciers!'); // or whatever
    });

});

function selected_values() {
    var price = 0;
    $('select').change(function(){
        var row = $(this).closest('tr.row');
        
        $(row).find('select').each(function(x){
            if (!isNaN(Number($('option:selected', this).attr('id'))))  {
                price = price + Number($('option:selected', this).attr('id'));
            }
        });
        $(row).find('.item_artikel_prijs').val(Number(price).toFixed(2));
        price = 0;
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

function getSibDat(obj, key, value, ukKeys) {
    for (var i = 0; i < obj.length; i++) {
        if (obj[i][key] == value) {
            var dat = [];
            for (var x = 0; x < ukKeys.length; x++) {
                dat.push(obj[i][ukKeys[x]]);
            }
            var DebtorId = (dat[2]);
            $("#order_project_nummer").val(dat[3]);
            
            $.post("http://www.de4gees.nl/AFAS-ProfitClass-PHP-master/connectors/pilot_debtor_connector.php", function( data2 ) {
                var obj2 = JSON.parse(data2);
                getSibDatDebtor(obj2, 'DebtorId', DebtorId, ['SearchName', 'AdressLine1', 'AdressLine3', 'AdressLine4', 'DebtorName', 'Email', 'TelNr', 'AdressLine1_aflevering', 'AdressLine3_aflevering']);
            });
        }
    }
}

function getSibDatId(obj, key, value, ukKeys) {
    for (var i = 0; i < obj.length; i++) {
        if (obj[i][key] == value) {
            var dat = [];
            for (var x = 0; x < ukKeys.length; x++) {
                dat.push(obj[i][ukKeys[x]]);
            }
            var DebtorId = (dat[2]);
            $("#order_debtorid").val(dat[2]);
            
            $.post( "http://www.de4gees.nl/AFAS-ProfitClass-PHP-master/connectors/pilot_debtor_connector.php", function( data2 ) {
                var obj2 = JSON.parse(data2);
                getSibDatDebtor(obj2, 'DebtorId', DebtorId, ['SearchName', 'AdressLine1', 'AdressLine3', 'AdressLine4', 'DebtorName', 'Email', 'TelNr', 'AdressLine1_aflevering', 'AdressLine3_aflevering']);
            });
        }
    }
}

function getSibDatKlant(obj, key, value, ukKeys) {
    for (var i = 0; i < obj.length; i++) {
        if (obj[i][key] == value) {
            var dat2 = [];
            for (var x = 0; x < ukKeys.length; x++) {
                dat2.push(obj[i][ukKeys[x]]);
            }
            if (dat2[3] == null) {
                dat2[3] = "Nederland";
            }
            var DebtorId = (dat2[4]);
            $("#order_AdressLine1").val(dat2[1]);
            $("#order_AdressLine3").val(dat2[2]);
            $("#order_AdressLine4").val(dat2[3]);
            $("#order_email").val(dat2[5]);
            $("#order_telefoon").val(dat2[6]);
            $("#navigation_address").val(dat2[7] + dat2[8]);

            $.post( "http://www.de4gees.nl/AFAS-ProfitClass-PHP-master/connectors/pilot_projects_connector.php", function( data ) {
                var obj = JSON.parse(data);
                getSibDatKlantInfo(obj, 'DebtorId', DebtorId, ['ProjectId', 'DebtorId']);
            });
        }
    }
}

function getSibDatDebtor(obj2, key, value, ukKeys) {
    for (var i = 0; i < obj2.length; i++) {
        if (obj2[i][key] == value) {
            var dat2 = [];
            for (var x = 0; x < ukKeys.length; x++) {
                dat2.push(obj2[i][ukKeys[x]]);
            }
            if (dat2[3] == null) {
                dat2[3] = "Nederland"
            }
            $("#order_AdressLine1").val(dat2[1]);
            $("#order_AdressLine3").val(dat2[2]);
            $("#order_AdressLine4").val(dat2[3]);
            $("#order_naam").val(dat2[4]);
            $("#order_email").val(dat2[5]);
            $("#order_telefoon").val(dat2[6]);
            $("#navigation_address").val(dat2[7] + dat2[8]);
        }
    }
}

function getSibDatKlantInfo(obj, key, value, ukKeys) {
    for (var i = 0; i < obj.length; i++) {
        if (obj[i][key] == value) {
            var dat = [];
            for (var x = 0; x < ukKeys.length; x++) {
                dat.push(obj[i][ukKeys[x]]);
            }
            $("#order_project_nummer").val(dat[0]);
            $("#order_debtorid").val(dat[1]);
        }
    }
}

function getWerkbonType() {
    
    $('#order_werkbon_type').change(function(){
        var value = $(this).val()
        var item = $('#item_werkbon_type').val();
        
        $('tr.row').each(function () {
            item = $(this).find('#item_werkbon_type').val();
            if (item != value) {
                $(this).hide();
            }
            if (item == value) {
                $(this).show();
            }
        });
        
        if (value == "Vloeren") {
            $('.calculation').hide();
        } else {
            $('.calculation').show();
        }
        
        if (value != 'Gordijnen/vouwgordijnen') {
            $('.gordijnen').hide();
        } else {
            $('.gordijnen').show();
        }
        
        if (value != 'Raamdecoratie') {
            $('.raam').hide();
        } else {
            $('.raam').show();
        }
    
        update_subtotal();
    });
    
}

function getWerkbonTypeAfter() {
    var value = $('#order_werkbon_type').val();

    $('.calculation').show();

    $('.gordijnen').hide();

    $('.vouwgordijnen').hide();

    $('.raam').hide();

    switch(value) {
        case 'Vloeren':
            $('.calculation').hide();
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
    }
}

function printpage() {
    window.print();
}