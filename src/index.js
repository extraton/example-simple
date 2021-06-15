// import freeton from "../freeton_dev/src/index";
import freeton from "freeton";

const Kington = require('../contracts/Kington.json');
const KingtonOrder = require('../contracts/KingtonOrder.json');
const SetcodeMultisigWallet = require('../contracts/SetcodeMultisigWallet.json');

const _ = {
  checkExtensionAvailability() {
    if (window.freeton === undefined) {
      throw 'Extension not available.';
    }
  },
  getProvider() {
    return new freeton.providers.ExtensionProvider(window.freeton);
  }
};

window.app = {
  async requestVersion() {
    const button = document.getElementById('buttonRequestVersion');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const version = await provider.getVersion();
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(version)
      console.log(version);
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.error(e);
    } finally {
      button.disabled = false;
    }
  },
  async requestNetwork() {
    const button = document.getElementById('buttonRequestNetwork');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const network = await provider.getNetwork();
      console.log(network);
    } finally {
      button.disabled = false;
    }
  },
  async hasSigner() {
    const button = document.getElementById('buttonHasSigner');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const hasSigner = await provider.hasSigner();
      console.log({hasSigner});
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(hasSigner)
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.error(e);
    } finally {
      button.disabled = false;
    }
  },
  async sign(form) {
    const button = document.getElementById('buttonSign');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const result = await signer.sign(form.unsigned.value);
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(result);
      console.log(result);
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.error(e);
    } finally {
      button.disabled = false;
    }
  },
  async runContractMethod() {
    const button = document.getElementById('buttonRunContractMethod');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const contract = new freeton.Contract(provider, Kington.abi, Kington.networks['2'].address);
      const messages = await contract.methods.getMessages.run();
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(messages);
      console.log(messages);
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.error(e);
    } finally {
      button.disabled = false;
    }
  },
  async deploy() {
    const button = document.getElementById('buttonDeploy');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const contractBuilder = new freeton.ContractBuilder(signer, KingtonOrder.abi, KingtonOrder.imageBase64);
      contractBuilder.setInitialAmount('1000022000');
      const constructorParams = {
        destinationAddress: Kington.networks['2'].address,
        message: freeton.utils.stringToHex('London is the capital of Great Britain.'),
      };
      const contract = await contractBuilder.deploy(constructorParams);
      await contract.getDeployProcessing().wait();
      console.log(`Deployed. TxId: ${contract.getDeployProcessing().txid}`)
    } finally {
      button.disabled = false;
    }
  },
  async transfer(form) {//Transfer tokens with message "Hello".
    const button = document.getElementById('buttonTransfer');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const wallet = signer.getWallet();
      const payload = 'te6ccgEBAgEADgABCAAAAAABAApIZWxsbw==';
      const contractMessageProcessing = await wallet.transfer(form.address.value, form.amount.value, false, payload);
      await contractMessageProcessing.wait();
      console.log(`Transferred. TxId: ${contractMessageProcessing.txid}`)
    } finally {
      button.disabled = false;
    }
  },
  async confirmTransaction(form) {
    const button = document.getElementById('buttonConfirmTransaction');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const wallet = new freeton.Wallet(signer, form.address.value);
      const contractMessageProcessing = await wallet.confirmTransaction(form.txid.value);
      await contractMessageProcessing.wait();
      console.log(`Confirmed. TxId: ${contractMessageProcessing.txid}`)
    } finally {
      button.disabled = false;
    }
  },
  async callContractMethod() {
    const button = document.getElementById('buttonCallContractMethod');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const contract = new freeton.Contract(signer, SetcodeMultisigWallet.abi, '0:bc6ed51718ca3fe6ba96d84e8a0f2f409423b6e3f3198d08634cd7f74372ed48');
      const input = {
        dest: '0:11684118bc3062a07126191bf17a650dbb101aff809eb79a9c64b061f4b9b97b',
        value: '500000000',
        bounce: false,
        allBalance: false,
        payload: '',
      };
      const contractMessageProcessing = await contract.methods.submitTransaction.call(input);
      await contractMessageProcessing.wait();
      console.log(`Called. TxId: ${contractMessageProcessing.txid}`)
      document.getElementById('result').innerHTML += '</br>' + `Called. TxId: ${contractMessageProcessing.txid}`
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.error(e);
    } finally {
      button.disabled = false;
    }
  },
  async getTokenList() {
    const button = document.getElementById('buttonGetTokenList');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const wallet = signer.getWallet();
      const tokenList = await wallet.getTokenList();
      console.log(tokenList);
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.error(e);
    } finally {
      button.disabled = false;
    }
  },
  async transferToken(form) {
    const button = document.getElementById('buttonTransferToken');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const wallet = signer.getWallet();
      const tokenList = await wallet.getTokenList();
      let token = null;
      for (const item of tokenList) {
        if (item.rootAddress === form.rootAddress.value) {
          token = item;
        }
      }
      if (null === token) {
        throw 'Token with this rootAddress not found in extension.';
      }
      const contractMessageProcessing = await token.transfer(form.address.value, form.amount.value);
      await contractMessageProcessing.wait();
      console.log(`Transferred. TxId: ${contractMessageProcessing.txid}`)
      document.getElementById('result').innerHTML += '</br>' + `Transferred. TxId: ${contractMessageProcessing.txid}`
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.error(e);
    } finally {
      button.disabled = false;
    }
  },
  async addToken(form) {
    const button = document.getElementById('buttonAddToken');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const wallet = signer.getWallet();
      const token = await wallet.addToken(form.rootAddress.value);
      console.log(token);
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.error(e);
    } finally {
      button.disabled = false;
    }
  },
  async activateToken(form) {
    const button = document.getElementById('buttonActivateToken');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const wallet = signer.getWallet();
      const tokenList = await wallet.getTokenList();
      let token = null;
      for (const item of tokenList) {
        if (item.rootAddress === form.rootAddress.value) {
          token = item;
        }
      }
      if (null === token) {
        throw 'Token with this rootAddress not found in extension.';
      }
      await token.activate();
      document.getElementById('result').innerHTML += '</br>Activated. Token wallet address:' + token.walletAddress;
      console.log(token);
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.error(e);
    } finally {
      button.disabled = false;
    }
  },
  async subscribeToExtensionEvents() {
    const button = document.getElementById('buttonSubscribeToExtensionEvents');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      await provider.addEventListener(function (data) {
        document.getElementById('result').innerHTML += '</br>' + JSON.stringify(data);
      });
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.error(e);
      button.disabled = false;
    }
  }
};
