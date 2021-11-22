import './App.css';
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

const greeterAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

function App() {
  const [greeting, setGreetingValue] = useState();
  const [newGreeting, setNewGreetingValue] = useState();
  const [success, setSuccessValue] = useState(false);

  useEffect(() => {
    getGreeting();
  }, [])

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  async function getGreeting() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)

      try {
        const data = await contract.greet();
        setGreetingValue(data)
      }
      catch (e) {
        console.log(e)
      }
    }
  }

  async function setGreeting() {
    if (newGreeting && window.ethereum) {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(newGreeting);

      setNewGreetingValue("")
      await transaction.wait();
      setSuccessValue(true)

      getGreeting();
    }
  }

  function handleChange(e) {
    e.preventDefault();
    if (success) setSuccessValue(false);
    setNewGreetingValue(e.target.value)
  }

  return (
    <div className="App">
      <div className="container">
        <p className="greeting">{greeting}</p>
        <input onChange={(e) => handleChange(e)} placeholder="Set greeting" />
        <button onClick={setGreeting}>Set Greeting</button>
        {newGreeting &&
          <div>
            <p>You are interacting with a smart contract</p>
            <p>{newGreeting}</p>
          </div>
        }
        {success &&
          <p>Well done !</p>
        }
      </div>

    </div>
  );
}

export default App;
