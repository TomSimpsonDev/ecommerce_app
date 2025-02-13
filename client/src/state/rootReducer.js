import { combineReducers } from 'redux';
import cartReducer from '../components/cart/cartReducer';

const rootReducer = combineReducers({
  cart: cartReducer,
});

export default rootReducer;