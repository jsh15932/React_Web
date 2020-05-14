'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _account = require('../models/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/signup', function (req, res) {
    // 회원 이름 양식
    var usernameRegex = /^[a-z0-9]+$/;

    if (!usernameRegex.test(req.body.username)) {
        return res.status(400).json({
            error: "BAD USERNAME",
            code: 1
        });
    }

    // 비밀번호 길이 설정
    if (req.body.password.length < 4 || typeof req.body.password !== "string") {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 2
        });
    }

    // 회원 중복 확인
    _account2.default.findOne({ username: req.body.username }, function (err, exists) {
        if (err) throw err;
        if (exists) {
            return res.status(409).json({
                error: "USERNAME EXISTS",
                code: 3
            });
        }

        // 계정 생성
        var account = new _account2.default({
            username: req.body.username,
            password: req.body.password
        });

        account.password = account.generateHash(account.password);

        // 데이터베이스 저장
        account.save(function (err) {
            if (err) throw err;
            return res.json({ success: true });
        });
    });
});

router.post('/signin', function (req, res) {

    if (typeof req.body.password !== "string") {
        return res.status(401).json({
            error: "LOGIN FAILED",
            code: 1
        });
    }

    // 회원 이름으로 회원 검색
    _account2.default.findOne({ username: req.body.username }, function (err, account) {
        if (err) throw err;

        // 계정 유무 확인
        if (!account) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

        // 비밀번호 유효성 확인
        if (!account.validateHash(req.body.password)) {
            return res.status(401).json({
                error: "LOGIN FAILED",
                code: 1
            });
        }

        // 세션 변경
        var session = req.session;
        session.loginInfo = {
            _id: account._id,
            username: account.username
        };

        // 가입 완료
        return res.json({
            success: true
        });
    });
});

router.get('/getinfo', function (req, res) {
    if (typeof req.session.loginInfo === "undefined") {
        return res.status(401).json({
            error: 1
        });
    }

    res.json({ info: req.session.loginInfo });
});

router.post('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) throw err;
    });
    return res.json({ sucess: true });
});

router.get('/search/:username', function (req, res) {
    // 키워드로 회원 이름 검색
    var re = new RegExp('^' + req.params.username);
    _account2.default.find({ username: { $regex: re } }, { _id: false, username: true }).limit(5).sort({ username: 1 }).exec(function (err, accounts) {
        if (err) throw err;
        res.json(accounts);
    });
});

router.get('/search', function (req, res) {
    res.json([]);
});

exports.default = router;