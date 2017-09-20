var autoAddressEndpoint = "https://api.autoaddress.ie/2.0";
var licenceKey;

var userOnAddressCallback;
var userOnEcadCallback;

var theTargetElement;
var theTargetInputName;

function AutoAddressLoader(
  autoAddressSettings,
  targetElement,
  targetInputName,
  cssName
) {
  licenceKey = autoAddressSettings.key;
  userOnAddressCallback = autoAddressSettings.onAddressFound;
  userOnEcadCallback = autoAddressSettings.onEcadFound;
  autoAddressSettings.onAddressFound = onFound;

  theTargetElement = targetElement;
  thetargetInputName = targetInputName;

  // manually append auto address and custome styles to head
  window.parent
    .$("head")
    .append(
      '<link rel="stylesheet" href="' +
        autoAddressEndpoint +
        '/control/css/autoaddress.min.css" type="text/css" />'
    );

  window.parent
    .$("head")
    .append(
      '<link rel="stylesheet" href="/WebResources/' +
        cssName +
        '" type="text/css" />'
    );

  var address1_line1 = Xrm.Page.getAttribute(targetInputName).getValue();
  var address1_line1_tabindex = window.parent
    .$("#" + theTargetElement.replace("_d", ""))
    .attr("tabindex");

  // loading the autoaddress controller script
  window.parent.jQuery
    .ajax({
      type: "GET",
      url: autoAddressEndpoint + "/control/js/jquery.autoaddress.min.js",
      dataType: "script",
      cache: false
    })
    .done(function() {
      console.log("AutoAddress Load was performed.");

      window.parent.$("#" + theTargetElement).find("div").remove();
      window.parent.$("#" + theTargetElement).AutoAddress(autoAddressSettings);

      // add current value
      if (address1_line1 !== null) {
        window.parent
          .$("#" + theTargetElement)
          .AutoAddress()
          .setAddress(address1_line1);
      }

      // removes auto address default css classes and include ms ones
      window.parent.$(".autoaddress-control button").remove();
      window.parent
        .$("#" + theTargetElement + " input")
        .removeClass("autoaddress-text-box")
        .addClass("ms-crm-InlineInput")
        .attr("tabindex", address1_line1_tabindex);

      window.parent
        .$(".autoaddress-control")
        .addClass("ms-crm-Inline-Edit")
        .addClass("aa-address1-inline-padding")
        .removeAttr("style")
        .css("margin", "0");
      window.parent
        .$(".autoaddress-control input")
        .css("border", "1px solid #CCCCCC !important");

      // remove default event for tab key
      window.parent.$("#" + theTargetElement + " input").keydown(function(e) {
        var code = e.keyCode || e.which;

        if (code === 9) {
          e.preventDefault();
        }
      });
    });
}

function getEcadData(id) {
  window.parent.$.ajax({
    type: "GET",
    dataType: "jsonp",
    url: autoAddressEndpoint + "/getecaddata",
    data: {
      key: licenceKey,
      ecadid: id
    },
    success: userOnEcadCallback
  });
}

function onFound(args) {  
  // do nothing if auto address response is empty
  if (!args) return;
  
  window.parent
    .$("#" + theTargetElement)
    .AutoAddress()
    .setAddress(args.reformattedAddress[0]);

  userOnAddressCallback(args);

  if (userOnEcadCallback && args.addressId) {
    getEcadData(args.addressId);
  }
}
