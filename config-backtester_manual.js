// Everything is explained here:
// @link https://gekko.wizb.it/docs/commandline/plugins.html

var config = {};

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                          GENERAL SETTINGS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

config.debug = true; // for additional logging / debugging

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                         WATCHING A MARKET
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

config.watch = {

  // see https://gekko.wizb.it/docs/introduction/supported_exchanges.html
  exchange: 'binance',
  currency: 'BNB',
  asset: 'XLM',

  // You can set your own tickrate (refresh rate).
  // If you don't set it, the defaults are 2 sec for
  // okcoin and 20 sec for all other exchanges.
  // tickrate: 20
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                       CONFIGURING TRADING ADVICE
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

config.tradingAdvisor = {
  enabled: true,
  method: 'tether',
  candleSize: 10,
  historySize: 60,
}

// Exponential Moving Averages settings:
config.DEMA = {
  // EMA weight (α)
  // the higher the weight, the more smooth (and delayed) the line
  weight: 21,
  // amount of candles to remember and base initial EMAs on
  // the difference between the EMAs (to act as triggers)
  thresholds: {
    down: -0.025,
    up: 0.025
  }
};

// MACD settings:
config.MACD = {
  // EMA weight (α)
  // the higher the weight, the more smooth (and delayed) the line
  short: 10,
  long: 21,
  signal: 9,
  // the difference between the EMAs (to act as triggers)
  thresholds: {
    down: -0.025,
    up: 0.025,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 1
  }
};

// PPO settings:
config.PPO = {
  // EMA weight (α)
  // the higher the weight, the more smooth (and delayed) the line
  short: 12,
  long: 26,
  signal: 9,
  // the difference between the EMAs (to act as triggers)
  thresholds: {
    down: -0.025,
    up: 0.025,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 2
  }
};

// Uses one of the momentum indicators but adjusts the thresholds when PPO is bullish or bearish
// Uses settings from the ppo and momentum indicator config block
config.varPPO = {
  momentum: 'TSI', // RSI, TSI or UO
  thresholds: {
    // new threshold is default threshold + PPOhist * PPOweight
    weightLow: 120,
    weightHigh: -120,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 0
  }
};

// RSI settings:
config.RSI = {
  interval: 14,
  thresholds: {
    low: 30,
    high: 70,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 1
  }
};

// TSI settings:
config.TSI = {
  short: 13,
  long: 25,
  thresholds: {
    low: -25,
    high: 25,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 1
  }
};

// Ultimate Oscillator Settings
config.UO = {
  first: {weight: 4, period: 7},
  second: {weight: 2, period: 14},
  third: {weight: 1, period: 28},
  thresholds: {
    low: 30,
    high: 70,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 1
  }
};

// CCI Settings
config.CCI = {
    constant: 0.015, // constant multiplier. 0.015 gets to around 70% fit
    history: 90, // history size, make same or smaller than history
    thresholds: {
        up: 100, // fixed values for overbuy upward trajectory
        down: -100, // fixed value for downward trajectory
        persistence: 0 // filter spikes by adding extra filters candles
    }
};

// StochRSI settings
config.StochRSI = {
  interval: 3,
  thresholds: {
    low: 20,
    high: 80,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 3
  }
};

// CUSTOM INDICATORS
// --------------------

// RSI EMA Cross
config.RSI_EMA_Cross = {
	// RSI period
	// The number of time units to track in the RSI
  rsi: {
	interval: 14
  },
  // EMA weight (α)
  // the higher the weight, the more smooth (and delayed) the line
  rsi_ema: {
	  interval: 14,
	  rsi_interval: 14
  },
  thresholds: {
	// Extra amount of RSI_EMA crossing above EMA for trend change
    crossAbove: 0.02,
	// Same as above but below
    crossBelow: 0.02,
    // How many candle intervals should a trend persist
    // before we consider it real?
    persistence: 2
  }
};

// custom settings:
config.custom = {
  my_custom_setting: 10,
}

config['talib-macd'] = {
  parameters: {
    optInFastPeriod: 10,
    optInSlowPeriod: 21,
    optInSignalPeriod: 9
  },
  thresholds: {
    down: -0.025,
    up: 0.025,
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                       CONFIGURING PLUGINS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// do you want Gekko to simulate the profit of the strategy's own advice?
config.paperTrader = {
  enabled: true,
  // report the profit in the currency or the asset?
  reportInCurrency: true,
  // start balance, on what the current balance is compared with
  simulationBalance: {
    // these are in the unit types configured in the watcher.
    asset: 1,
    currency: 100,
  },
  // how much fee in % does each trade cost?
  feeMaker: 0.15,
  feeTaker: 0.25,
  feeUsing: 'maker',
  // how much slippage/spread should Gekko assume per trade?
  slippage: 0.05,
}

config.performanceAnalyzer = {
  enabled: true,
  riskFreeReturn: 5
}

// Want Gekko to perform real trades on buy or sell advice?
// Enabling this will activate trades for the market being
// watched by `config.watch`.
config.trader = {
  enabled: false,
  key: '',
  secret: '',
  username: '', // your username, only required for specific exchanges.
  passphrase: '', // GDAX, requires a passphrase.
}

config.eventLogger = {
  enabled: false,
  // optionally pass a whitelist of events to log, if not past
  // the eventLogger will log _all_ events.
  // whitelist: ['portfolioChange', 'portfolioValueChange']
}

config.pushover = {
  enabled: false,
  sendPushoverOnStart: false,
  muteSoft: true, // disable advice printout if it's soft
  tag: '[GEKKO]',
  key: '',
  user: ''
}

// want Gekko to send a mail on buy or sell advice?
config.mailer = {
  enabled: false,       // Send Emails if true, false to turn off
  sendMailOnStart: true,    // Send 'Gekko starting' message if true, not if false

  email: '',    // Your Gmail address
  muteSoft: true, // disable advice printout if it's soft

  // You don't have to set your password here, if you leave it blank we will ask it
  // when Gekko's starts.
  //
  // NOTE: Gekko is an open source project < https://github.com/askmike/gekko >,
  // make sure you looked at the code or trust the maintainer of this bot when you
  // fill in your email and password.
  //
  // WARNING: If you have NOT downloaded Gekko from the github page above we CANNOT
  // guarantuee that your email address & password are safe!

  password: '',       // Your Gmail Password - if not supplied Gekko will prompt on startup.

  tag: '[GEKKO] ',      // Prefix all email subject lines with this

            //       ADVANCED MAIL SETTINGS
            // you can leave those as is if you
            // just want to use Gmail

  server: 'smtp.gmail.com',   // The name of YOUR outbound (SMTP) mail server.
  smtpauth: true,     // Does SMTP server require authentication (true for Gmail)
          // The following 3 values default to the Email (above) if left blank
  user: '',       // Your Email server user name - usually your full Email address 'me@mydomain.com'
  from: '',       // 'me@mydomain.com'
  to: '',       // 'me@somedomain.com, me@someotherdomain.com'
  ssl: true,        // Use SSL (true for Gmail)
  port: '',       // Set if you don't want to use the default port
}

config.pushbullet = {
    // sends pushbullets if true
  enabled: false,
    // Send 'Gekko starting' message if true
  sendMessageOnStart: true,
    // disable advice printout if it's soft
  muteSoft: true,
    // your pushbullet API key
  key: 'xxx',
    // your email, change it unless you are Azor Ahai
  email: 'jon_snow@westeros.org',
    // will make Gekko messages start mit [GEKKO]
  tag: '[GEKKO]'
};

config.kodi = {
  // if you have a username & pass, add it like below
  // http://user:pass@ip-or-hostname:8080/jsonrpc
  host: 'http://ip-or-hostname:8080/jsonrpc',
  enabled: false,
  sendMessageOnStart: true,
}

config.ircbot = {
  enabled: false,
  emitUpdates: false,
  muteSoft: true,
  channel: '#your-channel',
  server: 'irc.freenode.net',
  botName: 'gekkobot'
}

config.telegrambot = {
  enabled: false,
  token: 'YOUR_TELEGRAM_BOT_TOKEN',
};

config.twitter = {
    // sends pushbullets if true
  enabled: false,
    // Send 'Gekko starting' message if true
  sendMessageOnStart: false,
    // disable advice printout if it's soft
  muteSoft: false,
  tag: '[GEKKO]',
    // twitter consumer key
  consumer_key: '',
    // twitter consumer secret
  consumer_secret: '',
    // twitter access token key
  access_token_key: '',
    // twitter access token secret
  access_token_secret: ''
};

config.xmppbot = {
  enabled: false,
  emitUpdates: false,
  client_id: 'jabber_id',
  client_pwd: 'jabber_pw',
  client_host: 'jabber_server',
  client_port: 5222,
  status_msg: 'I\'m online',
  receiver: 'jabber_id_for_updates'
}

config.campfire = {
  enabled: false,
  emitUpdates: false,
  nickname: 'Gordon',
  roomId: null,
  apiKey: '',
  account: ''
}

config.redisBeacon = {
  enabled: false,
  port: 6379, // redis default
  host: '127.0.0.1', // localhost
    // On default Gekko broadcasts
    // events in the channel with
    // the name of the event, set
    // an optional prefix to the
    // channel name.
  channelPrefix: '',
  broadcast: [
    'candle'
  ]
}

config.slack = {
  enabled: false,
  token: '',
  sendMessageOnStart: true,
  muteSoft: true,
  channel: '' // #tradebot
}

config.ifttt = {
  enabled: false,
  eventName: 'gekko',
  makerKey: '',
  muteSoft: true,
  sendMessageOnStart: true
}

config.candleWriter = {
  enabled: false
}

config.adviceWriter = {
  enabled: false,
  muteSoft: true,
}

config.backtestResultExporter = {
  enabled: false,
  writeToDisk: false,
  data: {
    stratUpdates: false,
    roundtrips: true,
    stratCandles: true,
    trades: true
  }
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                       CONFIGURING ADAPTER
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

config.adapter = 'sqlite';

config.sqlite = {
  path: 'plugins/sqlite',

  dataDirectory: 'history',
  version: 0.1,

  journalMode: require('./web/isWindows.js') ? 'DELETE' : 'WAL',

  dependencies: []
}

  // Postgres adapter example config (please note: requires postgres >= 9.5):
config.postgresql = {
  path: 'plugins/postgresql',
  version: 0.1,
  connectionString: 'postgres://user:pass@localhost:5432', // if default port
  database: null, // if set, we'll put all tables into a single database.
  schema: 'public',
  dependencies: [{
    module: 'pg',
    version: '6.1.0'
  }]
}

// Mongodb adapter, requires mongodb >= 3.3 (no version earlier tested)
config.mongodb = {
  path: 'plugins/mongodb',
  version: 0.1,
  connectionString: 'mongodb://localhost/gekko', // connection to mongodb server
  dependencies: [{
    module: 'mongojs',
    version: '2.4.0'
  }]
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                       CONFIGURING BACKTESTING
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Note that these settings are only used in backtesting mode, see here:
// @link: https://gekko.wizb.it/docs/commandline/backtesting.html

config.backtest = {
  daterange: 'scan',
// daterange: {
//   from: "2018-03-01",
//   to: "2018-04-28"
//},
  batchSize: 50
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                       CONFIGURING IMPORTING
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

config.importer = {
  daterange: {
    // NOTE: these dates are in UTC
    from: "2017-11-01 00:00:00",
    to: "2017-11-20 00:00:00"
  }
}

// set this to true if you understand that Gekko will
// invest according to how you configured the indicators.
// None of the advice in the output is Gekko telling you
// to take a certain position. Instead it is the result
// of running the indicators you configured automatically.
//
// In other words: Gekko automates your trading strategies,
// it doesn't advice on itself, only set to true if you truly
// understand this.
//
// Not sure? Read this first: https://github.com/askmike/gekko/issues/201
config['I understand that Gekko only automates MY OWN trading strategies'] = false;


config.BBRSI={"interval":14,"thresholds":{"low":40,"high":40,"persistence":9},"bbands":{"TimePeriod":20,"NbDevUp":2,"NbDevDn":2}}

config.BodhiDI_public={"optInTimePeriod":14,"diplus":23.5,"diminus":23}

config.CCI={"constant":0.015,"history":90,"thresholds":{"up":100,"down":-100,"persistence":0}}

config.CCI_custom={"constant":0.015,"history":90,"thresholds":{"up":150,"down":-30,"takeProfit":20,"minProfit":5,"takeLoss":-10,"persistence":0,"negativeProfit":1}}

config.CUSTOM_RSI={"RSI":{"optInTimePeriod":14,"long":25,"short":75,"buffer":3,"bufferPercent":75}}

config.DEMA={"weight":21,"thresholds":{"down":-0.025,"up":0.025}}

config.DEMACrossover={"firstTrade":"buy","shortSize":13,"longSize":34,"demaCrossover":{}}

config.DI={"optInTimePeriod":14,"diplus":23.5,"diminus":23}

config.Dave={"short":2,"long":10,"thresholds":{"down":0.01,"up":0.01,"getOut":0.03,"persistence":1,"maxExposureLength":30}}

config.DynBuySell={"thresholds":{"interval":8,"sell_at":1.05,"buy_at":0.97,"buy_at_up":1.003,"stop_loss_pct":0.85}}

config.EMACrossover={"firstTrade":"buy","shortSize":13,"longSize":34,"delta":0,"emaCrossover":{}}

config.EMADIV={"ema":50,"long":-2.5,"short":2.5}

config.EMADIV2={"ema":50,"long":-3,"short":3}

config.EMA_OR_PRICE_DIV={"ema":50,"long":-2.5,"short":2.5}

config.FIXPRICE={"short":41,"long":37,"exit":-1}

config.MACD={"short":10,"long":21,"signal":9,"thresholds":{"down":-0.025,"up":0.025,"persistence":1}}

config.MACD_1520024643={"short":10,"long":21,"signal":9,"interval":14,"thresholds":{"down":-0.025,"up":0.025,"persistence":1}}

config.MK_RSI_BULL_BEAR={"SMA_long":200,"SMA_short":50,"BULL_RSI":10,"BULL_FAST_RSI":5,"BULL_SLOW_RSI":14,"BULL_RSI_HIGH":80,"BULL_RSI_LOW":60,"BEAR_RSI":15,"BEAR_FAST_RSI":5,"BEAR_SLOW_RSI":14,"BEAR_RSI_HIGH":50,"BEAR_RSI_LOW":20}

config.NEO={"SMA_long":150,"SMA_short":40,"BULL_RSI":10,"BULL_RSI_high":80,"BULL_RSI_low":50,"IDLE_RSI":12,"IDLE_RSI_high":65,"IDLE_RSI_low":39,"BEAR_RSI":15,"BEAR_RSI_high":50,"BEAR_RSI_low":25,"ROC":6,"ROC_lvl":0}

config.NN_ADX_RSI={"SMA_long":800,"SMA_short":40,"interval":14,"SL":1,"BULL_RSI":10,"BULL_RSI_high":80,"BULL_RSI_low":50,"IDLE_RSI":12,"IDLE_RSI_high":65,"IDLE_RSI_low":39,"BEAR_RSI":15,"BEAR_RSI_high":50,"BEAR_RSI_low":25,"ROC":9,"ROC_lvl":0,"ADX":3,"ADX_high":70,"ADX_low":50,"thresholds":{"low":30,"high":70,"down":0.1,"persistence":1}}

config.NNv2={"threshold_buy_bear":1,"threshold_buy_bull":2,"threshold_sell_bear":-0.2,"threshold_sell_bull":-0.5,"NN_SMMA_Length":4,"maFast":30,"maSlow":720,"decay":0.6,"price_buffer_len":90,"stoploss_threshold":6,"waitTime":720}

config.PPO={"short":12,"long":26,"signal":9,"thresholds":{"down":-0.025,"up":0.025,"persistence":2}}

config.RSI={"interval":14,"thresholds":{"low":30,"high":70,"persistence":1}}

config.RSI_BB_ADX_Peak={"SMA_long":1000,"SMA_short":50,"BULL_RSI":10,"BULL_RSI_high":80,"BULL_RSI_low":60,"BEAR_RSI":15,"BEAR_RSI_high":50,"BEAR_RSI_low":20,"BULL_MOD_high":5,"BULL_MOD_low":-5,"BEAR_MOD_high":15,"BEAR_MOD_low":-5,"ADX":3,"ADX_high":70,"ADX_low":50,"Stop_Loss_Percent":50}

config.RSI_BULL_BEAR={"SMA_long":1000,"SMA_short":50,"BULL_RSI":10,"BULL_RSI_high":80,"BULL_RSI_low":60,"BEAR_RSI":15,"BEAR_RSI_high":50,"BEAR_RSI_low":20}

config.RSI_BULL_BEAR_ADX_PINGPONG={"SMA_long":1000,"SMA_short":50,"BULL_RSI":10,"BULL_RSI_high":80,"BULL_RSI_low":60,"BEAR_RSI":15,"BEAR_RSI_high":50,"BEAR_RSI_low":20,"BULL_MOD_high":5,"BULL_MOD_low":-5,"BEAR_MOD_high":15,"BEAR_MOD_low":-5,"ADX":3,"ADX_high":70,"ADX_low":50,"PINGPONG_GAINS_PERCENTAGE":2}

config.RSI_Bull_Bear_Adx_Stop={"SMA_long":1000,"SMA_short":50,"BULL_RSI":10,"BULL_RSI_high":80,"BULL_RSI_low":60,"BEAR_RSI":15,"BEAR_RSI_high":50,"BEAR_RSI_low":20,"BULL_MOD_high":5,"BULL_MOD_low":-5,"BEAR_MOD_high":15,"BEAR_MOD_low":-5,"ADX":3,"ADX_high":70,"ADX_low":50,"Stop_Loss_Percent":50}

config.RSI_EMA_Cross={"rsi":{"interval":14},"rsi_ema":{"interval":14,"rsi_interval":14},"thresholds":{"crossAbove":0.2,"crossBelow":0.2,"persistence":1}}

config.RsiStopLoss={"interval":14,"thresholds":{"low":30,"high":70,"persistence":1},"stoploss":{"loss":5,"gain":8,"progressive":true,"progressivegain":2}}

config.StochRSI={"interval":3,"thresholds":{"low":20,"high":80,"persistence":3}}

config.Supertrend_Gab0={"atrEma":13,"bandFactor":3}

config.TEMA={"short":10,"long":80,"SMA_long":200}

config.TMA={"short":7,"medium":25,"long":99}

config.TSI={"short":13,"long":25,"thresholds":{"low":-25,"high":25,"persistence":1}}

config.UO={"first":{"weight":4,"period":7},"second":{"weight":2,"period":14},"third":{"weight":1,"period":28},"thresholds":{"low":30,"high":70,"persistence":1}}

config.bryanbeck={"buyImmediately":"no","tradeFactors":"price","priceType":"open/close","buyIfPrice":"decrease","sellIfPrice":"increase","buyIfVol":"decrease","sellIfVol":"increase","changeType":"#","buyPricePersistenceThreshold":3,"sellPricePersistenceThreshold":2,"buyVolPersistenceThreshold":3,"sellVolPersistenceThreshold":2,"priceProtection":"disabled","nextActionBuy":"yes","nextActionSell":"no","thresholds":{"priceDecreaseAmt":0.00001,"priceIncreaseAmt":0.00002,"priceDecreasePer":0.000001,"priceIncreasePer":0.000001,"tradeVolDecreaseAmt":0.00001,"tradeVolIncreaseAmt":0.00002,"tradeVolDecreasePer":0.000001,"tradeVolIncreasePer":0.000001,"buyPriceThreshold":5650,"sellPriceThreshold":5660}}

config.buyatsellat_ui={"buyat":1.2,"sellat":0.98,"stop_loss_pct":0.85,"sellat_up":1.01}

config.custom={"my_custom_setting":10}

config.jazzbre={"short":10,"long":21,"interval":14,"signal":9,"thresholds":{"down":-0.025,"up":0.025},"chart":{"indicatorColors":{"ema1":"cyan","ema2":"pink","ema3":"orange","ema4":"yellow","ema5":"black","ppo":"purple"}}}

config.mounirs_esto={"rsi":{"interval":6},"ema":{"ema1":10}}

config.n8_v2_BB_RSI_SL={"interval":14,"SL":1,"BULL_RSI":10,"BULL_RSI_high":80,"BULL_RSI_low":60,"BEAR_RSI":15,"BEAR_RSI_high":50,"BEAR_RSI_low":20,"ADX":3,"ADX_high":70,"ADX_low":50,"thresholds":{"low":30,"high":70,"down":0.1,"persistence":1}}

config.neuralnet={
	"method":"adadelta", "decay":0.1, "threshold_buy":1, "momentum":0.9, "stoploss_threshold":0.85, "threshold_sell":-1, "stoploss_enabled":"false", "min_predictions":1000, "learning_rate":1.2, "price_buffer_len":100, "hodl_threshold":1
}
config.neuralnet_v2={"threshold_buy":1,"threshold_sell":-1,"learning_rate":0.01,"momentum":0.1,"decay":0.01,"stoploss_enabled":false,"stoploss_threshold":0.85,"hodl_threshold":1,"price_buffer_len":100,"min_predictions":1000}

config.rsidyn={"interval":8,"sellat":0.4,"buyat":1.5,"stop_percent":0.96,"stop_enabled":true}

config.varPPO={"momentum":"TSI","thresholds":{"weightLow":120,"weightHigh":-120,"persistence":0}}

config.w2={"pd":36,"ph":0.8520000000000001,"bbl":32.2,"lb":19.6,"mult":4.1,"rsi_interval":5.4399999999999995,"rsi_long":25.57,"rsi_short":77.25,"fastrsi":4.5200000000000005,"slowrsi":16.560000000000002}

config.x2_rsi={"interval":14,"thresholds":{"low":30,"high":70,"persistence":1}}

module.exports = config;
