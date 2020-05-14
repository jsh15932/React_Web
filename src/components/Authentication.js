import React from 'react';
import { Link } from 'react-router';

class Authentication extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleChange(e) {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    handleLogin() {
        let id = this.state.username;
        let pw = this.state.password;

        this.props.onLogin(id, pw).then(
            (success) => {
                if(!success) {
                    this.setState({
                        password: ''
                    });
                }
            }
        );
    }

    handleRegister() {
        let id = this.state.username;
        let pw = this.state.password;

        this.props.onRegister(id, pw).then(
            (success) => {
                if(!success) {
                    this.setState({
                        password: ''
                    });
                }
            }
        );
    }

    handleKeyPress(e) {
        if(e.charCode ===13 ){
            if(this.props.mode) {
                this.handleLogin();
            } else {
                this.handleRegister();
            }
        }
    }

    render() {
        const inputBoxes = (
            <div>
                <div className="input-field col s12 username">
                    <label>ID</label>
                    <input
                    name="username"
                    type="text"
                    className="validate"
                    value={this.state.username}
                    onChange={this.handleChange}
                    />
                </div>
                <div className="input-field col s12">
                    <label>비밀번호</label>
                    <input
                    name="password"
                    type="password"
                    className="validate"
                    value={this.state.password}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}/>
                </div>
            </div>
        );

        const loginView = (
            <div>
                <div className="card-content">
                    <div className="row">
                        { inputBoxes }
                        <a onClick={this.handleLogin} className="waves-effect waves-light btn">확인</a>
                    </div>
                </div>


                <div className="footer">
                    <div className="card-content">
                        <div className="right" >
                        처음이신가요? <Link to="/register">계정 생성t</Link>
                        </div>
                    </div>
                </div>

            </div>
        );

        const registerView = (
           <div className="card-content">
               <div className="row">
                   { inputBoxes }
                   <a onClick={this.handleRegister} className="waves-effect waves-light btn">생성</a>
               </div>
           </div>
       );

        return(
            <div className="container auth">
                <Link className="logo" to="/">자유 게시판</Link>
                <div className="card">
                    <div className="header blue white-text center">
                        <div className="card-content">{this.props.mode ? "LOGIN" : "REGISTER"}</div>
                    </div>
                    {this.props.mode ? loginView : registerView }
                </div>
            </div>
        );
    }

}

Authentication.propTypes = {
    mode: React.PropTypes.bool,
    onLogin: React.PropTypes.func,
    onRegister: React.PropTypes.func
};

Authentication.defaultProps = {
    mode: true,
    onLogin: (id, pw) => { console.error("onLogin not defined"); },
    onRegister: (id, pw) => { console.error("onRegister not defined"); }
};

export default Authentication;
