/**
 * Created by atsuo on 2017/06/10.
 */

import React, {Component} from 'react';

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


export default VoteList;
