$(document).ready(function(){
    console.log("scanning stuff ready");
    //ScanInit();
})


document.addEventListener("deviceready", ScanInit, false);
function ScanInit() {
     if('ontouchstart' in window || !!(navigator.msMaxTouchPoints)){
         console.log("init for touch");  //need to check for capabilities if touch t$hàzghh                                                    WVXBB
         document.querySelector("#startScan").addEventListener("touchend", startScan, false);

     }
    else{
         console.log("init for click");
         $("#startScan").hide();
         document.querySelector("#startScan").addEventListener("click",startFakeScan);
     }



    console.log("scanning.....") ;
}

function startScan() {
    console.log("scan started.....");
    var resultDiv = document.getElementById("results");
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            var s = "Result: " + result.text + "<br/>" +
                "Format: " + result.format + "<br/>" +
                "Cancelled: " + result.cancelled;
            console.log(s);
            //qr code put product direct in basket
            if(result.format =="QR_CODE"){
                console.log("qr code"+result.text);
                var item = result.text;
                var list= findById(item, function(product) {
                    console.log("found : " + product);
                    if (product == null) {
                        console.log("produt does not exsist");
                    } else {
                        addToCart(product);
                    }
                });

            }
            else{ //not a qr code then put result in search box
                console.log("other code");
                resultDiv.value = result.text;

            }

        },
        function (error) {
            alert("Scanning failed: " + error);
        }
    )
}
    function startFakeScan() {
        console.log("Fake scan started.....");


        var elem = document.getElementById("results");
        elem.value = "the dark knight";




}