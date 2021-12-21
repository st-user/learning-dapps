import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Web3 from "web3";

import './index.css';

const getWeb3 = async () => {

  if (!window.ethereum) {
    alert('Please use a modern dapp browser.');
    return;
  }

  await window.ethereum.send('eth_requestAccounts');

  return new Web3(window.ethereum);

};

const App = () => {

  const [ gas, setGas ] = useState("21000");
  const [ maxFeePerGas, setMaxFeePerGas ] = useState("200");
  const [ maxPriorityFeePerGas, setMaxPriorityFeePerGas ] = useState("10");  
  const [ eth, setEth ] = useState("");
  const [ toAddress, setToAddress ] = useState("");
  const [ web3Info, setWeb3Info ] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {

    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();

    setWeb3Info({
      web3, accounts
    });

  };

  const sendEth = async () => {

    console.log(`${gas}/${maxFeePerGas}/${maxPriorityFeePerGas}/${eth}/${toAddress}`);

    const { web3, accounts } = web3Info;

    const ethToSendInWei = web3.utils.toWei(eth, 'ether');
    const maxFeePerGasInWei = web3.utils.toWei(maxFeePerGas, "gwei");
    const maxPriorityFeePerGasInWei = web3.utils.toWei(maxPriorityFeePerGas, "gwei");

    console.log(`${ethToSendInWei}/${maxFeePerGasInWei}/${maxPriorityFeePerGasInWei}`);

    const receipt = await web3.eth.sendTransaction({
      from: accounts[0], 
      to: toAddress,
      value: ethToSendInWei,
      type: "0x2",
      gas, 
      maxFeePerGas: maxFeePerGasInWei, 
      maxPriorityFeePerGas: maxPriorityFeePerGasInWei
    });

    console.log(receipt);

  };

  return (
    <div>
      <h1>Simple EIP-1559 Test</h1>

      <p>Gas:</p>
      <input 
          type="text"
          placeholder="0"
          onChange={e => setGas(e.target.value)}
          value={gas} />

      <p>MaxFeePerGas(gwei):</p>
      <input
        type="text"
        placeholder="0"
        onChange={e => setMaxFeePerGas(e.target.value)}
        value={maxFeePerGas} />

      <p>MaxPriorityFreePerGas(gwei):</p>
      <input type="text"
        placeholder="0"
        onChange={e => setMaxPriorityFeePerGas(e.target.value)}
        value={maxPriorityFeePerGas}/>

      <p>Eth to send:</p>
      <input
        type="text"
        placeholder="0"
        onChange={e => setEth(e.target.value)}
        value={eth}/>


      <p>To Address:</p>
      <input
        type="text"
        onChange={e => setToAddress(e.target.value)}
        value={toAddress}/>

      <p>
      <button
        type="button"
        disabled={!web3Info}
        onClick={sendEth}>Send</button>
      </p>
    </div>
  );
};


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

