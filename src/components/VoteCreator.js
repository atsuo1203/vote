/**
 * Created by atsuo on 2017/06/10.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';


class VoteCreator extends Component {
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
      <div className="voteCreator">
        <h1>voteCreator</h1>
        <form onSubmit={this.handleSubmit}>
          <input type="text" ref="vote"/>
          <br />
          <input type="submit" value="投票項目作成"/>
        </form>
      </div>
    )
  }
}


export default VoteCreator;
