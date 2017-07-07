import React from 'react';
import axios from 'axios';
import '../styles/index.scss';

export default class App extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            rates: []
        }
    }

    componentDidMount () {
        this.startPolling();
    }

    componentWillUnmount () {
        if (this.pollingTimer) {
            clearInterval(this.pollingTimer);
            this.pollingTimer = null;
        }
    }

    /**
     * Starting polling.
     * 
     * @returns {void}
     */
    startPolling () {
        this.fetchData();

        this.pollingTimer = setInterval(this.fetchData, 10 * 1000);
    }

    /**
     * Fetching data.
     * 
     * @returns {void}
     */
    fetchData () {
        axios
            .get(`https://openexchangerates.org/api/latest.json?app_id=7f2f509f57d84af8b386c403f163d9d4&&symbols=GBP,EUR,RUB`)
            .then(res => {
                const responseRates = res.data.rates;
                let rates = [];

                Object.keys(responseRates).map((rate) => {
                    let rateItem = {};
                    rateItem.currency = rate;
                    rateItem.rate = responseRates[rate];
                    rates.push(rateItem);
                });

                this.setState({ rates });
            })
            .catch((error) => console.log(error));
    }

    /**
     * Render rates list.
     * 
     * @returns {JSX.Element} rates list
     */
    renderRatesList () {
        const { rates } = this.state;
        let result = null;

        if (rates.length > 1) {
            result = (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Currency</th>
                            <th>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rates.map((rateItem, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{rateItem.currency}</td>
                                        <td>{rateItem.rate}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            );
        }

        return result;
    }
    
    render () {
        return (
            <div className="row">
                <div className="col-xs-8 col-xs-offset-2">
                    <div className="page-header">
                        <h1>Currency rates widget <small>base currency - USD</small></h1>
                    </div>

                    {this.renderRatesList()}
                </div>
            </div>
        );
    }
}
