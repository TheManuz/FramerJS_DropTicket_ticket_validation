require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"material":[function(require,module,exports){
var Button, Card, ProgressBar, Ripple, scaledScreenFrame,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

exports.transformCurve = 'cubic-bezier(0.4, 0, 0.2, 1)';

exports.enterCurve = 'cubic-bezier(0, 0, 0.2, 1)';

exports.exitCurve = 'cubic-bezier(0.4, 0, 0.2, 1)';

exports.Button = Button = (function(superClass) {
  extend(Button, superClass);

  function Button(text, options) {
    if (options == null) {
      options = {};
    }
    if (options.backgroundColor == null) {
      options.backgroundColor = '#03a9f4';
    }
    if (options.color == null) {
      options.color = '#fff';
    }
    if (options.shadowY == null) {
      options.shadowY = 2;
    }
    if (options.shadowBlur == null) {
      options.shadowBlur = 2;
    }
    options = _.extend(options, {
      borderRadius: 2,
      height: 36,
      shadowColor: 'rgba(0, 0, 0, 0.24)'
    });
    Button.__super__.constructor.call(this, options);
    this.style.font = '500 14px/36px Roboto';
    this.style.textTransform = 'uppercase';
    this.style.textAlign = 'center';
    this.html = text;
    if (options.fit) {
      this.style.display = 'inline-block';
      this.style.width = 'auto';
      this.style.minWidth = '88px';
      this.style.padding = '0 8px';
    }
  }

  return Button;

})(Layer);

exports.Card = Card = (function(superClass) {
  extend(Card, superClass);

  function Card(options) {
    if (options == null) {
      options = {};
    }
    if (options.backgroundColor == null) {
      options.backgroundColor = '#fff';
    }
    if (options.shadowY == null) {
      options.shadowY = 2;
    }
    if (options.shadowBlur == null) {
      options.shadowBlur = 2;
    }
    options = _.extend(options, {
      borderRadius: 2,
      shadowColor: 'rgba(0, 0, 0, 0.24)'
    });
    Card.__super__.constructor.call(this, options);
  }

  return Card;

})(Layer);

exports.ProgressBar = ProgressBar = (function(superClass) {
  extend(ProgressBar, superClass);

  function ProgressBar(options) {
    if (options == null) {
      options = {};
    }
    this.animateTo = bind(this.animateTo, this);
    if (options.backgroundColor == null) {
      options.backgroundColor = 'rgba(0, 0, 0, 0.12)';
    }
    if (options.height == null) {
      options.height = 4;
    }
    if (options.originY == null) {
      options.originY = 1;
    }
    if (options.scaleY == null) {
      options.scaleY = 0;
    }
    ProgressBar.__super__.constructor.call(this, options);
    this.fill = new Layer({
      superLayer: this,
      backgroundColor: options.fillColor || '#03a9f4',
      scaleX: 0,
      originX: 0
    });
    this.fill.style.width = '100%';
    this.fill.style.height = '100%';
  }

  ProgressBar.prototype.animateTo = function(fill, time) {
    var containerAnimation, fillAnimation;
    this.fill.scaleX = 0;
    this.animate({
      properties: {
        scaleY: 1
      }
    });
    fillAnimation = new Animation({
      layer: this.fill,
      properties: {
        scaleX: fill
      },
      time: time || 1
    });
    containerAnimation = new Animation({
      layer: this,
      properties: {
        scaleY: 0
      }
    });
    fillAnimation.on(Events.AnimationEnd, function() {
      return containerAnimation.start();
    });
    fillAnimation.start();
    return containerAnimation;
  };

  return ProgressBar;

})(Layer);

exports.Ripple = Ripple = (function(superClass) {
  extend(Ripple, superClass);

  function Ripple(options) {
    if (options == null) {
      options = {};
    }
    if (options.container == null) {
      options.container = Framer.Device.screen;
    }
    if (options.origin == null) {
      options.origin = {
        x: options.container.midX,
        y: options.container.midY
      };
    }
    if (options.radius == null) {
      options.radius = Math.max(options.container.width, options.container.height);
    }
    if (options.color == null) {
      options.color = '#000';
    }
    Ripple.__super__.constructor.call(this, {
      backgroundColor: 'transparent',
      width: options.container.width,
      height: options.container.height,
      x: options.container.screenFrame.x,
      y: options.container.screenFrame.y,
      clip: true
    });
    this.placeBefore(options.container);
    this.ink = new Layer({
      superLayer: this,
      backgroundColor: options.color,
      opacity: 0.25,
      width: options.radius * 2,
      height: options.radius * 2,
      midX: options.origin.x - options.container.screenFrame.x,
      midY: options.origin.y - options.container.screenFrame.y,
      borderRadius: '50%',
      scale: 0
    });
    this.grow();
  }

  Ripple.prototype.grow = function() {
    return this.ink.animate({
      properties: {
        scale: 1
      }
    });
  };

  Ripple.prototype.remove = function() {
    var animation;
    return animation = this.ink.animate({
      properties: {
        opacity: 0
      }
    });
  };

  return Ripple;

})(Layer);

scaledScreenFrame = function() {
  var frame;
  frame = Framer.Device.screen.screenFrame;
  frame.width *= Framer.Device.screen.screenScaleX();
  frame.height *= Framer.Device.screen.screenScaleY();
  frame.x += (Framer.Device.screen.width - frame.width) * Framer.Device.screen.originX;
  frame.y += (Framer.Device.screen.height - frame.height) * Framer.Device.screen.originY;
  return frame;
};

exports.eventToOrigin = function(event) {
  return {
    x: (event.x - scaledScreenFrame().x) / Framer.Device.screen.screenScaleX(),
    y: (event.y - scaledScreenFrame().y) / Framer.Device.screen.screenScaleY()
  };
};


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvVGhlTWFudXovb3duQ2xvdWQvR3JhcGhpY1Byb2plY3RzLzIwMTUvRHJvcFRpY2tldC9GcmFtZXIvRHJvcFRpY2tldF90aWNrZXRfdmFsaWRhdGlvbi5mcmFtZXIvbW9kdWxlcy9tYXRlcmlhbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBLG9EQUFBO0VBQUE7Ozs7QUFBQSxPQUFPLENBQUMsY0FBUixHQUF5Qjs7QUFDekIsT0FBTyxDQUFDLFVBQVIsR0FBcUI7O0FBQ3JCLE9BQU8sQ0FBQyxTQUFSLEdBQW9COztBQUdwQixPQUFPLENBQUMsTUFBUixHQUF1Qjs7O0VBQ1QsZ0JBQUMsSUFBRCxFQUFPLE9BQVA7O01BQU8sVUFBUTs7O01BQzNCLE9BQU8sQ0FBQyxrQkFBbUI7OztNQUMzQixPQUFPLENBQUMsUUFBUzs7O01BQ2pCLE9BQU8sQ0FBQyxVQUFXOzs7TUFDbkIsT0FBTyxDQUFDLGFBQWM7O0lBQ3RCLE9BQUEsR0FBVSxDQUFDLENBQUMsTUFBRixDQUFTLE9BQVQsRUFDVDtNQUFBLFlBQUEsRUFBYyxDQUFkO01BQ0EsTUFBQSxFQUFRLEVBRFI7TUFFQSxXQUFBLEVBQWEscUJBRmI7S0FEUztJQUtWLHdDQUFNLE9BQU47SUFFQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsR0FBYztJQUNkLElBQUMsQ0FBQSxLQUFLLENBQUMsYUFBUCxHQUF1QjtJQUN2QixJQUFDLENBQUEsS0FBSyxDQUFDLFNBQVAsR0FBbUI7SUFDbkIsSUFBQyxDQUFBLElBQUQsR0FBUTtJQUVSLElBQUcsT0FBTyxDQUFDLEdBQVg7TUFDQyxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsR0FBaUI7TUFDakIsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFQLEdBQWU7TUFDZixJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVAs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ckIsQ0FBQTtFQUNoQixLQUFLLENBQUMsTUFBTixJQUFnQixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFyQixDQUFBO0VBRWhCLEtBQUssQ0FBQyxDQUFOLElBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFyQixHQUE4QixLQUFLLENBQUMsS0FBckMsQ0FBQSxHQUErQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztFQUMvRSxLQUFLLENBQUMsQ0FBTixJQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBckIsR0FBOEIsS0FBSyxDQUFDLE1BQXJDLENBQUEsR0FBK0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFFL0UsU0FBTztBQVJZOztBQVVwQixPQUFPLENBQUMsYUFBUixHQUF3QixTQUFDLEtBQUQ7U0FDdkI7SUFBQSxDQUFBLEVBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBTixHQUFVLGlCQUFBLENBQUEsQ0FBbUIsQ0FBQyxDQUEvQixDQUFBLEdBQW9DLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQXJCLENBQUEsQ0FBdkM7SUFDQSxDQUFBLEVBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBTixHQUFVLGlCQUFBLENBQUEsQ0FBbUIsQ0FBQyxDQUEvQixDQUFBLEdBQW9DLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQXJCLENBQUEsQ0FEdkM7O0FBRHVCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydHMudHJhbnNmb3JtQ3VydmUgPSAnY3ViaWMtYmV6aWVyKDAuNCwgMCwgMC4yLCAxKScgIyBmYXN0IG91dCwgc2xvdyBpblxuZXhwb3J0cy5lbnRlckN1cnZlID0gJ2N1YmljLWJlemllcigwLCAwLCAwLjIsIDEpJyAjIGxpbmVhciBvdXQsIHNsb3cgaW5cbmV4cG9ydHMuZXhpdEN1cnZlID0gJ2N1YmljLWJlemllcigwLjQsIDAsIDAuMiwgMSknICMgZmFzdCBvdXQsIGxpbmVhciBpblxuXG5cbmV4cG9ydHMuQnV0dG9uID0gY2xhc3MgQnV0dG9uIGV4dGVuZHMgTGF5ZXJcblx0Y29uc3RydWN0b3I6ICh0ZXh0LCBvcHRpb25zPXt9KSAtPlxuXHRcdG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89ICcjMDNhOWY0J1xuXHRcdG9wdGlvbnMuY29sb3IgPz0gJyNmZmYnXG5cdFx0b3B0aW9ucy5zaGFkb3dZID89IDJcblx0XHRvcHRpb25zLnNoYWRvd0JsdXIgPz0gMlxuXHRcdG9wdGlvbnMgPSBfLmV4dGVuZCBvcHRpb25zLFxuXHRcdFx0Ym9yZGVyUmFkaXVzOiAyXG5cdFx0XHRoZWlnaHQ6IDM2XG5cdFx0XHRzaGFkb3dDb2xvcjogJ3JnYmEoMCwgMCwgMCwgMC4yNCknXG5cblx0XHRzdXBlciBvcHRpb25zXG5cblx0XHRAc3R5bGUuZm9udCA9ICc1MDAgMTRweC8zNnB4IFJvYm90bydcblx0XHRAc3R5bGUudGV4dFRyYW5zZm9ybSA9ICd1cHBlcmNhc2UnXG5cdFx0QHN0eWxlLnRleHRBbGlnbiA9ICdjZW50ZXInXG5cdFx0QGh0bWwgPSB0ZXh0XG5cdFx0XG5cdFx0aWYgb3B0aW9ucy5maXRcblx0XHRcdEBzdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jaydcblx0XHRcdEBzdHlsZS53aWR0aCA9ICdhdXRvJ1xuXHRcdFx0QHN0eWxlLm1pbldpZHRoID0gJzg4cHgnXG5cdFx0XHRAc3R5bGUucGFkZGluZyA9ICcwIDhweCdcblxuZXhwb3J0cy5DYXJkID0gY2xhc3MgQ2FyZCBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRvcHRpb25zLmJhY2tncm91bmRDb2xvciA/PSAnI2ZmZidcblx0XHRvcHRpb25zLnNoYWRvd1kgPz0gMlxuXHRcdG9wdGlvbnMuc2hhZG93Qmx1ciA/PSAyXG5cdFx0b3B0aW9ucyA9IF8uZXh0ZW5kIG9wdGlvbnMsXG5cdFx0XHRib3JkZXJSYWRpdXM6IDJcblx0XHRcdHNoYWRvd0NvbG9yOiAncmdiYSgwLCAwLCAwLCAwLjI0KSdcblxuXHRcdHN1cGVyIG9wdGlvbnNcblxuXG5leHBvcnRzLlByb2dyZXNzQmFyID0gY2xhc3MgUHJvZ3Jlc3NCYXIgZXh0ZW5kcyBMYXllclxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0b3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gJ3JnYmEoMCwgMCwgMCwgMC4xMiknXG5cdFx0b3B0aW9ucy5oZWlnaHQgPz0gNFxuXHRcdG9wdGlvbnMub3JpZ2luWSA/PSAxXG5cdFx0b3B0aW9ucy5zY2FsZVkgPz0gMFxuXG5cdFx0c3VwZXIgb3B0aW9uc1xuXG5cdFx0QGZpbGwgPSBuZXcgTGF5ZXJcblx0XHRcdHN1cGVyTGF5ZXI6IEBcblx0XHRcdGJhY2tncm91bmRDb2xvcjogb3B0aW9ucy5maWxsQ29sb3IgfHwgJyMwM2E5ZjQnXG5cdFx0XHRzY2FsZVg6IDBcblx0XHRcdG9yaWdpblg6IDBcblx0XHRAZmlsbC5zdHlsZS53aWR0aCA9ICcxMDAlJ1xuXHRcdEBmaWxsLnN0eWxlLmhlaWdodCA9ICcxMDAlJ1xuXG5cdGFuaW1hdGVUbzogKGZpbGwsIHRpbWUpID0+XG5cdFx0QGZpbGwuc2NhbGVYID0gMFxuXHRcdEBhbmltYXRlIHByb3BlcnRpZXM6IHNjYWxlWTogMVxuXHRcdGZpbGxBbmltYXRpb24gPSBuZXcgQW5pbWF0aW9uXG5cdFx0XHRsYXllcjogQGZpbGxcblx0XHRcdHByb3BlcnRpZXM6IHNjYWxlWDogZmlsbFxuXHRcdFx0dGltZTogdGltZSB8fCAxXG5cdFx0Y29udGFpbmVyQW5pbWF0aW9uID0gbmV3IEFuaW1hdGlvblxuXHRcdFx0bGF5ZXI6IEBcblx0XHRcdHByb3BlcnRpZXM6IHNjYWxlWTogMFxuXHRcdGZpbGxBbmltYXRpb24ub24gRXZlbnRzLkFuaW1hdGlvbkVuZCwgLT4gY29udGFpbmVyQW5pbWF0aW9uLnN0YXJ0KClcblx0XHRmaWxsQW5pbWF0aW9uLnN0YXJ0KClcblx0XHRjb250YWluZXJBbmltYXRpb25cblxuXG5leHBvcnRzLlJpcHBsZSA9IGNsYXNzIFJpcHBsZSBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucz17fSkgLT5cblx0XHRvcHRpb25zLmNvbnRhaW5lciA/PSBGcmFtZXIuRGV2aWNlLnNjcmVlblxuXHRcdG9wdGlvbnMub3JpZ2luID89IHg6IG9wdGlvbnMuY29udGFpbmVyLm1pZFgsIHk6IG9wdGlvbnMuY29udGFpbmVyLm1pZFlcblx0XHRvcHRpb25zLnJhZGl1cyA/PSBNYXRoLm1heCBvcHRpb25zLmNvbnRhaW5lci53aWR0aCwgb3B0aW9ucy5jb250YWluZXIuaGVpZ2h0XG5cdFx0b3B0aW9ucy5jb2xvciA/PSAnIzAwMCdcblxuXHRcdHN1cGVyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCdcblx0XHRcdHdpZHRoOiBvcHRpb25zLmNvbnRhaW5lci53aWR0aFxuXHRcdFx0aGVpZ2h0OiBvcHRpb25zLmNvbnRhaW5lci5oZWlnaHRcblx0XHRcdHg6IG9wdGlvbnMuY29udGFpbmVyLnNjcmVlbkZyYW1lLnhcblx0XHRcdHk6IG9wdGlvbnMuY29udGFpbmVyLnNjcmVlbkZyYW1lLnlcblx0XHRcdGNsaXA6IHRydWVcblx0XHRcdFxuXHRcdEBwbGFjZUJlZm9yZSBvcHRpb25zLmNvbnRhaW5lclxuXG5cdFx0QGluayA9IG5ldyBMYXllclxuXHRcdFx0c3VwZXJMYXllcjogQFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBvcHRpb25zLmNvbG9yXG5cdFx0XHRvcGFjaXR5OiAwLjI1XG5cdFx0XHR3aWR0aDogb3B0aW9ucy5yYWRpdXMgKiAyXG5cdFx0XHRoZWlnaHQ6IG9wdGlvbnMucmFkaXVzICogMlxuXHRcdFx0bWlkWDogb3B0aW9ucy5vcmlnaW4ueCAtIG9wdGlvbnMuY29udGFpbmVyLnNjcmVlbkZyYW1lLnhcblx0XHRcdG1pZFk6IG9wdGlvbnMub3JpZ2luLnkgLSBvcHRpb25zLmNvbnRhaW5lci5zY3JlZW5GcmFtZS55XG5cdFx0XHRib3JkZXJSYWRpdXM6ICc1MCUnXG5cdFx0XHRzY2FsZTogMFxuXHRcdFxuXHRcdEBncm93KClcblxuXHRcdFxuXHRncm93OiAtPlxuXHRcdEBpbmsuYW5pbWF0ZSBwcm9wZXJ0aWVzOiBzY2FsZTogMVxuXHRcblx0cmVtb3ZlOiAtPlxuXHRcdGFuaW1hdGlvbiA9IEBpbmsuYW5pbWF0ZSBwcm9wZXJ0aWVzOiBvcGFjaXR5OiAwXG5cblxuIyB2aWEgaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2dyb3Vwcy9mcmFtZXJqcy9wZXJtYWxpbmsvNTgwNzA5NTkyMDU2MTE2L1xuc2NhbGVkU2NyZWVuRnJhbWUgPSAtPlxuXHRmcmFtZSA9IEZyYW1lci5EZXZpY2Uuc2NyZWVuLnNjcmVlbkZyYW1lXG5cdGZyYW1lLndpZHRoICAqPSBGcmFtZXIuRGV2aWNlLnNjcmVlbi5zY3JlZW5TY2FsZVgoKVxuXHRmcmFtZS5oZWlnaHQgKj0gRnJhbWVyLkRldmljZS5zY3JlZW4uc2NyZWVuU2NhbGVZKClcblx0XG5cdGZyYW1lLnggKz0gKEZyYW1lci5EZXZpY2Uuc2NyZWVuLndpZHRoIC0gIGZyYW1lLndpZHRoKSAgKiBGcmFtZXIuRGV2aWNlLnNjcmVlbi5vcmlnaW5YXG5cdGZyYW1lLnkgKz0gKEZyYW1lci5EZXZpY2Uuc2NyZWVuLmhlaWdodCAtIGZyYW1lLmhlaWdodCkgKiBGcmFtZXIuRGV2aWNlLnNjcmVlbi5vcmlnaW5ZXG5cblx0cmV0dXJuIGZyYW1lXG5cbmV4cG9ydHMuZXZlbnRUb09yaWdpbiA9IChldmVudCkgLT5cblx0eDogKGV2ZW50LnggLSBzY2FsZWRTY3JlZW5GcmFtZSgpLngpIC8gRnJhbWVyLkRldmljZS5zY3JlZW4uc2NyZWVuU2NhbGVYKClcblx0eTogKGV2ZW50LnkgLSBzY2FsZWRTY3JlZW5GcmFtZSgpLnkpIC8gRnJhbWVyLkRldmljZS5zY3JlZW4uc2NyZWVuU2NhbGVZKClcbiJdfQ==
