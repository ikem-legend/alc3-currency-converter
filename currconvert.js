// if (!navigator.serviceWorker) {return false};
if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/currconvtr/sw/index.js')
  .then((reg) => {
    console.log('serviceWorker registration succeeded');
  }).catch(() => {
    console.log('serviceWorker registration failed');
  });
}

$('#amount').keyup((e) => {
  // console.log(e.keyCode)
  if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || (e.keyCode == 8) || (e.keyCode == 46)) {
    convertCurrency();
  }
});
$('#amount').on('paste', () => {
  setTimeout( () => {
    convertCurrency(); //console.log("pasted");
  }, 100);
});
$('#fromCurrency').change(() => {
  convertCurrency();
});

$('#toCurrency').change(() => {
  convertCurrency();
});

function convertCurrency() {//e, amount, fromCurrency, toCurrency, cb
  let amount = $('#amount').val();
  // console.log(amount);
  let fromCurrency = $('#fromCurrency').val();
  // console.log(fromCurrency);
  let toCurrency = $('#toCurrency').val();
  // console.log(toCurrency);
  // console.log(e.keyCode);
  if (amount !== "") {
    fromCurrency = encodeURIComponent(fromCurrency);
    toCurrency = encodeURIComponent(toCurrency);
    let query = fromCurrency + '_' + toCurrency;

    let url = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`;
    // console.log(url);
    fetch(url).then((response) => response.json() )
    .then((body) => {
      // console.log(body[query]);
      let rate = body[query];
      if (rate) {
        let convert = amount * rate;
        // console.log(convert);
        convert = Math.round(convert * 100) / 100
        if ($('#conversion').html() == "") {
          // console.log("Empty")
          $('#conversion').append(convert);
        } else {
          $('#conversion').html("")
          $('#conversion').append(convert)
        }
      }
    })
    .catch('error', (e) => {
      console.log("Got an error: ", e);
      // cb(e);
    });
  } else {
    $('#conversion').html("")
    alert("Please input amount to be converted");
  }

}