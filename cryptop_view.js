//--------------------------------------------------------------------- View ---
// Génération de portions en HTML et affichage
//
view = {

    // Injecte le HTML dans une balise de la page Web.
    samDisplay(sectionId, representation) {
        const section = document.getElementById(sectionId);
        section.innerHTML = representation;
    },

    // Astuce : Pour avoir la coloration syntaxique du HTML avec l'extension lit-html dans VSCode
    // https://marketplace.visualstudio.com/items?itemName=bierner.lit-html
    // utiliser this.html`<h1>Hello World</h1>` en remplacement de `<h1>Hello World</h1>`
    html([str, ...strs], ...vals) {
        return strs.reduce((acc, v, i) => acc + vals[i] + v, str);
    },

    // Renvoit le HTML de l'interface complète de l'application
    appUI(model, state) {
        const configsChooserHTML = this.configsChooserUI();
        return this.html`
            <div class="container">
                ${configsChooserHTML}
                <h1 class="text-center">Portfolio Cryptos</h1>
                <br/>
                <div class="row">
                    <div class="col-lg-6">
                        ${state.representations.currencies}
                        <br/>
                    </div>

                    <div class="col-lg-6">
                        ${state.representations.preferences}
                        <br/>
                        ${state.representations.wallet}
                        <br/>
                    </div>
                </div>
            </div>
        `;
    },

    configsChooserUI() {
        const options = Object.keys(configs).map(v => {
            const selected = configsSelected == v ? 'selected="selected"' : '';
            return this.html`
                <option ${selected}>${v}</option>
            `;
        }).join('\n');
        return this.html`
            <div class="row">
                <div class="col-md-7"></div>
                <div class="col-md-5">
                    <br/>
                    <div class="d-flex justify-content-end">
                        <div class="input-group">
                            <div class="input-group-prepend ">
                                <label class="input-group-text">Config initiale :</label>
                            </div>
                            <select class="custom-select" onchange="actions.reinit({e:event})">
                                ${options}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <br/>
        `;
    },

    currenciesUI(model, state) {
        const tabName = model.ui.currenciesCard.selectedTab;
        switch (tabName) {
            case 'cryptos':
                return this.currenciesCryptosUI(model, state);
                break;
            case 'fiats':
                return this.currenciesFiatsUI(model, state);
                break;
            default:
                console.error('view.currenciesUI() : unknown tab name: ', tabName);
                return '<p>Error in view.currenciesUI()</p>';
        }
    },

    currenciesCryptosUI(model, state) {
        const paginationHTML = this.paginationUI(model, state, 'cryptos');
        let items = '';
        let taille1 = state.data.cryptos.filteredNum;
        let taille = state.data.cryptos.listNum ;
        let posValueCodes = state.data.coins.posValueCodes;
        let nullValueCodes = state.data.coins.nullValueCodes;
        return this.html`
            <div class="card border-secondary" id="currencies">
                <div class="card-header">
                    <ul class="nav nav-pills card-header-tabs">
                        <li class="nav-item">
                            <a class="nav-link active" href="#currencies">
                                Cryptos <span class="badge badge-light">${taille1} / ${taille}</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-secondary" href="#currencies"
                               onclick="actions.changeTab({tab:'currenciesFiats'})">
                                Monnaies cibles
                                <span class="badge badge-secondary">10 / 167</span></a>
                        </li>
                    </ul>
                </div>
                <div class="card-body">
                    <div class="input-group">
                        <div class="input-group-append">
                            <span class="input-group-text">Filtres : </span>
                        </div>
                        <input value="${model.ui.currenciesCard.tabs.cryptos.filters.text}" id="filterText" type="text" class="form-control"
                               placeholder="code ou nom..." onchange="actions.filtrerCryptoFiat({e:event,genre:'text'})"/>
                        <div class="input-group-append">
                            <span class="input-group-text">Prix &gt; </span>
                        </div>
                        <input id="filterSup" type="number" class="form-control" value="${model.ui.currenciesCard.tabs.cryptos.filters.price}" min="0"  onchange="actions.filtrerCryptoFiat({e:event,genre:'price'})"/>
                    </div>
                    <br/>
                    <div class="table-responsive">
                        <table class="col-12 table table-sm table-bordered">
                            <thead>
                            <th class="align-middle text-center col-2">
                                <a href="#currencies">Code</a>
                            </th>
                            <th class="align-middle text-center col-5">
                                <a href="#currencies">Nom</a>
                            </th>
                            <th class="align-middle text-center col-2">
                                <a href="#currencies">Prix</a>
                            </th>
                            <th class="align-middle text-center col-3">
                                <a href="#currencies">Variation</a>
                            </th>
                            </thead>
                            ${ state.data.cryptos.filtered.map( (v, i) =>
                                    `<tr class="${ nullValueCodes.includes(v.code) ? 'bg-warning' :posValueCodes.includes(v.code) ?  'bg-success text-light' : ''}"  
                                  onclick="actions.addOrdeletecryptos({ code : '${v.code}'})">
                                  <td class="text-center">
                                    <span class="badge badge-pill badge-light">
                                      <img src="${v.icon_url}" /> ${v.code}
                                    </span></td>
                                  <td><b>${v.name}</b></td>
                                  <td class="text-right"><b>${v.price.toFixed(2)}</b></td>
                                  <td class="text-right">${v.change.toFixed(3)+ ' '} ${v.change > 0 ? '↗' :'↘' }</td>
                                </tr>
                                `).join('\n')
                            }
                            

                        </table>
                    </div>

                    ${paginationHTML}
                </div>
                <div class="card-footer text-muted"> Cryptos préférées :
                    
                    <span class="badge badge-warning">BCH</span>
                    <span class="badge badge-success">BTC</span>
                    <span class="badge badge-warning">BTLC</span>
                    <span class="badge badge-warning">DSH</span>
                    <span class="badge badge-success">ETH</span>
                    <span class="badge badge-success">LTC</span>
                    <span class="badge badge-warning">XMR</span>
                </div>
            </div>
        `;
    },
    paginationUI(model, state, currency) {
        return this.html`
<section id="pagination">
  <div class="row justify-content-center">
    <nav class="col-auto">
      <ul class="pagination">
        <li class="page-item disabled">
          <a class="page-link" href="#currencies">&lt;</a>
        </li>
        <li class="page-item active">
          <a class="page-link" href="#currencies">1</a>
        </li>
        <li class="page-item ">
          <a class="page-link" href="#currencies">2</a>
        </li>
        <li class="page-item ">
          <a class="page-link" href="#currencies">&gt;</a>
        </li>
      </ul>
    </nav>
    <div class="col-auto">
      <div class="input-group mb-3">
        <select class="custom-select" id="selectTo">
          <option value="0">5</option>
          <option selected="selected" value="1">10</option>
          <option value="2">15</option>
        </select>
        <div class="input-group-append">
          <span class="input-group-text">par page</span>
        </div>
      </div>
    </div>
  </div>
</section>    `;
    },
    currenciesFiatsUI(model,state) {
        const paginationHTML = this.paginationUI(model, state, 'fiats');
        const filters = model.ui.currenciesCard.tabs.fiats.filters;
        const cryptosNum = state.data.cryptos.filteredNum;
        const filtereNum = state.data.fiats.filteredNum;
        const targets = model.config.targets

        return `
    <div class="card border-secondary"
      id="currencies">
      <div class="card-header">
        <ul class="nav nav-pills card-header-tabs">
          <li class="nav-item">
            <a class="nav-link text-secondary" href="#currencies"
              onclick="actions.changeTab({tab:'currenciesCryptos'})"> Cryptos <span
                class="badge badge-secondary">${cryptosNum} / 386</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="#currencies">Monnaies cibles <span
                class="badge badge-light">${filtereNum} / 167</span></a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <div class="input-group">
          <div class="input-group-append">
            <span class="input-group-text">Filtres : </span>
          </div>
          <input value="${filters.text}" id="filterText" type="text" class="form-control"
            placeholder="code ou nom..." onchange="actions.filtrercurrenciesFiat({e:event})"/>
        </div> <br />
        <div>
        <table class="col-12 table table-sm table-bordered">
          <thead>
            <th class="align-middle text-center col-2">
              <a href="#currencies" onclick="">Code</a>
            </th>
            <th class="align-middle text-center col-5">
              <a href="#currencies" onclick="">Nom</a>
            </th>
            <th class="align-middle text-center col-2">
              <a href="#currencies" onclick="">Symbole</a>
            </th>
          </thead>
          ${ state.data.fiats.filtered.map( (v, i) =>
            `<tr class="${ v.code == targets.active ? 'bg-success' :targets.list.indexOf(v.code) >=0 ?  'bg-warning' : ''}" onclick="actions.AddOrDeletefiats({code : '${v.code}'})">
            <td class="text-center"><b>${v.code}</b></td>
            <td><b>${v.name}</b></td>
            <td class="text-right"><b>${v.symbol}</b></td>
          </tr>`).join("\n")
        }

        </table>
        </div><br />
        ${paginationHTML}
      </div>
      <div class="card-footer text-muted"> Monnaies préférées :
      ${targets.list.map( (v,i) =>
            `<span class="badge badge-${ v == targets.active ? 'success' : 'warning'}">${v}</span>`
        ).join('\n')}
      </div>
    </div>
    `;
    },
    preferencesUI(model, state) {

        const authors = model.config.authors;
        const debug = model.config.debug;
        const activeTarget = model.config.targets.active;
        const updateDisabled = model.config.dataMode == 'offline' ? 'disabled="disabled"' : '';
        const target = model.config.targets.active;
        const targetsList = mergeUnique(model.config.targets.list, [target]).sort();
        const fiatsList = state.data.fiats.list;

        const fiatOptionsHTML = targetsList.map((v) => {
            const code = fiatsList[v].code;
            const name = fiatsList[v].name;
            const isOffline = model.config.dataMode == 'offline';
            const selected = code == target ? 'selected="selected"' : '';
            const disabled = isOffline && code != target ? 'disabled="disabled"' : '';
            return this.html`
                <option value="${code}" ${selected} ${disabled}>${code} - ${name}</option>
            `;
        }).join('\n');

        const dataModeOptionsHTML = [['online', 'En ligne'], ['offline', 'Hors ligne']].map(v => {
            const selected = v[0] == model.config.dataMode ? 'selected="selected"' : '';
            return this.html`
                <option value="${v[0]}" ${selected}>${v[1]}</option>`;
        }).join('\n');

        return this.html`
            <div class="card border-secondary">
                <div class="card-header d-flex justify-content-between">
                    <h5 class=""> Préférences </h5>
                    <h5 class="text-secondary"><abbr title="${authors}">Crédits</abbr></h5>
                </div>
                <div class="card-body">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <label class="input-group-text" for="inputGroupSelect01">Monnaie
                                cible</label>
                        </div>
                        <select class="custom-select" id="inputGroupSelect01"
                                onchange="actions.changeTarget({e:event, debug:'${debug}'})">
                            ${fiatOptionsHTML}
                        </select>
                    </div>
                    <p></p>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <label class="input-group-text">Données</label>
                        </div>
                        <select class="custom-select"
                                onchange="actions.changeDataMode({e:event, target:'${activeTarget}', debug:'${debug}'})">
                            ${dataModeOptionsHTML}
                        </select>
                        <div class="input-group-append">
                            <button class="btn btn-primary" ${updateDisabled}
                                    onclick="actions.updateOnlineCurrenciesData({target: '${activeTarget}', debug:'${debug}'})">
                                Actualiser
                            </button>
                        </div>
                    </div>
                </div>
            </div>    `;
    },

    walletUI(model, state) {
        const tabName = model.ui.walletCard.selectedTab;
        switch (tabName) {
            case 'portfolio':
                return this.walletPortfolioUI(model, state);
                break;
            case 'ajouter':
                return this.walletAjouterUI(model, state);
                break;
            default:
                console.error('view.currenciesUI() : unknown tab name: ', tabName);
                return '<p>Error in view.currenciesUI()</p>';
        }
    },

    walletPortfolioUI(model, state) {
        console.log("holaaa", model.config.coins);
        let items = '', totalcoins = 0;
        let port = state.data.coins.posValueCodes;
        let allcrypto = state.data.cryptos.list;
        let confirmQunti=0;
        let erreur=0;
        for (let i = 0; i < port.length; i++) {
            let nomc = allcrypto[port[i]];
            let key = port[i];
            let quntite = model.config.coins[key]['quantity'];
            let price = nomc.price.toFixed(2);
            let totalcoin = quntite * price;
            textDesign="";
            CHECKinter="";
            if(model.config.coins[key]['quantityNew']){
                quntite=model.config.coins[key]['quantityNew'];
                CHECKinter=parseInt(model.config.coins[key]['quantityNew'])!=model.config.coins[key]['quantityNew'] || model.config.coins[key]['quantityNew']<0;
                if (CHECKinter){
                    textDesign="text-danger";
                    erreur++;
                }else{
                    totalcoin=quntite * price;
                    textDesign="text-primary";
                    confirmQunti++;
                }
            }
            totalcoins += totalcoin;
            items += `<tr>
                        <td class="text-center"> 
                            <span class="badge badge-pill badge-light">
                                <img src="${nomc.icon_url}"/>${key}
                            </span> 
                        </td>
                        <td><b>${nomc.name}</b></td>
                        <td class="text-right">
                            ${nomc.price.toFixed(2)}
                        </td> 
                        <td class="text-right">
                                    <input type="text" class="form-control ${ textDesign  }" value="${quntite}"   onchange="actions.changeCoinQ({e:event, code:'${key.toString()}'})" />
                        </td>
                        <td class="text-right ${ textDesign  }"><span class=""><b>${ (CHECKinter )? "???" : totalcoin.toFixed(2) }</b></span></td>
                   </tr>`;

        }
        items += `
            </table></div>
         
            <div class="input-group d-flex justify-content-end">
                <div class="input-group-prepend ">
                    <button class="btn  ${ (confirmQunti ==0 || erreur!=0 )? "disabled" :" btn-primary" } " onclick="actions.ConfirmerWallet()" >Confirmer</button>
                </div>
                <div class="input-group-append">
                    <button class="btn ${ (confirmQunti ==0 )? "disabled" :" btn-secondary" } " onclick="actions.annulerWallet()">Annuler</button>
                </div>
            </div>
            
            </div>
            <div class="card-footer">
                <h3><span class="badge  ${ (confirmQunti ==0 )? "badge-success" :" badge-primary" }    ">Total :${totalcoins.toFixed(2)}  EUR</span></h3>
            </div>`;
        return this.html`
            <div class="card border-secondary text-center" id="wallet">
                <div class="card-header">
                    <ul class="nav nav-pills card-header-tabs">
                        <li class="nav-item">
                            <a class="nav-link active" href="#wallet">Portfolio <span class="badge badge-light">${state.data.coins.posValueCodes.length}</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-secondary" href="#wallet"
                               onclick="actions.changeTab({tab:'walletAjouter'})">
                                Ajouter <span class="badge badge-secondary">${state.data.coins.nullValueCodes.length}</span></a>
                        </li>
                    </ul>
                </div>
                <div class="card-body text-center">
                    <br/>
                    <div class="table-responsive">
                        <table class="col-12 table table-sm table-bordered">
                            <thead>
                            <th class="align-middle text-center col-1"> Code</th>
                            <th class="align-middle text-center col-4"> Nom</th>
                            <th class="align-middle text-center col-2"> Prix</th>
                            <th class="align-middle text-center col-3"> Qté</th>
                            <th class="align-middle text-center col-2"> Total</th>
                            </thead>
                            ${items}
                    </div>
        `;
    },
    walletAjouterUI(model, state) {
        let items = '', totalcoins = 0;
        let port = state.data.coins.nullValueCodes;
        let allcrypto = state.data.cryptos.list;
        let confirmQunti=0;
        for (let i = 0; i < port.length; i++) {
            let nomc = allcrypto[port[i]];
            let key = port[i];
            let quntite = model.config.coins[key]['quantity'];
            let price = nomc.price.toFixed(2);
            let totalcoin = quntite * price;
            textDesign="";
            CHECKinter="";
            erreur="";
            if(model.config.coins[key]['quantityNew']){
                quntite=model.config.coins[key]['quantityNew'];
                CHECKinter=parseInt(model.config.coins[key]['quantityNew'])!=model.config.coins[key]['quantityNew'] || model.config.coins[key]['quantityNew']<0;
                if (CHECKinter){
                    textDesign="text-danger";
                    erreur++;
                }else{
                    totalcoin=quntite * price;
                    textDesign="text-primary";
                    confirmQunti++;
                }
            }
            totalcoins += totalcoin;
            items += `<tr>
                        <td class="text-center"> 
                            <span class="badge badge-pill badge-light">
                                <img src="${nomc.icon_url}"/>${key}
                            </span> 
                        </td>
                        <td><b>${nomc.name}</b></td>
                        <td class="text-right">
                            ${nomc.price.toFixed(2)}
                        </td> 
                        <td class="text-right">
                                    <input type="text" class="form-control ${ textDesign  }" value="${quntite}"   onchange="actions.changeCoinQ({e:event, code:'${key.toString()}'})" />
                        </td>
                        <td class="text-right ${ textDesign  }"><span class=""><b>${ (CHECKinter )? "???" : totalcoin.toFixed(2) }</b></span></td>
                   </tr>`;

        }
        items += `
            </table></div>
         
            <div class="input-group d-flex justify-content-end">
                <div class="input-group-prepend ">
                    <button class="btn  ${ (confirmQunti ==0 || erreur!=0 )? "disabled" :" btn-primary" } " onclick="actions.ConfirmerAjout()" >Confirmer</button>
                </div>
                <div class="input-group-append">
                    <button class="btn ${ (confirmQunti ==0 )? "disabled" :" btn-secondary" } " onclick="actions.annulerAjout()">Annuler</button>
                </div>
            </div>
            
            </div>
            <div class="card-footer">
                <h3><span class="badge  ${ (confirmQunti ==0 )? "badge-success" :" badge-primary" }    ">Total :${totalcoins.toFixed(2)}  EUR</span></h3>
            </div>`;

        return this.html`
            <div class="card border-secondary text-center" id="wallet">
                <div class="card-header">
                    <ul class="nav nav-pills card-header-tabs">
                        <li class="nav-item">
                            <a class="nav-link text-secondary" href="#wallet"
                               onclick="actions.changeTab({tab:'walletPortfolio'})">
                                Portfolio <span
                                    class="badge badge-secondary">${state.data.coins.posValueCodes.length}</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="#wallet">Ajouter <span
                                    class="badge badge-light">${state.data.coins.nullValueCodes.length}</span></a>
                        </li>
                    </ul>
                </div>
                <div class="card-body">
                    <br/>
                    <div class="table-responsive">
                        <table class="col-12 table table-sm table-bordered">
                            <thead>
                            <th class="align-middle text-center col-1"> Code</th>
                            <th class="align-middle text-center col-4"> Nom</th>
                            <th class="align-middle text-center col-2"> Prix</th>
                            <th class="align-middle text-center col-3"> Qté</th>
                            <th class="align-middle text-center col-2"> Total</th>
                            </thead>
                            ${items}

                    </div>
        `;
    },


};
