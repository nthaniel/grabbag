module.exports = function(string) {

  var Small = {
    'zero': 0,
    'a': 1,
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10,
    'eleven': 11,
    'twelve': 12,
    'thirteen': 13,
    'fourteen': 14,
    'fifteen': 15,
    'sixteen': 16,
    'seventeen': 17,
    'eighteen': 18,
    'nineteen': 19,
    'twenty': 20,
    'thirty': 30,
    'forty': 40,
    'fifty': 50,
    'sixty': 60,
    'seventy': 70,
    'eighty': 80,
    'ninety': 90,
  };

  var a, n, g;

  var text2num = function() {
    n = 0;
    g = 0;
    feach(string);
    return n + g;
  };

  var feach = function(w) {
    var x = Small[w];
    if (x != null) {
        g = g + x;
    } else if (typeof parseInt(w) !== NaN) {
        n = n + parseInt(w);
    }
  }

  return text2num(string);
};
