import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from './cartActions';

const initialState = {
  cart: JSON.parse(sessionStorage.getItem('cart')) || [],
};

const saveCartToSession = (cart) => {
  sessionStorage.setItem('cart', JSON.stringify(cart));
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const updatedCartAdd = state.cart.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      if (!updatedCartAdd.some(item => item.id === action.payload.id)) {
        updatedCartAdd.push({ ...action.payload, quantity: 1 });
      }

      saveCartToSession(updatedCartAdd);
      return {
        ...state,
        cart: updatedCartAdd,
      };
    case REMOVE_FROM_CART:
      const updatedCartRemove = state.cart.map(item =>
        item.id === action.payload
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0);

      saveCartToSession(updatedCartRemove);
      return {
        ...state,
        cart: updatedCartRemove,
      };
    case CLEAR_CART:
      saveCartToSession([]);
      return {
        ...state,
        cart: [],
      };
    default:
      return state;
    }
  };

export default cartReducer;