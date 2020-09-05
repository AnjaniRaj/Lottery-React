import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from "./lottery";

class App extends Component {

    state = {
        manager: '',
        players: [],
        balance: '',
        value: '',
        message: ''
    };

    async componentDidMount() {
        //no need to give call from address, takes in default metamask addr
        const manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);

        this.setState({manager, players, balance});
    }

    onSubmit = async (event) => {
        event.preventDefault();
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        console.log(accounts[0]);
        this.setState({message: 'waiting on transaction to succeed ...'});
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.value, 'ether')
        });

        this.setState({message: 'transaction success ...'});
    };

    onClick = async () => {
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        this.setState({message: 'waiting on transaction to succeed ...'});
        await lottery.methods.pickWinner().send({
            from:accounts[0]
        });
        this.setState({message: 'Winner has been picked!'});

    };

    render() {
        return (

            <div>
                <h2>Lottery Contract</h2>
                <p> This contract is managed by {this.state.manager}</p>
                <p>
                    {this.state.players.length} are playing. The jackpot amount
                    is {web3.utils.fromWei(this.state.balance, 'ether')} ether
                </p>
                <hr/>
                <form onSubmit={this.onSubmit}>
                    <h4>Enter lottery</h4>
                    <div>
                        <label>Amount of ether to enter</label>
                        <input
                            value={this.state.value}
                            onChange={event => this.setState({value: event.target.value})}
                        />
                    </div>
                    <button>Enter</button>
                </form>
                <hr/>
                <button onClick={this.onClick}>Pick a winner!</button>

                <hr/>
                <h1>{this.state.message}</h1>
            </div>
        )
            ;
    }
}

export default App;
