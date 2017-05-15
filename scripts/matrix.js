var a = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t'];
var matrix = [];
a.forEach(function(elem1, e1){
  a.forEach(function(elem2, e2){
    if(e1 !== e2){
      matrix.push(elem1 + elem2);
      if(e2 > e1)
        matrix.push(elem1 + elem2);
    }
  });
});
