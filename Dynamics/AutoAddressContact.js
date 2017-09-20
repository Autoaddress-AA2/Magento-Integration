function load(licenceKey) {
  // settings
  var autoAddressSettings = {
    key: licenceKey,
    language: "en",
    autocomplete: true,
    autocompleteMinChars: 3,
    optionsLimit: -1,
    vanityMode: false,
    addressProfile: "DemoApi5Line",
    incompleteAddressLabel: "",
    addressFoundLabel: "",
    partialAddressLabel: "",
    nuaAddressFoundLabel: "",
    noResultFoundLabel: "",
    errorMessageLabel: "",
    width: "auto",
    hoverOptionPanel: true,
    onAddressFound: myAutoAddressHandler,
    onEcadFound: myEcadHandler // if provided, it will automatically call get ecad data
  };

  // the target element where auto address controll will be held
  var targetElement =
    "address1_composite_compositionLinkControl_address1_line1_d";

  // the first line of the address line
  var targetInputName = "address1_line1";

  // the name of css file to use (must exist in web resource!)
  var cssName = "new_CompositeAddress.css";

  AutoAddressLoader(
    autoAddressSettings,
    targetElement,
    targetInputName,
    cssName
  );
}

// this is where you seed the address to your inputs
// This example is for online version. Remove "window.parent." for on premise
function myAutoAddressHandler(args) {
  // set  input
  window.parent.Xrm.Page
    .getAttribute("address1_line1")
    .setValue(args.reformattedAddress[0]);

  window.parent.Xrm.Page
    .getAttribute("address1_line2")
    .setValue(args.reformattedAddress[1]);

  window.parent.Xrm.Page
    .getAttribute("address1_line3")
    .setValue(args.reformattedAddress[2]);

  window.parent.Xrm.Page
    .getAttribute("address1_city")
    .setValue(args.reformattedAddress[3]);

  window.parent.Xrm.Page
    .getAttribute("address1_stateorprovince")
    .setValue(args.reformattedAddress[4]);

  window.parent.Xrm.Page
    .getAttribute("address1_postalcode")
    .setValue(args.postcode);
}

// for ecad data callback
function myEcadHandler(data) {
  // seed your inputs here
}
