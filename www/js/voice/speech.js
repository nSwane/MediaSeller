/**
 * Plugin https://github.com/mayurloved/speechrecognizer.git
 *
 */

/* Use speech to find a product */
function recognizeSpeechFind() {
    if (!window.plugins || !window.plugins.speechrecognizer) {
        console.log('Speech not supported!');
        return;
    }

    var maxMatches = 1;
    var promptString = "Mot clé produit"; // optional
    var language = "fr-FR";                     // optional
    window.plugins.speechrecognizer.startRecognize(function (result) {
        find(result[0]);
    }, function (errorMessage) {
        console.log("Error message: " + errorMessage);
    }, maxMatches, promptString, language);
}


/* Use speech to do a certain action on a product. */
/* Add into cart or buy for example */
function recognizeSpeechAction(product) {
    if (!window.plugins || !window.plugins.speechrecognizer) {
        console.log('Speech not supported!');
        return;
    }

    var maxMatches = 1;
    var promptString = "Acheter ou Ajouter"; // optional
    var language = "fr-FR";                     // optional

    var actions = ["Acheter", "Ajouter"];
    var f = new Fuse(actions);

    window.plugins.speechrecognizer.startRecognize(function (result) {
        var indexes = f.search(result[0]);
        var done = false;
        for (var i = 0; indexes.length && !done; i++) {
            switch (indexes[i]) {
                case 0:
                    addToCart(product);
					window.location= "checkout.html";
                    done = true;
                    break;
                case 1:
                    done = true;
                    alert('Ajouter!');
                    addToCart(product);
                    break;
                default:
                    console.log('Not recognized');
            }
        }
    }, function (errorMessage) {
        console.log("Error message: " + errorMessage);
    }, maxMatches, promptString, language);
}

/* Use speech to do a certain action on a product. */
/* Add into cart or buy for example */
function confirmSpeechAction() {
    if (window.plugins && window.plugins.speechrecognizer) {

        doPhoneSpeech();

    }
    else if (('webkitSpeechRecognitiong' in window)) {
        doWebSpeech();
    }
    else {
        clickConfimation();
        console.log('Speech not supported!');
        return;

    }

}
function clickConfimation(){
    var r = confirm("Confirm Purchase") ;
    if (r == true) {
        $('#achatmsg').text("purchase validated, Thank you for shopping at MediaSeller");
        clearCart();
        $('#achat').hide();


    } else {
        txt = "You pressed Cancel!";
    }
}
function doWebSpeech() {
    $(".enablevoice").show();
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-EN';
    var fusion_list = [];

    recognition.onstart = function (event) {
        console.log("onstart", event);

    }

    recognition.onresult = function (event) {
        console.log("onresult", event);


        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                var final_transcriptbuy = final_transcript += event.results[i][0].transcript;

                if (final_transcriptbuy.match(".*achat.*") || final_transcriptbuy.match(".*buy*.")) {
                    $('#achatmsg').text("purchase validated, Thank you for shopping at MediaSeller");
                    clearCart();
                }
                else {
                    console.log("can't buy");
                    $('#achatmsg').text("purchase no validated, you must speak the word 'buy' or 'achat' as well as push the button.");

                }
            }


        }
    }

    recognition.onerror = function (event) {
        console.log("onerror", event);
    }

    recognition.onend = function () {
        console.log("onend");
    }

    $(".enablevoice").click(function () {
        // console.log("here in voice enable");
        recognition.start();

        $(".enablevoice").hide();
        $(".disablevoice").show();
    });

    $(".disablevoice").click(function () {
        //  console.log("here in voice disable ");
        recognition.stop();
        $(".disablevoice").hide();
        $(".enablevoice").show();


    });

}

function doPhoneSpeech() {
    var maxMatches = 1;
    var promptString = "Confirmer ou Annuler"; // optional
    var language = "fr-FR";                     // optional

    var actions = ["Confirmer"];
    var f = new Fuse(actions);

    window.plugins.speechrecognizer.startRecognize(function (result) {
        var indexes = f.search(result[0]);

        for (var i = 0; i < indexes.length; i++) {
            switch (indexes[i]) {
                case 0:
                    $('#achatmsg').text("purchase validated, Thank you for shopping at MediaSeller");
                    clearCart();
                    $('#achat').hide();
                    break;

                default:
                    console.log("can't buy");
                    $('#achatmsg').text("purchase no validated, you must speak the word 'acheter'  as well as push the button.");

            }
        }
    }, function (errorMessage) {
        console.log("Error message: " + errorMessage);
    }, maxMatches, promptString, language);


}

