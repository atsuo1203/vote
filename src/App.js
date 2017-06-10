import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import VoteCreator from './components/VoteCreator'
import VoteList from './components/VoteList'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vote: [],
    }
  }

  componentDidMount() {
    this.handleShowVote();
    setInterval(this.handleShowVote, 4000);
  };

  // get
  handleShowVote = () => {
    fetch("/api/vote")
      .then(res => {
        return res.json()
      })
      .then(resVote => {
        this.setState({vote: resVote})
      })
  };

  // add
  handleAddVote = vote => {
    fetch("/api/vote/add", {
      method: "POST",
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(vote),
    })
      .then(res => {
        return res.json()
      })
      .then(resVote => {
        this.setState({vote: resVote})
      })
  };

  // countUp(投票してカウントを増やす)
  handleCountUpVote = id => {
    let voteList = this.state.vote;
    let newVoteList = voteList;

    newVoteList.forEach(function (val) {
      if (val.id === id) {
        val.count = val.count + 1;
      }
    });
    this.setState({vote: newVoteList});

    // サーバのjsonを変更
    fetch("/api/vote/up", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({id: id}),
    })
      .then(res => {
        if (res.status === 404)
          this.setState({vote: voteList});
      })
  };

  // countDown(投票してカウントを減らす)
  handleCountDownVote = id => {
    let voteList = this.state.vote;
    let newVoteList = voteList;

    newVoteList.forEach(function (val) {
      if (val.id === id) {
        val.count = val.count - 1;
      }
    });
    this.setState({vote: newVoteList});

    // サーバのjsonを変更
    fetch("/api/vote/down", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({id: id}),
    })
      .then(res => {
        if (res.status === 404)
          this.setState({vote: voteList});
      })
  };

  //削除
  handleRemoveVote = id => {
    let voteList = this.state.vote;
    let newVoteList = voteList;
    newVoteList.some(function (v, i) {
      if (v.id === id) newVoteList.splice(i, 1);
    });
    this.setState({vote: newVoteList});

    // サーバのjsonを変更
    fetch("/api/vote/remove", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({id: id}),
    })
      .then(res => {
        if (res.status === 404)
          this.setState({vote: voteList})
      })
  };

  render() {
    return (
      <div>
        <VoteCreator
          onAddVote={this.handleAddVote}
        />
        <VoteList
          data={this.state.vote}
          onCountUpVote={this.handleCountUpVote}
          onCountDownVote={this.handleCountDownVote}
          onRemoveVote={this.handleRemoveVote}
        />
      </div>
    );
  }
}

export default App;
