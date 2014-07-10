(function() {
  var KssStateGenerator;

  KssStateGenerator = (function() {

    function KssStateGenerator() {
      var idx, idxs, pseudos, rulePattern, ruleMatches, replaceRule, rule, stylesheet, _i, _r, _len, _len2, _len3, _ref, _ref2;
      rulePattern = /[^|,]([a-z0-9\.\- >]+(\:hover|\:disabled|\:active|\:visited|\:focus)[a-z0-9\.\- >]*)/gi;
      pseudos = /(\:hover|\:disabled|\:active|\:visited|\:focus)/g;
      _ref = document.styleSheets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stylesheet = _ref[_i];
        idxs = [];
        _ref2 = stylesheet.cssRules || [];
        for (idx = 0, _len2 = _ref2.length; idx < _len2; idx++) {
          rule = _ref2[idx];
          if ((rule.type === CSSRule.STYLE_RULE) && pseudos.test(rule.selectorText)) {
            replaceRule = function(matched, stuff) {
              return ".pseudo-class-" + matched.replace(':', '');
            };
            ruleMatches = rule.cssText.match(declaration);
            for (_r = 0, _len3 = ruleMatches.length; _r < _len3; _r++) {
              this.insertRule(ruleMatches[_r].replace(pseudos, replaceRule));
            }
          }
        }
      }
    }

    KssStateGenerator.prototype.insertRule = function(rule) {
      var headEl, styleEl;
      headEl = document.getElementsByTagName('head')[0];
      styleEl = document.createElement('style');
      styleEl.type = 'text/css';
      if (styleEl.styleSheet) {
        styleEl.styleSheet.cssText = rule;
      } else {
        styleEl.appendChild(document.createTextNode(rule));
      }
      return headEl.appendChild(styleEl);
    };

    return KssStateGenerator;

  })();

  new KssStateGenerator;

}).call(this);
