function showImage(options){

}



function init(_settings){
  document.body.innerHTML += '<div id="choices"></div>';
  showChoices(_settings);
}

function showChoices(_settings){
  var choices = randperm(_settings.items.length);
  for (var i = 0; i < _settings.numberPerQuestion; i++) {
    if(typeof _settings.itemFunction === "function"){
      _settings.itemFunction(_settings.items[choices[i]].options);
    }
    else
      console.error("You must provide an item as a function");
  }
}


// return a random permutation of a range (similar to randperm in Matlab)
function randperm(length){
    // first generate number sequence
    var permArray = new Array(length);
    for(var i = 0; i < length; i++){
        permArray[i] = i;
    }
    // draw out of the number sequence
    for (var i = (length - 1); i >= 0; --i){
        var randPos = Math.floor(i * Math.random());
        var tmpStore = permArray[i];
        permArray[i] = permArray[randPos];
        permArray[randPos] = tmpStore;
    }
    console.log(permArray);
    return permArray;
}
