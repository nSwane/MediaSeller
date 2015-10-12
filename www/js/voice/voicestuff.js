/**
 * Created by jennifer on 29/11/14.
 */



$(document).ready(function () {
    console.log("voice stuff ready");
    $(".disablevoice").hide();
    if (!('webkitSpeechRecognition' in window)) {
        $(".enablevoice").hide();
    }
    else {

        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-EN';
        // recognition.start();

        var fusion_list = [];

        recognition.onstart = function (event) {
            console.log("onstart", event);

        }

        recognition.onresult = function (event) {
            console.log("onresult", event);
            var interim_transcript = '';
            var final_transcript = '';
            var final_transcriptbuy = '';
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                    final_transcriptbuy=final_transcript;

                    var resultDiv = document.getElementById("results");

                    if(final_transcript.match("search for")){
                       final_transcript= final_transcript.replace("search for", "");
                      }
                    else if(final_transcript.match("search.*")){
                        final_transcript= final_transcript.replace("search", "");

                    }
                    else if(final_transcript.match("cherche")){
                        final_transcript= final_transcript.replace("cherche", "");
                    }
                    else if(final_transcript.match("chercher")){
                        final_transcript= final_transcript.replace("chercher", "");
                    }
                    if(resultDiv != null) {
                        resultDiv.value = final_transcript;
                    }
                    $("#speech").append("" + final_transcript + "</br>");

                    if (final_transcriptbuy.match(".*achat.*") || final_transcriptbuy.match(".*buy*.")) {
                        fusion_list.push("say_achat");
                        check_interaction();
                    }


                    interim_transcript = '';
                    final_transcript = null;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                   // $("#speech").append("interim " + interim_transcript + "</br>")
                }
            }
        }
    }

    if (!('webkitSpeechRecognition' in window)) {
        $(".enablevoice").hide();
    }
    else {
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

    function check_interaction() {
        if (fusion_list[fusion_list.length - 2] === "click_achat" && fusion_list[fusion_list.length - 1] === "say_achat") {
            alert("click && parole = redundancy")
            //usefull to not match from the latest interaction
            fusion_list.push("interaction ok");
            $('#achatmsg').text("purchase validated, Thank you for shopping at MediaSeller");
            clearCart();
        }
        else if (fusion_list[fusion_list.length - 2] === "say_achat" && fusion_list[fusion_list.length - 1] === "click_achat") {
            alert("parole && click = redundancy")
            //usefull to not match from the latest interaction
            fusion_list.push("interaction ok");
            $('#achatmsg').text("purchase validated, Thank you for shopping at MediaSeller");
            clearCart();

        }
        else{
            console.log("purchase not ok");
            $('#achatmsg').text("purchase no validated, you must speak the word 'buy' or 'achat' as well as push the button.");
        }
    }
});
