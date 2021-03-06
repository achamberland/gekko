/*
 * Volatility RSI
 * Used to signal pumps/dumps during consolidation periods
 *
 * Inspired by (okay fine, stolen) from CryptoMedication's TradingView indicator
 */

const stdev = require('stdev'); // Find npm module that does this

const EMA = require('./EMA.js');
const SMMA = require('./SMMA.js');
const ATR = require('./ATR.js');

const defaults = {
	
	// Like overbought/oversold.
	// Average of lagging period below compared to these thresholds.
	// *** This indicator's result may end up numeric and not need these
	overbusy: 70,
	overquiet: 30,

	// Lagging behavior
	// Get average of lagged behavior from range
	trailingPeriod: {
		start: 2,
		end: 5,
		applyEma: 0 // 0 or 1 boolean - numeric for gen. backtests
	},

	bb: {
		period: 2, // This is applied to ATR smoothing (SMMA) in places
		multiplier: 20,
	},

	atr: {
		period: 14
		smoothing: 0 // EMA smoothing - not applied if zero
	},

	bb_and_atr_smoothing: 0 
};

var Indicator = function(settings) {
    this.input = 'candle';

    this.result = false;
    this.age = 0;

    this.bb = new BB(settings.bb.period);
	this.atr = new ATR(settings.atr.period);

	this.atr_smma = new SMMA({ interval: settings.bb.period }); 
	if (this.settings.atr.smoothing) {
		this.atr_ema = new EMA({ interval: settings.atr.smoothing });
	}
}

Indicator.prototype.update = candle => {
	this.bb.update(candle);
	this.atr.update(candle);
	this.atr_smma.update(this.atr.result);

	this.normalizedATR = this.normalizeATR(this.atr.result);

	if (this.settings.bb_and_atr_smoothing) {
		// this.bb_ema.update(this.bb.result);
		this.atr_ema.update(this.normalizedATR);
		// this.bbResult = this.bb_ema.result; Needed/Useful?
		this.result = this.atr_ema.result;
	} else {
		// this.bbResult = this.bb.result; Needed/Useful?
		this.result = this.normalizedATR;
	}
}

// This applies smoothed BBs to the ATR instead of the candle
function normalizeATR(atr) {
	const basis_ATR = this.atr_smma.result;
 	const stdev_ATR = multiplier * stdev(atr, this.settings.bb.period);
 	const upper_ATR = basis_ATR + stdev_ATR
 	const lower_ATR = basis_ATR - stdev_ATR
 	const bb_relative_ATR = (atr - lower_ATR)/(upper_ATR - lower_ATR)
 	return (40 * bb_relative_ATR) + 30;
}

//@version=3
	//
	//study(shorttitle="CryptoMed Volatility RSI", title="CryptoMedication's Volatility RSI", overlay=false)
	//
	//
	//
	////Non repainting sourced input
	//
	const src = security(tickerid, period, close[1], lookahead=barmerge.lookahead_on)
	//
	//
	//
	/////Inputs

	const ploton_ea = input(false,title="Plot Standard BB%B? ")
	const smoothon_ea = input(false,title="Smooth On ? ")
	//
	const s2_ea = input(title="Smooth BB%b with xx EMA", defval=9)
	//
	const x=100
	//
	//
	//
	const bb_rel_period_ea = input(20, minval=1,title="BB%B Period",type=integer)
	//
	const multiplier_ea = input(2.0, minval=0.001, maxval=50,title="BB%B Multiplier",type=float)
	//
	const atrperiod_ea = input(14,title="ATR Period",type=integer)
	//
	//
	//
	//
	//
	/////Make it Easy
	//
	//
	//
	const easyon = input(false,title="What is All This? I want it easy! ")
	//
	const easyval = input(defval=60,title="And My Chart Period in minutes is", type=integer)
	//
	//
	const easyvalmp=2
	//
	const easyvals2 = 9
	//
	//
	//
	/////make it switch
	//
	const bb_rel_period = easyon ? easyval/3 : bb_rel_period_ea
	const atrperiod = easyon ? easyval/5 : atrperiod_ea
	const multiplier = easyon ? easyvalmp : multiplier_ea
	//
	//
	//
	const smoothon = easyon ? true : smoothon_ea
	const ploton = easyon ? true : ploton_ea
	//
	//
	//
	const s2 = easyon ? easyvals2 : s2_ea
	//
	//
	//
	//
	//
	//
	//
	/////Calculations BB_rel
	//
	//
	//
	const basis = SMMA(src, bb_rel_period)
	//
	const stdev = multiplier * stdev(src, bb_rel_period)
	//
	const upper = basis + stdev
	//
	const lower = basis - stdev
//
	const bb_rel = (src - lower)/(upper - lower)
//
	const norm_bb = (40*bb_rel+30)
	//
	//
	//
	/////Calculations ATR
	//
	const atr = atr(atrperiod)
	//
	//
	//
	//
//
	//color(aqua, 30)
//
	//
//
	//////hlineupsmooth=(70*x/100)
	//
	//////hlinelowsmooth=(30*x/100)
//
	//
	//
	//////hlineupdef=70
	//
/////hlinedowndef=30
//
	//
//
	const upperband_var = 70///smoothon and hlineupsmooth ? hlineupsmooth : hlineupdef
//
	const lowerband_var = 30///smoothon and hlinelowsmooth ? hlinelowsmooth : hlinedowndef
	//
	//
	//
	const upperband = hline(upperband_var, linestyle=dotted, linewidth=1, color=aqua)
	//
	const lowerband = hline(lowerband_var, linestyle=dotted, linewidth=1, color=aqua)
	//
 	const midbad = hline(50, linestyle=dotted, linewidth=1, color=aqua)
	//
//
	//
//fill(upperband,lowerband,aqua)
	//
	//
	//
/////NOW the AMAZING APPLY the BB%B ONTO THE ATR
	//
	//
//
	////Calculations BB_rel
	//
	//
	//
	const basis_ATR = sma(atr, bb_rel_period)
	//
	const stdev_ATR = multiplier * stdev(atr, bb_rel_period)
	//
	const upper_ATR = basis_ATR + stdev_ATR
	//
	const lower_ATR = basis_ATR - stdev_ATR
	//
	const bb_rel_ATR = (atr - lower_ATR)/(upper_ATR - lower_ATR)
	//
	const norm_bb_ATR = (40*bb_rel_ATR+30)
	//
//
	//
////Smoothing
	//
	const plotbb = ema(norm_bb_ATR,s2)
	//
	const plotsnbb = ema(norm_bb,s2)
	//
	//
	//
	const norm_bb_plot = smoothon ? plotsnbb : norm_bb
//
	//
//
	/////Plot's
	//
//plot(easyon ? na : (ploton? norm_bb_plot : na), title = '[Standard]BB%B', color=blue, linewidth=1) 
	//
	//
	//
	//plot(easyon ? na :(smoothon and plotbb ? plotbb : norm_bb_ATR), title = '[BB%B]ATR', color=aqua, linewidth=1)
	//
	//
	//
//avgbb=avg(plotsnbb,plotsnbb)
	//
	//up = norm_bb > avgbb
	//
	//stepcolor = up? aqua : red
	//
//
	//
	//plot(easyon ? avg(plotsnbb,plotsnbb):na,color=stepcolor,linewidth=1)//@version=3
	//
	//study(shorttitle="CryptoMed Volatility RSI", title="CryptoMedication's Volatility RSI", overlay=false)
	//
	//
//
	////Non repainting sourced input
	//
//src = security(tickerid, period, close[1], lookahead=barmerge.lookahead_on)
	//
	//
	//
}
