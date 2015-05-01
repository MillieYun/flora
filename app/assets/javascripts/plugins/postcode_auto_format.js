// UK Postcode format check
// Author: Millie
// Email: millie.yun@gmail.com

(function(){
  $(document).ready(function(){
    // Postcode Validator (UK)
    var PostcodeValidator = (function( pv ) {

    pv.config = {
      'elem': $(".postcode_field")[0],
      'noticeElem': $(".postcode_field").parent().find("span")[0],
      'errorNotice': '<strong class="invalid">This invalid, please input a valid postcode<strong>',
      'outcodeStartWithTowLetters': /^[A-Z]{2}/i,
      'regexOutcodeTwo': /^[A-PR-UWYZ][0-9]$/i,
      'regexOutcodeThree': /^[A-PR-UWYZ][A-HK-Y0-9][A-HJKSUW0-9]/i,
      'regexOutcodeFour': /^[A-PR-UWYZ][A-HK-Y][0-9][A-Z0-9]/i,
      'regexIncode': /[0-9]{1}[ABD-HJLNP-UW-Z]{2}$/i
    };

    pv.formatPostcode = function(){
      var _postcode = pv.config.elem.val().replace(/\s/g, '').toUpperCase(),
          _incode = _postcode.slice(-3);

      switch(_postcode.length) {
        case 5:
          _postcode = _postcode.slice(0,2) + " " + _incode;
          break;
        case 6:
          _postcode = _postcode.slice(0,3) + " " + _incode;
          break;
        case 7:
          _postcode = _postcode.slice(0,4) + " " + _incode;
          break;
      }
      pv.config.elem.val(_postcode);
    }


    pv.showError = function() {
      pv.config.noticeElem.innerHTML = pv.config.errorNotice;
    }

    pv.clearErrorMsg = function() {
      pv.config.noticeElem.innerHTML = "";
    }
    pv.validOutcode = function( outcode ) {
    // Determine which outcode regex to run
      switch( outcode.length ) {
        case 2:
          return pv.config.regexOutcodeTwo.test(outcode);
          break;
        case 3:
          return pv.config.regexOutcodeThree.test(outcode);
          break;
        case 4:
          return pv.config.regexOutcodeFour.test(outcode);
          break;
        default:
          return false;
      }
    }
    pv.validIncode = function( incode ){
      return pv.config.regexIncode.test(incode)
    }
    pv.validateOnInput = function() {
      var inputEntry = pv.config.elem.val().replace(/\s/g, '').toUpperCase(),
          incode = inputEntry.slice(-3),
          outcode = inputEntry.slice(0, inputEntry.length -3 ),
          validatePostcodeLength = inputEntry.length < 8 && inputEntry.length >4,
          incodeFormat = /[0-9][a-z][a-z]/i ;

      pv.formatPostcode();

      // If input less than 5 characters then won't do validate
      if(inputEntry.length < 5 ) {
        pv.clearErrorMsg();
        return false;
      }

      if( pv.validOutcode(outcode) && pv.validIncode(incode) ){
        pv.config.elem.data('is-validated', 'false');
        pv.clearErrorMsg();
      } else {

        pv.showError();

        // Setting Postcode input expection,
        // System will clear ErrorMsg when string(inputEntry) match regEx above.
        if (inputEntry.length == 5 ){
          var outcodeFormat2 = /(^[A-PR-UWYZ][A-HK-Y])|(^[A-PR-UWYZ][A-HK-Y])/i,
                               // [1st characters in regexOutcodeThree][2nd characters in regexOutcodeThree]  || [1st characters in regexOutcodeFour][2nd characters in regexOutcodeFour]
              incodeFormat1  = /(^[0-9]{1}[ABD-HJLNP-UW-Z]{2})|([A-HJKSUW0-9][0-9]{1}[ABD-HJLNP-UW-Z])/i,
                               // [whole regEx in regexIncode]||[3rd character in regexOutcodeThree][1st charactors in regexIncode][2nd characters in regexIncode]
              incodeFormat2  = /(^[0-9]{2}[ABD-HJLNP-UW-Z0-9])|(^[0-9][A-Z][0-9])/i;
                               //[3rd in regexOutcodeThree and regexOutcodeFour][1st in regexIncode and 4st in regexOutcodeFour][2nd in regexIncode and 1st in regexIncode] || [3rd in regexOutcodeFour][4th in regexOutcodeFour][1st in regexIncode]

          var ignoreError1   = pv.validOutcode(outcode) && incodeFormat1.test(incode),
              ignoreError2   = outcodeFormat2.test(outcode) && incodeFormat2.test(incode);

          if(ignoreError1 || ignoreError2 )
            pv.clearErrorMsg();

        } else if (inputEntry.length == 6 ) {
          var outcodeFormat = /^[A-PR-UWYZ][A-HK-Y][0-9]/i
                              // from 1st-3rd characters in regexOutcodeFour]
              incodeFormat  = /^[A-Z0-9][0-9][ABD-HJLNP-UW-Z]/i,
                              //[4th characters in regexOutcodeFour][1st in regexIncode][2nd in regexIncode]
              ingnoreError  = outcodeFormat.test(outcode) && incodeFormat.test(incode);

          if(ingnoreError)
            pv.clearErrorMsg();
        }

      }
    }
    pv.validateOnBlur = function(){
      var inputEntry = pv.config.elem.val().replace(/\s/g, '').toUpperCase(),
          incode = inputEntry.slice(-3),
          outcode = inputEntry.slice(0, inputEntry.length -3 );

      pv.formatPostcode();

      // If input less than 5 characters then won't do validate
      if(inputEntry.length < 5 ) {
        pv.showError();        
        return false;
      }
      if( pv.validOutcode(outcode) && pv.validIncode(incode) ){
        pv.config.elem.attr('data-is-validated', 'true');
        pv.clearErrorMsg();
      }else{
        pv.showError();
      }
    }

    function render_error_msg($target) {
      $target.attr('data-is-validated', 'false');
      if($target.parent().find("span").length == 0){
        $target.parent().append("<span class='text-danger'></span>");
      }
      return $target.parent().find("span")[0];
    }

    // Check postcode on input or blur
    $("input[name*=postcode]:visible").on("input blur", function(_event){
      pv.config.elem = $(this);
      pv.config.noticeElem = render_error_msg($(this));

      if (_event.type == "input") {
        // When user inputing postcode, guess what user will input for next
        pv.validateOnInput();
      } else {
        // When user finish input postcode, validate whole postcode
        pv.validateOnBlur();
      }
    });

     return pv;

    }( PostcodeValidator || {} ));
  });
}).call(this);