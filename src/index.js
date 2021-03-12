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
      console.log(e);
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
  async getMessages() {
    const button = document.getElementById('buttonGetMessages');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const contract = new freeton.Contract(provider, Kington.abi, Kington.networks['2'].address);
      const messages = await contract.functions.getMessages.runGet();
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(messages);
      console.log(messages);
    } catch (e) {
      document.getElementById('result').innerHTML += '</br>' + JSON.stringify(e);
      console.log(e);
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
  async transfer() {//Transfer tokens to surf with message "Hello".
    const button = document.getElementById('buttonTransfer');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const wallet = signer.getWallet();
      const address = '0:b1c6ca063c050c4923580d3461c46c978651c4f100955e8ba32d40b278907206';
      const amount = '100000000';
      const payload = 'te6ccgEBAgEADgABCAAAAAABAApIZWxsbw==';
      const contractMessageProcessing = await wallet.transfer(address, amount, false, payload);
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
      console.log({publicKey: signer.getPublicKey()});
      const wallet = new freeton.Wallet(signer, form.address.value);
      const contractMessageProcessing = await wallet.confirmTransaction(form.txid.value);
      await contractMessageProcessing.wait();
      console.log(`Confirmed. TxId: ${contractMessageProcessing.txid}`)
    } finally {
      button.disabled = false;
    }
  },
  async run() {
    const button = document.getElementById('buttonRun');
    button.disabled = true;
    try {
      _.checkExtensionAvailability();
      const provider = _.getProvider();
      const signer = await provider.getSigner();
      const contract = new freeton.Contract(signer, SetcodeMultisigWallet.abi, '0:138a41d0fafae5d6e9f7a19241702074e1f76858ebbe7bbc693bb8de813ca982');
      const input = {
        dest: '0:11684118bc3062a07126191bf17a650dbb101aff809eb79a9c64b061f4b9b97b',
        value: '500000000',
        bounce: false,
        allBalance: false,
        payload: '',
      };
      const result = await contract.functions.submitTransaction.run(input);
      console.log(result);
    } finally {
      button.disabled = false;
    }
  }
};
