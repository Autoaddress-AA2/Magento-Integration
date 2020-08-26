///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'jimu/BaseWidgetSetting',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/form/ValidationTextBox',
    'dijit/form/RadioButton',
    'jimu/dijit/CheckBox'
  ],
  function(declare, BaseWidgetSetting, _WidgetsInTemplateMixin) {
  
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      baseClass: 'jimu-widget-autoaddresswidget-setting',
  
      postCreate: function(){
        //the config object is passed in
        this.setConfig(this.config);
      },
  
      setConfig: function(config){
        // set values based on config values if they exist
        this.addressProfileNode.set("value", config.addressProfile);
        this.licenceKeyNode.set("value", config.licenceKey);

        // check only one of radio options is set to true
        let array = [config.postal, config.vanity, config.geographic];
        let count = 0;
        for (let index = 0; index < array.length; index++) {
          const element = array[index];
          if (element){count ++};
        }
        if (count != 1) {
          this.postalRadio.set('checked', false);
          this.geographicRadio.set('checked', false);
          this.vanityRadio.set('checked', true);
        } else {
          this.postalRadio.set('checked', config.postal);
          this.vanityRadio.set('checked', config.vanity);
          this.geographicRadio.set('checked', config.geographic);
        }
      },
  
      getConfig: function(){
        //WAB will get config object through this method
        return {
          addressProfile: this.addressProfileNode.value,
          licenceKey: this.licenceKeyNode.value,
          geographic: this.geographicRadio.get('checked'),
          vanity: this.vanityRadio.get('checked'),
          postal: this.postalRadio.get('checked')

        };
      }
    });
  });