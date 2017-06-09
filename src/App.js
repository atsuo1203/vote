import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './App.css';


class VoteCreater extends Component {
  // addボタンを押した時，voteをvoteListにaddする
  handleSubmit = (e) => {
    e.preventDefault();
    let voteName = ReactDOM.findDOMNode(this.refs.vote).value.trim();
    if (!voteName) return;

    this.props.onAddVote({name: voteName});
    ReactDOM.findDOMNode(this.refs.vote).value = "";
  };

  render() {
    return (
      <div className="voteCreater">
        <h1>voteCreater</h1>
        <form onSubmit={this.handleSubmit}>
          <input type="text" ref="vote"/>
          <br />
          <input type="submit" value="投票項目作成"/>
        </form>
      </div>
    )
  }
}

class VoteList extends Component {
  render(){
    let voteNodes = this.props.data.map(vote => {
        return(
          <div key={vote.id}>
            <h3>{vote.name}</h3>
            {vote.count}
            <br/>
            <input type="button" value="投票 +1" onClick={this.props.onCountUpVote.bind(this, vote.id)} />
            <input type="button" value="投票 -1" onClick={this.props.onCountDownVote.bind(this, vote.id)} />
            <input type="button" value="削除" onClick={this.props.onRemoveVote.bind(this, vote.id)} />
            <hr/>
          </div>
        )
    });

    return(
      <div className="voteList">
        <h1>voteList</h1>
        <hr/>
        {voteNodes}
        <br />
      </div>
    )
  }
}

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

    newVoteList.forEach(function(val){
      if(val.id === id) {
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
        if(res.status === 404)
          this.setState({vote: voteList});
      })
  };
  
  // countDown(投票してカウントを減らす)
  handleCountDownVote = id => {
    let voteList = this.state.vote;
    let newVoteList = voteList;

    newVoteList.forEach(function(val){
      if(val.id === id) {
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
        if(res.status === 404)
          this.setState({vote: voteList});
      })
  };

  //削除
  handleRemoveVote = id => {
    let voteList = this.state.vote;
    let newVoteList = [];
    newVoteList.forEach(function(val){
      if(val.id != id)
        newVoteList.push(val);
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
        if(res.status===404)
          this.setState({vote: voteList})
      })
  };



  render() {
    return (
      <div>
        <VoteCreater
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
