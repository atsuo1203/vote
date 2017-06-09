/**
 * Created by atsuo on 2017/06/10.
 */
const express = require('express');
const router = express.Router()
const fs = require('fs');
const path = require('path');

const VOTE_FILE = path.join(__dirname, '../vote.json');

// get
router.get('/', function (req, res) {
  fs.readFile(VOTE_FILE, (err, data) => {
    if (err) {
      console.error(err);
      res.status(404).end();
      return;
    }
    res.json(JSON.parse(data));
  });
});

// add
router.post('/add', function (req, res) {
  fs.readFile(VOTE_FILE, (err, data) => {
    if (err) {
      console.error(err);
      res.status(404).end();
      return;
    }

    let voteList = JSON.parse(data);
    let newVote = {
      id: Date.now(),
      name: req.body.name,
      count: 0,
    };

    // voteListに新しいvoteを追加
    voteList.push(newVote);

    // vote.jsonを更新する
    fs.writeFile(VOTE_FILE, JSON.stringify(voteList, null, 2), function (err) {
      if (err) {
        console.error(err);
        res.status(404).end();
      }
      res.json(voteList);
    });
  });
});

// 投票 +1
router.post('/up', function (req, res) {
  fs.readFile(VOTE_FILE, (err, data) => {
    if (err) {
      console.error(err);
      res.status(404).end();
      return;
    }

    let id = req.body.id;
    let voteList = JSON.parse(data);

    // countを1増やす
    voteList.forEach(function(val){
      if(val.id === id){
        val.count = val.count + 1
      }
    });

    // vote.jsonを更新する
    fs.writeFile(VOTE_FILE, JSON.stringify(voteList, null, 2), function (err) {
      if (err) {
        console.error(err);
        res.status(404).end();
        return;
      }
      res.status(200).end();
    });
  });
});

// 投票 -1
router.post('/down', function (req, res) {
  fs.readFile(VOTE_FILE, (err, data) => {
    if (err) {
      console.error(err);
      res.status(404).end();
      return;
    }

    let id = req.body.id;
    let voteList = JSON.parse(data);

    // countを1減らす
    voteList.forEach(function(val){
      if(val.id === id){
        val.counv = val.count - 1
      }
    });

    // vote.jsonを更新する
    fs.writeFile(VOTE_FILE, JSON.stringify(voteList, null, 2), function (err) {
      if (err) {
        console.error(err);
        res.status(404).end();
        return;
      }
      res.status(200).end();
    });
  });
});


// remove
router.post('/remove', function (req, res) {
  fs.readFile(VOTE_FILE, (err, data) => {
    if (err) {
      console.error(err);
      res.status(404).end();
      return;
    }

    let id = req.body.id;
    let voteList = JSON.parse(data);

    // 削除vote以外のオブジェクト配列を作成する
    let newVoteList = [];
    voteList.forEach(function(val){
      if(val.id != id)
        newVoteList.push(val);
    });

    // vote.jsonをnewVoteListで更新する
    fs.writeFile(VOTE_FILE, JSON.stringify(newVoteList, null, 2), function (err) {
      if (err) {
        console.error(err);
        res.status(404).end();
      }
      res.status(200).end();
    });
  });
});


module.exports = router;
