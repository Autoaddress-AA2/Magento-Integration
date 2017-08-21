 requirejs(['jquery'], function(){ 
   //remove conflicts with Magento jQuery       
    $ = jQuery.noConflict();  

    //Function to call the Autoaddress API and display control on the page
    function LoadAutoaddress(selectedCountry) {      
       $("head").append(
            '<link rel="stylesheet" href="https://api.autoaddress.ie/2.0/control/css/autoaddress.min.css" type="text/css" />'
          );
          jQuery
            .ajax({
              type: "GET",
              url: "https://api.autoaddress.ie/2.0/control/js/jquery.autoaddress.min.js",
              dataType: "script",
              cache: false
            })
            .done(function() {
              console.log("AutoAddress Load was performed.");
            
              $("#AAControl").AutoAddress({
                key : "<Your key here>",
                vanityMode : true,                
                addressProfile: "MagentoDefault",
                country: selectedCountry,
                addressFoundLabel: "Postcode Found, address populated below",                                    
                onAddressFound: function (data) {                                                                        
                    $("#street_1").val(data.reformattedAddress[0]);
                    $("#street_2").val(data.reformattedAddress[1]);
                    $("#city").val(data.reformattedAddress[2]);
                    $("#region").val(data.reformattedAddress[3]);
                    $("#zip").val(data.postcode.slice(0,3)+" "+ data.postcode.slice(3));
                }
              });
          }); 
    }; 

    //Function to remove autoaddress control from page
    function UnloadAutoaddress() {
      $(".autoaddress-control").remove();
    }
   
    //Necessary for initial call on page load
    //Caters for clients to set Ireland or GB as default country option
    if($("#country").val() == "IE" || $("#country").val() == "GB")
    {                  
        LoadAutoaddress($("#country").val());                        
    }   

    //Adds change event to country drop down
    //checks whether to load or unload the Autoaddress control
    $("#country").change(function() {          
      if($("#country").val() == "IE" || $("#country").val() == "GB")
      {     
        //Check if an Autoaddress control already exists
        //Unload if exists
        //prevents multiple Autoaddress controls being loaded to the page
        if($(".autoaddress-text-box").length > 0)
        {
          UnloadAutoaddress();
        }    
        LoadAutoaddress($("#country").val());           
      }
      else
      {    
        //Check if an Autoaddress control exists      
        //Remove if exists
        //So that there is no Autoaddress control if the selected country is not supported
        if($(".autoaddress-text-box").length > 0)
        {            
            UnloadAutoaddress();
        }        
      }
    });        
    return {};    
});    