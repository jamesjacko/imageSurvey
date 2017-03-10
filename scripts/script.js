function imageSurvey(_settings) {
  this._settings = _settings;
  this._results = [];
  this.showImage = function(options){

  }
  // return a random permutation of a range (similar to randperm in Matlab)
  this.randperm = function(length){
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
      };
      return permArray;
  }

  this.showChoices = function(_settings){
    var container = document.getElementById("img_surv_choices");
    container.innerHTML = ""
    var choices = this.randperm(_settings.items.length);
    var shownChoices = [];
    for (var i = 0; i < _settings.choiceOptions.numberPerQuestion; i++) {
      if(typeof _settings.itemFunction === "function"){
        var obj = _settings.itemFunction(_settings.items[choices[i]].options);
        this.add(obj, container);
        shownChoices.push(choices[i]);
      }
      else
        console.error("You must provide an item as a function");
    }
    switch (_settings.choiceOptions.type) {
      case 2:

        break;
      default:
    }
    var clicker = document.createElement("div");
    container.appendChild(clicker);

    if(_settings.choiceOptions.options){
      var timeout;
      var _this = this;
      var keys = [];
      var buttonDiv = document.createElement('div');
      var buttonP = document.createElement('p');
      buttonP.appendChild(document.createTextNode(_settings.choiceOptions.question));
      buttonDiv.setAttribute('id', 'img_surv_option_buttons');
      buttonDiv.appendChild(buttonP);
      _settings.choiceOptions.options.forEach(function(elem){
        var button = document.createElement('button');
        button.setAttribute("data", elem.value);
        var buttonText = document.createTextNode(elem.name + " or Press \"" + String.fromCharCode(elem.keyCode) + "\"");
        button.addEventListener("click", function(){
          _this.storeChoice(shownChoices, elem.value, 1);
          clearTimeout(timeout);
          _this.showChoices(_settings);
        });
        button.appendChild(buttonText);
        buttonDiv.appendChild(button);
        keys.push({
          key: elem.keyCode,
          value: elem.value
        })
      });
      container.appendChild(buttonDiv);
      clicker.setAttribute('tabindex', 0);
      clicker.focus();
      clicker.addEventListener("keydown",function(e){
        keys.forEach(function(key){
          if(e.keyCode === key.key){
            _this.storeChoice(shownChoices, key.value, 1);
            clearTimeout(timeout);
            _this.showChoices(_settings);
          }
        })
      });
      if(_settings.choiceOptions.timePerQuestion){
        var bar = document.createElement('div');
        bar.className = "img_surv_progressbar";
        bar.style.transitionDuration = _settings.choiceOptions.timePerQuestion + "s";
        container.appendChild(bar);
        var height = bar.offsetHeight;
        document.getElementsByClassName("img_surv_progressbar")[0].style.width = "100%";
        timeout = setTimeout(function(){
          _this.showChoices(_settings);
        }, _settings.choiceOptions.timePerQuestion * 1000)
      }
    };

  }

  this.storeChoice = function(items, value, time){
    var obj = {
      items: items,
      value: value,
      time: time
    };
    this._results.push(obj);
    console.log(this._results);
  }

  this.add = function(obj, container){
    switch (_settings.choiceOptions.type){
      case 1:
        var opt = document.createElement('input');
        opt.setAttribute("type", "radio");
        opt.setAttribute("name", "choice")
        opt.className = "img_surv_option";
        obj.appendChild(opt);
        break;
      case 2:
        break;
      default:
    }
    container.appendChild(obj);
  }
  this.init = function(_settings){
    document.body.innerHTML += '<div id="img_surv_choices"></div>';
    this.showChoices(_settings);
  }
  this.init(_settings);
};
