import "./style/login.css"

const Home = ({ history }) => {
    const nextTapped = () => {
        history.push('/signup');
    }

    return (
        <section>
                <div class="container">
                    <div class="form">
                        <h2>Ebiblio login</h2>
                        <form>
                            <div class="inputBox">
                                <input type="text" placeholder="Username" />
                            </div>
                            <div class="inputBox">
                                <input type="password" placeholder="Password" />
                            </div>
                            <div class="inputBox">
                                <input type="submit" value="Login" />
                            </div>
                            <p class="signup">
                                Don't have an account? <a href="#" onClick={() => nextTapped() }>Sign up</a>
                            </p>
                        </form>
                    </div>
                </div>
        </section>
    );
}

export default Home;