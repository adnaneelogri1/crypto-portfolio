
//------------------------------------------------------------------ Actions ---
// Actions appelées dans le code HTML quand des événements surviennent
//
actions = {

  //------------------------------- Initialisation et chargement des données ---

  async initAndGo(initialConfig) {
    console.log('initAndGo: ', initialConfig);

    if (initialConfig.config.dataMode == 'online') {
      const params = {
        target : initialConfig.config.targets.wished,
        debug  : initialConfig.config.debug,
      };
      let coinlayerData = await coinlayerRequest(params);
      if (coinlayerData.success) {
        initialConfig.data.online = coinlayerData;
      } else {
        console.log('initAndGo: Données en ligne indisponibles');
        console.log('initAndGo: BASCULEMENT EN MODE HORS-LIGNE');
        initialConfig.config.dataMode = 'offline';
      }
    }
  model.samPresent({do:'init', config:initialConfig});
  },

  reinit(data) {
    const initialConfigName =  data.e.target.value;
    configsSelected = initialConfigName;
    actions.initAndGo(configs[initialConfigName]);
  },

  async updateOnlineCurrenciesData(data) {
    const params = {
      debug  : data.debug,
      target : data.target,
    };
    let coinlayerData = await coinlayerRequest(params);
    if (coinlayerData.success) {
      model.samPresent({do:'updateCurrenciesData', currenciesData: coinlayerData});
    } else {
      console.log('updateOnlineCurrenciesData: Données en ligne indisponibles');
      console.log('updateOnlineCurrenciesData: BASCULEMENT EN MODE HORS-LIGNE');
      model.samPresent({do:'changeDataMode', dataMode:'offline'});
    }
  },

  //----------------------------------------------------------- CurrenciesUI ---

  // TODO: ajoutez vos fonctions...

  //----------------------------------------------- CurrenciesUI et WalletUI ---
  changeTab(data) {
    model.samPresent({do:'changeTab', ...data});
  },

  //----------------------------------------------------------- CurrenciesUI ---

  // TODO: ajoutez vos fonctions...


  //---------------------------------------------------------- PreferencesUI ---

  changeTarget(data) {
    data.target = data.e.target.value;
    delete data.e;
    this.updateOnlineCurrenciesData(data)
  },

  changeDataMode(data) {
    data.dataMode = data.e.target.value;
    delete data.e;
    if (data.dataMode == 'online') {
      this.updateOnlineCurrenciesData(data)
    }
    model.samPresent({do:'changeDataMode', ...data});
  },

  //--------------------------------------------------------------- WalletUI ---
  changeCoinQ(data){
    model.samPresent({do:'changeCoinQ',...data});
  },
  annulerWallet(data){
    model.samPresent({do:'annulerWallet'});
  },
  ConfirmerWallet(data){
    model.samPresent({do:'ConfirmerWallet'});
  },
  changeAjout(data){
    model.samPresent({do:'changeCoinQ',...data});
  },
  annulerAjout(data){
    model.samPresent({do:'annulerAjout'});
  },
  ConfirmerAjout(data){
    model.samPresent({do:'ConfirmerAjout'});
  },
  filtrercurrenciesFiat(data){
    data.text = data.e.target.value;
    delete data.e;
    model.samPresent({do:'filtrercurrenciesFiat',...data});
  },
  filtrerCryptoFiat(data){
    data.text = data.e.target.value;
    data.type=data.genre;
    delete data.e;
    model.samPresent({do:'filtrerCryptoFiat',...data});

  },
  AddOrDeletefiats(data){
    model.samPresent({do:'AddOrDeletefiats',...data});
  },
  addOrdeletecryptos(data){
    model.samPresent({do:'addOrdeletecryptos',...data});
  },
  // TODO: ajoutez vos fonctions...
  calcul(data){
    model.samPresent({do:'changeDataMode', ...data});
  }

};
