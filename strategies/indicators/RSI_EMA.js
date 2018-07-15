/*
 * Combined indicator applying EMA to the RSI.
 */

const RSI = require('./RSI');
const EMA = require('./EMA');

var Indicator = function(settings) {
  this.input = 'price';
  this.result = false;
  this.age = 0;
  this.rsi = new RSI({ interval: settings.rsi_interval });
  this.ema = new EMA(settings.interval);
}

Indicator.prototype.update = function(price) {
  this.rsi.update(price);
  this.ema.update(this.rsi.result);
  this.result = this.ema.result;
  this.age++;
}

Indicator.prototype.check = function(price) {
  this.rsi.check(price);
  this.rsiEma.check(price);
}

Indicator.prototype.log = function(price) {
  this.rsi.log(price);
  this.rsiEma.log(price);
}

module.exports = Indicator;
