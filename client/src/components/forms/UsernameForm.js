import React from 'react';
import ErrorMessage from '../messages/ErrorMessage'
import PropTypes from 'prop-types'

class UsernameForm extends React.Component {
    state = {
        username: '',
        loading: false,
        error: ''
    };

    submitName = async () => {
        let error = this.validateUsername(this.state.username)

        if (error) {
            this.setState({error: error})
            return
        }

        error = await this.props.submit(this.state.username)
        if (error) this.setState({error: error})
    }

        validateUsername = (username) => {
        let error = false
        if (!username) error = 'Must have a username'
        if (username.length < 5) error = 'Password needs to be longer'
        return error
    }

    usernameChanged = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    render() {
        const { username, error } = this.state
        return (
            <div>
                <input
                    placeholder="username"
                    value={username}
                    onChange={this.usernameChanged}
                />
                { (error !== '') && <ErrorMessage text={error}/>}

                <button onClick={this.submitName}> Submit </button>
            </div>
        )
    }
}

UsernameForm.propTypes = {
    submit: PropTypes.func.isRequired
};


export default UsernameForm