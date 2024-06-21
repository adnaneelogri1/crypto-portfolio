
//-------------------------------------------------------------------- Model ---
// Unique source de vérité de l'application
//
model = {

  config: {},
  data : {},
  ui   : {},

  // Demande au modèle de se mettre à jour en fonction des données qu'on
  // lui présente.
  // l'argument data est un objet confectionné dans les actions.
  // Les propriétés de data apportent les modifications à faire sur le modèle.
  samPresent(data) {
    switch (data.do) {
      case 'init': {
        Object.assign(this, data.config);
        const conf = this.config;
        conf.targets.list = mergeUnique([conf.targets.wished], conf.targets.list).sort();
        const isOnline = conf.dataMode == 'online';
        conf.targets.active = isOnline ? conf.targets.wished : this.data.offline.live.target;
        this.hasChanged.currencies = true;
        if (conf.debug) console.log('model.samPresent - init - targets.list  : ', conf.targets.list);
        if (conf.debug) console.log('model.samPresent - init - targets.active: ', conf.targets.active);
      } break;

      case 'updateCurrenciesData': {
        this.data.online = data.currenciesData;
        this.config.targets.active = data.currenciesData.live.target;
        this.hasChanged.currencies = true;
      } break;

      case 'changeDataMode': {
        this.config.dataMode = data.dataMode;
        if (data.dataMode == 'offline') {
          this.config.targets.active = this.data.offline.live.target;
          this.hasChanged.currencies = true;
        }
      } break;

      case 'changeTab': {
        switch (data.tab) {
          case 'currenciesCryptos':
            this.ui.currenciesCard.selectedTab = 'cryptos';
            break;
          case 'currenciesFiats':
            this.ui.currenciesCard.selectedTab = 'fiats';
            break;
          case 'walletPortfolio':
            this.ui.walletCard.selectedTab = 'portfolio';
            break;
          case 'walletAjouter':
            this.ui.walletCard.selectedTab = 'ajouter';
            break;
            default:
        }
      } break;
      case 'changeCoinQ': {
        model.config.coins[data.code]['quantityNew']=data.e.target.value;
        // console.log(model.config.coins[code]['quantityNew']);
        this.hasChanged.coins = true;
      }break;
      case 'annulerWallet': {
        console.log("oui annuler");
        state.data.coins.posValueCodes.map( (v,i) => this.config.coins[v].quantityNew = '');
        console.log("oui annuler");
        this.hasChanged.coins = true;
      }break;
      case 'ConfirmerWallet': {
        state.data.coins.posValueCodes.map( (v,i) =>{
            if(this.config.coins[v].quantityNew!=""){
              this.config.coins[v].quantity =  this.config.coins[v].quantityNew
              this.config.coins[v].quantityNew=""
            }
            }
        )
        this.hasChanged.coins = true;
      }break;
        case 'changeAjout': {
        model.config.coins[data.code]['quantityNew']=data.e.target.value;
        // console.log(model.config.coins[code]['quantityNew']);
        this.hasChanged.coins = true;
      }break;
      case 'annulerAjout': {
        state.data.coins.nullValueCodes.map( (v,i) => this.config.coins[v].quantityNew = '');
        this.hasChanged.coins = true;
      }break;
      case 'ConfirmerAjout': {
        state.data.coins.nullValueCodes.map( (v,i) =>{
            if(this.config.coins[v].quantityNew!=""){
              this.config.coins[v].quantity =  this.config.coins[v].quantityNew
              this.config.coins[v].quantityNew=""
            }
            }
        )
        this.hasChanged.coins = true;
      }break;
      case 'filtrercurrenciesFiat': {
        this.ui.currenciesCard.tabs['fiats'].filters.text = data.text;
        this.hasChanged['fiats'].filter = true;
      }break;
      case 'filtrerCryptoFiat': {
        if(data.type=="text"){
          this.ui.currenciesCard.tabs.cryptos.filters.text = data.text;
          this.hasChanged.cryptos.filter = true;
        }else{
          this.ui.currenciesCard.tabs.cryptos.filters.price = data.text;
          this.hasChanged.cryptos.filter = true;
        }

      }break;
      case 'AddOrDeletefiats': {
        if(this.config.targets.list.includes(data.code)==false)
          this.config.targets.list.push(data.code);
        else if (data.code != this.config.targets.active)
          this.config.targets.list.splice(this.config.targets.list.indexOf(data.code), 1)
        this.hasChanged.currencies = true;
      }break;
    case 'addOrdeletecryptos': {
      if(state.data.coins.nullValueCodes.includes(data.code)){
          delete this.config.coins[data.code];
      }
      else
        this.config.coins[data.code] = {quantity: 0  , quantityNew: ''};
      this.hasChanged.coins = true;
      }break;



      // TODO: ajoutez des cas répondant à vos actions...


      default:
        console.error(`model.samPresent(), unknown do: '${data.do}' `);
    }
    // Demande à l'état de l'application de prendre en compte la modification
    // du modèle
    state.samUpdate(this);
  }
};
