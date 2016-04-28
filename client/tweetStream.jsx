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
        var tweets = { sandersTweet: [],
            hilldogTweet: [],
            trumpTweet: [],
            cruzTweet: [],
            counts: {
                sandersTweet: 0,
                hilldogTweet: 0,
                trumpTweet: 0,
                cruzTweet: 0
            },
            speed: {
                sandersTweet: 1,
                hilldogTweet: 1,
                trumpTweet: 1,
                cruzTweet: 1
            },
            secondCounts: {
                sandersTweet: 0,
                hilldogTweet: 0,
                trumpTweet: 0,
                cruzTweet: 0
            }
        };
        //return {tweets: []};
        return {tweets};
    },

    componentDidMount() {
        socket.on('tweet', this._tweetRecieved);
        //setInterval(this._mockTweetRecieved, 250);
        setInterval(this._updateLineChart, 2000);
    },

    _graphCounter : 0,

    _updateLineChart() {
        this._graphCounter+=2;
        var {tweets} = this.state;

        //TODO: foreach candidate
        for (var key in this.lineDataIndex) {

            //get and reset sendondCount
            var secCount = tweets.secondCounts[key];
            tweets.secondCounts[key] = 0;
            var idx = this.lineDataIndex[key];
            this.lineData[idx].values.push({x: this._graphCounter, y: secCount});
            if (this.lineData[idx].values.length > 10) {
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
        sandersTweet: 3,
        hilldogTweet: 2,
        trumpTweet: 0,
        cruzTweet: 1
    },

    lineData : [
        {
            name: "Donald Trump",
            values: [ { x: 0, y: 0 } ],
            strokeWidth: 2
        },
        {
            name: "Ted Cruz",
            values: [ { x: 0, y: 0 } ],
            strokeWidth: 2
        },
        {
            name: "Hillary Clinton",
            values: [ { x: 0, y: 0 } ],
            strokeWidth: 2
        },
        {
            name: "Bernie Sanders",
            values: [ { x: 0, y: 0 } ],
            strokeWidth: 2
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
                <div className="test">
                    <LineChart
                        legend={true}
                        data={this.lineData}
                        colors={this.colors}
                        width='100%'
                        height={400}
                        viewBoxObject={{
                            x: 0,
                            y: 0,
                            width: 500,
                            height: 400
                        }}
                        title="Tweet Counts"
                        yAxisLabel="Tweets Recieved"
                        xAxisLabel="Time (seconds)"
                        gridHorizontal={true}
                    />
                </div>
                <TweetList
                    tweets={this.state.tweets.sandersTweet}
                    candidateName = 'Bernie Sanders'
                    divClass = 'sanders'
                    tweetCount = {this.state.tweets.counts.sandersTweet}
                />
                <TweetList
                    tweets={this.state.tweets.hilldogTweet}
                    candidateName = 'Hill Dogg'
                    divClass = 'clinton'
                    tweetCount = {this.state.tweets.counts.hilldogTweet}
                />
                <TweetList
                    tweets={this.state.tweets.trumpTweet}
                    candidateName = 'The Trump'
                    divClass = 'trump'
                    tweetCount = {this.state.tweets.counts.trumpTweet}
                />
                <TweetList
                    tweets={this.state.tweets.cruzTweet}
                    candidateName = 'Ted Cruz'
                    divClass = 'cruz'
                    tweetCount = {this.state.tweets.counts.cruzTweet}
                />
            </div>
        );
    }
});


React.render(<TweetApp/>, document.getElementById('tweetForm'));