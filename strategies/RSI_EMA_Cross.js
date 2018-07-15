/*
 * RSI EMA Crossover Strategy
 * When the EMA of the RSI crosses above/below the RSI, trade it
 */

// helpers
var _ = require('lodash');
var log = require('../core/log.js');

const RSI = require('./indicators/RSI.js');
const RSIEMA = require('./indicators/RSI_EMA.js');

// let's create our own method
var method = {};

log.debug('AT LEAST IT FUCKING TRIED')

// set our defaults
method.settings = {
	thresholds: {
		crossAbove: 0.02,
		crossBelow: 0.02,
		persistence: 1,
	},
	rsi: {
		interval: 14,
	},
	rsi_ema: {
		interval: 14,
		rsi_interval: 14,
	},
}

// prepare everything our method needs
method.init = function() {
  this.name = 'RSI EMA Cross';

  this.trend = {
    direction: 'none',
    duration: 0,
    persisted: false,
    adviced: false
  };

  this.requiredHistory = this.tradingAdvisor.historySize;

  // define the indicators we need
  this.addIndicator('rsi', 'RSI', this.settings.rsi);
  this.addIndicator('rsi_ema', 'RSI_EMA', this.settings.rsi_ema);

}

// for debugging purposes log the last
// calculated parameters.
method.log = function(candle) {
  var digits = 8;
  const rsi = this.indicators.rsi;
  const rsiEma = this.indicators.rsi_ema;

  if (rsi.result === false || rsiEma.result === false) {
  	log.debug(`Initial candle
	  RSI: ${rsi.result},
	  EMA of RSI: ${rsiEma.result}
	  `);
	return;
  }

  log.debug('calculated RSI properties for candle:');
  log.debug('\t', 'rsi:', rsi.result.toFixed(digits));
  log.debug('\t', 'ema of rsi:', rsiEma.result.toFixed(digits));
  log.debug('\t', 'price:', candle.close.toFixed(digits));
}

method.check = function() {
 log.debug('checkiong')
  const rsi = this.indicators.rsi.result;
  const rsiEma = this.indicators.rsi_ema.result;

  const minUpperCross = rsiEma + this.settings.thresholds.crossAbove;
  const maxLowerCross = rsiEma - this.settings.thresholds.crossBelow;

	if (rsi > minUpperCross) {
		// new trend detected
		if(this.trend.direction !== 'high') {
			this.trend = {
				duration: 0,
				persisted: false,
				direction: 'high',
				adviced: false
			};
		}

	  this.trend.duration++;

	  log.debug('In high since', this.trend.duration, 'candle(s)');

	  if(this.trend.duration >= this.settings.thresholds.persistence) {
		  this.trend.persisted = true;
	  }
	  if(this.trend.persisted && !this.trend.adviced) {
		this.trend.adviced = true;
		this.advice('short');
	  } else {
		this.advice();
	  }
	} else if (rsi < maxLowerCross) {

		// new trend detected
		if(this.trend.direction !== 'low') {
			this.trend = {
				duration: 0,
				persisted: false,
				direction: 'low',
				adviced: false
			};
		}

		this.trend.duration++;

		log.debug('In low since', this.trend.duration, 'candle(s)');

		if (this.trend.duration >= this.settings.thresholds.persistence) {
			this.trend.persisted = true;
		}

		if (this.trend.persisted && !this.trend.adviced) {
			this.trend.adviced = true;
			this.advice('long');
		} else {
			this.advice();
		}
	} else {
      log.debug('In no trend');
      this.advice();
    }

	log.debug('end of check')
};

module.exports = method;

