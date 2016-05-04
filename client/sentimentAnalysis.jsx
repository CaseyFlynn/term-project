var React = require('react');
var socket = io.connect();
var mocks = require('../mocks/mockTweets');
var d3 = require('d3');
import {LineChart} from 'react-d3';

var Tweet = React.createClass({
    render() {
        var tweet = this.props.tweet;
        return (
            <div className='tweet'>
                <img src={tweet.avatar} className="avatar"/>
                <blockquote>
                    <cite>
                        <a href={"http://www.twitter.com/" + tweet.screenname}>{tweet.author}</a>
                        <span className="screen-name">@{tweet.screenname}</span>
                    </cite>
                    <span className="content">{tweet.text}</span>
                </blockquote>
            </div>
        );
    }
});

var TweetList = React.createClass({
    render() {
        return (
            <div className='tweetList'>
                <div className={this.props.candidateName}>
                    <h2>{this.props.candidateName}</h2>
                    <h3>Count: {this.props.tweetCount}</h3>
                </div>
                <div className='tweets'>
                    {
                        this.props.tweets.map((tweetData, i) => {
                            return (
                                <Tweet
                                    key = {i}
                                    tweet = {tweetData}
                                />
                            );
                        })
                    }
                </div>
            </div>
        );
    }
});



var TweetApp = React.createClass({

    getInitialState() {
        var tweets = { sanders: [],
            hilldog: [],
            trump: [],
            cruz: [],
            counts: {
                sanders: 0,
                hilldog: 0,
                trump: 0,
                cruz: 0
            },
            speed: {
                sanders: 1,
                hilldog: 1,
                trump: 1,
                cruz: 1
            },
            secondCounts: {
                sanders: 0,
                hilldog: 0,
                trump: 0,
                cruz: 0
            }
        };
        //return {tweets: []};
        return {tweets};
    },

    componentDidMount() {
        socket.on('tweet', this._tweetRecieved);
        //setInterval(this._updateLineChart, 1000);
    },

    _graphCounter : 0,

    _updateLineChart() {
        this._graphCounter+=1;
        var {tweets} = this.state;

        //TODO: foreach candidate
        for (var key in this.lineDataIndex) {

            //get and reset sendondCount
            var secCount = tweets.secondCounts[key];
            tweets.secondCounts[key] = 0;
            var idx = this.lineDataIndex[key];
            this.lineData[idx].values.push({x: this._graphCounter, y: secCount});
            if (this.lineData[idx].values.length > 20) {
                this.lineData[idx].values.shift();
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
        this._updateTweetListForCandidate(data.tweet, data.candidate);
    },

    _updateTweetListForCandidate(tweet, candidate) {
        var {tweets} = this.state;
        tweets.counts[candidate]++;
        tweets.secondCounts[candidate]++;

        if (tweets.counts[candidate] % tweets.speed[candidate] == 0) {
            tweets[candidate].unshift(tweet);
            if (tweets[candidate].length > 10) {
                tweets[candidate].pop()
            }
        }
        this.setState({tweets});
    },

    lineDataIndex: {
        sanders: 3,
        hilldog: 2,
        trump: 0,
        cruz: 1
    },

    barData : [
        {
            name: "Donald Trump",
            values: [ { x: 0, y: 0, z: 0} ],
        },
        {
            name: "Ted Cruz",
            values: [ { x: 0, y: 0, z: 0 } ],
        },
        {
            name: "Hillary Clinton",
            values: [ { x: 0, y: 0, z: 0 } ],
        },
        {
            name: "Bernie Sanders",
            values: [ { x: 0, y: 0, z: 0} ],
        }
    ],

    colors : function(series, idx){
        //console.log(series,idx);
        switch(series){
            case 0:
                return '#FF0000';
            case 1:
                return '#FF00FF';
            case 2:
                return '#0000FF';
            default:
                return '#008000';
        }
    },

    viewBoxObject : {
        x: 0,
        y: 0,
        width: 500,
        height: 400
    },

    render() {
        return (
            <div>
                <div className="sentimentBarChart">
                    <BarChart
                        legend={true}
                        data={this.lineData}
                        colors={this.colors}
                        width='100%'
                        height={400}
                        margins = {{left: 100, right: 100, top: 50, bottom: 50}}
                        viewBoxObject={{
                            x: 0,
                            y: 0,
                            width: 800,
                            height: 400
                        }}
                        title="Tweet Counts"
                        yAxisLabel="Tweet Count"
                        xAxisLabel="Candidates"
                        gridHorizontal={true}
                    />
                </div>
            </div>
        );
    }
});


React.render(<TweetApp/>, document.getElementById('tweetForm'));