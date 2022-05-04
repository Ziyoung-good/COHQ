import axios from 'axios';
const instance = axios.create({
    baseURL:'https://react-crazy-game.firebaseio.com/'
});

export default instance;