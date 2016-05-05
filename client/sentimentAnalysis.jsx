var React = require('react');
var socket = io.connect();
var mocks = require('../mocks/mockTweets');
var d3 = require('d3');
import {BarChart} from 'react-d3-components';
var sentiment = require('sentiment');

//var BarChart = ReactD3.BarChart;

var TweetSentiment = React.createClass({

    getInitialState() {
        var tweets = {
            counts: {
                sanders: {
                    positive: 0,
                    negative: 0,
                    neutral: 0
                },
                hilldog : {
                    positive: 0,
                        negative: 0,
                        neutral: 0
                },
                trump: {
                    positive: 0,
                    negative: 0,
                    neutral: 0
                },
                cruz: {
                    positive: 0,
                    negative: 0,
                    neutral: 0
                }
            }
        };
        return {tweets};
    },

    componentDidMount() {
        socket.on('tweet', this._tweetRecieved);
        setInterval(this._updateBarChart, 1000);
    },

    _updateBarChart() {
        var {tweets} = this.state;
        for (var grp in this.barDataGroups) {
            for (var key in this.barDataIndex) {
                var grpIdx = this.barDataGroups[grp];
                var dataIdx = this.barDataIndex[key];
                this.barData[grpIdx].values[dataIdx].y = tweets.counts[key][grp];
            }
        }
        this.setState({tweets});
    },

    _mockTweetRecieved(tweet) {
        tweet = mocks.tweets[Math.floor(Math.random()*mocks.tweets.length)];
        var {tweets} = this.state;
        this._updateTweetListForCandidate(tweet,Object.keys(tweets)[Math.floor(Math.random()*4)]);
    },

    _tweetRecieved(data) {
        this.totalTweets++;
        this._updateTweetListForCandidate(data.tweet, data.candidate);
    },

    _updateTweetListForCandidate(tweet, candidate) {
        var {tweets} = this.state;

        var sent = sentiment(tweet.text).score;
        if (sent > 0) {
            tweets.counts[candidate].positive++;
        } else if (sent == 0) {
            tweets.counts[candidate].neutral++;
        } else {
            tweets.counts[candidate].negative++;
        }
        this.setState({tweets});
    },

    totalTweets: 0,

    barDataIndex: {
        trump: 0,
        cruz: 1,
        hilldog: 2,
        sanders: 3
    },

    barDataGroups: {
        neutral: 0,
        negative: 1,
        positive: 2
    },

    barData : [
        {
            label: 'Neutral',
            values: [{x: 'Trump', y: 0}, {x: 'Cruz', y: 0}, {x: 'Clinton', y: 0}, {x: 'Sanders', y: 0}]
        },
        {
            label: 'Negative',
            values: [{x: 'Trump', y: 0}, {x: 'Cruz', y: 0}, {x: 'Clinton', y: 0}, {x: 'Sanders', y: 0}]
        },
        {
            label: 'Positive',
            values: [{x: 'Trump', y: 0}, {x: 'Cruz', y: 0}, {x: 'Clinton', y: 0}, {x: 'Sanders', y: 0}]
        }
    ],

    tooltip : function(x, y0, y, total) {
        return y.toString();
    },

    colors : function(series, idx){
        switch(series){
            case 'Neutral':
                return '#ffff00';
            case 'Negative':
                return '#ff1a1a';
            case 'Positive':
                return '#009933';
            default:
                return '#FFFFFF';
        }
    },
    render() {
        return (
            <div>
                <div id="tweetRecieveCounter">Total tweets recieved: {this.totalTweets}</div>
                <div id="legend">
                    <ul>
                        <li style={{color: "#ffff00;"}}><span style={{color: "black;"}}>Neutral</span></li>
                        <li style={{color: "#ff1a1a;"}}><span style={{color: "black;"}}>Negative</span></li>
                        <li style={{color: "#009933;"}}><span style={{color: "black;"}}>Positive</span></li>
                    </ul>
                </div>
                <div id="sentimentBarChart">
                    <BarChart
                        legend={true}
                        data={this.barData}
                        width={800}
                        height={600}
                        margin={{top: 10, bottom: 50, left: 50, right: 10}}
                        tooltipHtml={this.tooltip}
                        tooltipMode={'element'}
                        colorScale={this.colors}
                    />
                </div>
            </div>
        );
    }
});


React.render(<TweetSentiment/>, document.getElementById('sentimentChart'));